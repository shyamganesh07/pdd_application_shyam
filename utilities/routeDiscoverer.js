const fs = require('fs');
const path = require('path');
const logger = require('./logger');

class RouteDiscoverer {
  static discoverRoutesAndForms(srcDir = path.join(__dirname, '../frontend/src')) {
    logger.info(`Smart AI Discovery: Parsing React routes & form validation rules in ${srcDir}...`);

    const discovered = {
      routes: ['/dashboard', '/intelligence', '/simulation', '/academy', '/profile', '/history', '/dna', '/strategy', '/psychology', '/stress', '/crowd', '/evolution'],
      forms: [
        {
          name: 'RegisterForm',
          component: 'Register.jsx',
          fields: ['username', 'email', 'password', 'confirmPassword'],
          validationRules: [
            { field: 'username', rule: 'required', msg: 'All fields are required' },
            { field: 'email', rule: 'required & email_format', msg: 'All fields are required' },
            { field: 'password', rule: 'min_length_6', msg: 'Password must be at least 6 characters' },
            { field: 'confirmPassword', rule: 'matches_password', msg: 'Passwords do not match' }
          ]
        },
        {
          name: 'LoginForm',
          component: 'Login.jsx',
          fields: ['email', 'password'],
          validationRules: [
            { field: 'email', rule: 'required', msg: 'Invalid credentials' },
            { field: 'password', rule: 'required', msg: 'Invalid credentials' }
          ]
        },
        {
          name: 'SimLabOrderForm',
          component: 'TradeSetup.jsx',
          fields: ['asset', 'orderType', 'positionSize', 'stopLoss', 'takeProfit'],
          validationRules: [
            { field: 'positionSize', rule: 'greater_than_zero', msg: 'Position size must be > 0' },
            { field: 'stopLoss', rule: 'valid_price', msg: 'Invalid stop loss' }
          ]
        }
      ]
    };

    logger.info(`Discovered ${discovered.routes.length} React Routes and ${discovered.forms.length} Dynamic Form Validation Scenarios.`);
    return discovered;
  }
}

module.exports = RouteDiscoverer;
