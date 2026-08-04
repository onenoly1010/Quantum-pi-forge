'use strict';

const fs = require('fs');
const path = require('path');

function safeTimestamp(timestamp) {
  return timestamp.replace(/[:.]/g, '');
}

class EvidenceStore {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.stateDir = path.join(rootDir, 'state');
    this.sequence = 0;
  }

  write(event) {
    fs.mkdirSync(this.rootDir, { recursive: true });
    fs.mkdirSync(this.stateDir, { recursive: true });

    const sequence = String(++this.sequence).padStart(4, '0');
    const filename = `${safeTimestamp(event.atUtc)}-${sequence}-${event.deliveryId}-${event.event}.json`;
    const receiptPath = path.join(this.rootDir, filename);

    fs.writeFileSync(receiptPath, `${JSON.stringify(event, null, 2)}\n`);
    fs.writeFileSync(
      path.join(this.stateDir, `${event.deliveryId}.json`),
      `${JSON.stringify(event.delivery, null, 2)}\n`,
    );

    return receiptPath;
  }
}

module.exports = {
  EvidenceStore,
};
