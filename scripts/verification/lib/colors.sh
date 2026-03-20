#!/bin/bash
# ANSI color codes and formatting utilities
# Part of Pi Forge Quantum Genesis verification framework

# ANSI color codes
export RED='\033[0;31m'
export GREEN='\033[0;32m'
export YELLOW='\033[1;33m'
export BLUE='\033[0;34m'
export MAGENTA='\033[0;35m'
export CYAN='\033[0;36m'
export BOLD='\033[1m'
export NC='\033[0m' # No Color

# Status functions with consistent formatting
success() { 
    echo -e "${GREEN}✅ $1${NC}"
}

error() { 
    echo -e "${RED}❌ ERROR: $1${NC}" >&2
}

warning() { 
    echo -e "${YELLOW}⚠️  WARNING: $1${NC}"
}

info() { 
    echo -e "${CYAN}ℹ️  $1${NC}"
}

section() {
    local title=$1
    local separator=${2:-"================================================================================"}
    echo -e "\n${BOLD}${MAGENTA}$title${NC}"
    echo -e "${MAGENTA}$separator${NC}"
}

# Progress indicator
progress() {
    echo -e "${BLUE}⏳ $1${NC}"
}

# Debug output (only shown if DEBUG=1)
debug() {
    if [ "${DEBUG:-0}" == "1" ]; then
        echo -e "${CYAN}🔍 DEBUG: $1${NC}"
    fi
}

# Highlight important values
highlight() {
    echo -e "${BOLD}${CYAN}$1${NC}"
}

# Print a divider line
divider() {
    echo -e "${MAGENTA}$(printf '=%.0s' {1..80})${NC}"
}

# Export functions so they can be used in other scripts
export -f success error warning info section progress debug highlight divider
