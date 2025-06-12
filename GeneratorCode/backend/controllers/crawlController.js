const { crawlWebsite: crawl } = require('../services/crawler');
const { extractImages } = require('../services/imageProcessor');

exports.crawlWebsite = async (req, res, next) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Crawl the website
    const htmlContent = await crawl(url);
    
    // Extract images
    const images = extractImages(htmlContent, url);
    
    res.json({ images });
  } catch (error) {
    next(error);
  }
};