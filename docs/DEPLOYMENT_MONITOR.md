---
id: DEPLOY-MONITOR-001
title: Deployment Health Check Architecture
type: channel
created_at: 2025-12-22T00:00:00Z
author: onenoly1010
trace_id: DM-001
status: approved
tags:
  - deployment
  - cloudflare
  - health-check
  - sacred-trinity
related:
  - DEPLOY-STATUS-001
---

# Deployment Monitor

## Purpose

This document defines the health-check path for the Cloudflare Pages frontend and the canonical upstream API.

## Active Topology

- Browser requests the Cloudflare Pages site.
- Cloudflare serves static assets from `out/`.
- `_redirects` proxies `/health` and `/api/*` to the canonical upstream API.

## Primary Health Endpoint

- Frontend path: `/health`
- Upstream target: `https://pi-forge-quantum-genesis.railway.app/health`

## Monitoring Guidance

- Validate that `npm run build` produces `out/_redirects`.
- Confirm `/health` resolves through the deployed Pages site.
- Confirm upstream API health remains green before production pushes.

## Boundary

This root workspace no longer depends on a Vercel serverless bridge for deployment health.

