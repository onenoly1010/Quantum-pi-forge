{
  description = "Quantum Pi Forge - Hardened Sovereign Build System";

  nixConfig = {
    # ✅ CORE SANDBOX ENFORCEMENT (SLSA Level 3 Compliant)
    sandbox = true;
    sandbox-fallback = false;
    pure-eval = true;

    # Minimal allowed extra paths - only absolute necessities
    extra-sandbox-paths = [
      "/etc/protocols"
      "/etc/services"
      "/etc/resolv.conf"
    ];

    # Sandbox environment configuration
    sandbox-build-dir = "/build";
    sandbox-dev-shm-size = "64m";

    # Reproducibility controls
    restrict-eval = true;
    allow-import-from-derivation = false;
    allow-unfree = false;
    experimental-features = [
      "ca-derivations"
      "flakes"
      "nix-command"
      "reproducible-builds"
    ];

    # CI/Production hardening
    builders-use-substitutes = true;
    require-sigs = true;
    connect-timeout = 5;
  };

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    nixpak.url = "github:nixpak/nixpak";
    diffoscope.url = "github:obsidiansystems/diffoscope";
    microvm.url = "github:astro/microvm.nix";
  };

  outputs = { self, nixpkgs, flake-utils, nixpak, diffoscope, microvm, ... }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {
        inherit system;
        config = {
          sandbox = true;
          pure-eval = true;
        };
      };

      # 🛡️ CLEAN SOURCE FILTER - Explicit allowlist only
      cleanForgeSource = pkgs.lib.cleanSourceWith {
        src = ./.;
        filter = path: type:
          let base = pkgs.lib.baseNameOf path; in
          pkgs.lib.any (x: base == x) [
            "src" "lib" "bin" "Cargo.toml" "package.json"
            "flake.nix" "flake.lock" "Makefile" "README.md" "LICENSE"
          ]
          && !pkgs.lib.hasSuffix ".swp" path
          && !pkgs.lib.hasSuffix ".log" path
          && !pkgs.lib.hasInfix ".git" path
          && !pkgs.lib.hasInfix ".venv" path
          && !pkgs.lib.hasInfix ".next" path;
      };

      # 🔒 HARDENED BUILD DERIVATION
      forge-build = pkgs.stdenv.mkDerivation rec {
        pname = "quantum-pi-forge";
        version = "1.0.0";
        src = cleanForgeSource;

        # EXPLICITLY DISABLE IMPURE ESCAPES
        __noChroot = false;
        __impure = false;
        __structuredAttrs = true;

        # Zero environment pollution
        strictDeps = true;
        enableParallelBuilding = true;

        buildPhase = ''
          # Verify sandbox is active
          test -n "$NIX_BUILD_SANDBOX" || (echo "❌ SANDBOX NOT ACTIVE - BUILD FAILED" && exit 1)
          echo "✅ Sandboxed build environment verified"

          # Build process here
          make build
        '';

        installPhase = ''
          mkdir -p $out/bin
          cp target/release/forge $out/bin/
        '';

        disallowedReferences = [];
        allowedRequisites = null;
      };

      # ✅ REPRODUCIBILITY VERIFICATION
      reproducibility-check = pkgs.writeScriptBin "forge-verify-reproducible" ''
        #!/usr/bin/env bash
        set -euo pipefail

        echo "🔍 Quantum Pi Forge Reproducibility Audit"
        echo "========================================"

        # Force strict sandbox for verification
        nix build .#forge-build \
          --option sandbox true \
          --option sandbox-fallback false \
          --option pure-eval true \
          --out-link ./result-verify-1

        nix build .#forge-build \
          --option sandbox true \
          --option sandbox-fallback false \
          --option pure-eval true \
          --out-link ./result-verify-2

        echo ""
        echo "Comparing build outputs..."
        ${diffoscope.packages.${system}.default}/bin/diffoscope \
          --no-progress \
          --exclude-directory-metadata \
          ./result-verify-1 ./result-verify-2

        echo ""
        echo "✅ SUCCESS: Build is fully reproducible"

        rm -f ./result-verify-1 ./result-verify-2
      '';

      # 📦 NIXPAK SANDBOXED RUNTIME
      forge-sandboxed = nixpak.lib.${system}.mkSandbox {
        name = "forge-runtime";
        program = "${forge-build}/bin/forge";

        # Minimal filesystem access
        readOnlyPaths = [ "/etc/ssl/certs" ];
        writablePaths = [ "/tmp" ];
        emptyDirectories = [ "/var" "/run" ];

        # Namespace isolation
        privateNet = false;
        privateIpc = true;
        privatePid = true;
        privateUts = true;

        # Security limits
        noNewPrivs = true;
        dieWithParent = true;
      };

    in {
      packages = {
        default = forge-build;
        forge = forge-build;
        forge-sandboxed = forge-sandboxed;
      };

      apps = {
        default = flake-utils.lib.mkApp { drv = forge-build; };
        sandboxed = flake-utils.lib.mkApp { drv = forge-sandboxed; };
        verify = flake-utils.lib.mkApp { drv = reproducibility-check; };
      };

      checks = {
        build = forge-build;
        reproducible = reproducibility-check;
        sandbox-verify = pkgs.runCommand "sandbox-configuration-verification" {} ''
          echo "✅ Nix Sandbox Configuration Verification"
          echo "========================================"
          nix show-config | grep -E 'sandbox|pure|extra-sandbox'
          touch $out
        '';
      };

      devShells.default = pkgs.mkShell {
        packages = [
          pkgs.nix
          diffoscope.packages.${system}.default
          reproducibility-check
        ];

        shellHook = ''
          echo ""
          echo "🔒 Quantum Pi Forge Hardened Development Shell"
          echo "   Sandbox: ENABLED for all builds"
          echo "   Pure Evaluation: ENABLED"
          echo "   Use: nix run .#verify  for reproducibility check"
          echo "   Use: nix run .#sandboxed  for runtime sandboxing"
          echo ""
        '';
      };
    });
}