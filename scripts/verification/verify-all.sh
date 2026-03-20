#!/bin/bash
# Master Verification Orchestration Script
# Part of Pi Forge Quantum Genesis verification framework
#
# Usage: ./verify-all.sh [network]
# Where network is: all, pi-network, zero-g, pi-network-testnet, zero-g-testnet
# Default: all

set -e

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LIB_DIR="$SCRIPT_DIR/lib"

# Source library functions
source "$LIB_DIR/colors.sh"

# Parse arguments
NETWORK_FILTER=${1:-all}

# Global counters
TOTAL_VERIFICATIONS=0
SUCCESSFUL_VERIFICATIONS=0
FAILED_VERIFICATIONS=0

# Function to run a verification script
run_verification() {
    local script_path=$1
    local network=$2
    local description=$3
    
    ((TOTAL_VERIFICATIONS++))
    
    section "Running: $description"
    
    if [ ! -f "$script_path" ]; then
        error "Verification script not found: $script_path"
        ((FAILED_VERIFICATIONS++))
        return 1
    fi
    
    # Make script executable
    chmod +x "$script_path"
    
    # Run the verification
    if bash "$script_path" "$network"; then
        success "✓ $description completed successfully"
        ((SUCCESSFUL_VERIFICATIONS++))
        return 0
    else
        error "✗ $description failed"
        ((FAILED_VERIFICATIONS++))
        return 1
    fi
}

# Main orchestration function
main() {
    section "🚀 Pi Forge Quantum Genesis - Multi-Chain Verification" "$(printf '=%.0s' {1..80})"
    info "Network Filter: $(highlight "$NETWORK_FILTER")"
    info "Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo ""
    
    # Check for Foundry installation
    section "🔧 Prerequisites Check"
    if ! command -v cast &> /dev/null; then
        error "Foundry 'cast' command not found"
        error "Please install Foundry: https://book.getfoundry.sh/getting-started/installation"
        exit 1
    fi
    
    if ! command -v forge &> /dev/null; then
        warning "Foundry 'forge' command not found (optional)"
    else
        success "Foundry tools are available"
    fi
    
    # Check for bc (used for floating point math)
    if ! command -v bc &> /dev/null; then
        warning "'bc' command not found. Some calculations may not work."
    fi
    
    echo ""
    
    # Create reports directory
    mkdir -p "$SCRIPT_DIR/../../reports"
    
    # Pi Network Mainnet Verification
    if [ "$NETWORK_FILTER" == "all" ] || [ "$NETWORK_FILTER" == "pi-network" ] || [ "$NETWORK_FILTER" == "pi-network-mainnet" ]; then
        section "🔮 Pi Network Mainnet Verification"
        
        if [ -n "$CATALYST_POOL_ADDRESS" ] && [ -n "$MODEL_ROYALTY_NFT_ADDRESS" ]; then
            run_verification \
                "$SCRIPT_DIR/pi-network/verify-catalyst.sh" \
                "mainnet" \
                "Pi Network Mainnet - Catalyst Pool" || true
        else
            warning "Skipping Pi Network Mainnet: Missing environment variables"
            info "Required: CATALYST_POOL_ADDRESS, MODEL_ROYALTY_NFT_ADDRESS"
        fi
        
        echo ""
    fi
    
    # Pi Network Testnet Verification
    if [ "$NETWORK_FILTER" == "all" ] || [ "$NETWORK_FILTER" == "pi-network-testnet" ]; then
        section "🔮 Pi Network Testnet Verification"
        
        if [ -n "$CATALYST_POOL_ADDRESS_TESTNET" ] && [ -n "$MODEL_ROYALTY_NFT_ADDRESS_TESTNET" ]; then
            run_verification \
                "$SCRIPT_DIR/pi-network/verify-catalyst.sh" \
                "testnet" \
                "Pi Network Testnet - Catalyst Pool" || true
        else
            warning "Skipping Pi Network Testnet: Missing environment variables"
            info "Required: CATALYST_POOL_ADDRESS_TESTNET, MODEL_ROYALTY_NFT_ADDRESS_TESTNET"
        fi
        
        echo ""
    fi
    
    # 0G Mainnet Verification
    if [ "$NETWORK_FILTER" == "all" ] || [ "$NETWORK_FILTER" == "zero-g" ] || [ "$NETWORK_FILTER" == "zero-g-mainnet" ]; then
        section "🔷 0G Mainnet Verification"
        
        if [ -n "$ZERO_G_W0G" ] && [ -n "$ZERO_G_FACTORY" ] && [ -n "$ZERO_G_ROUTER" ]; then
            run_verification \
                "$SCRIPT_DIR/zero-g/verify-uniswap.sh" \
                "mainnet" \
                "0G Mainnet - Uniswap V2" || true
        else
            warning "Skipping 0G Mainnet: Missing environment variables"
            info "Required: ZERO_G_W0G, ZERO_G_FACTORY, ZERO_G_ROUTER"
        fi
        
        echo ""
    fi
    
    # 0G Testnet Verification
    if [ "$NETWORK_FILTER" == "all" ] || [ "$NETWORK_FILTER" == "zero-g-testnet" ]; then
        section "🔷 0G Testnet Verification"
        
        if [ -n "$ZERO_G_W0G_TESTNET" ] && [ -n "$ZERO_G_FACTORY_TESTNET" ] && [ -n "$ZERO_G_ROUTER_TESTNET" ]; then
            run_verification \
                "$SCRIPT_DIR/zero-g/verify-uniswap.sh" \
                "testnet" \
                "0G Testnet - Uniswap V2" || true
        else
            warning "Skipping 0G Testnet: Missing environment variables"
            info "Required: ZERO_G_W0G_TESTNET, ZERO_G_FACTORY_TESTNET, ZERO_G_ROUTER_TESTNET"
        fi
        
        echo ""
    fi
    
    # Generate summary report
    generate_summary_report
    
    # Generate HTML report
    generate_html_report
    
    # Final status
    echo ""
    divider
    section "📊 Final Verification Summary"
    info "Total Verifications: $(highlight "$TOTAL_VERIFICATIONS")"
    info "Successful: $(highlight "$SUCCESSFUL_VERIFICATIONS") ✓"
    info "Failed: $(highlight "$FAILED_VERIFICATIONS") ✗"
    
    if [ $FAILED_VERIFICATIONS -eq 0 ] && [ $TOTAL_VERIFICATIONS -gt 0 ]; then
        echo ""
        success "🎉 All verifications passed successfully!"
        exit 0
    elif [ $TOTAL_VERIFICATIONS -eq 0 ]; then
        echo ""
        warning "No verifications were run. Check your environment variables."
        exit 1
    else
        echo ""
        error "Some verifications failed. Please review the reports."
        exit 1
    fi
}

# Generate summary JSON report
generate_summary_report() {
    local report_file="$SCRIPT_DIR/../../reports/verification-summary-$(date +%Y%m%d-%H%M%S).json"
    
    cat > "$report_file" <<EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "network_filter": "$NETWORK_FILTER",
  "summary": {
    "total": $TOTAL_VERIFICATIONS,
    "successful": $SUCCESSFUL_VERIFICATIONS,
    "failed": $FAILED_VERIFICATIONS
  },
  "individual_reports": [
$(find "$SCRIPT_DIR/../../reports" -name "*.json" -newer "$SCRIPT_DIR/verify-all.sh" -type f 2>/dev/null | {
    count=0
    files_array=""
    while read -r file; do
        if [ $count -gt 0 ]; then
            files_array="$files_array,"
        fi
        files_array="$files_array
    \"$(basename "$file")\""
        count=$((count + 1))
    done
    echo "$files_array"
    # Ensures empty array [] if no files found
})
  ]
}
EOF
    
    success "Summary report saved to: $(highlight "$report_file")"
}

# Generate HTML report
generate_html_report() {
    local report_file="$SCRIPT_DIR/../../reports/verification-report-$(date +%Y%m%d-%H%M%S).html"
    
    cat > "$report_file" <<'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pi Forge Quantum Genesis - Verification Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            border-left: 4px solid #667eea;
        }
        .stat-card h3 {
            font-size: 2.5em;
            color: #667eea;
            margin-bottom: 5px;
        }
        .stat-card p {
            color: #666;
            font-size: 0.9em;
        }
        .stat-card.success { border-left-color: #10b981; }
        .stat-card.success h3 { color: #10b981; }
        .stat-card.failed { border-left-color: #ef4444; }
        .stat-card.failed h3 { color: #ef4444; }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            color: #667eea;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .network-card {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 15px;
        }
        .network-card h3 {
            color: #333;
            margin-bottom: 10px;
        }
        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: bold;
        }
        .status-badge.success {
            background: #d1fae5;
            color: #065f46;
        }
        .status-badge.failed {
            background: #fee2e2;
            color: #991b1b;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔮 Pi Forge Quantum Genesis</h1>
            <p>Multi-Chain Deployment Verification Report</p>
            <p style="font-size: 0.9em; margin-top: 10px;">EOF
    echo "Generated: $(date -u +%Y-%m-%d' '%H:%M:%S' UTC')" >> "$report_file"
    cat >> "$report_file" <<EOF
</p>
        </div>
        <div class="content">
            <div class="summary">
                <div class="stat-card">
                    <h3>$TOTAL_VERIFICATIONS</h3>
                    <p>Total Verifications</p>
                </div>
                <div class="stat-card success">
                    <h3>$SUCCESSFUL_VERIFICATIONS</h3>
                    <p>Successful</p>
                </div>
                <div class="stat-card failed">
                    <h3>$FAILED_VERIFICATIONS</h3>
                    <p>Failed</p>
                </div>
            </div>
            
            <div class="section">
                <h2>Verification Results</h2>
                <div class="network-card">
                    <h3>📋 Network Filter</h3>
                    <p>$NETWORK_FILTER</p>
                </div>
            </div>
            
            <div class="section">
                <h2>Individual Reports</h2>
                <p>Detailed JSON reports are available in the reports directory.</p>
            </div>
        </div>
        <div class="footer">
            <p>Pi Forge Quantum Genesis - Multi-Chain Verification Framework</p>
            <p>Powered by Foundry &amp; Bash</p>
        </div>
    </div>
</body>
</html>
EOF
    
    success "HTML report saved to: $(highlight "$report_file")"
}

# Run main function
main "$@"
