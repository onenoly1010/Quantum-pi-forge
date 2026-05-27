#!/usr/bin/env bash
set -Eeuo pipefail

echo "🔍 Press Agent Setup Verification"
echo "=================================="
echo ""

fail() {
  echo "❌ $*"
  exit 1
}

warn() {
  echo "⚠️  $*"
}

pass() {
  echo "✅ $*"
}

# Check root location
[ -d "press-agent" ] || fail "press-agent directory not found"

cd press-agent

[ -f "package.json" ] || fail "package.json not found"
pass "package.json found"

[ -f ".env.example" ] || fail ".env.example not found"
pass ".env.example found"

echo ""
echo "Checking source files..."

files=(
  "src/server.js"
  "src/dispatcher.js"
  "src/logger.js"
  "src/templates.js"
  "src/bots/discord.js"
  "src/bots/twitter.js"
  "src/bots/telegram.js"
)

for file in "${files[@]}"; do
  [ -f "$file" ] || fail "$file not found"
  pass "$file"
done

echo ""
echo "Checking documentation..."

docs=(
  "README.md"
  "OPERATIONS_GUIDE.md"
  "BOT_SETUP_GUIDE.md"
  "COMMUNICATION_PLAN.md"
  "PRESS_AGENT_REPORT.md"
)

for doc in "${docs[@]}"; do
  [ -f "$doc" ] || fail "$doc not found"
  pass "$doc"
done

echo ""
if [ ! -d "node_modules" ]; then
  warn "Dependencies not installed"
  echo "   Run: cd press-agent && npm install"
else
  pass "Dependencies installed"
fi

echo ""
if [ ! -f ".env" ]; then
  warn ".env file not found"
  echo "   Run: cp press-agent/.env.example press-agent/.env"
  echo "   Then configure your bot credentials"
else
  pass ".env file exists"

  if grep -Eiq 'YOUR_|your_|placeholder|changeme|replace_me' .env; then
    warn ".env file appears to contain placeholder values"
  fi

  echo ""
  echo "Checking expected environment keys..."

  required_keys=(
    "PORT"
    "DISCORD_WEBHOOK_URL"
    "TELEGRAM_BOT_TOKEN"
    "TELEGRAM_CHAT_ID"
    "TWITTER_API_KEY"
    "TWITTER_API_SECRET"
    "TWITTER_ACCESS_TOKEN"
    "TWITTER_ACCESS_SECRET"
  )

  missing=0

  for key in "${required_keys[@]}"; do
    if ! grep -Eq "^${key}=.+" .env; then
      warn "$key is missing or empty"
      missing=1
    else
      pass "$key is present"
    fi
  done

  if [ "$missing" -eq 1 ]; then
    warn ".env is present but not fully configured"
  else
    pass ".env has all expected keys"
  fi
fi

echo ""
cd ..

if [ -f ".github/workflows/press-agent-communications.yml" ]; then
  pass "GitHub Actions workflow exists"
else
  fail "GitHub Actions workflow not found"
fi

echo ""
echo "=================================="
echo "✅ Press Agent setup verification complete!"
echo ""
echo "Next steps:"
echo "1. Configure bot credentials in press-agent/.env"
echo "2. Add matching secrets to GitHub repository settings"
echo "3. Run: cd press-agent && npm install && npm start"
echo "4. Test: curl http://localhost:3001/health"
echo ""
echo "📚 See press-agent/BOT_SETUP_GUIDE.md for detailed instructions"
