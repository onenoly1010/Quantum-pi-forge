#!/usr/bin/env python3
"""
Generate the root deployment dashboard for the Cloudflare Pages migration.
"""

from pathlib import Path


ROOT = Path(__file__).resolve().parent
DASHBOARD = ROOT / "docs" / "DEPLOYMENT_DASHBOARD.md"


CONTENT = """# Deployment Dashboard

This is the active deployment reference for the root `Quantum-pi-forge` workspace.

## Platform Model

- **Cloudflare Pages** hosts the static coordination site for this repo.
- **Cloudflare edge routing** uses `_redirects` generated during the build.
- **Canonical upstream API** remains `https://pi-forge-quantum-genesis.railway.app` until backend migration is completed.
- **Supabase** remains the data layer where applicable.

## Build And Deploy

```bash
npm install
npm run build
wrangler pages deploy out --project-name quantumpiforge
```

## Validation

```bash
npm run doctor:env
npm run build
pytest tests/test_cloudflare_build.py
```

## Current Hosting Direction

The root repo no longer supports Vercel as an active deployment target.
"""


def main() -> int:
    DASHBOARD.write_text(CONTENT + "\n", encoding="utf-8")
    print(f"wrote {DASHBOARD}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
