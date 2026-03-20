/**
 * Pi Forge Integration SDK
 * 
 * JavaScript SDK for browser-based Pi Network interactions with the Pi Forge Quantum Genesis platform.
 * 
 * Features:
 * - Pi SDK integration
 * - Payment flow orchestration
 * - Real-time resonance visualization
 * - Session management
 * 
 * @version 1.0.0
 * @requires Pi SDK (https://sdk.minepi.com/pi-sdk.js)
 */

(function(window) {
    'use strict';

    /**
     * PiForge SDK Class
     */
    class PiForgeSDK {
        constructor() {
            this.config = {
                network: 'testnet',
                debug: false,
                apiBase: typeof window !== 'undefined' && window.location.protocol === 'https:' 
                    ? 'https://localhost:8000' 
                    : 'http://localhost:8000',
                apiPath: '/api/pi-network'
            };
            this.initialized = false;
            this.sessionId = null;
            this.user = null;
            this.Pi = null;
            this.BOOST_COST_PER_PERCENT = 0.01; // Cost in Pi per 1% boost
        }

        /**
         * Initialize the Pi Forge SDK
         * @param {Object} options - Configuration options
         * @param {string} options.network - Network mode: 'testnet' or 'mainnet'
         * @param {boolean} options.debug - Enable debug logging
         * @param {string} options.apiBase - Base URL for API endpoints
         */
        async initialize(options = {}) {
            this.config = { ...this.config, ...options };
            
            if (this.config.debug) {
                console.log('[PiForge] Initializing with config:', this.config);
            }

            // Check if Pi SDK is loaded
            if (typeof window.Pi === 'undefined') {
                throw new Error('Pi SDK not loaded. Please ensure the Pi SDK is included before this script. See documentation for the current SDK URL.');
            }

            this.Pi = window.Pi;
            this.initialized = true;

            if (this.config.debug) {
                console.log('[PiForge] Initialization complete');
            }

            return this;
        }

        /**
         * Authenticate user with Pi Network
         * @param {Array<string>} scopes - Requested permission scopes (e.g., ['payments', 'username'])
         * @returns {Object} Authentication result with user info and session
         */
        async authenticate(scopes = ['payments', 'username']) {
            this._ensureInitialized();

            if (this.config.debug) {
                console.log('[PiForge] Authenticating with scopes:', scopes);
            }

            try {
                // Authenticate with Pi SDK
                const authResult = await this.Pi.authenticate(scopes, this._onIncompletePaymentFound.bind(this));
                
                if (this.config.debug) {
                    console.log('[PiForge] Pi SDK authentication successful:', authResult);
                }

                // Register session with backend
                const response = await this._apiRequest('POST', '/authenticate', {
                    pi_uid: authResult.user.uid,
                    username: authResult.user.username,
                    access_token: authResult.accessToken
                });

                this.sessionId = response.session_id;
                this.user = authResult.user;

                if (this.config.debug) {
                    console.log('[PiForge] Backend session created:', this.sessionId);
                }

                return {
                    user: this.user,
                    accessToken: authResult.accessToken,
                    sessionId: this.sessionId
                };
            } catch (error) {
                console.error('[PiForge] Authentication failed:', error);
                throw new Error(`Authentication failed: ${error.message}`);
            }
        }

        /**
         * Create a payment
         * @param {Object} paymentData - Payment details
         * @param {number} paymentData.amount - Payment amount in Pi
         * @param {string} paymentData.memo - Payment description
         * @param {Object} paymentData.metadata - Additional metadata
         * @returns {Object} Payment result with paymentId and transaction hash
         */
        async createPayment(paymentData) {
            this._ensureInitialized();
            this._ensureAuthenticated();

            const { amount, memo, metadata = {} } = paymentData;

            if (!amount || amount <= 0) {
                throw new Error('Payment amount must be greater than 0');
            }

            if (!memo) {
                throw new Error('Payment memo is required');
            }

            if (this.config.debug) {
                console.log('[PiForge] Creating payment:', paymentData);
            }

            try {
                // Create payment record on backend
                const backendPayment = await this._apiRequest('POST', '/payments/create', {
                    amount: parseFloat(amount),
                    memo: memo,
                    user_id: this.user.uid,
                    metadata: metadata
                });

                if (this.config.debug) {
                    console.log('[PiForge] Backend payment created:', backendPayment);
                }

                // Create payment with Pi SDK
                const piPayment = await this.Pi.createPayment({
                    amount: amount,
                    memo: memo,
                    metadata: { 
                        ...metadata, 
                        paymentId: backendPayment.payment_id 
                    }
                }, {
                    onReadyForServerApproval: (paymentId) => this._onReadyForServerApproval(paymentId),
                    onReadyForServerCompletion: (paymentId, txid) => this._onReadyForServerCompletion(paymentId, txid),
                    onCancel: (paymentId) => this._onPaymentCancelled(paymentId),
                    onError: (error, payment) => this._onPaymentError(error, payment)
                });

                if (this.config.debug) {
                    console.log('[PiForge] Pi SDK payment created:', piPayment);
                }

                // Trigger resonance visualization if payment completed
                if (piPayment.status === 'completed') {
                    this._triggerResonanceVisualization(piPayment);
                }

                return {
                    paymentId: backendPayment.payment_id,
                    txid: piPayment.transaction?.txid,
                    status: piPayment.status,
                    amount: amount,
                    memo: memo
                };
            } catch (error) {
                console.error('[PiForge] Payment creation failed:', error);
                throw new Error(`Payment creation failed: ${error.message}`);
            }
        }

        /**
         * Activate mining boost (convenience method)
         * @param {number} boostPercent - Boost percentage (e.g., 50 for +50%)
         * @returns {Object} Payment result
         */
        async activateMiningBoost(boostPercent) {
            const amount = this._calculateBoostCost(boostPercent);
            
            return this.createPayment({
                amount: amount,
                memo: `Mining boost activation: +${boostPercent}%`,
                metadata: {
                    type: 'mining_boost',
                    boostPercent: boostPercent,
                    duration: '24h'
                }
            });
        }

        /**
         * Get payment history
         * @param {number} limit - Maximum number of records to return
         * @returns {Array} List of payments
         */
        async getPaymentHistory(limit = 10) {
            this._ensureInitialized();
            this._ensureAuthenticated();

            try {
                const response = await this._apiRequest('GET', `/payments/history?user_id=${this.user.uid}&limit=${limit}`);
                return response.payments || [];
            } catch (error) {
                console.error('[PiForge] Failed to get payment history:', error);
                throw error;
            }
        }

        /**
         * Verify a payment
         * @param {string} paymentId - Payment ID to verify
         * @param {string} txid - Transaction hash
         * @returns {Object} Verification result
         */
        async verifyPayment(paymentId, txid) {
            this._ensureInitialized();

            try {
                const response = await this._apiRequest('POST', '/payments/verify', {
                    payment_id: paymentId,
                    tx_hash: txid
                });
                return response;
            } catch (error) {
                console.error('[PiForge] Payment verification failed:', error);
                throw error;
            }
        }

        /**
         * Get system status
         * @returns {Object} System status information
         */
        async getStatus() {
            this._ensureInitialized();

            try {
                const response = await this._apiRequest('GET', '/status');
                return response;
            } catch (error) {
                console.error('[PiForge] Failed to get status:', error);
                throw error;
            }
        }

        // Private methods

        _ensureInitialized() {
            if (!this.initialized) {
                throw new Error('PiForge SDK not initialized. Call PiForge.initialize() first.');
            }
        }

        _ensureAuthenticated() {
            if (!this.sessionId || !this.user) {
                throw new Error('User not authenticated. Call PiForge.authenticate() first.');
            }
        }

        async _apiRequest(method, endpoint, data = null) {
            const url = `${this.config.apiBase}${this.config.apiPath}${endpoint}`;
            
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (this.sessionId) {
                options.headers['X-Session-ID'] = this.sessionId;
            }

            if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
                options.body = JSON.stringify(data);
            }

            if (this.config.debug) {
                console.log(`[PiForge] API ${method} ${url}`, data);
            }

            const response = await fetch(url, options);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
                throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
            }

            return response.json();
        }

        async _onReadyForServerApproval(paymentId) {
            if (this.config.debug) {
                console.log('[PiForge] Payment ready for approval:', paymentId);
            }

            try {
                await this._apiRequest('POST', '/payments/approve', {
                    payment_id: paymentId
                });
                if (this.config.debug) {
                    console.log('[PiForge] Payment approved:', paymentId);
                }
            } catch (error) {
                console.error('[PiForge] Payment approval failed:', error);
                throw error;
            }
        }

        async _onReadyForServerCompletion(paymentId, txid) {
            if (this.config.debug) {
                console.log('[PiForge] Payment ready for completion:', paymentId, txid);
            }

            try {
                await this._apiRequest('POST', '/payments/complete', {
                    payment_id: paymentId,
                    tx_hash: txid
                });
                if (this.config.debug) {
                    console.log('[PiForge] Payment completed:', paymentId);
                }

                // Trigger resonance visualization
                this._triggerResonanceVisualization({ paymentId, txid });
            } catch (error) {
                console.error('[PiForge] Payment completion failed:', error);
                throw error;
            }
        }

        async _onPaymentCancelled(paymentId) {
            if (this.config.debug) {
                console.log('[PiForge] Payment cancelled:', paymentId);
            }

            try {
                await this._apiRequest('POST', '/payments/cancel', {
                    payment_id: paymentId
                });
            } catch (error) {
                console.error('[PiForge] Payment cancellation handling failed:', error);
            }
        }

        _onPaymentError(error, payment) {
            console.error('[PiForge] Payment error:', error, payment);
            
            // Emit custom event for error handling
            window.dispatchEvent(new CustomEvent('piforge:payment:error', {
                detail: { error, payment }
            }));
        }

        async _onIncompletePaymentFound(payment) {
            if (this.config.debug) {
                console.log('[PiForge] Incomplete payment found:', payment);
            }

            // Handle incomplete payment - this gets called during authentication
            // if there's a previous payment that wasn't completed
            return payment.paymentId;
        }

        _triggerResonanceVisualization(payment) {
            if (this.config.debug) {
                console.log('[PiForge] Triggering resonance visualization for payment:', payment);
            }

            // Emit custom event for resonance visualization
            window.dispatchEvent(new CustomEvent('piforge:resonance', {
                detail: { payment }
            }));
        }

        _calculateBoostCost(boostPercent) {
            // Cost calculation using configured rate
            return Math.round(boostPercent * this.BOOST_COST_PER_PERCENT * 100) / 100;
        }
    }

    // Create global PiForge instance
    window.PiForge = new PiForgeSDK();

    // Log SDK load
    console.log('[PiForge] SDK loaded. Call PiForge.initialize() to begin.');

})(window);
