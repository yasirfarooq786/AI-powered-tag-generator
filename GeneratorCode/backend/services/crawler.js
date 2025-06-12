const puppeteer = require('puppeteer');
const axios = require('axios');
const { JSDOM } = require('jsdom');

exports.crawlWebsite = async (url) => {
  try {
    // Try with axios first (faster for simple sites)
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      return response.data;
    } catch (axiosError) {
      console.log('Falling back to Puppeteer for dynamic content...');
      // If axios fails, use Puppeteer for JavaScript-rendered content
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      const content = await page.content();
      await browser.close();
      return content;
    }
  } catch (error) {
    console.error('Crawling error:', error);
    throw new Error('Failed to crawl website');
  }
};

