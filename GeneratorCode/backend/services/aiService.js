const OpenAI = require('openai');
const { OPENAI_API_KEY } = require('../config/config');

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

// API Health Check Function
exports.testOpenAIConnection = async () => {
  try {
    const testResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a connectivity tester. Just respond 'OK' if operational."
        },
        {
          role: "user",
          content: "Test connection"
        }
      ],
      max_tokens: 5
    });

    return {
      status: 'operational',
      response: testResponse.choices[0].message.content
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message,
      details: error
    };
  }
};

exports.generateAltTextForImages = async (images) => {
  try {
    // First verify API connection
    const healthCheck = await exports.testOpenAIConnection();
    if (healthCheck.status !== 'operational') {
      console.error('OpenAI API Connection Failed:', healthCheck.error);
      throw new Error(`API Service Unavailable: ${healthCheck.error}`);
    }

    console.log('OpenAI API verified as operational. Starting alt text generation...');

    const batchSize = 5;
    const batches = [];
    const stats = {
      total: images.length,
      skipped: 0,
      generated: 0,
      failed: 0
    };

    // Create batches
    for (let i = 0; i < images.length; i += batchSize) {
      batches.push(images.slice(i, i + batchSize));
    }

    const results = [];
    
    for (const [batchIndex, batch] of batches.entries()) {
      console.log(`Processing batch ${batchIndex + 1}/${batches.length}`);
      
      const batchResults = await Promise.all(
        batch.map(async (img) => {
          try {
            // Skip if the image already has an alt text
            if (img.originalAlt?.trim()) {
              stats.skipped++;
              console.log(`Skipping (existing alt): ${img.src.substring(0, 50)}...`);
              return {
                ...img,
                generatedAlt: img.originalAlt,
                status: 'skipped'
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
            stats.generated++;
            
            console.log(`Generated alt for ${img.src.substring(0, 50)}...: ${generatedAlt}`);
            
            return {
              ...img,
              generatedAlt,
              status: 'success'
            };
          } catch (error) {
            stats.failed++;
            console.error(`Error generating ALT for ${img.src}:`, error.message);
            return {
              ...img,
              generatedAlt: '',
              status: 'failed',
              error: error.message
            };
          }
        })
      );
      
      results.push(...batchResults);
      
      // Add delay between batches to avoid rate limiting
      if (batchIndex < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('Alt text generation completed:', stats);
    return {
      success: true,
      stats,
      results
    };
  } catch (error) {
    console.error('AI service critical error:', error);
    return {
      success: false,
      error: error.message,
      results: images.map(img => ({
        ...img,
        generatedAlt: '',
        status: 'failed',
        error: 'Service unavailable'
      }))
    };
  }
};
