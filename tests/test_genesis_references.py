"""
Test suite for GENESIS.md references.

This test verifies that GENESIS.md is properly referenced as the foundational
archive in key documentation files across the repository.
"""

from pathlib import Path


# Get the repository root directory
REPO_ROOT = Path(__file__).parent.parent


class TestGenesisReferences:
    """Test that GENESIS.md is properly referenced in documentation."""

    def test_genesis_file_exists(self):
        """Verify GENESIS.md file exists."""
        genesis_path = REPO_ROOT / "GENESIS.md"
        assert genesis_path.exists(), f"GENESIS.md not found at {genesis_path}"
        assert genesis_path.stat().st_size > 0, "GENESIS.md is empty"

    def test_genesis_sha256_exists(self):
        """Verify GENESIS.md.sha256 file exists for integrity verification."""
        sha256_path = REPO_ROOT / "GENESIS.md.sha256"
        assert sha256_path.exists(), f"GENESIS.md.sha256 not found at {sha256_path}"
        assert sha256_path.stat().st_size > 0, "GENESIS.md.sha256 is empty"

    def test_genesis_sha256_verification(self):
        """Verify GENESIS.md SHA256 hash is valid."""
        import hashlib
        
        genesis_path = REPO_ROOT / "GENESIS.md"
        sha256_path = REPO_ROOT / "GENESIS.md.sha256"
        
        # Read the expected hash from sha256 file
        with open(sha256_path, 'r') as f:
            content = f.read().strip()
        tokens = content.split()
        assert tokens, "GENESIS.md.sha256 does not contain a valid SHA256 hash"
        expected_hash = tokens[0]
        
        # Calculate actual hash of GENESIS.md
        sha256_hash = hashlib.sha256()
        with open(genesis_path, 'rb') as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        actual_hash = sha256_hash.hexdigest()
        
        assert actual_hash == expected_hash, \
            f"SHA256 hash mismatch. Expected: {expected_hash}, Got: {actual_hash}"

    def test_readme_references_genesis(self):
        """Verify README.md references GENESIS.md."""
        readme_path = REPO_ROOT / "README.md"
        assert readme_path.exists(), "README.md not found"
        
        with open(readme_path, 'r') as f:
            content = f.read()
        
        assert "GENESIS.md" in content, "README.md does not reference GENESIS.md"
        content_lower = content.lower()
        assert "eternal archive" in content_lower or "foundational" in content_lower, \
            "README.md does not use foundational language for GENESIS.md"

    def test_ecosystem_overview_references_genesis(self):
        """Verify ECOSYSTEM_OVERVIEW.md references GENESIS.md."""
        overview_path = REPO_ROOT / "ECOSYSTEM_OVERVIEW.md"
        assert overview_path.exists(), "ECOSYSTEM_OVERVIEW.md not found"
        
        with open(overview_path, 'r') as f:
            content = f.read()
        
        assert "GENESIS.md" in content, "ECOSYSTEM_OVERVIEW.md does not reference GENESIS.md"
        # Should have multiple references since it's the ecosystem overview
        genesis_count = content.count("GENESIS.md")
        assert genesis_count >= 1, \
            f"ECOSYSTEM_OVERVIEW.md should reference GENESIS.md, found {genesis_count}"

    def test_architecture_references_genesis(self):
        """Verify docs/ARCHITECTURE.md references GENESIS.md."""
        arch_path = REPO_ROOT / "docs" / "ARCHITECTURE.md"
        assert arch_path.exists(), "docs/ARCHITECTURE.md not found"
        
        with open(arch_path, 'r') as f:
            content = f.read()
        
        assert "GENESIS.md" in content, "docs/ARCHITECTURE.md does not reference GENESIS.md"
        assert "../GENESIS.md" in content, \
            "docs/ARCHITECTURE.md does not use correct relative path (../GENESIS.md)"

    def test_genesis_content_has_oinio_seal(self):
        """Verify GENESIS.md contains OINIO Seal content."""
        genesis_path = REPO_ROOT / "GENESIS.md"
        
        with open(genesis_path, 'r') as f:
            content = f.read()
        
        # Check for key OINIO Seal elements
        assert "OINIO" in content, "GENESIS.md does not contain OINIO reference"
        assert "Solstice" in content, "GENESIS.md does not reference Winter Solstice"
        assert "Sovereignty" in content, "GENESIS.md does not contain Sovereignty principle"
        assert "Transparency" in content, "GENESIS.md does not contain Transparency principle"

    def test_foundational_language_in_references(self):
        """Verify documentation uses foundational language when referencing GENESIS.md."""
        files_to_check = [
            REPO_ROOT / "README.md",
            REPO_ROOT / "ECOSYSTEM_OVERVIEW.md",
            REPO_ROOT / "docs" / "ARCHITECTURE.md"
        ]
        
        foundational_terms = [
            "foundational",
            "foundation",
            "eternal archive",
            "archive",
            "rooted in",
            "built upon"
        ]
        
        for file_path in files_to_check:
            assert file_path.exists(), (
                f"Expected documentation file not found: {file_path}. "
                "All files in files_to_check should exist so foundational language can be verified."
            )

            with open(file_path, 'r') as f:
                content = f.read().lower()
            # Check if GENESIS.md is mentioned
            if "genesis.md" in content:
                # At least one foundational term should appear near GENESIS.md
                has_foundational_language = any(term in content for term in foundational_terms)
                assert has_foundational_language, \
                    f"{file_path.name} references GENESIS.md but lacks foundational language"
