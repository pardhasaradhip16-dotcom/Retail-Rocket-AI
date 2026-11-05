import express from 'express';
import { getRecommendations } from '../controllers/recommendationController.js';
import {
  getSampleVisitor,
  getUserStats,
  getUserHistory,
  getUserViews,
  setPricePreference,
  getPricePreference
} from '../controllers/userController.js';
import { recordViewEvent, recordGenericEvent } from '../controllers/eventController.js';
import { getAllProducts, getProductById } from '../controllers/productController.js';
import { register, login, getMe, getDemoCredentials } from '../controllers/authController.js';
import recommendationEngine from '../services/recommendationEngine.js';

const router = express.Router();

// Health
router.get('/health', (req, res) => {
  res.json(recommendationEngine.getHealthStats());
});

// Authentication & Accounts
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', getMe);
router.get('/auth/demo-credentials', getDemoCredentials);

// Recommendations
router.get('/recommend/:visitorId', getRecommendations);

// Visitors / Users
router.get('/users/sample', getSampleVisitor);
router.get('/visitors/sample', getSampleVisitor);
router.get('/user/:visitorId/stats', getUserStats);
router.get('/user/:visitorId/history', getUserHistory);
router.get('/user/:visitorId/views', getUserViews);
router.post('/user/:visitorId/price-preference', setPricePreference);
router.get('/user/:visitorId/price-preference', getPricePreference);

// Events
router.post('/events/view', recordViewEvent);
router.post('/events', recordGenericEvent);

// Products
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);

export default router;
