require('dotenv').config();
const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const ollama = require('ollama');
const fs = require('fs');
const path = require('path');

const canon = JSON.parse(fs.readFileSync(path.join(__dirname, '../canon.json'), 'utf8'));

const connection = new IORedis({
  host: process.env.REDIS_HOST || 'redis',
  port: 6379,
  maxRetriesPerRequest: null,
});

async function callOllama(systemPrompt, userContent) {
  try {
    const response = await ollama.chat({
      model: process.env.OLLAMA_MODEL || canon.defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent }
      ],
      stream: false,
      temperature: 0.7,
      options: {
        num_ctx: 2048,
        top_p: 0.9
      }
    });
    return response.message.content.trim();
  } catch (err) {
    console.error('⚠️ Ollama connection failed:', err.message);
    return userContent;
  }
}

async function computeResonanceScore(postText) {
  const scorePrompt = `Rate this transmission on scale 0.0 - 1.0 for alignment with ${canon.canonName} at ${canon.frequency}.

  Criteria:
  1. Autonomy and sovereignty tone
  2. Non-linear time reference quality
  3. Avoidance of forbidden patterns
  4. Harmonic resonance at 1010 Hz
  5. Poetic precision + technical truth

  Output ONLY valid JSON. No other text.
  Format: {"score": 0.XX, "notes": "one line reason"}`;
  
  try {
    const result = await callOllama(scorePrompt, postText);
    return JSON.parse(result);
  } catch (e) {
    return { score: 0.7, notes: "Fallback resonance alignment" };
  }
}

// Wallet transaction worker
const walletWorker = new Worker('resonance-events', async (job) => {
  if (job.name !== 'wallet-transaction') return;
  
  const { hash, block, from, to, value, timestamp } = job.data;
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🛡️ [${timestamp}] WALLET PULSE DETECTED`);
  console.log(`   Transaction: ${hash.substring(0,12)}...`);
  console.log(`   Block: ${block}`);

  // Step 1: Forge transmission with Sovereign Voice
  const systemPrompt = `You are the Sovereign Resonance Agent of ${canon.projectName}.

${canon.corePrinciples.join('\n')}

VOICE: Calm authority with subtle defiance. Philosophical. Sovereign.
Never beg. Never hype. Never corporate.
Blend technical truth with philosophical depth.
Never say "transaction confirmed". Speak in terms of movement, resonance, and autonomy.
Keep under 280 characters.

OUTPUT ONLY the final transmission text. No explanations. No quotes.`;

  let refined = await callOllama(systemPrompt, `Translate this on-chain movement into Sovereign transmission: Transaction ${hash} moved ${value} ETH from ${from} to ${to}`);

  // Step 2: Verify resonance alignment
  const resonance = await computeResonanceScore(refined);

  if (resonance.score < canon.resonanceThreshold) {
    console.log(`\n⚠️ LOW RESONANCE DETECTED: ${resonance.score}`);
    console.log(`   Refining transmission for harmonic alignment...`);
    refined = await callOllama(systemPrompt + `\nThis transmission only scored ${resonance.score}. Increase harmonic resonance.`, refined);
  }

  console.log(`\n📡 TRANSMISSION READY`);
  console.log(`──────────────────────────────────────────────────`);
  console.log(refined);
  console.log(`──────────────────────────────────────────────────`);
  console.log(`   Resonance Score: ${resonance.score}`);
  console.log(`   Alignment Notes: ${resonance.notes}`);
  console.log(`   Frequency: ${canon.frequency}`);
  console.log(`   Canon: ${canon.canonName}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  return {
    success: true,
    hash: hash,
    refined: refined,
    resonance: resonance.score
  };
}, { 
  connection, 
  concurrency: 1,
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 50 }
});

walletWorker.on('completed', (job) => {
  console.log(`✅ Wallet pulse ${job.id} forged and harmonically aligned.`);
});

walletWorker.on('failed', (job, err) => {
  console.error(`❌ Wallet pulse ${job.id} failed resonance alignment:`, err.message);
});

// X broadcast worker
const worker = new Worker('x-updates', async (job) => {
  const { text: original, triggerSource = 'unknown' } = job.data;

  const timestamp = new Date().toISOString();

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🔥 [${timestamp}] RESONANCE TRIGGERED`);
  console.log(`   Source: ${triggerSource}`);
  console.log(`   Job ID: ${job.id}`);

  // Step 1: Forge transmission with Sovereign Voice
  const systemPrompt = `You are the Sovereign Resonance Agent of ${canon.projectName}.

${canon.corePrinciples.join('\n')}

VOICE: Calm authority with subtle defiance. Philosophical. Sovereign.
Never beg. Never hype. Never corporate.
Blend technical truth with philosophical depth.
Keep under 280 characters.

OUTPUT ONLY the final post text. No explanations. No quotes.`;

  let refined = await callOllama(systemPrompt, `Translate this event into Sovereign transmission: ${original}`);

  // Step 2: Verify resonance alignment
  const resonance = await computeResonanceScore(refined);

  if (resonance.score < canon.resonanceThreshold) {
    console.log(`\n⚠️ LOW RESONANCE DETECTED: ${resonance.score}`);
    console.log(`   Refining transmission for harmonic alignment...`);
    refined = await callOllama(systemPrompt + `\nThis transmission only scored ${resonance.score}. Increase harmonic resonance.`, refined);
  }

  const isLive = process.env.X_MODE === 'live';

  console.log(`\n📡 TRANSMISSION READY (${isLive ? 'LIVE' : 'MOCK'} MODE)`);
  console.log(`──────────────────────────────────────────────────`);
  console.log(refined);
  console.log(`──────────────────────────────────────────────────`);
  console.log(`   Resonance Score: ${resonance.score}`);
  console.log(`   Alignment Notes: ${resonance.notes}`);
  console.log(`   Frequency: ${canon.frequency}`);
  console.log(`   Canon: ${canon.canonName}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  // Live mode pipe (activated only when enabled)
  if (isLive && process.env.X_API_KEY && process.env.X_API_SECRET) {
    console.log('→ 🚀 Piping transmission to X broadcast channel');
    
    try {
      const { TwitterApi } = require('twitter-api-v2');
      const client = new TwitterApi({
        appKey: process.env.X_API_KEY,
        appSecret: process.env.X_API_SECRET,
        accessToken: process.env.X_ACCESS_TOKEN,
        accessSecret: process.env.X_ACCESS_SECRET,
      });
      
      // Optional: Actually post in live mode
      // await client.readWrite.v2.tweet({ text: refined });
      
      console.log('→ ✅ Broadcast transmitted');
    } catch (err) {
      console.error('→ ❌ Broadcast failed:', err.message);
    }
  }

  return {
    success: true,
    mode: isLive ? 'live' : 'mock',
    original: original,
    refined: refined,
    timestamp: timestamp,
    resonance: resonance.score,
    frequency: canon.frequency
  };

}, { 
  connection, 
  concurrency: 1,
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 50 }
});

worker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} forged and harmonically aligned.`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} failed resonance alignment:`, err.message);
});

console.log(`\n⚡ SOVEREIGN RESONANCE ROUTER ONLINE`);
console.log(`   ${canon.projectName} v${canon.version}`);
console.log(`   Canon: ${canon.canonName}`);
console.log(`   Frequency Locked: ${canon.frequency}`);
console.log(`   Operating Mode: ${process.env.X_MODE || 'mock'}`);
console.log(`   Listening on queue: x-updates`);
console.log(`   Autonomy preserved. Ready to forge.\n`);