import { Router } from 'express';
import { config } from '../config.js';

export const healthRouter = Router();

healthRouter.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Prāṇa Yoga Backend API',
    version: '1.0.0',
    mode: config.nodeEnv,
    database: config.databaseUrl ? 'configured' : 'memory_sandbox',
    razorpay: config.razorpay.isConfigured ? 'live_configured' : 'sandbox_demo',
  });
});
