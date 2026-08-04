'use strict';

const { credentialStatus } = require('./config');

class NoSendAdapter {
  constructor({ channel, requiredSecrets = [] }) {
    this.channel = channel;
    this.requiredSecrets = requiredSecrets;
  }

  prepare(envelope) {
    return {
      channel: this.channel,
      deliveryId: envelope.id,
      messageReference: envelope.messageReference,
    };
  }

  validate(envelope, env) {
    const credentials = credentialStatus(this.requiredSecrets, env);

    if (this.channel === 'contact_form' && !envelope.channelConfigReference) {
      return {
        ok: false,
        reason: 'CONTACT_FORM_CONFIGURATION_REFERENCE_REQUIRED',
        credentials,
      };
    }

    return {
      ok: credentials.ready,
      reason: credentials.ready ? null : 'MISSING_REQUIRED_CREDENTIALS',
      credentials,
    };
  }

  deliver() {
    return {
      delivered: false,
      reason: 'NO_SEND_ADAPTER',
    };
  }

  captureEvidence() {
    return null;
  }
}

class AdapterRegistry {
  constructor(adapters = []) {
    this.adapters = new Map(adapters.map((adapter) => [adapter.channel, adapter]));
  }

  get(channel) {
    const adapter = this.adapters.get(channel);

    if (!adapter) {
      throw new Error(`No delivery adapter registered for channel: ${channel}`);
    }

    return adapter;
  }
}

function createDefaultRegistry() {
  return new AdapterRegistry([
    new NoSendAdapter({
      channel: 'x_public',
      requiredSecrets: [
        'TWITTER_API_KEY',
        'TWITTER_API_SECRET',
        'TWITTER_ACCESS_TOKEN',
        'TWITTER_ACCESS_SECRET',
      ],
    }),
    new NoSendAdapter({
      channel: 'email',
      requiredSecrets: ['EMAIL_PROVIDER', 'EMAIL_API_KEY', 'EMAIL_FROM'],
    }),
    new NoSendAdapter({
      channel: 'contact_form',
    }),
    new NoSendAdapter({
      channel: 'approved_other',
    }),
  ]);
}

module.exports = {
  AdapterRegistry,
  NoSendAdapter,
  createDefaultRegistry,
};
