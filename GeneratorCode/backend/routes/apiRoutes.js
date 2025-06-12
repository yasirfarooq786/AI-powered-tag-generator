const express = require('express');
const router = express.Router();
const crawlController = require('../controllers/crawlController');
const aiController = require('../controllers/aiController');

// Crawl endpoints
router.post('/crawl', crawlController.crawlWebsite);

// AI endpoints
router.post('/generate-alt', aiController.generateAltText);

module.exports = router;