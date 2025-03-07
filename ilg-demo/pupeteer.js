import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const expirationSelectionNumber = '3';
const monthNumber = '2';
const yearNumber = '2022';
const countyCode = '056';  // Broward - 006, St. Lucie - 056
const insurerCode = '0';   // All insurers

// Launch Puppeteer and get the page
async function getDriver() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://dwcdataportal.fldfs.com/ProofOfCoverage.aspx");
  return { browser, page };
}

// Select expiration date option
async function ExpirationDate(page) {
  await page.waitForSelector('#ContentPlaceHolder1_ddlSearchOptions');
  await page.select('#ContentPlaceHolder1_ddlSearchOptions', expirationSelectionNumber);
}

// Select year
async function selectYear(page) {
  await page.waitForSelector('#ContentPlaceHolder1_ddYear');
  await page.select('#ContentPlaceHolder1_ddYear', yearNumber);
}

// Select month
async function selectMonth(page) {
  await page.waitForSelector('#ContentPlaceHolder1_ddMonth');
  await page.select('#ContentPlaceHolder1_ddMonth', monthNumber);
}

// Select county
async function selectCounty(page) {
  await page.waitForSelector('#ContentPlaceHolder1_ddCounty');
  await page.select('#ContentPlaceHolder1_ddCounty', countyCode);
}

// Select insurer
async function selectInsurer(page) {
  await page.waitForSelector('#ContentPlaceHolder1_ddInsurer');
  await page.select('#ContentPlaceHolder1_ddInsurer', insurerCode);
}

// Click search button
async function clickButton(page) {
  await page.waitForSelector('#ContentPlaceHolder1_btnSearch2');
  await page.click('#ContentPlaceHolder1_btnSearch2');
}

// Extract table data and save as CSV
async function getTable(page) {
  await page.waitForSelector('#ContentPlaceHolder1_DataGrid_POC');  // Wait for the table

  const tableData = await page.evaluate(() => {
    const rows = document.querySelectorAll('#ContentPlaceHolder1_DataGrid_POC tr');
    const data = [];

    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      const rowData = [];

      cells.forEach(cell => {
        rowData.push(cell.innerText.trim());
      });

      if (rowData.length > 0) {
        data.push(rowData);
      }
    });

    return data;
  });

  const columnNames = ['Employer Address', 'Policy Number', 'Policy Expiration Date', 'Employer Name', 'Named Insured', 'Class Code'];
  const formattedData = tableData.map(row => {
    return {
      'Employer Address': row[0] || '',
      'Policy Number': row[1] || '',
      'Policy Expiration Date': row[2] || '',
      'Employer Name': row[3] || '',
      'Named Insured': row[4] || '',
      'Class Code': row[5] || ''
    };
  });

  const filePath = path.join(process.cwd(), 'public/csvs', 'February.csv');
  const csvData = formattedData.map(row => Object.values(row).join(',')).join('\n');
  fs.writeFileSync(filePath, `${columnNames.join(',')}\n${csvData}`);

  return filePath;
}

// API route to trigger Puppeteer scraping
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { browser, page } = await getDriver();

      await ExpirationDate(page);
      await selectYear(page);
      await selectMonth(page);
      await selectCounty(page);
      await selectInsurer(page);
      await clickButton(page);
      const filePath = await getTable(page);

      await browser.close();

      res.status(200).json({ message: 'CSV generated successfully', filePath });
    } catch (error) {
      res.status(500).json({ error: 'Error scraping data', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
