const { generateAltTextForImages } = require('../services/aiService');

exports.generateAltText = async (req, res, next) => {
  try {
    const { images } = req.body;
    
    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ error: 'Images array is required' });
    }

    // Generate ALT texts
    const imagesWithAltText = await generateAltTextForImages(images);
    
    res.json({ images: imagesWithAltText });
  } catch (error) {
    next(error);
  }
};