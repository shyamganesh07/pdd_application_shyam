/**
 * TradeMind AI - Enterprise Test Framework Central Configuration
 */
module.exports = {
  env: process.env.NODE_ENV || 'production',
  webUrl: process.env.WEB_URL || 'https://trademind-backend-vldj.onrender.com',
  baseUrl: process.env.BASE_URL || 'http://localhost:5173',
  
  browsers: {
    chrome: { name: 'chrome', headless: true },
    firefox: { name: 'firefox', headless: true },
    edge: { name: 'MicrosoftEdge', headless: true }
  },

  appium: {
    host: 'localhost',
    port: 4723,
    capabilities: {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': 'Android Emulator',
      'appium:app': './frontend/android/app/build/outputs/apk/debug/app-debug.apk',
      'appium:appPackage': 'com.trademind.ai',
      'appium:appActivity': '.MainActivity',
      'appium:autoGrantPermissions': true,
      'appium:newCommandTimeout': 300
    }
  },

  timeouts: {
    implicit: 10000,
    explicit: 15000,
    pageLoad: 30000,
    script: 30000
  },

  reporting: {
    outputDir: './reports',
    excelPath: './reports/excel/TradeMind_E2E_Comprehensive_Report.xlsx',
    zipPath: './TradeMind_Test_Results_Artifact.zip',
    failureScreenshotsDir: './reports/failures/screenshots',
    failureLogsDir: './reports/failures/logs'
  }
};
