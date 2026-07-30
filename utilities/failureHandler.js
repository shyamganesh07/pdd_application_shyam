const fs = require('fs');
const path = require('path');
const config = require('../config/framework.config');
const logger = require('./logger');

class FailureHandler {
  static async handleFailure(driver, testName, error) {
    logger.error(`Test Failure Detected in "${testName}": ${error.message}`);

    const timestamp = Date.now();
    const cleanTestName = testName.replace(/[^a-zA-Z0-9_]/g, '_');
    
    const screenshotDir = config.reporting.failureScreenshotsDir;
    const logsDir = config.reporting.failureLogsDir;

    if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

    const screenshotPath = path.join(screenshotDir, `${cleanTestName}_${timestamp}.png`);
    const logPath = path.join(logsDir, `${cleanTestName}_${timestamp}.json`);

    let currentUrl = 'N/A';
    let browserLogs = [];

    if (driver) {
      try {
        currentUrl = await driver.getCurrentUrl();
        const screenshotData = await driver.takeScreenshot();
        fs.writeFileSync(screenshotPath, screenshotData, 'base64');
        logger.info(`Screenshot captured: ${screenshotPath}`);
      } catch (e) {
        logger.warn(`Could not capture screenshot: ${e.message}`);
      }

      try {
        if (driver.manage && driver.manage().logs) {
          browserLogs = await driver.manage().logs().get('browser');
        }
      } catch {}
    }

    const failureDetails = {
      testName,
      timestamp: new Date().toISOString(),
      url: currentUrl,
      error: {
        message: error.message,
        stack: error.stack
      },
      browserLogs,
      screenshotPath
    };

    fs.writeFileSync(logPath, JSON.stringify(failureDetails, null, 2), 'utf-8');
    logger.info(`Failure details saved: ${logPath}`);

    return {
      screenshotPath,
      logPath,
      url: currentUrl
    };
  }
}

module.exports = FailureHandler;
