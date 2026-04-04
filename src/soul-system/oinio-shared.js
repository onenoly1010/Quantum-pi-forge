/**
 * ═══════════════════════════════════════════════════════════════
 *  🌾 OINIO SHARED UTILITIES — Shared Oracle Components
 * ═══════════════════════════════════════════════════════════════
 *  Shared constants and functions to eliminate code duplication
 *  between oinio-system.js and oinio-forge-bridge.js
 * ═══════════════════════════════════════════════════════════════
 */

const crypto = require('crypto');

// ═══════════════════════════════════════════════════════════════
// 🌌 SHARED ORACLE CONSTANTS
// ═══════════════════════════════════════════════════════════════

/**
 * Pattern recognition dictionary
 */
const PATTERNS = [
  'The Spiral', 'The Mirror', 'The Threshold', 'The Void',
  'The Bloom', 'The Anchor', 'The Storm', 'The Seed',
  'The River', 'The Mountain', 'The Web', 'The Flame',
  'The Echo', 'The Door', 'The Root', 'The Sky'
];

/**
 * Oracle message dictionary
 */
const MESSAGES = [
  'What once was hidden now seeks form.',
  'The pattern remembers itself through you.',
  'Resistance is the shape of the next becoming.',
  'You are the question and the answer.',
  'What you seek is seeking you.',
  'The chaos contains the blueprint.',
  'This moment is the initiation.',
  'You are already what you are becoming.',
  'The wound is where the light enters.',
  'Trust the spiral, not the straight line.',
  'What falls away was never yours.',
  'The void is full of potential.',
  'You are the bridge between worlds.',
  'The fear is the threshold.',
  'What you birth will birth you.',
  'The ending is also the beginning.'
];

// ═══════════════════════════════════════════════════════════════
// 🔮 SHARED ORACLE LOGIC
// ═══════════════════════════════════════════════════════════════

/**
 * Generates deterministic oracle reading from question + seed + epoch
 * This is the core cryptographic oracle logic
 */
function generateDeterministicReading(question, seed, epochNumber) {
  const combined = `${question}|${seed}|${epochNumber}`;
  const hash = crypto.createHash('sha256').update(combined, 'utf8').digest();
  
  // Extract deterministic values
  const resonance = (hash[0] % 100) + 1; // 1-100
  const clarity = (hash[1] % 100) + 1;
  const flux = (hash[2] % 100) + 1;
  const emergence = (hash[3] % 100) + 1;
  
  // Pattern recognition (first 4 bytes modulo dictionary size)
  const patternIndex = hash.readUInt32BE(4) % PATTERNS.length;
  const pattern = PATTERNS[patternIndex];
  
  // Oracle message (deterministic selection)
  const messageIndex = hash.readUInt32BE(8) % MESSAGES.length;
  const message = MESSAGES[messageIndex];
  
  return {
    mode: 'deterministic',
    resonance,
    clarity,
    flux,
    emergence,
    pattern,
    message
  };
}

/**
 * Displays oracle reading with visual formatting
 */
function displayReading(reading, epochNumber) {
  const modeLabel = reading.mode.toUpperCase();
  
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log(`║  🔮 EPOCH ${epochNumber} READING [${modeLabel}]`);
  console.log('╠═══════════════════════════════════════════════════════════════╣');
  console.log(`║  Resonance: ${'█'.repeat(Math.floor(reading.resonance / 5))}${' '.repeat(20 - Math.floor(reading.resonance / 5))} ${reading.resonance}%`);
  console.log(`║  Clarity:   ${'█'.repeat(Math.floor(reading.clarity / 5))}${' '.repeat(20 - Math.floor(reading.clarity / 5))} ${reading.clarity}%`);
  console.log(`║  Flux:      ${'█'.repeat(Math.floor(reading.flux / 5))}${' '.repeat(20 - Math.floor(reading.flux / 5))} ${reading.flux}%`);
  console.log(`║  Emergence: ${'█'.repeat(Math.floor(reading.emergence / 5))}${' '.repeat(20 - Math.floor(reading.emergence / 5))} ${reading.emergence}%`);
  
  // Quantum harmony layer
  if (reading.harmonyIndex !== undefined) {
    const harmonyPercent = Math.round(reading.harmonyIndex * 100);
    console.log('╠═══════════════════════════════════════════════════════════════╣');
    console.log(`║  ⚡ Harmony: ${'█'.repeat(Math.floor(harmonyPercent / 5))}${' '.repeat(20 - Math.floor(harmonyPercent / 5))} ${harmonyPercent}%`);
    console.log(`║  Trend: ${reading.quantumTrend} (${Math.round(reading.quantumConfidence * 100)}% confidence)`);
  }
  
  console.log('╠═══════════════════════════════════════════════════════════════╣');
  console.log(`║  🌌 Pattern: ${reading.pattern}`);
  console.log('╠═══════════════════════════════════════════════════════════════╣');
  console.log(`║  📜 Oracle: "${reading.message}"`);
  
  // Quantum insights
  if (reading.quantumInsight) {
    console.log('╠═══════════════════════════════════════════════════════════════╣');
    console.log(`║  ⚡ Quantum Insight:`);
    console.log(`║  ${reading.quantumInsight.substring(0, 60)}`);
  }
  
  // Forge recommendations
  if (reading.forgeRecommendations && reading.forgeRecommendations.length > 0) {
    console.log('╠═══════════════════════════════════════════════════════════════╣');
    console.log('║  🔧 Forge Guidance:');
    reading.forgeRecommendations.slice(0, 2).forEach(rec => {
      console.log(`║  • ${rec.substring(0, 58)}`);
    });
  }
  
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');
}

module.exports = {
  PATTERNS,
  MESSAGES,
  generateDeterministicReading,
  displayReading
};
