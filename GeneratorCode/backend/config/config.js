require('dotenv').config();

module.exports = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  PORT: process.env.PORT || 5000,
  RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX || 100
};