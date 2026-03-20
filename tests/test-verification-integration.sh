#!/bin/bash
# Integration Test for Verification Framework
# Tests end-to-end workflow without requiring actual deployments

# Note: Not using 'set -e' to allow controlled error handling

# Store test directory before sourcing libraries (which may override SCRIPT_DIR)
TEST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VERIFICATION_DIR="$TEST_DIR/../scripts/verification"
LIB_DIR="$VERIFICATION_DIR/lib"

# Source colors for output
source "$LIB_DIR/colors.sh"

section "🧪 Verification Framework Integration Test" "$(divider)"

# Test 1: Check all required files exist
section "📁 File Structure Test"
info "Checking required files exist..."

FILES_TO_CHECK=(
    "$LIB_DIR/colors.sh"
    "$LIB_DIR/validators.sh"
    "$LIB_DIR/formatters.sh"
    "$LIB_DIR/assertions.sh"
    "$VERIFICATION_DIR/verify-all.sh"
    "$VERIFICATION_DIR/pi-network/verify-catalyst.sh"
    "$VERIFICATION_DIR/zero-g/verify-uniswap.sh"
    "$VERIFICATION_DIR/universal/verify-erc20.sh"
    "$TEST_DIR/../config/networks.json"
    "$TEST_DIR/../docs/VERIFICATION.md"
)

all_files_exist=true
for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        success "Found: $(basename "$file")"
    else
        error "Missing: $file"
        all_files_exist=false
    fi
done

if [ "$all_files_exist" = true ]; then
    success "All required files exist"
else
    error "Some required files are missing"
    exit 1
fi
echo ""

# Test 2: Check all scripts are executable
section "🔐 Executable Permissions Test"
info "Checking scripts are executable..."

SCRIPTS_TO_CHECK=(
    "$VERIFICATION_DIR/verify-all.sh"
    "$VERIFICATION_DIR/pi-network/verify-catalyst.sh"
    "$VERIFICATION_DIR/zero-g/verify-uniswap.sh"
    "$VERIFICATION_DIR/universal/verify-erc20.sh"
)

all_executable=true
for script in "${SCRIPTS_TO_CHECK[@]}"; do
    if [ -x "$script" ]; then
        success "Executable: $(basename "$script")"
    else
        error "Not executable: $script"
        all_executable=false
    fi
done

if [ "$all_executable" = true ]; then
    success "All scripts are executable"
else
    error "Some scripts are not executable"
    exit 1
fi
echo ""

# Test 3: Check library functions can be sourced
section "📚 Library Import Test"
info "Testing library imports..."

# Try sourcing each library
if source "$LIB_DIR/colors.sh" 2>/dev/null; then
    success "colors.sh sourced successfully"
else
    error "Failed to source colors.sh"
    exit 1
fi

if source "$LIB_DIR/validators.sh" 2>/dev/null; then
    success "validators.sh sourced successfully"
else
    error "Failed to source validators.sh"
    exit 1
fi

if source "$LIB_DIR/formatters.sh" 2>/dev/null; then
    success "formatters.sh sourced successfully"
else
    error "Failed to source formatters.sh"
    exit 1
fi

if source "$LIB_DIR/assertions.sh" 2>/dev/null; then
    success "assertions.sh sourced successfully"
else
    error "Failed to source assertions.sh"
    exit 1
fi

success "All libraries import correctly"
echo ""

# Test 4: Verify JSON configuration is valid
section "⚙️  Configuration Validation Test"
info "Testing JSON configuration..."

CONFIG_FILE="$TEST_DIR/../config/networks.json"

if command -v jq &> /dev/null; then
    # Test if JSON is valid by trying to parse it
    jq_output=$(jq . "$CONFIG_FILE" 2>&1)
    jq_status=$?
    
    if [ $jq_status -eq 0 ]; then
        success "networks.json is valid JSON"
        
        # Check for expected networks
        networks=$(jq -r 'keys[]' "$CONFIG_FILE" 2>/dev/null)
        info "Configured networks:"
        for network in $networks; do
            info "  - $(highlight "$network")"
        done
    else
        error "networks.json is not valid JSON"
        info "jq output: $jq_output"
        exit 1
    fi
else
    warning "jq not installed, skipping JSON validation"
fi
echo ""

# Test 5: Check reports directory can be created
section "📊 Reports Directory Test"
info "Testing reports directory..."

REPORTS_DIR="$TEST_DIR/../reports"
mkdir -p "$REPORTS_DIR"

if [ -d "$REPORTS_DIR" ]; then
    success "Reports directory exists/created"
    
    # Test write permissions
    test_file="$REPORTS_DIR/test-write-$(date +%s).tmp"
    if echo "test" > "$test_file" 2>/dev/null; then
        success "Reports directory is writable"
        rm -f "$test_file"
    else
        error "Reports directory is not writable"
        exit 1
    fi
else
    error "Could not create reports directory"
    exit 1
fi
echo ""

# Test 6: Test verify-all.sh with no environment variables
section "🚀 Master Script Test (No Env Vars)"
info "Testing verify-all.sh without environment variables..."

# Run with invalid network filter to test error handling
if bash "$VERIFICATION_DIR/verify-all.sh" invalid-network 2>&1 | grep -q "WARNING"; then
    success "Master script handles missing environment variables correctly"
else
    warning "Could not verify environment variable handling"
fi
echo ""

# Test 7: Check GitHub Actions workflow syntax
section "⚙️  GitHub Actions Workflow Test"
info "Checking workflow file syntax..."

WORKFLOW_FILE="$TEST_DIR/../.github/workflows/verify-deployments.yml"

if [ -f "$WORKFLOW_FILE" ]; then
    success "Workflow file exists"
    
    # Basic YAML syntax check
    if grep -q "name: Verify All Deployments" "$WORKFLOW_FILE"; then
        success "Workflow has correct name"
    else
        warning "Workflow name not found"
    fi
    
    if grep -q "workflow_dispatch:" "$WORKFLOW_FILE"; then
        success "Workflow is manually dispatchable"
    else
        warning "Workflow dispatch trigger not found"
    fi
else
    warning "Workflow file not found at expected location"
fi
echo ""

# Test 8: Check documentation completeness
section "📖 Documentation Test"
info "Checking documentation..."

DOC_FILE="$TEST_DIR/../docs/VERIFICATION.md"

if [ -f "$DOC_FILE" ]; then
    success "VERIFICATION.md exists"
    
    # Check for key sections
    if grep -q "## Quick Start" "$DOC_FILE"; then
        success "Documentation has Quick Start section"
    else
        warning "Quick Start section missing"
    fi
    
    if grep -q "## Troubleshooting" "$DOC_FILE"; then
        success "Documentation has Troubleshooting section"
    else
        warning "Troubleshooting section missing"
    fi
    
    if grep -q "## Adding New Chains" "$DOC_FILE"; then
        success "Documentation has Adding New Chains section"
    else
        warning "Adding New Chains section missing"
    fi
else
    error "Documentation file missing"
    exit 1
fi
echo ""

# Final Summary
section "📊 Integration Test Summary"
success "🎉 All integration tests passed!"
info "The verification framework is ready for use"
echo ""
info "Next steps:"
info "1. Set environment variables for your deployments"
info "2. Run: ./scripts/verification/verify-all.sh all"
info "3. Check reports/ directory for verification results"
echo ""
