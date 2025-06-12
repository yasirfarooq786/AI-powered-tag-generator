const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { CORS_ORIGIN } = require('./config/config');
const apiRoutes = require('./routes/apiRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Error handling
app.use(errorHandler);

module.exports = app;