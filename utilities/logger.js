const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, 'framework_execution.log');

function formatMessage(level, message) {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
}

const logger = {
  info: (msg) => {
    const formatted = formatMessage('info', msg);
    console.log(formatted);
    fs.appendFileSync(logFile, formatted + '\n');
  },
  warn: (msg) => {
    const formatted = formatMessage('warn', msg);
    console.warn(formatted);
    fs.appendFileSync(logFile, formatted + '\n');
  },
  error: (msg) => {
    const formatted = formatMessage('error', msg);
    console.error(formatted);
    fs.appendFileSync(logFile, formatted + '\n');
  },
  debug: (msg) => {
    const formatted = formatMessage('debug', msg);
    fs.appendFileSync(logFile, formatted + '\n');
  }
};

module.exports = logger;
