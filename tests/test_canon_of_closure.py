"""
Test suite for Canon of Closure artifacts.

This test verifies that all documentation artifacts exist
and have proper cross-references as defined in the HANDOFF_INDEX.md.
"""

import os
import pytest
from pathlib import Path


# Get the repository root directory
REPO_ROOT = Path(__file__).parent.parent

# Canon of Closure configuration
CIRCLE_OF_CLOSURE_STEPS = [
    "Lint", "Host", "Test", "Pre-aggregate", "Release",
    "Deploy", "Rollback", "Monitor", "Visualize", "Alert"
]

HANDOFF_ARTIFACTS = [
    ("assets", "ascii-banner.txt"),
    ("docs", "CANON_OF_CLOSURE.md"),
    ("docs", "QUICK_USER_GUIDE.md"),
    ("docs", "DEV_REFERENCE.md"),
    ("runbooks", "RUNBOOK_MANIFEST.md"),
    ("assets", "runbook-wheel.svg"),
]


class TestCanonOfClosureArtifacts:
    """Test that all Canon of Closure artifacts exist."""

    def test_ascii_banner_exists(self):
        """Verify ASCII banner file exists."""
        banner_path = REPO_ROOT / "assets" / "ascii-banner.txt"
        assert banner_path.exists(), f"ASCII banner not found at {banner_path}"
        assert banner_path.stat().st_size > 0, "ASCII banner is empty"

    def test_canon_of_closure_exists(self):
        """Verify Canon of Closure document exists."""
        canon_path = REPO_ROOT / "docs" / "CANON_OF_CLOSURE.md"
        assert canon_path.exists(), f"Canon of Closure not found at {canon_path}"
        assert canon_path.stat().st_size > 0, "Canon of Closure is empty"

    def test_quick_user_guide_exists(self):
        """Verify Quick User Guide exists."""
        guide_path = REPO_ROOT / "docs" / "QUICK_USER_GUIDE.md"
        assert guide_path.exists(), f"Quick User Guide not found at {guide_path}"
        assert guide_path.stat().st_size > 0, "Quick User Guide is empty"

    def test_dev_reference_exists(self):
        """Verify Developer Reference Card exists."""
        ref_path = REPO_ROOT / "docs" / "DEV_REFERENCE.md"
        assert ref_path.exists(), f"Developer Reference not found at {ref_path}"
        assert ref_path.stat().st_size > 0, "Developer Reference is empty"

    def test_runbook_manifest_exists(self):
        """Verify Runbook Manifest exists."""
        runbook_path = REPO_ROOT / "runbooks" / "RUNBOOK_MANIFEST.md"
        assert runbook_path.exists(), f"Runbook Manifest not found at {runbook_path}"
        assert runbook_path.stat().st_size > 0, "Runbook Manifest is empty"

    def test_runbook_wheel_svg_exists(self):
        """Verify Runbook Wheel SVG exists."""
        svg_path = REPO_ROOT / "assets" / "runbook-wheel.svg"
        assert svg_path.exists(), f"Runbook Wheel SVG not found at {svg_path}"
        assert svg_path.stat().st_size > 0, "Runbook Wheel SVG is empty"

    def test_handoff_index_exists(self):
        """Verify Handoff Index exists."""
        index_path = REPO_ROOT / "docs" / "HANDOFF_INDEX.md"
        assert index_path.exists(), f"Handoff Index not found at {index_path}"
        assert index_path.stat().st_size > 0, "Handoff Index is empty"


class TestCanonOfClosureContent:
    """Test that Canon of Closure documents have proper content."""

    def test_ascii_banner_contains_circle_of_closure(self):
        """Verify ASCII banner mentions Circle of Closure."""
        banner_path = REPO_ROOT / "assets" / "ascii-banner.txt"
        content = banner_path.read_text()
        assert "CIRCLE OF CLOSURE" in content or "Circle of Closure" in content

    def test_canon_has_ten_steps(self):
        """Verify Canon of Closure defines the 10 steps."""
        canon_path = REPO_ROOT / "docs" / "CANON_OF_CLOSURE.md"
        content = canon_path.read_text()
        
        # Check for all steps defined in configuration
        for step in CIRCLE_OF_CLOSURE_STEPS:
            assert step in content, f"Step '{step}' not found in Canon of Closure"

    def test_handoff_index_references_all_artifacts(self):
        """Verify Handoff Index references all 6 artifacts."""
        index_path = REPO_ROOT / "docs" / "HANDOFF_INDEX.md"
        content = index_path.read_text()
        
        # Check for references to all artifacts
        assert "ascii-banner.txt" in content
        assert "CANON_OF_CLOSURE.md" in content
        assert "QUICK_USER_GUIDE.md" in content
        assert "DEV_REFERENCE.md" in content
        assert "RUNBOOK_MANIFEST.md" in content
        assert "runbook-wheel.svg" in content


class TestCrossReferences:
    """Test that cross-references between documents are valid."""

    def test_canon_cross_references(self):
        """Verify Canon of Closure has valid cross-references."""
        canon_path = REPO_ROOT / "docs" / "CANON_OF_CLOSURE.md"
        content = canon_path.read_text()
        
        # Documents it should reference
        assert "QUICK_USER_GUIDE.md" in content
        assert "DEV_REFERENCE.md" in content
        assert "RUNBOOK_MANIFEST.md" in content or "../runbooks/RUNBOOK_MANIFEST.md" in content

    def test_quick_guide_cross_references(self):
        """Verify Quick User Guide has valid cross-references."""
        guide_path = REPO_ROOT / "docs" / "QUICK_USER_GUIDE.md"
        content = guide_path.read_text()
        
        # Documents it should reference
        assert "CANON_OF_CLOSURE.md" in content
        assert "DEV_REFERENCE.md" in content
        assert "RUNBOOK_MANIFEST.md" in content or "../runbooks/RUNBOOK_MANIFEST.md" in content

    def test_dev_reference_cross_references(self):
        """Verify Developer Reference has valid cross-references."""
        ref_path = REPO_ROOT / "docs" / "DEV_REFERENCE.md"
        content = ref_path.read_text()
        
        # Documents it should reference
        assert "CANON_OF_CLOSURE.md" in content
        assert "QUICK_USER_GUIDE.md" in content
        assert "RUNBOOK_MANIFEST.md" in content or "../runbooks/RUNBOOK_MANIFEST.md" in content

    def test_runbook_cross_references(self):
        """Verify Runbook Manifest has valid cross-references."""
        runbook_path = REPO_ROOT / "runbooks" / "RUNBOOK_MANIFEST.md"
        content = runbook_path.read_text()
        
        # Documents it should reference
        assert "CANON_OF_CLOSURE.md" in content or "../docs/CANON_OF_CLOSURE.md" in content
        assert "QUICK_USER_GUIDE.md" in content or "../docs/QUICK_USER_GUIDE.md" in content
        assert "DEV_REFERENCE.md" in content or "../docs/DEV_REFERENCE.md" in content


class TestCircleOfClosureConcept:
    """Test that the Circle of Closure concept is present throughout."""

    @pytest.mark.parametrize("doc_path", [
        "docs/CANON_OF_CLOSURE.md",
        "docs/QUICK_USER_GUIDE.md",
        "docs/DEV_REFERENCE.md",
        "docs/HANDOFF_INDEX.md",
        "runbooks/RUNBOOK_MANIFEST.md",
    ])
    def test_documents_mention_closure(self, doc_path):
        """Verify each document mentions 'closure' or 'Circle of Closure'."""
        full_path = REPO_ROOT / doc_path
        content = full_path.read_text().lower()
        
        assert "closure" in content, f"{doc_path} does not mention 'closure'"

    def test_canon_has_eternal_return_philosophy(self):
        """Verify Canon explains the eternal return concept."""
        canon_path = REPO_ROOT / "docs" / "CANON_OF_CLOSURE.md"
        content = canon_path.read_text().lower()
        
        # Check for philosophical concepts
        assert "cycle" in content or "cyclical" in content
        assert "return" in content


class TestHandoffPackageCompleteness:
    """Test that the Handoff Package is complete as specified."""

    def test_all_six_artifacts_present(self):
        """Verify all 6 artifacts mentioned in issue are present."""
        for directory, filename in HANDOFF_ARTIFACTS:
            artifact = REPO_ROOT / directory / filename
            assert artifact.exists(), f"Missing artifact: {artifact}"
            assert artifact.stat().st_size > 0, f"Empty artifact: {artifact}"

    def test_handoff_index_declares_complete(self):
        """Verify Handoff Index declares the package as complete."""
        index_path = REPO_ROOT / "docs" / "HANDOFF_INDEX.md"
        content = index_path.read_text()
        
        # Should have completion status
        assert "Complete" in content or "complete" in content
        assert "Navigable" in content or "navigable" in content
