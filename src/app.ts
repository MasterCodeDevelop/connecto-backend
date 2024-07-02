import express from 'express';
import cors from 'cors';
import connectToDatabase from './config/db';
import dotenv from 'dotenv';

//  Ensure environment variables are loaded
dotenv.config();
const app = express();

// Connect to database
connectToDatabase();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

export default app;
