const cheerio = require('cheerio');
const { JSDOM } = require('jsdom');

exports.extractImages = (htmlContent, baseUrl) => {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  const images = Array.from(document.querySelectorAll('img'));
  
  return images.map(img => {
    let src = img.src;
    
    // Handle relative URLs
    if (src.startsWith('/')) {
      try {
        const url = new URL(baseUrl);
        src = `${url.protocol}//${url.hostname}${src}`;
      } catch (e) {
        // If baseUrl is invalid, keep the relative path
      }
    }
    
    return {
      src,
      alt: img.alt || '',
      originalAlt: img.alt || ''
    };
  }).filter(img => {
    // Filter out empty or invalid src
    return img.src && !img.src.startsWith('data:image');
  });
};