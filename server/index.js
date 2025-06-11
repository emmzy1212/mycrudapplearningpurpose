import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './routes/postRoutes.js';

dotenv.config(); // Load environment variables

const app = express();

// Connect to MongoDB using try/catch
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1); // Exit the process if DB connection fails
  }
};

connectDB(); // Call the DB connection function

// CORS config using env variable
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

// Use main router
app.use('/', router);

// Test route
app.get('/api/data', (req, res) => {
  res.json({ message: 'CORS-enabled backend with MongoDB connected!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
