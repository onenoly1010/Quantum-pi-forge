/**
 * Quantum Pi Forge Press Agent - Logging Module
 * 
 * Provides structured logging with in-memory log retrieval
 * for testing and debugging purposes.
 */

const winston = require('winston');
const { Writable } = require('stream');

// In-memory log storage for API access
const logBuffer = [];
const MAX_LOG_BUFFER = 1000;

// Custom format for console output
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `${timestamp} [${level}]: ${message}${metaStr}`;
    })
);

// JSON format for structured logging
const jsonFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
);

// Custom writable stream to store logs in memory
const memoryStream = new Writable({
    write(chunk, encoding, callback) {
        try {
            const logEntry = JSON.parse(chunk.toString());
            logBuffer.push({
                timestamp: logEntry.timestamp || new Date().toISOString(),
                level: logEntry.level,
                message: logEntry.message,
                service: logEntry.service,
                ...logEntry
            });
            
            // Keep buffer size manageable
            if (logBuffer.length > MAX_LOG_BUFFER) {
                logBuffer.shift();
            }
        } catch (e) {
            // If parsing fails, store raw message
            logBuffer.push({
                timestamp: new Date().toISOString(),
                level: 'info',
                message: chunk.toString()
            });
        }
        callback();
    }
});

// Create Winston logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: jsonFormat,
    defaultMeta: { service: 'press-agent' },
    transports: [
        new winston.transports.Console({
            format: consoleFormat
        }),
        new winston.transports.Stream({
            stream: memoryStream,
            format: jsonFormat
        })
    ]
});

// Add file transport in production
if (process.env.NODE_ENV === 'production') {
    logger.add(new winston.transports.File({ 
        filename: 'logs/error.log', 
        level: 'error',
        format: jsonFormat
    }));
    logger.add(new winston.transports.File({ 
        filename: 'logs/combined.log',
        format: jsonFormat
    }));
}

/**
 * Get logs from in-memory buffer
 * @param {string} level - Minimum log level to retrieve
 * @param {number} limit - Maximum number of logs to return
 * @returns {Array} Array of log entries
 */
function getLogs(level = 'info', limit = 100) {
    const levels = ['error', 'warn', 'info', 'debug'];
    const minLevelIndex = levels.indexOf(level);
    
    return logBuffer
        .filter(log => {
            const logLevelIndex = levels.indexOf(log.level);
            return logLevelIndex !== -1 && logLevelIndex <= minLevelIndex;
        })
        .slice(-limit)
        .reverse();
}

// Extend logger with getLogs method
logger.getLogs = getLogs;

module.exports = logger;
