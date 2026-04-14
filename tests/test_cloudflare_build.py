"""
Test suite for the Cloudflare Pages build process.
Validates that the root static build generates an `out/` directory.
"""
import shutil
import subprocess
from pathlib import Path

import pytest


ROOT_DIR = Path(__file__).parent.parent


class TestCloudflareBuild:
    """Tests for Cloudflare Pages build configuration and process."""

    @pytest.fixture(autouse=True)
    def setup_and_teardown(self):
        output_dir = ROOT_DIR / "out"
        if output_dir.exists():
            shutil.rmtree(output_dir)
        yield
        if output_dir.exists():
            shutil.rmtree(output_dir)

    def test_build_creates_output_directory(self):
        result = subprocess.run(
            ["npm", "run", "build"],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True,
        )

        assert result.returncode == 0, f"Build failed: {result.stderr}"
        output_dir = ROOT_DIR / "out"
        assert output_dir.exists(), "out directory was not created"
        assert output_dir.is_dir(), "out path is not a directory"

    def test_build_copies_required_html_files(self):
        subprocess.run(
            ["npm", "run", "build"],
            cwd=ROOT_DIR,
            capture_output=True,
            check=True,
        )

        output_dir = ROOT_DIR / "out"
        required_files = [
            "index.html",
            "ceremonial_interface.html",
            "resonance_dashboard.html",
            "spectral_command_shell.html",
        ]

        for filename in required_files:
            file_path = output_dir / filename
            assert file_path.exists(), f"{filename} not found in out directory"
            assert file_path.is_file(), f"{filename} is not a file"

    def test_build_copies_javascript_files(self):
        subprocess.run(
            ["npm", "run", "build"],
            cwd=ROOT_DIR,
            capture_output=True,
            check=True,
        )

        js_file = ROOT_DIR / "out" / "pi-forge-integration.js"
        assert js_file.exists(), "pi-forge-integration.js not found in out directory"
        assert js_file.is_file(), "pi-forge-integration.js is not a file"

    def test_build_copies_frontend_directory(self):
        subprocess.run(
            ["npm", "run", "build"],
            cwd=ROOT_DIR,
            capture_output=True,
            check=True,
        )

        frontend_dir = ROOT_DIR / "out" / "frontend"
        assert frontend_dir.exists(), "frontend directory not found in out directory"
        assert frontend_dir.is_dir(), "frontend is not a directory"
        assert list(frontend_dir.glob("*")), "frontend directory is empty"

    def test_build_creates_cloudflare_redirects(self):
        subprocess.run(
            ["npm", "run", "build"],
            cwd=ROOT_DIR,
            capture_output=True,
            check=True,
        )

        redirects_path = ROOT_DIR / "out" / "_redirects"
        assert redirects_path.exists(), "_redirects not found"
        redirects = redirects_path.read_text(encoding="utf-8")
        assert "/api/* https://pi-forge-quantum-genesis.railway.app/api/:splat 200" in redirects
        assert "/health https://pi-forge-quantum-genesis.railway.app/health 200" in redirects

    def test_package_json_build_scripts_target_cloudflare(self):
        package_json_path = ROOT_DIR / "package.json"
        import json

        with open(package_json_path, "r", encoding="utf-8") as f:
            package = json.load(f)

        scripts = package.get("scripts", {})
        assert scripts.get("build") == "npm run build:static"
        assert scripts.get("build:static") == "node scripts/build.js"
        assert scripts.get("build:cf") == "npm run build:static"

