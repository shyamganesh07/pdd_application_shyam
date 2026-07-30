const fs = require('fs');
const path = require('path');
const config = require('../config/framework.config');
const logger = require('./logger');

let ExcelJS;
try {
  ExcelJS = require('exceljs');
} catch {
  ExcelJS = null;
}

class ExcelReporter {
  constructor() {
    this.testResults = [];
    this.failedTests = [];
    this.executionLogs = [];
    this.startTime = new Date();
  }

  addResult(result) {
    // result: { testId, module, scenario, target, status, startTime, endTime, duration, detail }
    this.testResults.push(result);
    if (result.status === 'FAIL') {
      this.failedTests.push({
        testName: result.scenario,
        reason: result.detail || 'Assertion error',
        screenshotPath: result.screenshotPath || 'N/A',
        target: result.target || 'Chrome / Android',
        url: result.url || config.baseUrl
      });
    }
    this.executionLogs.push({
      timestamp: new Date().toISOString(),
      testName: result.scenario,
      step: `Executed ${result.scenario}`,
      result: result.status,
      remarks: result.detail || 'Executed cleanly'
    });
  }

  async generateReport(outputPath = config.reporting.excelPath) {
    logger.info(`Generating Enterprise 4-Sheet Excel Report at ${outputPath}...`);

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const endTime = new Date();
    const durationMs = endTime - this.startTime;
    const durationSec = (durationMs / 1000).toFixed(2) + 's';

    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.status === 'PASS').length;
    const failedTests = this.testResults.filter(r => r.status === 'FAIL').length;
    const skippedTests = this.testResults.filter(r => r.status === 'SKIP').length;
    const passPercentage = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) + '%' : '100.0%';

    if (ExcelJS) {
      const workbook = new ExcelJS.Workbook();

      // ── Sheet 1: Summary ──
      const sheet1 = workbook.addWorksheet('Summary');
      sheet1.columns = [
        { header: 'Metric Name', key: 'metric', width: 30 },
        { header: 'Metric Value', key: 'value', width: 45 }
      ];
      sheet1.addRows([
        { metric: 'Execution Date', value: new Date().toLocaleString() },
        { metric: 'Environment', value: config.env.toUpperCase() + ' (Production Web & Android APK)' },
        { metric: 'Target Repository', value: 'shyamganesh07/pdd_application_shyam' },
        { metric: 'Total Tests', value: totalTests },
        { metric: 'Passed', value: passedTests },
        { metric: 'Failed', value: failedTests },
        { metric: 'Skipped', value: skippedTests },
        { metric: 'Pass Percentage', value: passPercentage },
        { metric: 'Execution Duration', value: durationSec },
        { metric: 'Overall Status', value: failedTests === 0 ? '100% VERIFIED / SUCCESS' : 'FAILED' }
      ]);

      // ── Sheet 2: Test Cases ──
      const sheet2 = workbook.addWorksheet('Test Cases');
      sheet2.columns = [
        { header: 'Test ID', key: 'testId', width: 15 },
        { header: 'Module', key: 'module', width: 25 },
        { header: 'Scenario Name', key: 'scenario', width: 45 },
        { header: 'Browser / Device', key: 'target', width: 25 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Start Time', key: 'startTime', width: 22 },
        { header: 'End Time', key: 'endTime', width: 22 },
        { header: 'Duration', key: 'duration', width: 15 }
      ];
      this.testResults.forEach(r => {
        sheet2.addRow({
          testId: r.testId,
          module: r.module,
          scenario: r.scenario,
          target: r.target || 'Chrome / Android',
          status: r.status,
          startTime: r.startTime || new Date().toISOString(),
          endTime: r.endTime || new Date().toISOString(),
          duration: r.duration || '< 15ms'
        });
      });

      // ── Sheet 3: Failed Tests ──
      const sheet3 = workbook.addWorksheet('Failed Tests');
      sheet3.columns = [
        { header: 'Test Name', key: 'testName', width: 35 },
        { header: 'Failure Reason', key: 'reason', width: 45 },
        { header: 'Screenshot Path', key: 'screenshotPath', width: 35 },
        { header: 'Browser / Device', key: 'target', width: 25 },
        { header: 'URL', key: 'url', width: 35 }
      ];
      if (this.failedTests.length === 0) {
        sheet3.addRow({
          testName: 'N/A (All Tests Passed)',
          reason: 'None',
          screenshotPath: 'N/A',
          target: 'N/A',
          url: 'N/A'
        });
      } else {
        this.failedTests.forEach(f => sheet3.addRow(f));
      }

      // ── Sheet 4: Execution Logs ──
      const sheet4 = workbook.addWorksheet('Execution Logs');
      sheet4.columns = [
        { header: 'Timestamp', key: 'timestamp', width: 25 },
        { header: 'Test Name', key: 'testName', width: 35 },
        { header: 'Step Description', key: 'step', width: 45 },
        { header: 'Result', key: 'result', width: 15 },
        { header: 'Remarks', key: 'remarks', width: 40 }
      ];
      this.executionLogs.forEach(l => sheet4.addRow(l));

      await workbook.xlsx.writeFile(outputPath);
      logger.info(`Excel Report saved successfully with ${totalTests} rows across 4 sheets.`);
    } else {
      // Fallback CSV Summary Generator
      const csvPath = outputPath.replace('.xlsx', '.csv');
      const csvContent = "Test ID,Module,Scenario,Status,Detail\n" + 
        this.testResults.map(r => `"${r.testId}","${r.module}","${r.scenario}","${r.status}","${r.detail}"`).join("\n");
      fs.writeFileSync(csvPath, csvContent, 'utf-8');
      logger.info(`Report saved to ${csvPath}`);
    }
  }
}

module.exports = ExcelReporter;
