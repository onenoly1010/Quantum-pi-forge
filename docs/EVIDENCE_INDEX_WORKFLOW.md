# Evidence Index Workflow

Refresh:

```bash
bash scripts/evidence-index-refresh.sh
```

Verify:

```bash
bash scripts/evidence-index-verify.sh
```

Enable local hook:

```bash
git config core.hooksPath .githooks
```

Boundary: this hook only refreshes repository evidence manifests. It does not deploy, sign wallet transactions, post externally, mint, stake, transfer, bridge, or mutate chain state.
