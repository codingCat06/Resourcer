import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import searchRoutes from './routes/search';
import userRoutes from './routes/user';
import apiRoutes from './routes/api';
import adminRoutes from './routes/admin';
import contactRoutes from './routes/contact';
import { connectDB } from './models/db';
import { seedDatabase } from './utils/seedData';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/user', userRoutes);
app.use('/api/external', apiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Resourcer API is running' });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Test database connection and create tables
  const dbConnected = await connectDB();
  if (!dbConnected) {
    console.error('Failed to connect to database');
    process.exit(1);
  }
  
  // Seed database with sample data
  await seedDatabase();
});