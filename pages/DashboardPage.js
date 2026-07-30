const BasePage = require('./BasePage');

class DashboardPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.brandTitle = { css: '.brand-title' };
    this.neuralGauge = { css: '.neural-gauge' };
    this.bottomNavSimLab = { css: '.bottom-nav .nav-btn:nth-child(3)' };
    this.bottomNavMore = { css: '.bottom-nav .nav-btn:last-child' };
  }

  async openSimLab() {
    await this.click(this.bottomNavSimLab);
  }

  async openMoreMenu() {
    await this.click(this.bottomNavMore);
  }
}

module.exports = DashboardPage;
