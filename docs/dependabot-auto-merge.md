# Dependabot Auto-Merge Gate

This workflow automatically merges eligible Dependabot PRs after validating gating conditions.

## Features

- **CODEOWNERS Support**: Validates approvals from users listed in CODEOWNERS file
- **Team Membership**: Supports team references (e.g., `@org/team`) and expands them to individual members
- **Freshness Verification**: Ensures required checks completed within a configurable time window (default: 12 hours)
- **Required Label**: Only processes PRs with the specified label (default: `dependencies`)
- **Required Checks**: Validates that specified CI checks have passed
- **Caching**: Caches team membership data to reduce API calls (default TTL: 24 hours)

## Setup

### 1. Create Repository Secret

Create a repository secret named `REPO_MERGE_TOKEN` with a Personal Access Token (PAT) that has the following scopes:

- `repo` - Full control of private repositories (required for merging PRs)
- `read:org` - Read organization and team membership (required for team-based CODEOWNERS)

To create the token:
1. Go to GitHub Settings > Developer settings > Personal access tokens > Fine-grained tokens
2. Create a new token with the required permissions
3. Add the token as a repository secret named `REPO_MERGE_TOKEN`

### 2. Add CODEOWNERS File

Create a `CODEOWNERS` file in one of these locations:
- `.github/CODEOWNERS` (recommended)
- `CODEOWNERS`
- `docs/CODEOWNERS`

Example:
```
# Default owners for everything
* @username @org/team-name

# Specific path owners
/src/ @developer1 @org/frontend-team
```

### 3. Configure Required Checks

Ensure your repository has the required checks configured:
- `Test Dependencies` - Runs tests on dependency updates
- `Security Scan` - Scans for security vulnerabilities

These check names should match the `REQUIRED_CHECKS` environment variable in the workflow.

## Configuration

The workflow accepts the following environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `REQUIRED_LABEL` | `dependencies` | Label required on the PR |
| `REQUIRED_CHECKS` | `Test Dependencies,Security Scan` | Comma-separated list of required checks |
| `FRESHNESS_HOURS` | `12` | Maximum age of check runs in hours |
| `REQUIRED_CODEOWNER_APPROVALS` | `1` | Minimum number of CODEOWNER approvals required |
| `MERGE_METHOD` | `squash` | Merge method (`merge`, `squash`, or `rebase`) |
| `CACHE_TTL_SECONDS` | `86400` | Cache TTL for team membership data (24 hours) |

## How It Works

1. **Trigger**: Workflow runs on `pull_request_target` events (opened, labeled, reopened, synchronize, edited)

2. **Validation Steps**:
   - Verifies PR is created by Dependabot
   - Checks for required label
   - Parses CODEOWNERS file and expands team references to user lists
   - Counts approvals from CODEOWNERS users/team members
   - Validates required checks are passing and fresh

3. **Merge**: If all conditions pass, the PR is automatically merged using the specified method

## Workflow Events

The workflow triggers on these PR events:
- `opened` - New Dependabot PR created
- `labeled` - Label added (in case required label is added later)
- `reopened` - PR reopened after being closed
- `synchronize` - PR updated with new commits
- `edited` - PR title/body edited

## Troubleshooting

### PR Not Merging

Check the workflow logs for specific error messages:

1. **"PR is not from Dependabot"** - Only Dependabot PRs are processed
2. **"PR does not have required label"** - Add the `dependencies` label to the PR
3. **"Insufficient CODEOWNER approvals"** - Request reviews from CODEOWNERS
4. **"Required check not found"** - Ensure the check names match exactly
5. **"Required check is stale"** - Re-run the checks or adjust `FRESHNESS_HOURS`

### Team Membership Not Working

- Ensure `REPO_MERGE_TOKEN` has `read:org` scope
- Verify the team slug format is correct (lowercase, hyphens instead of spaces)
- Check that the token owner has visibility into the organization's teams

## Security Considerations

- The workflow uses `pull_request_target` which runs in the context of the base branch
- The `REPO_MERGE_TOKEN` should be kept secret and have minimal required permissions
- Team membership data is cached locally to reduce API exposure
- Only Dependabot PRs are processed, reducing attack surface

## License

This workflow is part of the Pi Forge Quantum Genesis project.
