'use strict';

const crypto = require('crypto');

const { createDefaultRegistry } = require('./adapters');
const { readConfig } = require('./config');
const { EvidenceStore } = require('./evidence-store');

const TRANSITIONS = {
  PREPARED: ['AUTHORIZED'],
  AUTHORIZED: ['SENT'],
  SENT: ['CONFIRMED'],
  CONFIRMED: ['VERIFIED'],
  VERIFIED: [],
};

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

class DeliveryService {
  constructor({
    adapters = createDefaultRegistry(),
    config = readConfig(),
    evidenceStore = new EvidenceStore(config.evidenceDir),
    env = process.env,
    now = () => new Date().toISOString(),
  } = {}) {
    this.adapters = adapters;
    this.config = config;
    this.evidenceStore = evidenceStore;
    this.env = env;
    this.now = now;
    this.deliveries = new Map();
  }

  prepare({ target, channel, message, messageReference, channelConfigReference = null }) {
    if (!target || !target.name || !target.channel) {
      throw new Error('Target name and target channel are required');
    }
    if (!channel || !message || !messageReference) {
      throw new Error('Channel, message, and message reference are required');
    }

    const adapter = this.adapters.get(channel);
    const delivery = {
      id: crypto.randomUUID(),
      state: 'PREPARED',
      target: {
        name: target.name,
        channel: target.channel,
      },
      channel,
      channelConfigReference,
      messageReference,
      messageSha256: sha256(message),
      authorizationReference: null,
      providerConfirmation: null,
      verificationReference: null,
      createdAtUtc: this.now(),
      updatedAtUtc: this.now(),
    };

    adapter.prepare(delivery);
    this.deliveries.set(delivery.id, delivery);
    this.record(delivery, 'PREPARED');
    return delivery;
  }

  authorize(deliveryId, authorizationReference) {
    if (!authorizationReference) {
      throw new Error('Authorization reference is required');
    }

    const delivery = this.get(deliveryId);
    this.transition(delivery, 'AUTHORIZED');
    delivery.authorizationReference = authorizationReference;
    this.record(delivery, 'AUTHORIZED');
    return delivery;
  }

  send(deliveryId) {
    const delivery = this.get(deliveryId);
    this.assertState(delivery, 'AUTHORIZED');
    const adapter = this.adapters.get(delivery.channel);
    const validation = adapter.validate(delivery, this.env);

    if (!validation.ok) {
      this.record(delivery, 'BLOCKED', {
        reason: validation.reason,
        missingCredentials: validation.credentials.missing,
      });
      return {
        delivered: false,
        reason: validation.reason,
      };
    }

    if (this.config.mode !== 'live' || !this.config.liveAcknowledgement) {
      this.record(delivery, 'BLOCKED', {
        reason: 'LIVE_DELIVERY_GATE_NOT_ENABLED',
        mode: this.config.mode,
      });
      return {
        delivered: false,
        reason: 'LIVE_DELIVERY_GATE_NOT_ENABLED',
      };
    }

    const result = adapter.deliver(delivery, this.env);

    if (!result.delivered) {
      this.record(delivery, 'BLOCKED', {
        reason: result.reason || 'DELIVERY_NOT_COMPLETED',
      });
      return result;
    }

    this.transition(delivery, 'SENT');
    delivery.providerConfirmation = adapter.captureEvidence(result);
    this.record(delivery, 'SENT', {
      providerConfirmation: delivery.providerConfirmation,
    });
    return result;
  }

  confirm(deliveryId, confirmation) {
    if (!confirmation || !confirmation.identifier) {
      throw new Error('Independent confirmation identifier is required');
    }

    const delivery = this.get(deliveryId);
    this.transition(delivery, 'CONFIRMED');
    delivery.providerConfirmation = confirmation;
    this.record(delivery, 'CONFIRMED', {
      confirmation,
    });
    return delivery;
  }

  verify(deliveryId, verificationReference) {
    if (!verificationReference) {
      throw new Error('Verification reference is required');
    }

    const delivery = this.get(deliveryId);
    this.transition(delivery, 'VERIFIED');
    delivery.verificationReference = verificationReference;
    this.record(delivery, 'VERIFIED', {
      verificationReference,
    });
    return delivery;
  }

  get(deliveryId) {
    const delivery = this.deliveries.get(deliveryId);

    if (!delivery) {
      throw new Error(`Delivery not found: ${deliveryId}`);
    }

    return delivery;
  }

  transition(delivery, nextState) {
    this.assertState(delivery, delivery.state);
    if (!TRANSITIONS[delivery.state].includes(nextState)) {
      throw new Error(`Invalid delivery transition: ${delivery.state} -> ${nextState}`);
    }

    delivery.state = nextState;
    delivery.updatedAtUtc = this.now();
  }

  assertState(delivery, expectedState) {
    if (delivery.state !== expectedState) {
      throw new Error(`Expected delivery state ${expectedState}; received ${delivery.state}`);
    }
  }

  record(delivery, event, details = {}) {
    const atUtc = this.now();
    delivery.updatedAtUtc = atUtc;

    return this.evidenceStore.write({
      schema: 'qpf.delivery_evidence.v1',
      event,
      atUtc,
      deliveryId: delivery.id,
      delivery,
      details,
    });
  }
}

module.exports = {
  DeliveryService,
  TRANSITIONS,
};
