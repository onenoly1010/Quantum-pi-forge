#!/bin/bash
# OINIO Forge Browser Test Runner
# This contains ALL browser/Chrome related functionality
# Separated from frontend dashboard code

set +e

# Environment guard: Skip browser operations if requested or not available
if [ "$BROWSER" = "none" ] || [ "$CI" = "true" ] || [ "$HEADLESS" = "true" ]; then
    echo "✅ Headless/CI environment detected - skipping browser launch"
    exit 0
fi

# Check for available browsers - respect CHROME_BIN environment variable first
detect_browser() {
    # Honor explicit CHROME_BIN override if set
    if [ -n "$CHROME_BIN" ] && [ -x "$CHROME_BIN" ]; then
        echo "$CHROME_BIN"
        return 0
    fi
    
    if command -v google-chrome &> /dev/null; then
        echo "google-chrome"
        return 0
    elif command -v chromium &> /dev/null; then
        echo "chromium"
        return 0
    elif command -v chromium-browser &> /dev/null; then
        echo "chromium-browser"
        return 0
    elif command -v firefox &> /dev/null; then
        echo "firefox"
        return 0
    else
        return 1
    fi
}

BROWSER_BIN=$(detect_browser)

if [ $? -ne 0 ]; then
    echo "⚠️  No web browser found in environment"
    echo "   This is NOT an error - dashboard is still perfectly valid"
    echo "   To view dashboard: open monitor_v2.html manually in any browser"
    echo
    echo "   If you are in CI: set BROWSER=none to suppress this message"
    exit 0
fi

# Only attempt to open if we actually found a browser
if [ "$1" = "open" ] && [ -f "monitor_v2.html" ]; then
    echo "🌐 Opening monitor dashboard with $BROWSER_BIN"
    $BROWSER_BIN monitor_v2.html > /dev/null 2>&1 &
fi