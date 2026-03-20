# Pi Forge Quantum Genesis - CI/CD Automation Guide

This document describes the CI/CD workflows, packaging system, and monitoring automation for the Pi Forge Quantum Genesis project.

## Table of Contents

- [Overview](#overview)
- [Workflows](#workflows)
  - [Test and Build](#test-and-build)
  - [Release on Merge](#release-on-merge)
  - [Scheduled Monitoring](#scheduled-monitoring)
- [Pi Studio Packaging](#pi-studio-packaging)
- [Webhook Configuration](#webhook-configuration)
- [Reusable Actions](#reusable-actions)
- [Running Workflows Locally](#running-workflows-locally)
- [Troubleshooting](#troubleshooting)
- [Size Reduction Tips](#size-reduction-tips)

---

## Overview

The automation system consists of three main workflows:

1. **Test and Build** - Runs on every PR and push to feature branches
2. **Release on Merge** - Creates draft releases when PRs are merged to main
3. **Scheduled Monitoring** - Daily health checks with GitHub Issue reporting

All workflows enforce a **1 MB per file limit** for Pi Studio packages to comply with Pi Network app constraints.

---

## Workflows

### Test and Build

**File:** `.github/workflows/test-and-build.yml`

**Triggers:**
- Push to any branch except `main`
- Pull requests targeting `main`

**Jobs:**

1. **lint-and-test**
   - Sets up Python 3.11
   - Installs dependencies
   - Runs flake8 linter
   - Executes pytest tests

2. **build-and-package**
   - Copies application files to build directory
   - Excludes binary files (*.exe, *.dll)
   - Creates `pi-studio-part-XX.zip` packages
   - Validates all files are under 1 MB
   - Uploads artifacts

3. **health-check**
   - Verifies FastAPI and Flask modules load correctly
   - Tests health endpoint functions

**Artifacts Produced:**
- `pi-studio-packages` - ZIP files containing the application

### Release on Merge

**File:** `.github/workflows/release-on-merge.yml`

**Triggers:**
- Push to `main` branch (typically from merged PR)

**Actions:**
1. Builds and packages the application
2. Generates a version tag (format: `vYYYY.MM.DD-SHA`)
3. Creates `press-release-draft.md` with release notes
4. Creates a **Draft Release** on GitHub with:
   - Pi Studio ZIP packages attached
   - Press release template
   - Publication checklist

**Note:** The release is created in **draft mode**. The repository owner must review and publish it manually.

### Scheduled Monitoring

**File:** `.github/workflows/scheduled-monitoring.yml`

**Triggers:**
- Daily at 6:00 AM UTC (cron: `0 6 * * *`)
- Manual trigger via workflow_dispatch

**Health Checks Performed:**
1. FastAPI module import test
2. Flask module import test
3. Critical file existence check
4. Source file size validation
5. Binary file detection

**Outputs:**
- Updates/creates GitHub Issue with status report
- Sends webhook notifications (if configured)
- Uploads health report artifact

---

## Pi Studio Packaging

### Package Structure

```
pi-studio-part-01.zip
├── server/
│   ├── main.py          (FastAPI application)
│   ├── app.py           (Flask application)
│   ├── requirements.txt
│   └── ...
├── frontend/
│   ├── index.html
│   └── ...
├── docs/
├── index.html
├── install.sh
├── README.md
├── .env.example
├── Dockerfile
├── railway.toml
└── vercel.json
```

### File Size Constraints

**Hard Limit:** Each file inside the ZIP must be ≤ 1 MB

**Excluded by Default:**
- `*.exe` - Windows executables
- `*.dll` - Dynamic libraries
- `__pycache__/` - Python bytecode
- `*.pyc` - Compiled Python
- `.git/` - Git directory
- `.venv/` - Virtual environment
- `node_modules/` - Node dependencies

### Multi-Part Packaging

If the application grows and requires splitting:

1. Part 01: Core server and frontend
2. Part 02: Documentation and assets
3. Part 03: Optional components

The packaging script automatically handles splitting when needed.

---

## Webhook Configuration

### Slack Integration

1. Create a Slack Incoming Webhook:
   - Go to your Slack workspace settings
   - Navigate to Apps → Incoming Webhooks
   - Create a new webhook for your channel

2. Add to GitHub Secrets:
   - Go to repository Settings → Secrets and variables → Actions
   - Create secret: `SLACK_WEBHOOK_URL`
   - Paste your webhook URL

### Discord Integration

1. Create a Discord Webhook:
   - Go to your Discord server settings
   - Navigate to Integrations → Webhooks
   - Create a new webhook

2. Add to GitHub Secrets:
   - Create secret: `DISCORD_WEBHOOK_URL`
   - Paste your webhook URL

### Notification Triggers

Webhooks are triggered when:
- Health check status is `degraded` or `warning`
- Build failures occur (if configured)

---

## Reusable Actions

### Validate Package Sizes

**Location:** `.github/actions/validate-package-sizes/action.yml`

**Usage:**

```yaml
- name: Validate package sizes
  uses: ./.github/actions/validate-package-sizes
  with:
    path: build/artifacts/pi-studio-part-01.zip
    max-size-mb: '1'
    fail-on-error: 'true'
```

**Inputs:**
- `path` (required): Path to directory or ZIP file
- `max-size-mb` (optional): Maximum file size in MB (default: 1)
- `fail-on-error` (optional): Fail action if oversized files found (default: true)

**Outputs:**
- `status`: pass or fail
- `oversized-files`: List of files exceeding the limit
- `report`: Full validation report

---

## Running Workflows Locally

### Prerequisites

- Python 3.11+
- pip
- Git
- zip/unzip utilities

### Manual Test Run

```bash
# Clone repository
git clone https://github.com/onenoly1010/pi-forge-quantum-genesis.git
cd pi-forge-quantum-genesis

# Install dependencies
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r server/requirements.txt

# Run tests
cd tests
python -m pytest -v

# Run linter
pip install flake8
flake8 server/ --count --select=E9,F63,F7,F82 --show-source --statistics
```

### Local Packaging

```bash
# Create build directory
mkdir -p build/pi-studio

# Copy files
cp -r server/ build/pi-studio/server/
cp -r frontend/ build/pi-studio/frontend/
cp index.html build/pi-studio/

# Create ZIP (excluding large files)
cd build/pi-studio
zip -r ../pi-studio-local.zip . -x "*.exe" -x "*.dll" -x "__pycache__/*"

# Validate sizes
find . -type f -exec sh -c 'size=$(stat -c %s "$1"); if [ $size -gt 1048576 ]; then echo "OVERSIZED: $1 ($size bytes)"; fi' _ {} \;
```

### Using Act for Local Workflow Testing

[Act](https://github.com/nektos/act) allows running GitHub Actions locally:

```bash
# Install act
brew install act  # macOS
# or see https://github.com/nektos/act#installation

# Run test workflow
act push -j lint-and-test

# Run with specific event
act pull_request
```

---

## Troubleshooting

### Common Issues

#### 1. Build Fails: Module Import Error

**Symptom:** `ModuleNotFoundError: No module named 'X'`

**Solution:**
- Check `server/requirements.txt` is complete
- Verify Python version (3.11 required)
- Run `pip install -r server/requirements.txt` locally

#### 2. Packaging Fails: Oversized Files

**Symptom:** `Found files exceeding 1 MB limit`

**Solution:**
- Identify the oversized file from the error message
- Apply size reduction techniques (see below)
- Add file to exclusion list if it's not needed in package

#### 3. Release Not Created

**Symptom:** Workflow succeeds but no release appears

**Solution:**
- Check workflow ran on `main` branch
- Verify `GITHUB_TOKEN` permissions
- Look for the release in "Drafts" section

#### 4. Health Check Failures

**Symptom:** Monitoring issue shows degraded status

**Solution:**
- Review the specific failing checks
- Fix import errors or missing files
- Re-run workflow manually to verify fix

#### 5. Webhook Not Sending

**Symptom:** No Slack/Discord notifications

**Solution:**
- Verify secret is set correctly (no trailing spaces)
- Test webhook URL manually with curl
- Check workflow logs for curl errors

### Debug Mode

To enable verbose logging in workflows:

```yaml
env:
  ACTIONS_STEP_DEBUG: true
```

---

## Size Reduction Tips

### For Python Files

1. **Remove unused imports**
   ```bash
   pip install autoflake
   autoflake --in-place --remove-all-unused-imports server/*.py
   ```

2. **Minify if needed** (not recommended for source)
   ```bash
   pip install python-minifier
   pyminify server/large_file.py > server/large_file.min.py
   ```

### For JavaScript Files

1. **Minify with Terser**
   ```bash
   npm install -g terser
   terser frontend/app.js -o frontend/app.min.js
   ```

2. **Bundle and tree-shake**
   - Use webpack, rollup, or esbuild

### For Images

1. **Convert to WebP**
   ```bash
   # Install cwebp
   sudo apt install webp
   
   # Convert
   cwebp -q 80 image.png -o image.webp
   ```

2. **Compress existing images**
   ```bash
   # Install optipng and jpegoptim
   optipng image.png
   jpegoptim --strip-all image.jpg
   ```

### For Data Files

1. **Use compression**
   - Store as `.json.gz` instead of `.json`
   - Use binary formats (msgpack, protobuf)

2. **Split large files**
   - Break into logical chunks
   - Load on-demand

### Exclusion Strategy

Add to `.gitignore` or packaging exclusions:
- Development dependencies
- Test fixtures
- Documentation images
- Temporary files
- IDE configurations

---

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Pi Network Developer Guide](https://developers.minepi.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Flask Documentation](https://flask.palletsprojects.com/)

---

*Pi Forge Quantum Genesis - Built with Quantum Spirit by Kris Olofson (onenoly1010)*
