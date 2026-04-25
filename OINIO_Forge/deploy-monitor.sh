#!/bin/bash
# Cloudflare Pages deployment for OINIO Autonomy Monitor v2
set -e

echo "🚀 Deploying OINIO Monitor v2 to Cloudflare Pages"
echo

# Initialize wrangler project
cat > wrangler.toml << 'EOF'
name = "oinio-autonomy-monitor"
compatibility_date = "2026-04-24"
compatibility_flags = [ "nodejs_compat" ]

[site]
bucket = "./public"
EOF

mkdir -p public
cp monitor_v2.html public/index.html

echo "✅ Created deployment structure"
echo

echo "📋 Deployment command:"
echo "npx wrangler pages deploy public --project-name oinio-autonomy-monitor"
echo
echo "Or deploy directly with:"
echo "wrangler pages deploy public"
echo
echo "Deployment is ready."