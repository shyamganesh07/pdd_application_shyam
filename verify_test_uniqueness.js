import { TEST_MODULES } from './selenium-tests/generate_excel.js';
import { APPIUM_MODULES } from './appium-tests/generate_excel.js';
import { LOAD_MODULES } from './load-tests/generate_excel.js';
import { SECURITY_MODULES } from './security-tests/generate_excel.js';

function auditUniqueness(suiteName, modules) {
    const titles = new Set();
    const ids = new Set();
    let totalCount = 0;
    let duplicateTitles = [];
    let duplicateIds = [];

    modules.forEach(mod => {
        mod.scenarios.forEach((sc, idx) => {
            totalCount++;
            const testId = `${mod.prefix}_${(idx + 1).toString().padStart(3, '0')}`;
            
            if (titles.has(sc)) {
                duplicateTitles.push(sc);
            } else {
                titles.add(sc);
            }

            if (ids.has(testId)) {
                duplicateIds.push(testId);
            } else {
                ids.add(testId);
            }
        });
    });

    console.log(`======================================================`);
    console.log(`🔍 Auditing Uniqueness for Suite: [${suiteName}]`);
    console.log(`======================================================`);
    console.log(`- Total Test Cases Scanned: ${totalCount}`);
    console.log(`- Unique Test IDs Count: ${ids.size}`);
    console.log(`- Unique Test Titles Count: ${titles.size}`);
    console.log(`- Duplicate Titles Found: ${duplicateTitles.length}`);
    console.log(`- Duplicate IDs Found: ${duplicateIds.length}`);

    if (duplicateTitles.length > 0) {
        console.error(`❌ Found Duplicate Titles in ${suiteName}:`, duplicateTitles);
    }
    if (duplicateIds.length > 0) {
        console.error(`❌ Found Duplicate IDs in ${suiteName}:`, duplicateIds);
    }

    const isUnique = duplicateTitles.length === 0 && duplicateIds.length === 0 && totalCount === 500;
    console.log(`Result: ${isUnique ? '✅ 100% UNIQUE & VALIDATED' : '❌ DUPLICATES DETECTED'}\n`);
    
    return { suiteName, totalCount, uniqueTitles: titles.size, uniqueIds: ids.size, isUnique, allTitles: Array.from(titles) };
}

function verifyGlobalCrossSuiteUniqueness(suiteResults) {
    console.log(`======================================================`);
    console.log(`🌐 Global Cross-Suite Test Case Uniqueness Verification`);
    console.log(`======================================================`);

    const globalTitles = new Set();
    let grandTotal = 0;
    let crossSuiteDuplicates = [];

    suiteResults.forEach(res => {
        grandTotal += res.totalCount;
        res.allTitles.forEach(t => {
            if (globalTitles.has(t)) {
                crossSuiteDuplicates.push(t);
            } else {
                globalTitles.add(t);
            }
        });
    });

    console.log(`- Total Combined Test Cases (4 Suites): ${grandTotal}`);
    console.log(`- Unique Test Scenarios Across Project: ${globalTitles.size}`);
    console.log(`- Cross-Suite Duplicates Found: ${crossSuiteDuplicates.length}`);

    if (crossSuiteDuplicates.length === 0 && grandTotal === 2000 && globalTitles.size === 2000) {
        console.log(`\n🎉 CERTIFIED AUDIT RESULT: ALL 2,000 TEST CASES ACROSS ALL 4 EXCEL REPORTS ARE 100% UNIQUE & Tailored to TradeMind PWA!`);
    } else {
        console.error(`❌ Cross-suite duplicates found:`, crossSuiteDuplicates);
    }
}

async function runAudit() {
    const r1 = auditUniqueness("Selenium E2E Web Test Suite", TEST_MODULES);
    const r2 = auditUniqueness("Appium Mobile Frontend Test Suite", APPIUM_MODULES);
    const r3 = auditUniqueness("Load & Performance Test Suite", LOAD_MODULES);
    const r4 = auditUniqueness("DevSecOps Security Test Suite", SECURITY_MODULES);

    verifyGlobalCrossSuiteUniqueness([r1, r2, r3, r4]);
}

runAudit();
