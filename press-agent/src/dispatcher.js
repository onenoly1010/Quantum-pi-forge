'use strict';

const logger = require('./logger');

async function dispatch(message, channels = {}) {
  const results = [];

  for (const [name, bot] of Object.entries(channels)) {
    if (!bot || typeof bot.send !== 'function') {
      results.push({ channel: name, ok: false, error: 'bot.send is not available' });
      continue;
    }

    try {
      await bot.send(message);
      results.push({ channel: name, ok: true });
    } catch (error) {
      const detail = error && error.message ? error.message : String(error);
      logger.error(`Dispatch failed for ${name}: ${detail}`);
      results.push({ channel: name, ok: false, error: detail });
    }
  }

  return results;
}

module.exports = {
  dispatch,
};
