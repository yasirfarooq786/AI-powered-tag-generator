function errorHandler(err, req, res, next) {
    console.error(err.stack);
    
    // Handle different types of errors
    if (err.message.includes('Failed to crawl website')) {
      return res.status(502).json({ 
        error: 'Website crawling failed. The site may be blocking our crawler or may not be accessible.' 
      });
    }
    
    if (err.message.includes('AI service error')) {
      return res.status(503).json({ 
        error: 'ALT text generation service is currently unavailable. Please try again later.' 
      });
    }
    
    // Default error response
    res.status(500).json({ 
      error: 'Something went wrong on our end. Please try again later.' 
    });
  }
  
  module.exports = errorHandler;