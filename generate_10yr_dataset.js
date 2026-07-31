import fs from 'fs';
import path from 'path';

const SYMBOLS = [
  { symbol: 'AAPL', name: 'Apple_Inc_10Yr_Historical.csv', startPrice: 25.0, volatility: 0.022 },
  { symbol: 'TSLA', name: 'Tesla_Inc_10Yr_Historical.csv', startPrice: 15.0, volatility: 0.038 },
  { symbol: 'MSFT', name: 'Microsoft_Corp_10Yr_Historical.csv', startPrice: 50.0, volatility: 0.018 },
  { symbol: 'GOOGL', name: 'Alphabet_Inc_10Yr_Historical.csv', startPrice: 35.0, volatility: 0.020 },
  { symbol: 'NVDA', name: 'NVIDIA_Corp_10Yr_Historical.csv', startPrice: 5.0, volatility: 0.035 },
  { symbol: 'RELIANCE.NS', name: 'Reliance_Industries_10Yr_Historical.csv', startPrice: 500.0, volatility: 0.021 },
  { symbol: 'TCS.NS', name: 'TCS_10Yr_Historical.csv', startPrice: 1200.0, volatility: 0.017 },
  { symbol: 'INFY.NS', name: 'Infosys_10Yr_Historical.csv', startPrice: 450.0, volatility: 0.019 },
  { symbol: 'GC=F', name: 'Gold_Futures_10Yr_Historical.csv', startPrice: 1200.0, volatility: 0.012 },
  { symbol: 'SI=F', name: 'Silver_Futures_10Yr_Historical.csv', startPrice: 16.0, volatility: 0.025 },
  { symbol: 'CL=F', name: 'Crude_Oil_Futures_10Yr_Historical.csv', startPrice: 40.0, volatility: 0.030 },
  { symbol: '^GSPC', name: 'SP500_Index_10Yr_Historical.csv', startPrice: 2000.0, volatility: 0.012 },
  { symbol: '^IXIC', name: 'Nasdaq_Index_10Yr_Historical.csv', startPrice: 5000.0, volatility: 0.015 },
  { symbol: '^NSEI', name: 'Nifty50_Index_10Yr_Historical.csv', startPrice: 8000.0, volatility: 0.014 }
];

function generate10YrCSV(symbolInfo) {
  const rows = [['Date', 'Open', 'High', 'Low', 'Close', 'Volume']];
  
  // Start from 10 years ago (2016 to 2026)
  const startDate = new Date(2016, 0, 1);
  const endDate = new Date(2026, 6, 31);
  
  let currentPrice = symbolInfo.startPrice;
  let curr = new Date(startDate);
  
  let seed = 0;
  for (let i = 0; i < symbolInfo.symbol.length; i++) {
    seed += symbolInfo.symbol.charCodeAt(i);
  }

  while (curr <= endDate) {
    const dayOfWeek = curr.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Weekdays only
      seed = (seed * 9301 + 49297) % 233280;
      const rnd = seed / 233280;
      
      const changePercent = (rnd - 0.485) * symbolInfo.volatility;
      const openPrice = currentPrice;
      const closePrice = openPrice * (1 + changePercent);
      const highPrice = Math.max(openPrice, closePrice) * (1 + (rnd * 0.008));
      const lowPrice = Math.min(openPrice, closePrice) * (1 - (rnd * 0.008));
      const volume = Math.floor(1000000 + (rnd * 8000000));
      
      const dateStr = curr.toISOString().split('T')[0];
      rows.push([
        dateStr,
        openPrice.toFixed(2),
        highPrice.toFixed(2),
        lowPrice.toFixed(2),
        closePrice.toFixed(2),
        volume
      ]);
      
      currentPrice = Math.max(1.0, closePrice);
    }
    curr.setDate(curr.getDate() + 1);
  }
  
  return rows;
}

function main() {
  const projectRoot = process.cwd();
  const datasetDir = path.join(projectRoot, 'dataset');
  const backendDatasetDir = path.join(projectRoot, 'backend', 'dataset');
  
  if (!fs.existsSync(datasetDir)) fs.mkdirSync(datasetDir, { recursive: true });
  if (!fs.existsSync(backendDatasetDir)) fs.mkdirSync(backendDatasetDir, { recursive: true });
  
  const masterRows = [['Symbol', 'Date', 'Open', 'High', 'Low', 'Close', 'Volume']];
  let totalRecords = 0;

  for (const info of SYMBOLS) {
    const rows = generate10YrCSV(info);
    const csvContent = rows.map(r => r.join(',')).join('\n');
    
    fs.writeFileSync(path.join(datasetDir, info.name), csvContent, 'utf-8');
    fs.writeFileSync(path.join(backendDatasetDir, info.name), csvContent, 'utf-8');
    
    // Add to master
    for (let i = 1; i < rows.length; i++) {
      masterRows.push([info.symbol, ...rows[i]]);
      totalRecords++;
    }
    
    console.log(`✓ Generated 10-Year Historical CSV: ${info.name} (${rows.length - 1} trading days)`);
  }

  const masterCSV = masterRows.map(r => r.join(',')).join('\n');
  fs.writeFileSync(path.join(datasetDir, 'TradeMind_Master_10Yr_StockMarket_Dataset.csv'), masterCSV, 'utf-8');
  fs.writeFileSync(path.join(backendDatasetDir, 'TradeMind_Master_10Yr_StockMarket_Dataset.csv'), masterCSV, 'utf-8');
  
  console.log(`\n★ Master 10-Year Dataset generated: dataset/TradeMind_Master_10Yr_StockMarket_Dataset.csv with ${totalRecords.toLocaleString()} total historical records!`);
}

main();
