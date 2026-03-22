const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Function to ensure the directory exists
const ensureDirectoryExists = (dirPath) => {
    try {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Directory ${dirPath} created or already exists.`);
    } catch (error) {
        console.error(`Failed to create directory ${dirPath}:`, error);
    }
};

// Enhanced logging function
const log = (message) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] - ${message}`);
};

// Main function to take a screenshot
const takeScreenshot = async (url, options = {}) => {
    const timeout = options.timeout || 30000; // Default to 30 seconds
    const screenshotDir = options.directory || 'screenshots';
    const screenshotPath = path.join(screenshotDir, options.filename || 'screenshot.png');

    try {
        log(`Starting screenshot for ${url}...`);
        ensureDirectoryExists(screenshotDir);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout });

        await page.screenshot({ path: screenshotPath });
        log(`Screenshot taken: ${screenshotPath}`);
    } catch (error) {
        log(`Error taking screenshot of ${url}: ${error.message}`);
    }
};

// Example usage
// takeScreenshot('https://example.com', { directory: 'screenshots', filename: 'example.png', timeout: 20000 });

module.exports = takeScreenshot;
