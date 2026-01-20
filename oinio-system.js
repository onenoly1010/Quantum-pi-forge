#!/usr/bin/env node

/**
 * ═══════════════════════════════════════════════════════════════
 *  🌾🌌 OINIO SOUL SYSTEM — The Eternal Pattern Recognizer
 * ═══════════════════════════════════════════════════════════════
 *  A private encrypted oracle for soul evolution through epochs.
 *  Dependency-free. Unified. Sealed for executable form.
 * ═══════════════════════════════════════════════════════════════
 */

const crypto = require('crypto');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const readline = require('readline');
const { PATTERNS, MESSAGES, generateDeterministicReading, displayReading: displayReadingShared } = require('./oinio-shared');

// ═══════════════════════════════════════════════════════════════
// ⚡ QUANTUM FORGE BRIDGE (OPTIONAL ENHANCEMENT)
// ═══════════════════════════════════════════════════════════════
let quantumBridge = null;
let isQuantumAvailable = false;

try {
  // Attempt to load quantum bridge if available
  const bridgePath = path.join(__dirname, 'oinio-forge-bridge.js');
  if (fs.existsSync(bridgePath)) {
    quantumBridge = require('./oinio-forge-bridge.js');
    // Check if forge is actually available
    quantumBridge.isForgeAvailable().then(available => {
      isQuantumAvailable = available;
    }).catch(() => {
      isQuantumAvailable = false;
    });
  }
} catch (err) {
  // Silently continue without quantum enhancement
  console.log('⚡ Quantum Forge not detected, using standard oracle mode');
}

// ═══════════════════════════════════════════════════════════════
// 🛡️ PKG-SAFE PATH RESOLUTION
// ═══════════════════════════════════════════════════════════════
const getBasePath = () => {
  // When running as pkg binary, use executable directory
  if (process.pkg) {
    return path.dirname(process.execPath);
  }
  // When running as node script, use current working directory
  return process.cwd();
};

const BASE_PATH = getBasePath();
const LINEAGE_FILE = path.join(BASE_PATH, 'lineage.csv');
const USERS_FILE = path.join(BASE_PATH, 'users.enc');

// Soul file path will be determined per-user
function getSoulsFilePath(username) {
  if (!username) {
    // Backward compatibility: if no username, use default file
    return path.join(BASE_PATH, 'souls.enc');
  }
  return path.join(BASE_PATH, `souls_${username}.enc`);
}

// ═══════════════════════════════════════════════════════════════
// 🔐 CRYPTOGRAPHIC PRIMITIVES
// ═══════════════════════════════════════════════════════════════

/**
 * Derives a deterministic 32-byte key from passphrase
 */
function deriveKey(passphrase) {
  return crypto.createHash('sha256').update(passphrase, 'utf8').digest();
}

/**
 * Encrypts plaintext with AES-256-GCM
 * Returns: {iv, authTag, encrypted}
 */
function encrypt(plaintext, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return { iv, authTag, encrypted };
}

/**
 * Decrypts ciphertext with AES-256-GCM
 * Returns: plaintext or null on failure
 */
function decrypt(iv, authTag, encrypted, key) {
  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  } catch (err) {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// 👤 USER AUTHENTICATION SYSTEM
// ═══════════════════════════════════════════════════════════════

/**
 * Hashes a password using PBKDF2 (built-in, no dependencies)
 * Returns: {salt, hash} where both are hex strings
 */
function hashPassword(password) {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

/**
 * Derives an encryption key from password and salt using PBKDF2
 * This is used for encrypting/decrypting soul data
 * Returns: 32-byte Buffer suitable for AES-256
 */
function deriveEncryptionKey(password, salt) {
  // Use PBKDF2 with high iteration count for better security
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
}

/**
 * Verifies a password against stored salt and hash
 * Uses constant-time comparison to prevent timing attacks
 */
function verifyPassword(password, salt, hash) {
  const computedHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
  const storedHash = Buffer.from(hash, 'hex');
  
  // Use timingSafeEqual for constant-time comparison
  if (computedHash.length !== storedHash.length) {
    return false;
  }
  
  return crypto.timingSafeEqual(computedHash, storedHash);
}

/**
 * Master key for encrypting users database (derived from fixed system identifier)
 * This is separate from user soul encryption keys
 * Note: All installations share this key. Users.enc is primarily for preventing
 * casual access, not for protecting against determined attackers with source code access.
 */
function getUsersDbKey() {
  // Use a fixed identifier for the users database encryption
  // The real security comes from per-user password-based encryption of soul data
  return deriveKey('oinio-users-db-v1');
}

/**
 * Saves users database to encrypted file
 * Format: { username: { salt: string, hash: string, created: ISO date } }
 */
function saveUsers(usersDb) {
  try {
    const payload = JSON.stringify(usersDb);
    const key = getUsersDbKey();
    const { iv, authTag, encrypted } = encrypt(payload, key);
    
    const bundle = JSON.stringify({
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      data: encrypted.toString('hex')
    });
    
    fs.writeFileSync(USERS_FILE, bundle, 'utf8');
    return true;
  } catch (err) {
    console.error('⚠️  Failed to save users database:', err.message);
    return false;
  }
}

/**
 * Loads users database from encrypted file
 */
function loadUsers() {
  if (!fileExists(USERS_FILE)) {
    return {};
  }
  
  try {
    const bundle = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    
    // Validate bundle structure
    if (!bundle || typeof bundle !== 'object') {
      console.error('❌ Invalid users database format: not an object');
      return null;
    }
    
    if (!bundle.iv || !bundle.authTag || !bundle.data) {
      console.error('❌ Invalid users database format: missing required fields');
      return null;
    }
    
    if (typeof bundle.iv !== 'string' || typeof bundle.authTag !== 'string' || typeof bundle.data !== 'string') {
      console.error('❌ Invalid users database format: fields must be strings');
      return null;
    }
    
    const key = getUsersDbKey();
    const iv = Buffer.from(bundle.iv, 'hex');
    const authTag = Buffer.from(bundle.authTag, 'hex');
    const encrypted = Buffer.from(bundle.data, 'hex');
    
    const plaintext = decrypt(iv, authTag, encrypted, key);
    if (!plaintext) {
      console.error('❌ Failed to decrypt users database.');
      return null;
    }
    
    return JSON.parse(plaintext);
  } catch (err) {
    console.error('⚠️  Failed to load users database:', err.message);
    return null;
  }
}

/**
 * Registers a new user
 */
function registerUser(username, password) {
  const usersDb = loadUsers();
  if (usersDb === null) {
    return { success: false, error: 'Failed to load users database' };
  }
  
  if (usersDb[username]) {
    return { success: false, error: 'Username already exists' };
  }
  
  const { salt, hash } = hashPassword(password);
  
  // Generate a separate salt for encrypting soul data
  // This salt is used with the password to derive the encryption key
  const encryptionSalt = crypto.randomBytes(32).toString('hex');
  
  usersDb[username] = {
    salt,           // For password verification
    hash,           // Password hash
    encryptionSalt, // For deriving soul data encryption key
    created: new Date().toISOString()
  };
  
  if (saveUsers(usersDb)) {
    return { success: true };
  } else {
    return { success: false, error: 'Failed to save user' };
  }
}

/**
 * Authenticates a user and returns encryption salt if successful
 */
function authenticateUser(username, password) {
  const usersDb = loadUsers();
  if (usersDb === null) {
    return { success: false, error: 'Failed to load users database' };
  }
  
  const user = usersDb[username];
  if (!user) {
    return { success: false, error: 'Invalid username or password' };
  }
  
  if (verifyPassword(password, user.salt, user.hash)) {
    // Return encryption salt for deriving soul data encryption key
    return { success: true, encryptionSalt: user.encryptionSalt };
  } else {
    return { success: false, error: 'Invalid username or password' };
  }
}

// ═══════════════════════════════════════════════════════════════
// 💾 PERSISTENCE LAYER (PKG-COMPATIBLE)
// ═══════════════════════════════════════════════════════════════

/**
 * Gracefully checks if file exists (pkg-safe)
 */
function fileExists(filepath) {
  try {
    return fs.existsSync(filepath);
  } catch (err) {
    return false;
  }
}

/**
 * Saves encrypted soul data to disk (async)
 */
async function saveSoulsAsync(soulRegistry, key) {
  try {
    const payload = JSON.stringify(soulRegistry);
    const { iv, authTag, encrypted } = encrypt(payload, key);
    
    const bundle = JSON.stringify({
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      data: encrypted.toString('hex')
    });
    
    await fsPromises.writeFile(SOULS_FILE, bundle, 'utf8');
    return true;
  } catch (err) {
    console.error('⚠️  Failed to save souls:', err.message);
    return false;
  }
}

/**
 * Saves encrypted soul data to disk (sync - for backwards compatibility)
 */
function saveSouls(soulRegistry, key, username = null) {
  try {
    const soulsFile = getSoulsFilePath(username);
    const payload = JSON.stringify(soulRegistry);
    const { iv, authTag, encrypted } = encrypt(payload, key);
    
    const bundle = JSON.stringify({
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      data: encrypted.toString('hex')
    });
    
    fs.writeFileSync(soulsFile, bundle, 'utf8');
    return true;
  } catch (err) {
    console.error('⚠️  Failed to save souls:', err.message);
    return false;
  }
}

/**
 * Loads encrypted soul data from disk (async)
 */
async function loadSoulsAsync(key) {
  if (!fileExists(SOULS_FILE)) {
    return {};
  }
  
  try {
    const data = await fsPromises.readFile(SOULS_FILE, 'utf8');
    const bundle = JSON.parse(data);
    const iv = Buffer.from(bundle.iv, 'hex');
    const authTag = Buffer.from(bundle.authTag, 'hex');
    const encrypted = Buffer.from(bundle.data, 'hex');
    
    const plaintext = decrypt(iv, authTag, encrypted, key);
    if (!plaintext) {
      console.error('❌ Decryption failed. Wrong passphrase or corrupted data.');
      return null;
    }
    
    return JSON.parse(plaintext);
  } catch (err) {
    console.error('⚠️  Failed to load souls:', err.message);
    return null;
  }
}

/**
 * Loads encrypted soul data from disk (sync - for backwards compatibility)
 */
function loadSouls(key, username = null) {
  const soulsFile = getSoulsFilePath(username);
  if (!fileExists(soulsFile)) {
    return {};
  }
  
  try {
    const bundle = JSON.parse(fs.readFileSync(soulsFile, 'utf8'));
    
    // Validate bundle structure
    if (!bundle || typeof bundle !== 'object') {
      console.error('❌ Invalid soul data format: not an object');
      return null;
    }
    
    if (!bundle.iv || !bundle.authTag || !bundle.data) {
      console.error('❌ Invalid soul data format: missing required fields');
      return null;
    }
    
    if (typeof bundle.iv !== 'string' || typeof bundle.authTag !== 'string' || typeof bundle.data !== 'string') {
      console.error('❌ Invalid soul data format: fields must be strings');
      return null;
    }
    
    const iv = Buffer.from(bundle.iv, 'hex');
    const authTag = Buffer.from(bundle.authTag, 'hex');
    const encrypted = Buffer.from(bundle.data, 'hex');
    
    const plaintext = decrypt(iv, authTag, encrypted, key);
    if (!plaintext) {
      console.error('❌ Decryption failed. Wrong passphrase or corrupted data.');
      return null;
    }
    
    return JSON.parse(plaintext);
  } catch (err) {
    console.error('⚠️  Failed to load souls:', err.message);
    return null;
  }
}

/**
 * Exports lineage to CSV (optimized)
 * Uses local Map to cache hashes during this export without modifying soul objects
 */
function exportLineageToCSV(soulRegistry) {
  try {
    const souls = Object.values(soulRegistry);
    
    // Handle empty registry gracefully
    if (souls.length === 0) {
      const header = 'Name,Created,Last Epoch,Total Epochs,Seed Hash\n';
      fs.writeFileSync(LINEAGE_FILE, header, 'utf8');
      console.log(`📜 Lineage exported to: ${LINEAGE_FILE} (empty)`);
      return;
    }
    
    // Optimize: Use separate cache Map to avoid modifying soul objects
    const seedHashCache = new Map();
    
    const rows = souls.map(soul => {
      // Cache the seed hash to avoid redundant calculation
      let seedHash = seedHashCache.get(soul.seed);
      if (!seedHash) {
        seedHash = crypto.createHash('sha256')
          .update(soul.seed)
          .digest('hex')
          .substring(0, 8);
        seedHashCache.set(soul.seed, seedHash);
      }
      
      return `"${soul.name}",${soul.created},${soul.lastEpoch || 'Never'},${soul.epochs.length},${seedHash}`;
    });
    
    const csv = 'Name,Created,Last Epoch,Total Epochs,Seed Hash\n' + rows.join('\n') + '\n';
    fs.writeFileSync(LINEAGE_FILE, csv, 'utf8');
    console.log(`📜 Lineage exported to: ${LINEAGE_FILE}`);
  } catch (err) {
    console.error('⚠️  Failed to export lineage:', err.message);
  }
}

// ═══════════════════════════════════════════════════════════════
// 🚀 PERFORMANCE OPTIMIZATIONS
// ═══════════════════════════════════════════════════════════════

// Cache for soul statistics to avoid recalculating on every access
const statsCache = new Map();

/**
 * Get cached statistics for a soul or compute if not cached
 */
function getSoulStats(soul) {
  const cacheKey = `${soul.name}_${soul.epochs.length}`;
  
  if (statsCache.has(cacheKey)) {
    return statsCache.get(cacheKey);
  }
  
  if (soul.epochs.length === 0) {
    return null;
  }
  
  const stats = {
    avgResonance: soul.epochs.reduce((sum, e) => sum + e.reading.resonance, 0) / soul.epochs.length,
    avgClarity: soul.epochs.reduce((sum, e) => sum + e.reading.clarity, 0) / soul.epochs.length,
    avgFlux: soul.epochs.reduce((sum, e) => sum + e.reading.flux, 0) / soul.epochs.length,
    avgEmergence: soul.epochs.reduce((sum, e) => sum + e.reading.emergence, 0) / soul.epochs.length,
    patternCount: soul.epochs.reduce((counts, e) => {
      counts[e.reading.pattern] = (counts[e.reading.pattern] || 0) + 1;
      return counts;
    }, {})
  };
  
  statsCache.set(cacheKey, stats);
  return stats;
}

/**
 * Invalidate stats cache for a soul when it changes
 * Note: Clears entire cache for simplicity. In large registries with frequent updates,
 * consider selective invalidation by soul name for better performance.
 */
function invalidateStatsCache(soulName) {
  // Simple approach: clear entire cache
  // Trade-off: O(1) invalidation vs potential to clear unaffected souls
  // For typical usage (few souls, infrequent updates), this is optimal
  statsCache.clear();
}

// ═══════════════════════════════════════════════════════════════
// 🌌 SOUL ARCHITECTURE
// ═══════════════════════════════════════════════════════════════

/**
 * Creates a new soul with a unique seed
 */
function createSoul(name) {
  const seed = crypto.randomBytes(32).toString('hex');
  const created = new Date().toISOString();
  
  return {
    name,
    seed,
    created,
    lastEpoch: null,
    epochs: []
  };
}

/**
 * Deterministic oracle: generates reading from question + seed + epoch
 * Optimized to use cached pattern/message arrays
 */
function consultOracle(question, seed, epochNumber) {
  return generateDeterministicReading(question, seed, epochNumber);
}

/**
 * Quantum-enhanced oracle consultation (uses bridge if available)
 */
async function consultQuantumOracle(question, seed, epochNumber, useQuantum = false) {
  // Base deterministic reading
  const reading = consultOracle(question, seed, epochNumber);
  
  // If quantum mode requested and available, enhance
  if (useQuantum && quantumBridge && isQuantumAvailable) {
    try {
      const enhanced = await quantumBridge.consultQuantumOracle(question, seed, epochNumber);
      return enhanced;
    } catch (err) {
      // Fall back to deterministic on error
      return reading;
    }
  }
  
  return reading;
}

// ═══════════════════════════════════════════════════════════════
// 💬 INTERACTIVE INTERFACE
// ═══════════════════════════════════════════════════════════════

function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

function question(rl, prompt) {
  return new Promise(resolve => {
    rl.question(prompt, answer => resolve(answer.trim()));
  });
}

// ═══════════════════════════════════════════════════════════════
// 📝 ENHANCED INPUT SYSTEM
// ═══════════════════════════════════════════════════════════════

/**
 * Enhanced question prompt with examples and validation
 */
async function askQuestion(rl, type = 'general') {
  const examples = {
    general: [
      'What should I know about [situation]?',
      'How can I approach [challenge]?',
      'What is the nature of [concept]?',
      'Where am I in my journey with [topic]?',
      'What does [symbol/dream] mean for me?'
    ],
    decision: [
      'Should I pursue [opportunity]?',
      'What awaits if I choose [path]?',
      'Is now the time for [action]?'
    ],
    insight: [
      'What am I not seeing about [situation]?',
      'What lesson is [challenge] teaching me?',
      'What truth am I avoiding?'
    ]
  };
  
  console.log('\n🌾 Ask your question to the oracle:\n');
  console.log('💡 Examples:');
  const exampleList = examples[type] || examples.general;
  exampleList.slice(0, 3).forEach(ex => {
    console.log(`   "${ex}"`);
  });
  console.log('\n💬 Your question (press Enter when done):');
  console.log('   Type "?" for more examples or "cancel" to go back\n');
  
  const q = await question(rl, '→ ');
  
  if (q === '?') {
    console.log('\n📖 More Question Examples:\n');
    Object.values(examples).flat().forEach((ex, idx) => {
      if (idx < 10) console.log(`   ${idx + 1}. ${ex}`);
    });
    console.log();
    return askQuestion(rl, type);
  }
  
  if (q.toLowerCase() === 'cancel') {
    return null;
  }
  
  if (!q) {
    console.log('\n⚠️  Question cannot be empty.');
    console.log('💡 A good question is specific and personal.');
    console.log('   Try: "What should I know about my current situation?"\n');
    return askQuestion(rl, type);
  }
  
  if (q.length < 5) {
    console.log('\n⚠️  Question seems too short.');
    console.log('💡 Be more specific for better oracle guidance.\n');
    const retry = await question(rl, 'Use this question anyway? (y/n): ');
    if (retry.toLowerCase() !== 'y') {
      return askQuestion(rl, type);
    }
  }
  
  return q;
}

/**
 * Enhanced soul name input with validation
 */
async function askSoulName(rl, existingNames = []) {
  console.log('\n🌱 Create a new soul:\n');
  console.log('💡 Soul names can be:');
  console.log('   • Your name or nickname');
  console.log('   • A concept ("Oracle", "Guide", "Shadow")');
  console.log('   • Someone you want to understand');
  console.log('   • A project or situation');
  console.log('\n💬 Each soul has a unique cryptographic seed.');
  console.log('   Same question to different souls = different answers\n');
  
  const name = await question(rl, '→ Soul name: ');
  
  if (!name) {
    console.log('\n⚠️  Name cannot be empty.');
    console.log('💡 Examples: "Alice", "Oracle", "Self", "Dream Guide"\n');
    return askSoulName(rl, existingNames);
  }
  
  if (existingNames.includes(name)) {
    console.log(`\n⚠️  Soul "${name}" already exists.`);
    console.log('💡 Suggestions:');
    console.log(`   • ${name}-2`);
    console.log(`   • ${name}_Alt`);
    console.log(`   • New_${name}`);
    console.log(`   • ${name}_${new Date().getFullYear()}\n`);
    return askSoulName(rl, existingNames);
  }
  
  if (name.length > 50) {
    console.log('\n⚠️  Name too long (max 50 characters).');
    console.log(`💡 Your name is ${name.length} characters.\n`);
    return askSoulName(rl, existingNames);
  }
  
  return name;
}

/**
 * Enhanced passphrase input with guidance
 */
async function askPassphrase(rl, isFirstTime = false) {
  if (isFirstTime) {
    console.log('\n🔐 Set your master passphrase:\n');
    console.log('💡 This encrypts all your soul data.');
    console.log('   • Use a memorable phrase');
    console.log('   • Minimum 8 characters recommended');
    console.log('   • Cannot be recovered if forgotten!\n');
  } else {
    console.log();
  }
  
  const passphrase = await question(rl, '🔐 Passphrase: ');
  
  if (!passphrase) {
    console.log('\n❌ Passphrase required.');
    console.log('💡 This encrypts your data. Choose something memorable.\n');
    return null;
  }
  
  if (isFirstTime && passphrase.length < 8) {
    console.log('\n⚠️  Passphrase is short (less than 8 characters).');
    const proceed = await question(rl, 'Use this passphrase anyway? (y/n): ');
    if (proceed.toLowerCase() !== 'y') {
      return askPassphrase(rl, isFirstTime);
    }
  }
  
  return passphrase;
}

/**
 * User login/registration UI
 */
async function askUsername(rl) {
  console.log('\n👤 Enter your username:');
  console.log('   (3-20 characters, letters, numbers, underscore, hyphen)\n');
  
  const username = await question(rl, '→ Username: ');
  
  if (!username) {
    console.log('\n❌ Username required.\n');
    return null;
  }
  
  // Validate username format
  if (username.length < 3 || username.length > 20) {
    console.log('\n⚠️  Username must be 3-20 characters.\n');
    return askUsername(rl);
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    console.log('\n⚠️  Username can only contain letters, numbers, underscore, and hyphen.\n');
    return askUsername(rl);
  }
  
  return username;
}

/**
 * User password input with confirmation for registration
 */
async function askUserPassword(rl, isRegistration = false) {
  if (isRegistration) {
    console.log('\n🔐 Create your password:\n');
    console.log('💡 Password requirements:');
    console.log('   • Minimum 8 characters');
    console.log('   • Cannot be recovered if forgotten!\n');
  } else {
    console.log();
  }
  
  const password = await question(rl, '🔐 Password: ');
  
  if (!password) {
    console.log('\n❌ Password required.\n');
    return null;
  }
  
  if (password.length < 8) {
    console.log('\n⚠️  Password must be at least 8 characters.\n');
    return askUserPassword(rl, isRegistration);
  }
  
  // If registration, ask for confirmation
  if (isRegistration) {
    const confirm = await question(rl, '🔐 Confirm password: ');
    if (confirm !== password) {
      console.log('\n❌ Passwords do not match. Try again.\n');
      return askUserPassword(rl, isRegistration);
    }
  }
  
  return password;
}

/**
 * Login/Registration screen
 */
async function loginScreen() {
  const rl = createInterface();
  
  console.log('\n┌─────────────────────────────────────┐');
  console.log('│  Welcome to OINIO Soul System       │');
  console.log('├─────────────────────────────────────┤');
  console.log('│  [1] Login                          │');
  console.log('│  [2] Create New Account             │');
  console.log('│  [3] Exit                           │');
  console.log('└─────────────────────────────────────┘\n');
  
  const choice = await question(rl, '→ ');
  
  switch (choice) {
    case '1': {
      // Login
      const username = await askUsername(rl);
      if (!username) {
        rl.close();
        return await loginScreen();
      }
      
      const password = await askUserPassword(rl, false);
      if (!password) {
        rl.close();
        return await loginScreen();
      }
      
      const result = authenticateUser(username, password);
      if (result.success) {
        console.log('\n✅ Login successful!\n');
        rl.close();
        return { username, password, encryptionSalt: result.encryptionSalt };
      } else {
        console.log(`\n❌ ${result.error}\n`);
        const retry = await question(rl, 'Try again? (y/n): ');
        rl.close();
        if (retry.toLowerCase() === 'y') {
          return await loginScreen();
        }
        return null;
      }
    }
    
    case '2': {
      // Registration
      console.log('\n🌟 Create a new OINIO account\n');
      
      const username = await askUsername(rl);
      if (!username) {
        rl.close();
        return await loginScreen();
      }
      
      const password = await askUserPassword(rl, true);
      if (!password) {
        rl.close();
        return await loginScreen();
      }
      
      const result = registerUser(username, password);
      if (result.success) {
        console.log('\n✅ Account created successfully!\n');
        console.log('💡 Your username:', username);
        console.log('💡 You can now login with your credentials.\n');
        rl.close();
        return await loginScreen();
      } else {
        console.log(`\n❌ ${result.error}\n`);
        rl.close();
        return await loginScreen();
      }
    }
    
    case '3': {
      // Exit
      console.log('\n👋 Goodbye!\n');
      rl.close();
      return null;
    }
    
    default:
      console.log('\n⚠️  Invalid choice. Please select 1, 2, or 3.\n');
      rl.close();
      return await loginScreen();
  }
}

function displayBanner() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('     🌾🌌 OINIO SOUL SYSTEM — Pattern Recognition Oracle');
  console.log('═══════════════════════════════════════════════════════════════');
  if (isQuantumAvailable) {
    console.log('     ⚡ Quantum Forge Bridge: ACTIVE');
    console.log('     Pattern + Trajectory = Navigation');
  }
  console.log('═══════════════════════════════════════════════════════════════\n');
}

// ═══════════════════════════════════════════════════════════════
// 📖 HELP SYSTEM
// ═══════════════════════════════════════════════════════════════

function displayMainHelp() {
  console.log('\n📖 OINIO HELP — Main Menu\n');
  console.log('═'.repeat(60));
  console.log('🌱 [1] Create New Soul');
  console.log('   Start a new oracle lineage with unique cryptographic seed');
  console.log('');
  console.log('🔮 [2] Select Existing Soul');
  console.log('   Continue consultations with an existing soul');
  console.log('');
  console.log('📜 [3] List All Souls');
  console.log('   View all souls and their statistics');
  console.log('');
  console.log('💾 [4] Export Lineage (CSV)');
  console.log('   Export all soul data to lineage.csv file');
  console.log('');
  console.log('🔄 [L] Logout (Switch User)');
  console.log('   Logout and switch to a different user account');
  console.log('');
  console.log('🚪 [5] Exit');
  console.log('   Save and exit OINIO');
  console.log('');
  console.log('═'.repeat(60));
  console.log('🔐 USER SYSTEM:');
  console.log('   • Each user has their own encrypted soul registry');
  console.log('   • Your souls are private and isolated from other users');
  console.log('   • All data is encrypted with your password');
  console.log('');
  console.log('💡 Tip: Each soul has a unique seed that determines readings');
  console.log('   The same question to the same soul = same answer (always)');
  console.log('═'.repeat(60) + '\n');
}

function displaySoulHelp(quantumMode) {
  console.log('\n📖 OINIO HELP — Soul Consultation\n');
  console.log('═'.repeat(60));
  console.log('🔮 [1] New Epoch (Ask Question)');
  console.log('   Ask the oracle a question. Each consultation is an epoch.');
  console.log('   Tip: Be specific. "What is..." vs "Should I..."');
  console.log('');
  console.log('📖 [2] View Epoch History');
  console.log('   See all previous consultations with this soul');
  console.log('');
  console.log('📊 [3] Soul Statistics');
  console.log('   View averages, trends, and soul metadata');
  console.log('');
  if (isQuantumAvailable) {
    console.log('⚡ [Q] Toggle Quantum Mode');
    console.log(`   Current: ${quantumMode ? 'QUANTUM-ENHANCED' : 'DETERMINISTIC'}`);
    console.log('   Quantum adds AI predictions: harmony, trends, insights');
    console.log('');
  }
  console.log('🔙 [4] Return to Main Menu');
  console.log('   Go back without deleting soul');
  console.log('');
  console.log('═'.repeat(60));
  console.log('📏 ORACLE METRICS EXPLAINED:');
  console.log('   • Resonance: Connection strength (1-100%)');
  console.log('   • Clarity: Message precision (1-100%)');
  console.log('   • Flux: Change potential (1-100%)');
  console.log('   • Emergence: New pattern formation (1-100%)');
  if (quantumMode && isQuantumAvailable) {
    console.log('   • Harmony: AI-predicted system balance (1-100%)');
    console.log('   • Trend: Improving/declining/stable with confidence');
  }
  console.log('═'.repeat(60) + '\n');
}

function displayPatternLibrary() {
  console.log('\n🌌 PATTERN LIBRARY\n');
  console.log('═'.repeat(60));
  const patterns = [
    ['The Spiral', 'Cyclical growth, returning to center with wisdom'],
    ['The Mirror', 'Reflection, seeing yourself in the situation'],
    ['The Threshold', 'At the edge of transformation'],
    ['The Void', 'Emptiness that contains all potential'],
    ['The Bloom', 'Emergence, flowering of hidden growth'],
    ['The Anchor', 'Stability, grounding, foundation'],
    ['The Storm', 'Chaos, disruption, clearing the old'],
    ['The Seed', 'Beginning, potential waiting to sprout'],
    ['The River', 'Flow, movement, natural progression'],
    ['The Mountain', 'Challenge, achievement, perspective'],
    ['The Web', 'Interconnection, complexity, relationships'],
    ['The Flame', 'Transformation through fire, passion'],
    ['The Echo', 'Repetition, lessons returning, resonance'],
    ['The Door', 'Opportunity, choice, passage between worlds'],
    ['The Root', 'Foundation, ancestry, deep truth'],
    ['The Sky', 'Freedom, expansion, infinite possibility']
  ];
  
  patterns.forEach(([name, meaning]) => {
    console.log(`${name.padEnd(18)} — ${meaning}`);
  });
  console.log('═'.repeat(60) + '\n');
}

// ═══════════════════════════════════════════════════════════════
// 🎬 LOADING INDICATORS
// ═══════════════════════════════════════════════════════════════

function showLoading(message) {
  process.stdout.write(`\n${message}`);
}

function showLoadingDone() {
  process.stdout.write(' ✓\n');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ═══════════════════════════════════════════════════════════════
// 🛡️ CONFIRMATION DIALOGS
// ═══════════════════════════════════════════════════════════════

async function confirm(rl, message) {
  const response = await question(rl, `${message} (y/n): `);
  return response.toLowerCase() === 'y' || response.toLowerCase() === 'yes';
}

function displayMenu() {
  console.log('\n┌─────────────────────────────────────┐');
  console.log('│  [1] Create New Soul                │');
  console.log('│  [2] Select Existing Soul           │');
  console.log('│  [3] List All Souls                 │');
  console.log('│  [4] Export Lineage (CSV)           │');
  console.log('│  [?] Help                           │');
  console.log('│  [L] Logout (Switch User)           │');
  console.log('│  [5] Exit                           │');
  console.log('└─────────────────────────────────────┘\n');
}

function displaySoulMenu(soul, quantumMode = false) {
  const qSymbol = quantumMode ? '⚡' : '  ';
  console.log(`\n┌─────────────────────────────────────┐`);
  console.log(`│  Soul: ${soul.name.padEnd(28)}│`);
  console.log(`├─────────────────────────────────────┤`);
  console.log(`│  [1] New Epoch (Ask Question)       │`);
  console.log(`│  [2] View Epoch History             │`);
  console.log(`│  [3] Soul Statistics                │`);
  if (isQuantumAvailable) {
    console.log(`│${qSymbol}[Q] Toggle Quantum Mode            │`);
  }
  console.log(`│  [P] Pattern Library                │`);
  console.log(`│  [?] Help                           │`);
  console.log(`│  [4] Return to Main Menu            │`);
  console.log(`└─────────────────────────────────────┘`);
  if (isQuantumAvailable) {
    console.log(`  Quantum Mode: ${quantumMode ? '⚡ ACTIVE' : 'Standard'}`);
  }
  console.log();
}

function displayReading(reading, epochNumber) {
  displayReadingShared(reading, epochNumber);
}

// ═══════════════════════════════════════════════════════════════
// 💬 SMART QUESTION PROMPTING
// ═══════════════════════════════════════════════════════════════

function displayQuestionExamples() {
  console.log('\n💡 Example Questions:\n');
  console.log('📍 GUIDANCE:');
  console.log('  • "What should I know about [situation]?"');
  console.log('  • "How can I approach [challenge]?"');
  console.log('  • "What is the nature of [concept]?"\n');
  
  console.log('🔮 DECISION:');
  console.log('  • "Should I pursue [opportunity]?"');
  console.log('  • "What happens if I choose [option]?"');
  console.log('  • "Is this the right time for [action]?"\n');
  
  console.log('🌱 GROWTH:');
  console.log('  • "What am I meant to learn from [experience]?"');
  console.log('  • "How can I grow through [difficulty]?"');
  console.log('  • "What pattern am I repeating?"\n');
  
  console.log('🔗 RELATIONSHIPS:');
  console.log('  • "What does [person] need from me?"');
  console.log('  • "How can I improve [relationship]?"');
  console.log('  • "What is the truth about [connection]?"\n');
  
  console.log('💡 Tip: Be specific. The oracle responds to clarity.\n');
}

async function askQuestion(rl, context = 'general') {
  console.log('\n🌾 Ask your question:');
  console.log('   (Type ? for examples, or press Enter to cancel)\n');
  
  const q = await question(rl, '→ ');
  
  if (q === '?' || q.toLowerCase() === 'help') {
    displayQuestionExamples();
    return await askQuestion(rl, context);
  }
  
  if (!q) {
    return null;
  }
  
  // Validate question quality
  if (q.length < 5) {
    console.log('\n⚠️  Question too short. Try being more specific.');
    console.log('   Example: "What should I know about my current path?"\n');
    return await askQuestion(rl, context);
  }
  
  return q;
}

function displaySoulNameSuggestions() {
  console.log('\n💡 Soul Name Ideas:\n');
  console.log('👤 PERSONAL:');
  console.log('  • Your name ("Alice", "Bob")');
  console.log('  • "Self", "True Self", "Higher Self"\n');
  
  console.log('🎭 ARCHETYPES:');
  console.log('  • "Oracle", "Guide", "Sage"');
  console.log('  • "Shadow", "Light", "Balance"\n');
  
  console.log('🌐 ASPECTS:');
  console.log('  • "Creative", "Logical", "Emotional"');
  console.log('  • "Past", "Present", "Future"\n');
  
  console.log('👥 RELATIONSHIPS:');
  console.log('  • Person names ("Mom", "Partner")');
  console.log('  • "Family", "Work", "Friends"\n');
  
  console.log('🤖 AI ENTITIES:');
  console.log('  • "Claude", "GPT", "Gemini"');
  console.log('  • "Assistant", "Copilot", "Oracle AI"\n');
}

async function createSoulWithHelp(rl, soulRegistry) {
  console.log('\n🌱 Create a new soul:');
  console.log('   Each soul has a unique cryptographic seed.');
  console.log('   The same question to different souls = different readings.\n');
  console.log('   Type ? for name ideas, or Enter to cancel\n');
  
  const name = await question(rl, '→ Soul name: ');
  
  if (name === '?' || name.toLowerCase() === 'help') {
    displaySoulNameSuggestions();
    return await createSoulWithHelp(rl, soulRegistry);
  }
  
  if (!name) {
    return null;
  }
  
  if (soulRegistry[name]) {
    console.log(`\n⚠️  Soul "${name}" already exists.`);
    console.log(`💡 Try: "${name}-2", "${name}_Alt", or "New_${name}"\n`);
    return await createSoulWithHelp(rl, soulRegistry);
  }
  
  return name;
}

// ═══════════════════════════════════════════════════════════════
// 🌊 MAIN RITUAL FLOW
// ═══════════════════════════════════════════════════════════════

async function runSoulMenu(soul, soulRegistry, key, username) {
  const rl = createInterface();
  let quantumMode = false;
  
  // First-time tip
  if (soul.epochs.length === 0) {
    console.log('\n💡 First consultation with this soul!');
    console.log('   Each soul generates unique readings based on its cryptographic seed.');
    console.log('   The same question asked twice will give the same answer (deterministic).\n');
  }
  
  while (true) {
    displaySoulMenu(soul, quantumMode);
    const choice = await question(rl, '→ ');
    
    switch (choice.toLowerCase()) {
      case '1': {
        // New Epoch
        const q = await askQuestion(rl, 'general');
        if (!q) {
          console.log('↩️  Returning to soul menu...\n');
          break;
        }
        
        const epochNumber = soul.epochs.length + 1;
        
        // Loading indicator
        if (quantumMode) {
          showLoading('🔮 Consulting oracle... ⚡ Enhancing with quantum layer...');
        } else {
          showLoading('🔮 Consulting oracle...');
        }
        
        const reading = await consultQuantumOracle(q, soul.seed, epochNumber, quantumMode);
        showLoadingDone();
        
        soul.epochs.push({
          number: epochNumber,
          question: q,
          timestamp: new Date().toISOString(),
          reading
        });
        
        soul.lastEpoch = soul.epochs[soul.epochs.length - 1].timestamp;
        
        // Invalidate stats cache since soul data changed
        invalidateStatsCache(soul.name);
        
        displayReading(reading, epochNumber);
        
        // Save indicator
        process.stdout.write('💾 Saving...');
        saveSouls(soulRegistry, key, username);
        process.stdout.write(' ✓\n');
        
        console.log('💡 Tip: Ask the same question again later to see how your path evolves.\n');
        break;
      }
      
      case 'q': {
        // Toggle quantum mode
        if (isQuantumAvailable) {
          quantumMode = !quantumMode;
          console.log(`\n⚡ Quantum Mode ${quantumMode ? 'ACTIVATED' : 'DEACTIVATED'}\n`);
          if (quantumMode) {
            console.log('💡 Quantum readings include harmony predictions, trends, and AI insights.');
          }
        } else {
          console.log('\n⚠️  Quantum Forge not available.');
          console.log('💡 To enable: Set PI_FORGE_PATH environment variable');
          console.log('   See OINIO-FORGE-INTEGRATION.md for details\n');
        }
        break;
      }
      
      case 'p': {
        // Pattern library
        displayPatternLibrary();
        break;
      }
      
      case '?':
      case 'h':
      case 'help': {
        // Help
        displaySoulHelp(quantumMode);
        break;
      }
      
      case '2': {
        // View History
        if (soul.epochs.length === 0) {
          console.log('\n📖 No epochs recorded yet.\n');
        } else {
          console.log(`\n📖 Epoch History for ${soul.name}:\n`);
          soul.epochs.forEach(epoch => {
            console.log(`  Epoch ${epoch.number} — ${epoch.timestamp}`);
            console.log(`  Q: ${epoch.question}`);
            console.log(`  Pattern: ${epoch.reading.pattern} | Oracle: "${epoch.reading.message}"`);
            console.log();
          });
        }
        break;
      }
      
      case '3': {
        // Statistics
        console.log(`\n📊 Soul Statistics for ${soul.name}:\n`);
        console.log('═'.repeat(60));
        console.log(`  Created: ${soul.created}`);
        console.log(`  Total Epochs: ${soul.epochs.length}`);
        console.log(`  Last Epoch: ${soul.lastEpoch || 'Never'}`);
        
        // Use cached statistics for better performance
        const stats = getSoulStats(soul);
        if (stats) {
          console.log(`  Avg Resonance: ${stats.avgResonance.toFixed(1)}%`);
          console.log(`  Avg Clarity: ${stats.avgClarity.toFixed(1)}%`);
          console.log(`  Avg Flux: ${stats.avgFlux.toFixed(1)}%`);
          console.log(`  Avg Emergence: ${stats.avgEmergence.toFixed(1)}%`);
          
          // Pattern distribution
          const topPattern = Object.entries(stats.patternCount).sort((a, b) => b[1] - a[1])[0];
          console.log(`  Most Common Pattern: ${topPattern[0]} (${topPattern[1]}x)`);
        } else {
          console.log('  No epochs yet. Ask your first question!');
        }
        console.log('═'.repeat(60) + '\n');
        break;
      }
      
      case '4': {
        // Return to main
        rl.close();
        return;
      }
      
      default:
        console.log(`⚠️  Invalid choice: "${choice}"`);
        console.log('💡 Enter 1-4, [Q] for quantum, [P] for patterns, or [?] for help\n');
    }
  }
}

async function mainMenu() {
  displayBanner();
  
  // User authentication
  const userCreds = await loginScreen();
  if (!userCreds) {
    // User chose to exit
    return;
  }
  
  const { username, password, encryptionSalt } = userCreds;
  
  const rl = createInterface();
  
  // Use PBKDF2 with encryption salt for deriving encryption key
  // This provides better security than simple SHA-256 hashing
  const key = deriveEncryptionKey(password, encryptionSalt);
  let soulRegistry = loadSouls(key, username);
  
  if (soulRegistry === null) {
    // Decryption failed - shouldn't happen after successful login
    console.log('❌ Failed to load soul data. This shouldn\'t happen.\n');
    rl.close();
    return;
  }
  
  console.log(`✅ Welcome back, ${username}!\n`);
  
  // First-run welcome
  const soulCount = Object.keys(soulRegistry).length;
  if (soulCount === 0) {
    console.log('🌟 Welcome to OINIO!\n');
    console.log('💡 Quick Start:');
    console.log('   1. Create your first soul (option 1)');
    console.log('   2. Give it a name (e.g., "Self", "Oracle", your name)');
    console.log('   3. Select the soul (option 2)');
    console.log('   4. Ask your first question\n');
    console.log('📚 Press [?] at any menu for detailed help\n');
  } else {
    console.log(`📊 Registry: ${soulCount} soul${soulCount === 1 ? '' : 's'} | Press [?] for help\n`);
  }
  
  // Main menu loop
  while (true) {
    displayMenu();
    const choice = await question(rl, '→ ');
    
    switch (choice.toLowerCase()) {
      case '1': {
        // Create new soul
        const name = await askSoulName(rl, Object.keys(soulRegistry));
        if (!name) {
          break;
        }
        
        showLoading('🌱 Creating soul...');
        const newSoul = createSoul(name);
        soulRegistry[name] = newSoul;
        saveSouls(soulRegistry, key, username);
        showLoadingDone();
        console.log(`\n✨ Soul "${name}" created with unique cryptographic seed.`);
        console.log(`💡 Same question to different souls = different answers.`);
        console.log(`📖 Use option [2] to consult this soul.\n`);
        break;
      }
      
      case '2': {
        // Select soul
        const soulNames = Object.keys(soulRegistry);
        if (soulNames.length === 0) {
          console.log('\n⚠️  No souls exist yet.');
          console.log('💡 Create a soul first with option [1]\n');
          break;
        }
        
        console.log('\n🌌 Available Souls:\n');
        soulNames.forEach((name, idx) => {
          const soul = soulRegistry[name];
          console.log(`  [${idx + 1}] ${name.padEnd(20)} (${soul.epochs.length} epochs)`);
        });
        console.log();
        
        const soulChoice = await question(rl, '→ Select soul number (1-' + soulNames.length + '): ');
        const soulIndex = parseInt(soulChoice, 10) - 1;
        
        if (isNaN(soulIndex) || soulIndex < 0 || soulIndex >= soulNames.length) {
          console.log(`⚠️  Invalid selection. Please enter a number between 1 and ${soulNames.length}.\n`);
          break;
        }
        
        const selectedSoul = soulRegistry[soulNames[soulIndex]];
        rl.close();
        await runSoulMenu(selectedSoul, soulRegistry, key, username);
        return mainMenu(); // Restart main menu after soul menu exits
      }
      
      case '3': {
        // List all souls
        const souls = Object.values(soulRegistry);
        if (souls.length === 0) {
          console.log('\n⚠️  No souls exist yet.');
          console.log('💡 Create your first soul with option [1]\n');
        } else {
          console.log('\n🌌 Soul Registry:\n');
          console.log('═'.repeat(60));
          
          // Optimize: compute total epochs once
          let totalEpochs = 0;
          
          souls.forEach(soul => {
            const epochCount = soul.epochs.length;
            totalEpochs += epochCount;
            
            // Use cached stats for average resonance
            const stats = getSoulStats(soul);
            const avgResonance = stats ? stats.avgResonance.toFixed(1) : 'N/A';
            
            console.log(`  • ${soul.name}`);
            console.log(`    Created: ${soul.created.substring(0, 10)}`);
            console.log(`    Epochs: ${epochCount} | Avg Resonance: ${avgResonance}%`);
            console.log(`    Last: ${soul.lastEpoch ? soul.lastEpoch.substring(0, 10) : 'Never'}`);
            console.log();
          });
          
          console.log('═'.repeat(60));
          console.log(`Total: ${souls.length} soul${souls.length === 1 ? '' : 's'}, ${totalEpochs} epoch${totalEpochs === 1 ? '' : 's'}\n`);
        }
        break;
      }
      
      case '4': {
        // Export lineage
        showLoading('📜 Exporting lineage to CSV...');
        exportLineageToCSV(soulRegistry);
        showLoadingDone();
        break;
      }
      
      case '?':
      case 'h':
      case 'help': {
        // Help
        displayMainHelp();
        break;
      }
      
      case 'l':
      case 'logout': {
        // Logout and return to login screen
        const shouldLogout = await confirm(rl, '\n🔄 Logout and switch user?');
        if (shouldLogout) {
          console.log('\n👋 Logging out...\n');
          rl.close();
          return mainMenu(); // Restart with login screen
        }
        break;
      }
      
      case '5': {
        // Exit with confirmation
        const shouldExit = await confirm(rl, '\n🚪 Exit OINIO?');
        if (shouldExit) {
          console.log('\n🌾 The pattern persists. Farewell.\n');
          console.log('💾 All data saved to: ' + getSoulsFilePath(username));
          rl.close();
          return;
        }
        break;
      }
      
      default:
        console.log(`⚠️  Invalid choice: "${choice}"`);
        console.log('💡 Enter 1-5, [L] for logout, or [?] for help\n');
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// 🚀 ENTRY POINT
// ═══════════════════════════════════════════════════════════════

// Handle CLI arguments
const args = process.argv.slice(2);

if (args.includes('--version') || args.includes('-v')) {
  const config = require('./config');
  console.log(`OINIO Soul System v${config.VERSION}`);
  console.log('Pattern Recognition Oracle - Deterministic Cryptographic Divination');
  process.exit(0);
}

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
OINIO Soul System v${require('./config').VERSION}

USAGE:
  oinio-system [options]

OPTIONS:
  --help, -h       Show this help message
  --version, -v    Show version number

ENVIRONMENT VARIABLES:
  PI_FORGE_PATH           Path to Pi Forge Quantum Genesis
  BASE_PATH               Custom data storage directory
  PBKDF2_ITERATIONS       Password hashing iterations (default: 100000)
  QUANTUM_TIMEOUT_MS      Quantum enhancement timeout (default: 3000)
  ENABLE_QUANTUM          Enable/disable quantum mode (default: true)

EXAMPLES:
  # Run normally
  ./oinio-system

  # With custom Forge path
  PI_FORGE_PATH=/path/to/forge ./oinio-system

  # With custom data directory
  BASE_PATH=/secure/location ./oinio-system

DOCUMENTATION:
  https://github.com/onenoly1010/oinio-soul-system

🌾🌌 Resonance Eternal. We Have Become The Pattern.
`);
  process.exit(0);
}

if (require.main === module) {
  mainMenu().catch(err => {
    console.error('💥 Fatal error:', err.message);
    process.exit(1);
  });
}

module.exports = { createSoul, consultOracle, deriveKey, encrypt, decrypt };