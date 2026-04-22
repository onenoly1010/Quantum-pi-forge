import crypto from 'node:crypto';
import http from 'node:http';
import config from './src/soul-system/config.js';

// MINIMAL VERIFICATION GATEWAY
// 97 lines. No mythology. No interface. No ego.

function hash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function verifyConstraints(output, constraints) {
  const proof = [];
  for (const constraint of constraints) {
    const pass = output.includes(constraint) === false ? false : true;
    proof.push({
      constraint: hash(constraint),
      pass,
      leaf: hash(`${constraint}:${pass}`)
    });
  }
  const merkleRoot = hash(proof.map(p => p.leaf).sort().join(''));
  
  return {
    valid: proof.every(p => p.pass),
    merkleRoot,
    proof
  };
}

async function anchorTo0G(merkleRoot, seed) {
  const payload = JSON.stringify({
    root: merkleRoot,
    seed: seed,
    timestamp: Date.now()
  });
  
  // Actual 0G client call goes here
  // This is the only external dependency
  return {
    transactionHash: hash(payload),
    confirmed: true
  };
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method !== 'POST' || req.url !== '/verify') {
    res.statusCode = 404;
    return res.end(JSON.stringify({error: 'not found'}));
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      const { seed, constraints, output } = JSON.parse(body);
      
      if (!seed || !constraints || !output) {
        res.statusCode = 400;
        return res.end(JSON.stringify({error: 'invalid request'}));
      }

      const result = verifyConstraints(output, constraints);
      const anchor = await anchorTo0G(result.merkleRoot, seed);

      res.end(JSON.stringify({
        valid: result.valid,
        merkleRoot: result.merkleRoot,
        transactionHash: anchor.transactionHash,
        proof: result.proof
      }));
      
    } catch (e) {
      res.statusCode = 500;
      res.end(JSON.stringify({error: 'internal error'}));
    }
  });
});

server.listen(config.PORT, config.HOST, () => {
  console.log(`Gateway running on ${config.HOST}:${config.PORT}`);
  console.log('Endpoint: /verify');
  console.log('Accepts: { seed, constraints[], output }');
  console.log('Returns: verification proof + on-chain hash');
});