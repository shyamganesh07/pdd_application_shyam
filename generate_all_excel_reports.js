import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { generateExcelReport as generateSelenium } from './selenium-tests/generate_excel.js';
import { generateAppiumExcelReport as generateAppium } from './appium-tests/generate_excel.js';
import { generateLoadExcelReport as generateLoad } from './load-tests/generate_excel.js';
import { generateSecurityExcelReport as generateSecurity } from './security-tests/generate_excel.js';

async function main() {
    console.log('Generating all 500+ test case Excel reports into root /excel folder...');
    
    const excelDir = path.join(__dirname, 'excel');
    if (!fs.existsSync(excelDir)) {
        fs.mkdirSync(excelDir, { recursive: true });
    }

    // 1. Run individual generators
    await generateSelenium();
    await generateAppium();
    await generateLoad();
    await generateSecurity();

    // 2. Copy XLSX files to root /excel/ directory with formatted names
    const copyMap = [
        {
            src: path.join(__dirname, 'selenium-tests/reports/Selenium_E2E_500_Test_Results.xlsx'),
            dest: path.join(excelDir, 'TradeMind_Selenium_500_Report.xlsx')
        },
        {
            src: path.join(__dirname, 'appium-tests/reports/Appium_E2E_500_Test_Results.xlsx'),
            dest: path.join(excelDir, 'TradeMind_Appium_500_Report.xlsx')
        },
        {
            src: path.join(__dirname, 'load-tests/reports/Load_E2E_500_Test_Results.xlsx'),
            dest: path.join(excelDir, 'TradeMind_LoadTest_500_Report.xlsx')
        },
        {
            src: path.join(__dirname, 'security-tests/reports/Security_E2E_500_Test_Results.xlsx'),
            dest: path.join(excelDir, 'TradeMind_Security_500_Report.xlsx')
        },
        {
            src: path.join(__dirname, 'selenium-tests/reports/Selenium_E2E_500_Test_Results.xlsx'),
            dest: path.join(excelDir, 'TradeMind_Master_E2E_Report.xlsx')
        }
    ];

    copyMap.forEach(item => {
        if (fs.existsSync(item.src)) {
            fs.copyFileSync(item.src, item.dest);
            console.log(`[OK] Created Excel Report: ${item.dest}`);
        } else {
            console.error(`[WARN] Source file not found: ${item.src}`);
        }
    });

    console.log('\n✅ All 500+ test case Excel files successfully created inside /excel folder!');
}

main().catch(err => {
    console.error('Error generating Excel reports:', err);
    process.exit(1);
});
