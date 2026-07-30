const config = require('../config/framework.config');
const logger = require('../utilities/logger');

class BasePage {
  constructor(driver) {
    this.driver = driver;
    this.timeout = config.timeouts.explicit;
  }

  async navigateTo(url) {
    logger.info(`Navigating to URL: ${url}`);
    if (this.driver && this.driver.get) {
      await this.driver.get(url);
    }
  }

  async waitForElement(locator, timeout = this.timeout) {
    logger.debug(`Waiting for element: ${locator}`);
    if (this.driver && this.driver.wait) {
      return await this.driver.wait(this.driver.until.elementLocated(locator), timeout);
    }
    return true;
  }

  async click(locator) {
    logger.info(`Clicking element: ${locator}`);
    if (this.driver && this.driver.findElement) {
      const elem = await this.driver.findElement(locator);
      await elem.click();
    }
  }

  async type(locator, text) {
    logger.info(`Typing into ${locator}: ${text}`);
    if (this.driver && this.driver.findElement) {
      const elem = await this.driver.findElement(locator);
      await elem.clear();
      await elem.sendKeys(text);
    }
  }

  async getText(locator) {
    if (this.driver && this.driver.findElement) {
      const elem = await this.driver.findElement(locator);
      return await elem.getText();
    }
    return 'Mock Text';
  }

  async scrollToElement(locator) {
    if (this.driver && this.driver.executeScript) {
      const elem = await this.driver.findElement(locator);
      await this.driver.executeScript('arguments[0].scrollIntoView(true);', elem);
    }
  }

  async executeScript(script, ...args) {
    if (this.driver && this.driver.executeScript) {
      return await this.driver.executeScript(script, ...args);
    }
  }
}

module.exports = BasePage;
