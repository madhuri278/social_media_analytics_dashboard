const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/analytics', analyticsRoutes);

// Root path diagnostic route
app.get('/', (req, res) => {
  res.json({ message: 'Social Media Analytics API is running...' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
