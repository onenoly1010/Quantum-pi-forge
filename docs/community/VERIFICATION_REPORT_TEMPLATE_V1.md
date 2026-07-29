# Verification Report Template v1

**Use:** Copy into a GitHub issue titled `External verification: YYYY-MM-DD`  
**Repo:** https://github.com/onenoly1010/Quantum-pi-forge/issues/new  

```markdown
## External verification report

- **Verifier:** (name or handle)
- **Date (UTC):**
- **Affiliation:** (optional; “independent” is fine)
- **Method:** browser + explorer / RPC curls / git clone + scripts

### Network

- **Chain ID observed:** (expect `0x4115` / 16661)
- **RPC used:** (e.g. https://evmrpc.0g.ai)
- **Explorer used:** (e.g. https://chainscan.0g.ai)

### Contracts

| Address / role | Code present? | Notes |
| --- | --- | --- |
| OINIO token `0x75995EC0…Cb58` | yes/no | |
| Model registry `0x67aD7169…E87a` | yes/no | |
| Pair `0x2067319D…AaeE` (optional) | yes/no | |

- **Pair reserves empty (if checked):** yes/no/not checked
- **Bytecode digests match registry (optional):** yes/no/partial

### Public surfaces

- **Portal URL used:** https://quantumpiforge.com/deployed-addresses
- **Mint site disabled / gated:** yes/no
- **Signing/broadcast claimed disabled on portal:** yes/no

### Governance posture (from docs)

- **mint activation NOT AUTHORIZED:** agree / disagree
- **liquidity NOT AUTHORIZED:** agree / disagree
- **economic launch NOT AUTHORIZED:** agree / disagree

### Local tooling (optional — Phase 8.5)

```bash
# if run:
git clone …
npm run verify:evidence
# result:
```

### Disagreements / drift

(none, or list with timestamps)

### Conclusion

- [ ] Independent confirmation of published state  
- [ ] Partial confirmation with listed drift  
- [ ] Could not complete (blockers below)

**Blockers:**  

---

*This report is evidence of verification, not an activation request.*
```
