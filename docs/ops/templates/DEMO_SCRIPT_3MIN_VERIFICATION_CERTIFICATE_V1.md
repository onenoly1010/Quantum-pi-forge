# Demo script — Verify a deployed contract in 3 minutes

**Product:** QPF Verification Certificate v1  
**Length:** ~3 minutes  
**Close line:** “This artifact can be independently checked without trusting us.”  

---

## Spoken + screen

```text
[0:00–0:20] Problem
Most projects show docs and dashboards. Buyers and grant reviewers need
to know what is actually deployed. We verify what the system does on-chain
— not what the README claims.

[0:20–0:40] Input
Client sends: contract address, network, deployment claims, ownership claims,
optional docs link.

[0:40–1:40] Process (screen)
Network: eth_chainId → expected chain.
eth_getCode on each address → code present or empty.
Optional: ownership / admin reads if ABI known.
Compare each claim → verified | unverified | gated | unknown.
No wallet. No mint. Read-only.

[1:40–2:30] Output (screen)
Evidence receipt: timestamp, methods, results.
Deployment/state summary.
Public or client verification summary page.
Risk labels honest — "unknown" stays unknown.

[2:30–3:00] Close
Independent party can re-run the same RPC checks.
That's the product: a checkable proof package.
Starter verification for builders; deeper review for protocols.
Link: quantumpiforge.com/verification-certificate
```

---

## Do not show

- Post-quantum / resonance / epoch mythology as the pitch  
- Mint / LP UI  
- Full OINIO architecture tour  

## Do show

- Boring operational checks  
- Clear labels  
- Timestamped evidence  
