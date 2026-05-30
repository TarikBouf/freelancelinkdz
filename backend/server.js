
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'FreelanceLink DZ API is running' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/businesses', require('./routes/businesses'));
app.use('/api/freelancers', require('./routes/freelancers'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/proposals', require('./routes/proposals'));
app.use('/api/reviews', require('./routes/reviews'));

// Connect to MongoDB then start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));