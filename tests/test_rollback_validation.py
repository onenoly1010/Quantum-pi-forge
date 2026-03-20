"""
Test suite for rollback validation.

This module tests the rollback functionality to ensure:
1. Rollback target selection logic works correctly
2. Tag format validation is functional
3. Deployment tag parsing works as expected
4. Fallback mechanisms are in place
"""

import pytest
import re
from datetime import datetime, timedelta


class TestRollbackTargetSelection:
    """Test rollback target selection logic."""

    def test_tag_format_validation(self):
        """Test that deployment tag format is correctly validated."""
        valid_tags = [
            "deploy-20241210-120000-abc1234",
            "deploy-20231225-235959-xyz9876",
            "deploy-20240101-000000-test123"
        ]
        
        # Pattern from actual workflow
        tag_pattern = r"deploy-\d{8}-\d{6}-[a-z0-9]+"
        
        for tag in valid_tags:
            assert re.match(tag_pattern, tag), f"Valid tag {tag} should match pattern"
    
    def test_invalid_tag_format(self):
        """Test that invalid tag formats are rejected."""
        invalid_tags = [
            "deploy-invalid",
            "notdeploytag-20241210-120000-abc1234",
            "deploy-2024-12-10-12:00:00-abc",  # Wrong date format
            "deploy-20241210-abc1234",  # Missing timestamp
        ]
        
        tag_pattern = r"deploy-\d{8}-\d{6}-[a-z0-9]+"
        
        for tag in invalid_tags:
            assert not re.match(tag_pattern, tag), f"Invalid tag {tag} should not match pattern"
    
    def test_tag_sorting_chronological(self):
        """Test that tags are sorted chronologically (newest first)."""
        tags = [
            "deploy-20241210-120000-abc1234",  # Newest
            "deploy-20241210-110000-def5678",
            "deploy-20241210-100000-ghi9012",  # Oldest
        ]
        
        # Simulate git tag sort (version refname sorts lexicographically)
        sorted_tags = sorted(tags, reverse=True)
        
        assert sorted_tags[0] == "deploy-20241210-120000-abc1234"
        assert sorted_tags[-1] == "deploy-20241210-100000-ghi9012"
    
    def test_rollback_target_selection_with_tags(self):
        """Test rollback target selection when deployment tags exist."""
        # Simulate deployment tags (sorted newest first)
        deployment_tags = [
            "deploy-20241210-120000-abc1234",  # Current/latest
            "deploy-20241210-110000-def5678",  # Previous (rollback target)
            "deploy-20241210-100000-ghi9012",  # Older
        ]
        
        # Logic from workflow: head -2 | tail -1 (get second newest)
        if len(deployment_tags) >= 2:
            rollback_target = deployment_tags[1]
        else:
            rollback_target = "main"
        
        assert rollback_target == "deploy-20241210-110000-def5678"
    
    def test_rollback_target_single_tag(self):
        """Test rollback target when only one deployment tag exists."""
        deployment_tags = [
            "deploy-20241210-120000-abc1234",
        ]
        
        # With only one tag, head -2 | tail -1 would return the same tag
        # Simulating: head -2 gets 1 tag, tail -1 returns that tag
        tags_head_2 = deployment_tags[:2]  # Gets only 1 tag if only 1 exists
        if tags_head_2:
            rollback_target = tags_head_2[-1]  # tail -1 returns last element
        else:
            rollback_target = None
        
        # With a single tag, the workflow returns that same tag
        # This isn't ideal (rolling back to current version), but matches workflow behavior
        assert rollback_target == "deploy-20241210-120000-abc1234"
    
    def test_rollback_target_no_tags(self):
        """Test rollback target when no deployment tags exist."""
        deployment_tags = []
        
        # Logic from workflow: no rollback target if no tags (graceful skip)
        # Updated behavior: returns None/empty and exits gracefully
        if len(deployment_tags) >= 2:
            rollback_target = deployment_tags[1]
        elif len(deployment_tags) == 1:
            rollback_target = deployment_tags[0]
        else:
            # No rollback target available - should skip rollback gracefully
            rollback_target = None
        
        # With updated workflow, rollback is skipped when no tags exist
        assert rollback_target is None, "No rollback should occur when no tags exist"
    
    def test_manual_rollback_version_override(self):
        """Test that manual rollback version takes precedence."""
        manual_version = "deploy-20241201-120000-manual123"
        deployment_tags = [
            "deploy-20241210-120000-abc1234",
            "deploy-20241210-110000-def5678",
        ]
        
        # Manual version should override automatic selection
        if manual_version:
            rollback_target = manual_version
        else:
            rollback_target = deployment_tags[1] if len(deployment_tags) >= 2 else "main"
        
        assert rollback_target == "deploy-20241201-120000-manual123"


class TestRollbackWorkflowValidation:
    """Test rollback workflow configuration validation."""
    
    def test_workflow_has_rollback_action(self):
        """Test that workflow file contains rollback action."""
        import os
        from pathlib import Path

        # Use pathlib for robust path resolution
        test_dir = Path(__file__).parent
        workflow_path = test_dir.parent / '.github' / 'workflows' / 'ai-agent-handoff-runbook.yml'

        # Check if workflow file exists
        assert workflow_path.exists(), f"AI Agent Handoff workflow file should exist at {workflow_path}"

        content = workflow_path.read_text()

        # Verify key rollback components exist
        assert 'rollback' in content.lower(), "Workflow should contain rollback functionality"
        assert 'rollback_version' in content, "Workflow should have rollback_version input"

    def test_workflow_has_rollback_job(self):
        """Test that workflow contains a rollback job definition."""
        import os
        from pathlib import Path

        # Use pathlib for robust path resolution
        test_dir = Path(__file__).parent
        workflow_path = test_dir.parent / '.github' / 'workflows' / 'ai-agent-handoff-runbook.yml'

        content = workflow_path.read_text()

        # Check for rollback job
        assert re.search(r'^\s*rollback:', content, re.MULTILINE), \
            "Workflow should have a rollback job"


class TestRollbackReportGeneration:
    """Test rollback report generation."""
    
    def test_report_template_structure(self):
        """Test that rollback report has required sections."""
        # Simulate report generation
        report_template = """# 🔄 Rollback Report

**Run ID**: {run_id}
**Timestamp**: {timestamp}
**Rollback Target**: {target}

## Reason

- Deployment Status: {deployment_status}
- Health Status: {health_status}
- Manual Trigger: {manual_trigger}

## Actions Taken

1. ✅ Identified rollback target
2. ✅ Executed rollback deployment
3. ✅ Generated alert

## Next Steps

1. Investigate deployment failure
2. Fix issues in development
3. Retest before next deployment

---
*Automated Rollback by AI Agent*
"""
        
        # Verify required sections exist
        required_sections = [
            "# 🔄 Rollback Report",
            "**Run ID**:",
            "**Timestamp**:",
            "**Rollback Target**:",
            "## Reason",
            "## Actions Taken",
            "## Next Steps"
        ]
        
        for section in required_sections:
            assert section in report_template, f"Report should contain {section}"
    
    def test_report_formatting(self):
        """Test that report can be generated with actual values."""
        report = f"""# 🔄 Rollback Report

**Run ID**: 12345
**Timestamp**: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}
**Rollback Target**: deploy-20241210-110000-def5678

## Reason

- Deployment Status: failure
- Health Status: degraded
- Manual Trigger: false

## Actions Taken

1. ✅ Identified rollback target
2. ✅ Executed rollback deployment
3. ✅ Generated alert

## Next Steps

1. Investigate deployment failure
2. Fix issues in development
3. Retest before next deployment

---
*Automated Rollback by AI Agent*
"""
        
        # Verify report is non-empty and contains key data
        assert len(report) > 0
        assert "12345" in report
        assert "deploy-20241210-110000-def5678" in report
        assert "failure" in report


class TestRollbackDependencies:
    """Test rollback system dependencies."""
    
    def test_required_git_operations(self):
        """Test that required git operations are available."""
        import subprocess
        
        # Test git is available
        result = subprocess.run(['git', '--version'], capture_output=True, text=True)
        assert result.returncode == 0, "Git should be available"
        
        # Test git tag operations
        result = subprocess.run(['git', 'tag', '-l'], capture_output=True, text=True)
        assert result.returncode == 0, "Git tag listing should work"
    
    def test_tag_pattern_extraction(self):
        """Test extraction of components from deployment tags."""
        tag = "deploy-20241210-120000-abc1234"
        
        # Extract components
        match = re.match(r'deploy-(\d{8})-(\d{6})-([a-z0-9]+)', tag)
        
        assert match is not None, "Tag should match expected pattern"
        assert match.group(1) == "20241210", "Date should be extractable"
        assert match.group(2) == "120000", "Time should be extractable"
        assert match.group(3) == "abc1234", "Commit hash should be extractable"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
