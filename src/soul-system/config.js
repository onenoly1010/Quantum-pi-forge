export default {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || '0.0.0.0',

  // Security
  PBKDF2_ITERATIONS: 100000,
  PBKDF2_KEY_LENGTH: 32,
  PBKDF2_DIGEST: 'sha256',

  // Validation
  PROOF_TIMEOUT_MS: 115000,
  REQUIRE_VALID_SIGNATURE: true
};
