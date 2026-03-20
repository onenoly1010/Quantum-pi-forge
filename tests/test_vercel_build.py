"""
Test suite for Vercel build process
Validates that the build script correctly generates the public directory
"""
import os
import subprocess
import shutil
from pathlib import Path

import pytest


# Get the root directory of the repository
ROOT_DIR = Path(__file__).parent.parent


class TestVercelBuild:
    """Tests for Vercel build configuration and process"""

    @pytest.fixture(autouse=True)
    def setup_and_teardown(self):
        """Clean up public directory before and after tests"""
        public_dir = ROOT_DIR / "public"
        
        # Clean before test
        if public_dir.exists():
            shutil.rmtree(public_dir)
        
        yield
        
        # Clean after test (optional - can comment out to inspect)
        if public_dir.exists():
            shutil.rmtree(public_dir)

    def test_build_creates_public_directory(self):
        """Test that npm run build creates the public directory"""
        result = subprocess.run(
            ["npm", "run", "build"],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True
        )
        
        assert result.returncode == 0, f"Build failed: {result.stderr}"
        
        public_dir = ROOT_DIR / "public"
        assert public_dir.exists(), "Public directory was not created"
        assert public_dir.is_dir(), "Public path is not a directory"

    def test_build_copies_required_html_files(self):
        """Test that all required HTML files are copied to public directory"""
        # Run the build
        subprocess.run(
            ["npm", "run", "build"],
            cwd=ROOT_DIR,
            capture_output=True,
            check=True
        )
        
        public_dir = ROOT_DIR / "public"
        required_files = [
            "index.html",
            "ceremonial_interface.html",
            "resonance_dashboard.html",
            "spectral_command_shell.html",
        ]
        
        for filename in required_files:
            file_path = public_dir / filename
            assert file_path.exists(), f"{filename} not found in public directory"
            assert file_path.is_file(), f"{filename} is not a file"

    def test_build_copies_javascript_files(self):
        """Test that JavaScript files are copied to public directory"""
        # Run the build
        subprocess.run(
            ["npm", "run", "build"],
            cwd=ROOT_DIR,
            capture_output=True,
            check=True
        )
        
        public_dir = ROOT_DIR / "public"
        js_file = public_dir / "pi-forge-integration.js"
        
        assert js_file.exists(), "pi-forge-integration.js not found in public directory"
        assert js_file.is_file(), "pi-forge-integration.js is not a file"

    def test_build_copies_frontend_directory(self):
        """Test that the frontend directory is copied to public directory"""
        # Run the build
        subprocess.run(
            ["npm", "run", "build"],
            cwd=ROOT_DIR,
            capture_output=True,
            check=True
        )
        
        public_dir = ROOT_DIR / "public"
        frontend_dir = public_dir / "frontend"
        
        assert frontend_dir.exists(), "frontend directory not found in public directory"
        assert frontend_dir.is_dir(), "frontend is not a directory"
        
        # Check that frontend directory has files
        frontend_files = list(frontend_dir.glob("*"))
        assert len(frontend_files) > 0, "frontend directory is empty"

    def test_vercel_json_configuration(self):
        """Test that vercel.json has correct configuration"""
        vercel_config_path = ROOT_DIR / "vercel.json"
        
        assert vercel_config_path.exists(), "vercel.json not found"
        
        import json
        with open(vercel_config_path, 'r') as f:
            config = json.load(f)
        
        assert "outputDirectory" in config, "outputDirectory not specified in vercel.json"
        assert config["outputDirectory"] == "public", "outputDirectory should be 'public'"
        assert "buildCommand" in config, "buildCommand not specified in vercel.json"
        assert config["buildCommand"] == "npm run build", "buildCommand should be 'npm run build'"

    def test_package_json_build_script(self):
        """Test that package.json has correct build script"""
        package_json_path = ROOT_DIR / "package.json"
        
        assert package_json_path.exists(), "package.json not found"
        
        import json
        with open(package_json_path, 'r') as f:
            package = json.load(f)
        
        assert "scripts" in package, "scripts section not found in package.json"
        assert "build" in package["scripts"], "build script not found in package.json"
        assert "build:static" in package["scripts"], "build:static script not found in package.json"

    def test_node_version_compatibility(self):
        """Test that package.json specifies compatible Node.js version"""
        package_json_path = ROOT_DIR / "package.json"
        
        import json
        with open(package_json_path, 'r') as f:
            package = json.load(f)
        
        assert "engines" in package, "engines section not found in package.json"
        assert "node" in package["engines"], "node version not specified in package.json"
        
        # Verify that the version constraint allows Node.js 24.x
        node_version = package["engines"]["node"]
        assert ">=18" in node_version or ">=18.0.0" in node_version, \
            "Node.js version should support 18.x and above (including 24.x)"

    def test_gitignore_excludes_public(self):
        """Test that .gitignore excludes the public directory"""
        gitignore_path = ROOT_DIR / ".gitignore"
        
        assert gitignore_path.exists(), ".gitignore not found"
        
        with open(gitignore_path, 'r') as f:
            gitignore_content = f.read()
        
        assert "public/" in gitignore_content, "public/ should be in .gitignore"
