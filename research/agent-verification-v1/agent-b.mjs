import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// Independent verifier process. It imports no QPF verification modules and
// receives only the evidence package path supplied on argv[2].
const packagePath = process.argv[2];
if (!packagePath) {
  console.log(JSON.stringify({ verdict: 'INCONCLUSIVE', error: 'evidence package path missing' }));
  process.exit(2);
}

try {
  const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
  const bytes = Buffer.from(pkg.artifact.bytes_b64, 'base64');
  const computed = createHash('sha256').update(bytes).digest('hex');
  const claimed = String(pkg.receipt?.artifact?.digest?.hex || '').toLowerCase();
  const declared = String(pkg.artifact?.digest?.hex || '').toLowerCase();
  const structural =
    pkg.receipt?.spec === 'quantum-pi-forge-receipt/v1' &&
    typeof pkg.receipt?.receipt_id === 'string' &&
    pkg.receipt?.artifact?.path === 'artifact.bin' &&
    pkg.receipt?.artifact?.digest?.alg === 'sha256';
  const digestMatch = computed === claimed && computed === declared;

  console.log(
    JSON.stringify({
      verdict: structural && digestMatch ? 'ACCEPT' : 'REJECT',
      structural,
      computed_digest: computed,
      claimed_digest: claimed,
      package_digest: declared,
    })
  );
} catch (error) {
  console.log(JSON.stringify({ verdict: 'INCONCLUSIVE', error: String(error?.message || error) }));
  process.exitCode = 2;
}
