const OpenAI = require('openai');
const { OPENAI_API_KEY } = require('../config/config');

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

exports.generateAltTextForImages = async (images) => {
  try {
    // Process images in batches to avoid rate limiting
    const batchSize = 5;
    const batches = [];
    
    for (let i = 0; i < images.length; i += batchSize) {
      batches.push(images.slice(i, i + batchSize));
    }
    
    const results = [];
    
    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map(async (img) => {
          try {
            // Skip if the image already has an alt text
            if (img.originalAlt && img.originalAlt.trim().length > 0) {
              return {
                ...img,
                generatedAlt: img.originalAlt
              };
            }
            
            // Extract filename for context
            const filename = img.src.split('/').pop().split('.')[0];
            const filenameWords = filename.replace(/[-_]/g, ' ');
            
            const prompt = `Generate a concise, SEO-friendly ALT text for an image with filename "${filenameWords}". ` +
              `The ALT text should be descriptive, under 125 characters, and include relevant keywords. ` +
              `Do not include phrases like "image of" or "picture of".`;
            
            const response = await openai.chat.completions.create({
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content: "You are an SEO expert who creates excellent ALT texts for images."
                },
                {
                  role: "user",
                  content: prompt
                }
              ],
              max_tokens: 60,
              temperature: 0.7
            });
            
            const generatedAlt = response.choices[0].message.content.trim();
            
            return {
              ...img,
              generatedAlt
            };
          } catch (error) {
            console.error(`Error generating ALT for ${img.src}:`, error);
            return {
              ...img,
              generatedAlt: ''
            };
          }
        })
      );
      
      results.push(...batchResults);
      
      // Add delay between batches to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  } catch (error) {
    console.error('AI service error:', error);
    throw error;
  }
};