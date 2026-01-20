const path = require('path');

module.exports = {
  // Server configuration (for future Phase 2)
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || 'localhost',
  
  // File paths
  BASE_PATH: process.env.BASE_PATH || null, // Auto-detected if null
  PI_FORGE_PATH: process.env.PI_FORGE_PATH || path.join(
    process.env.HOME || process.env.USERPROFILE || '.',
    'pi-forge-quantum-genesis'
  ),
  
  // Storage
  DATA_DIR: process.env.DATA_DIR || null, // Uses BASE_PATH if null
  
  // Security
  PBKDF2_ITERATIONS: parseInt(process.env.PBKDF2_ITERATIONS || '100000', 10),
  PBKDF2_KEY_LENGTH: 32,
  PBKDF2_DIGEST: 'sha256',
  
  // Features
  ENABLE_QUANTUM: process.env.ENABLE_QUANTUM !== 'false', // Enabled by default if Forge available
  
  // Performance
  QUANTUM_TIMEOUT_MS: parseInt(process.env.QUANTUM_TIMEOUT_MS || '3000', 10),
  
  // CLI
  VERSION: '1.3.0'
};
