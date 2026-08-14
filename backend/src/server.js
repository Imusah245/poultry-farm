const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/eggs', require('./routes/eggProduction'));
app.use('/api/broilers', require('./routes/broilerGrowth'));
app.use('/api/feed', require('./routes/feed'));
app.use('/api/mortality', require('./routes/mortality'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/company', require('./routes/company'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/orders', require('./routes/orders'));

// Error handler middleware (must be last)
app.use(errorHandler);

// Connect to DB and start server
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
