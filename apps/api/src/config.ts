import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL || '',
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret_prana_2026',
    isConfigured: Boolean(
      process.env.RAZORPAY_KEY_ID && 
      !process.env.RAZORPAY_KEY_ID.includes('placeholder') &&
      process.env.RAZORPAY_KEY_SECRET &&
      !process.env.RAZORPAY_KEY_SECRET.includes('placeholder')
    ),
  },
  slotHoldTtlSeconds: parseInt(process.env.SLOT_HOLD_TTL_SECONDS || '600', 10),
};
