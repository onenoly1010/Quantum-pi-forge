'use strict';

const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { afterEach, describe, it } = require('node:test');

const { AdapterRegistry, NoSendAdapter } = require('../delivery/adapters');
const { EvidenceStore } = require('../delivery/evidence-store');
const { DeliveryService } = require('../delivery/service');

const tempDirs = [];

function createService({ adapters, config, env = {} } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qpf-delivery-'));
  tempDirs.push(dir);
  const resolvedConfig = {
    mode: 'disabled',
    evidenceDir: dir,
    liveAcknowledgement: false,
    ...config,
  };

  return new DeliveryService({
    adapters,
    config: resolvedConfig,
    env,
    evidenceStore: new EvidenceStore(dir),
    now: () => '2026-07-31T23:55:00.000Z',
  });
}

function preparedDelivery(service, channel = 'email') {
  return service.prepare({
    target: {
      name: 'Example Organization',
      channel: 'https://example.test/contact',
    },
    channel,
    message: 'Evidence-first architecture review invitation',
    messageReference: 'docs/outreach/example.md',
  });
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe('DeliveryService', () => {
  it('records PREPARED and AUTHORIZED evidence without retaining the message body', () => {
    const service = createService();
    const delivery = preparedDelivery(service);
    service.authorize(delivery.id, 'receipts/outreach/approval.json');

    const receipts = fs.readdirSync(service.config.evidenceDir);
    const preparedReceipt = JSON.parse(fs.readFileSync(
      path.join(service.config.evidenceDir, receipts.find((name) => name.includes('-PREPARED.json'))),
      'utf8',
    ));

    assert.strictEqual(delivery.state, 'AUTHORIZED');
    assert.ok(preparedReceipt.delivery.messageSha256);
    assert.strictEqual(JSON.stringify(preparedReceipt).includes('Evidence-first architecture review invitation'), false);
  });

  it('blocks delivery when required credentials are missing without claiming SENT', () => {
    const service = createService();
    const delivery = preparedDelivery(service);
    service.authorize(delivery.id, 'receipts/outreach/approval.json');

    const result = service.send(delivery.id);

    assert.strictEqual(result.delivered, false);
    assert.strictEqual(result.reason, 'MISSING_REQUIRED_CREDENTIALS');
    assert.strictEqual(delivery.state, 'AUTHORIZED');
  });

  it('requires a live gate before invoking an adapter', () => {
    const adapter = new NoSendAdapter({
      channel: 'email',
      requiredSecrets: ['EMAIL_PROVIDER', 'EMAIL_API_KEY', 'EMAIL_FROM'],
    });
    const service = createService({
      adapters: new AdapterRegistry([adapter]),
      env: {
        EMAIL_PROVIDER: 'configured',
        EMAIL_API_KEY: 'configured',
        EMAIL_FROM: 'configured',
      },
    });
    const delivery = preparedDelivery(service);
    service.authorize(delivery.id, 'receipts/outreach/approval.json');

    const result = service.send(delivery.id);

    assert.strictEqual(result.delivered, false);
    assert.strictEqual(result.reason, 'LIVE_DELIVERY_GATE_NOT_ENABLED');
    assert.strictEqual(delivery.state, 'AUTHORIZED');
  });

  it('records SENT, CONFIRMED, and VERIFIED only through valid transitions', () => {
    const adapter = {
      channel: 'email',
      prepare() {},
      validate() {
        return { ok: true, credentials: { missing: [] } };
      },
      deliver() {
        return { delivered: true, providerId: 'provider-message-1' };
      },
      captureEvidence(result) {
        return { identifier: result.providerId };
      },
    };
    const service = createService({
      adapters: new AdapterRegistry([adapter]),
      config: {
        mode: 'live',
        liveAcknowledgement: true,
      },
    });

    const delivery = preparedDelivery(service);
    service.authorize(delivery.id, 'receipts/outreach/approval.json');
    service.send(delivery.id);
    service.confirm(delivery.id, { identifier: 'provider-message-1' });
    service.verify(delivery.id, 'receipts/outreach/verification.json');

    assert.strictEqual(delivery.state, 'VERIFIED');
  });
});
