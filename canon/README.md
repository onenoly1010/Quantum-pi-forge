# Canon of Closure

Welcome to the Canon of Closure - the living documentation system for Pi Forge Quantum Genesis project.

## Overview

The Canon of Closure is an autonomous documentation system that:
- Captures the evolution and resolution of issues
- Maintains a structured knowledge base
- Enforces governance through automated merge gates
- Ensures integrity through continuous validation

## Structure

Artifacts are organized by type:

### 📜 Foundational
Core framework documents establishing principles and patterns. These artifacts form the foundation of the Canon and require the highest level of review.

**Approval Requirements**: 2 steward approvals

### 🔗 Channel
Communication and integration channels between systems. Documents APIs, protocols, and integration patterns.

**Approval Requirements**: 1 steward or curator approval

### ✅ Closure
Issue resolution documentation and retrospectives. Captures how specific issues were resolved and lessons learned.

**Approval Requirements**: 1 steward, curator, or contributor approval

### ⚖️ Governance
Policy, procedural, and governance documents. Defines how the Canon itself evolves.

**Approval Requirements**: 2 steward approvals (auto-merge disabled by default)

## Index

See [INDEX.md](./INDEX.md) for the complete artifact catalog (auto-generated).

## Creating Canon Artifacts

### Step 1: Create Issue

Create an issue using the Canon artifact template and get approval.

### Step 2: Create Artifact

Create a new `.md` file in the appropriate subdirectory with required frontmatter:

```yaml
---
id: UNIQUE-ID
title: Human Readable Title
type: foundational|channel|closure|governance
created_at: 2024-01-01T00:00:00Z
author: github-username
trace_id: A22-001
status: draft|review|approved|archived
parent: PARENT-ID (optional)
tags:
  - tag1
  - tag2
related:
  - RELATED-ID-1
  - RELATED-ID-2
---
```

### Step 3: Create Pull Request

Create a PR with your artifact. The Canon Auto-Merge system will:

1. **Gate 1**: Classify the artifact type
2. **Gate 2**: Wait for ClosureSentinel validation
3. **Gate 3**: Check role-based approvals
4. **Gate 4**: Detect conflicts
5. **Gate 5**: Log to audit trail
6. **Gate 6**: Auto-merge if all gates pass

### Step 4: Post-Merge

After merge, the system automatically:
- Regenerates the Canon index
- Verifies integrity
- Updates the parent issue (if linked)

## Examples

See the `examples/` directory for sample artifacts:
- `examples/foundational-example.md` - Foundational artifact template
- `examples/closure-example.md` - Closure artifact template

## Contribution Guidelines

1. ✅ Use the artifact template
2. ✅ Include all required frontmatter fields
3. ✅ Link to parent artifact (if applicable)
4. ✅ Ensure unique artifact ID
5. ✅ Wait for validation checks
6. ✅ Obtain required approvals
7. ✅ Let auto-merge handle the rest

## Validation

All artifacts are validated for:
- **Structure**: Proper YAML frontmatter
- **Schema**: Required fields present and valid
- **Conflicts**: No duplicate IDs or circular dependencies
- **Continuity**: Valid parent references
- **Integrity**: No broken links or orphaned artifacts

## Roles

- **Stewards**: Full permissions, can override gates
- **Curators**: Can approve channel and closure artifacts
- **Contributors**: Can approve closure artifacts
- **Agents**: Automated actors, no approval rights

## Support

For questions or issues:
- Review the [Setup Guide](../.github/AUTOMERGE_SETUP.md)
- Contact Canon Stewards
- Open an issue with the `canon` label

---

**System Status**: ✅ Auto-Merge Active  
**Last Index Update**: Auto-generated on merge  
**Total Artifacts**: See INDEX.md
