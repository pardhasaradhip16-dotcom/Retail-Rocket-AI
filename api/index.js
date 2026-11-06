import express from 'express';
import cors from 'cors';
import { connectDB } from '../server/config/db.js';
import recommendationEngine from '../server/services/recommendationEngine.js';
import apiRoutes from '../server/routes/api.js';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// Initialize database & recommendation engine
let initialized = false;
app.use(async (req, res, next) => {
  if (!initialized) {
    try {
      await connectDB();
      await recommendationEngine.initialize();
      initialized = true;
    } catch (e) {
      console.error('Initialization error:', e);
    }
  }
  next();
});

// Mount routes
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

export default app;

