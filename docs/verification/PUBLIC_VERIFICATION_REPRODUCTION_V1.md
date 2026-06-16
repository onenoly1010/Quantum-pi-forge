# Public Verification Reproduction v1

Quantum Pi Forge public evidence verification was reproduced from a fresh clone at the v2 mainnet activation commit.

## Reproduction Command

```bash
git clone https://github.com/onenoly1010/Quantum-pi-forge
cd Quantum-pi-forge
git checkout 4c9c392
npm ci
npm run verify:evidence
```

## Known-Good Result

```text
HEAD is now at 4c9c392 Activate v2 mainnet cutover: BirthGenesisHeartbeat (#341)

> verify:evidence
> node scripts/verify-evidence.cjs

OK evidence index verified: 3 lanes, 6 paths checked.
OK evidence receipt matches evidence index hash.
indexSha256=a63dc16e5f577c808fd495e5a18e87f25006980cf0d84d23b61f5beca57e58fa
OK claim map verified: 3 claims checked.
OK claim map drift check passed.
claims=3
OK evidence snapshot verified.
snapshotVersion=1.0.0
canonicalCommit=7e6281d
currentHead=4c9c392
baselineReceiptHash=b720d54e7a07b89edd4e7dd20ce6631d5d252bef273e8c59ab62cffa2fd27fb1
currentReceiptHash=a63dc16e5f577c808fd495e5a18e87f25006980cf0d84d23b61f5beca57e58fa
proofCommand=npm run verify:evidence

OK evidence verification bundle passed.
steps=5
```

## Interpretation

This confirms that the public evidence bundle verifies at commit `4c9c392` using the documented proof command.

The verification covers:

- evidence index
- evidence receipt hash
- claim map
- claim map drift guard
- evidence snapshot

## Caveat

The `npm ci` step may report dependency audit warnings. Those warnings do not invalidate the evidence proof result. Dependency security posture is tracked separately from the evidence verification bundle.
