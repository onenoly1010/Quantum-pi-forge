import config from './config.js';

/**
 * Robust retry mechanism with exponential backoff, jitter, and circuit breaker
 * Designed to minimize human intervention with automated failure recovery
 */
export class RetryManager {
  constructor() {
    this.failureCounts = new Map();
    this.circuitBreakers = new Map();
  }

  /**
   * Execute an operation with automatic retries
   * @param {Function} operation - Async function to execute
   * @param {string} operationId - Unique identifier for circuit tracking
   * @param {Object} options - Override default config values
   * @returns {Promise<any>} Result of successful operation
   */
  async executeWithRetry(operation, operationId = 'default', options = {}) {
    const opts = {
      maxRetries: config.MAX_RETRIES,
      initialDelay: config.INITIAL_RETRY_DELAY_MS,
      maxDelay: config.MAX_RETRY_DELAY_MS,
      backoffMultiplier: config.EXPONENTIAL_BACKOFF_MULTIPLIER,
      jitterPercent: config.RETRY_JITTER_PERCENT,
      circuitBreakerThreshold: config.CIRCUIT_BREAKER_THRESHOLD,
      circuitResetTimeout: config.CIRCUIT_BREAKER_RESET_TIMEOUT_MS,
      ...options
    };

    // Check circuit breaker state
    if (this.isCircuitOpen(operationId, opts.circuitResetTimeout)) {
      throw new Error(`Circuit open for ${operationId} - operation blocked to prevent cascading failure`);
    }

    let attempt = 0;
    let lastError;

    while (attempt < opts.maxRetries) {
      try {
        const result = await operation();
        this.recordSuccess(operationId);
        return result;
      } catch (error) {
        lastError = error;
        attempt++;
        
        this.recordFailure(operationId);

        if (attempt >= opts.maxRetries) {
          this.checkCircuitBreaker(operationId, opts.circuitBreakerThreshold);
          break;
        }

        // Only retry on retryable error types
        if (!this.isRetryableError(error)) {
          throw error;
        }

        // Calculate exponential backoff with jitter
        const delay = this.calculateDelay(attempt, opts);
        
        if (attempt >= config.FAILURE_LOG_THRESHOLD) {
          console.warn(`[RETRY] Operation ${operationId} failed (attempt ${attempt}/${opts.maxRetries}), retrying in ${delay}ms`, error.message);
        }

        await this.sleep(delay);
      }
    }

    console.error(`[FATAL] Operation ${operationId} failed after ${opts.maxRetries} attempts:`, lastError);
    throw lastError;
  }

  calculateDelay(attempt, opts) {
    const exponentialDelay = opts.initialDelay * Math.pow(opts.backoffMultiplier, attempt - 1);
    const cappedDelay = Math.min(exponentialDelay, opts.maxDelay);
    const jitterAmount = cappedDelay * (opts.jitterPercent / 100);
    const jitter = (Math.random() * jitterAmount * 2) - jitterAmount;
    return Math.max(opts.initialDelay, Math.floor(cappedDelay + jitter));
  }

  isRetryableError(error) {
    const retryableCodes = ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'EAI_AGAIN', 'EPIPE', 'ESOCKETTIMEDOUT'];
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    
    if (error.code && retryableCodes.includes(error.code)) return true;
    if (error.statusCode && retryableStatuses.includes(error.statusCode)) return true;
    if (error.message && error.message.includes('timeout')) return true;
    if (error.message && error.message.includes('rate limit')) return true;
    if (error.message && error.message.includes('network')) return true;
    
    return false;
  }

  recordSuccess(operationId) {
    if (this.failureCounts.has(operationId)) {
      this.failureCounts.set(operationId, 0);
    }
  }

  recordFailure(operationId) {
    const current = this.failureCounts.get(operationId) || 0;
    this.failureCounts.set(operationId, current + 1);
  }

  checkCircuitBreaker(operationId, threshold) {
    const failures = this.failureCounts.get(operationId) || 0;
    if (failures >= threshold) {
      this.openCircuit(operationId);
    }
  }

  openCircuit(operationId) {
    console.error(`[CIRCUIT BREAKER] Opening circuit for ${operationId} after repeated failures`);
    this.circuitBreakers.set(operationId, Date.now());
  }

  isCircuitOpen(operationId, resetTimeout) {
    const openedAt = this.circuitBreakers.get(operationId);
    if (!openedAt) return false;
    
    if (Date.now() - openedAt > resetTimeout) {
      this.circuitBreakers.delete(operationId);
      console.info(`[CIRCUIT BREAKER] Resetting circuit for ${operationId} - testing recovery`);
      return false;
    }
    
    return true;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getStats(operationId) {
    return {
      failureCount: this.failureCounts.get(operationId) || 0,
      circuitOpen: this.isCircuitOpen(operationId, config.CIRCUIT_BREAKER_RESET_TIMEOUT_MS),
      circuitOpenedAt: this.circuitBreakers.get(operationId) || null
    };
  }

  reset(operationId) {
    this.failureCounts.delete(operationId);
    this.circuitBreakers.delete(operationId);
  }
}

// Global singleton instance
export const retryManager = new RetryManager();

// Convenience wrapper
export async function retry(operation, operationId, options) {
  return retryManager.executeWithRetry(operation, operationId, options);
}