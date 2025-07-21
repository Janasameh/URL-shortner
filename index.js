require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const mongoose = require('mongoose');
const urlRouter = require('./routes/url');
const AuthRouter = require('./routes/auth');
const adminRouter= require('./routes/admin');
const { default: rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100, 
  message: "Too many requests from this IP, please try again after an hour."
});

app.use(limiter);


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

  app.use('/api', urlRouter);
  app.use('/api/auth', AuthRouter);
  app.use('/api/admin-dashboard',adminRouter);


  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).send('Something broke!');
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  const limit = rateLimit({
     max : 10,
    windowMs: 60 * 60 * 1000,
    message: "too many requests"
    
  });
