const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.emailInput = { id: 'email' };
    this.passwordInput = { id: 'password' };
    this.submitBtn = { css: 'button[type="submit"]' };
    this.errorBanner = { css: '.auth-error' };
    this.registerTab = { css: '.auth-tab:nth-child(2)' };
  }

  async login(email, password) {
    await this.type(this.emailInput, email);
    await this.type(this.passwordInput, password);
    await this.click(this.submitBtn);
  }

  async switchToRegister() {
    await this.click(this.registerTab);
  }
}

module.exports = LoginPage;
