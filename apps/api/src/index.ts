import express from 'express';
import cors from 'cors';
import http from 'http';
import { config } from './config.js';
import { BookingGateway } from './gateway/booking.gateway.js';
import { healthRouter } from './routes/health.js';
import { teachersRouter } from './routes/teachers.js';
import { slotsRouter } from './routes/slots.js';
import { paymentsRouter } from './routes/payments.js';
import { bookingsRouter } from './routes/bookings.js';
import { adminRouter } from './routes/admin.js';

const app = express();

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/health', healthRouter);
app.use('/api/teachers', teachersRouter);
app.use('/api/slots', slotsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/admin', adminRouter);

// Root fallback
app.get('/', (req, res) => {
  res.json({
    name: 'Prāṇa Yoga Booking Platform API',
    status: 'ONLINE',
    docs: {
      health: '/api/health',
      teachers: '/api/teachers',
      schedule: '/api/teachers/tch_ananya_01/schedule',
      bookings: '/api/bookings',
      adminMetrics: '/api/admin/metrics',
      adminAuditLogs: '/api/admin/audit-logs',
      websocket: 'ws://localhost:' + config.port + '/ws',
    },
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err?.message || 'Unknown error' });
});

// Create HTTP server & attach WebSocket Gateway
const server = http.createServer(app);
BookingGateway.init(server);

// Start server on all network interfaces
server.listen(config.port, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║   🌿 PRĀṆA YOGA BOOKING PLATFORM — PRODUCTION API ACTIVE          ║
║                                                                   ║
║   • REST API:        http://0.0.0.0:${config.port}                        ║
║   • Health Endpoint: http://0.0.0.0:${config.port}/api/health             ║
║   • WebSocket Stream:ws://0.0.0.0:${config.port}/ws                      ║
║   • Razorpay Mode:   ${config.razorpay.isConfigured ? 'LIVE/TEST KEYS CONNECTED  ' : 'SANDBOX SIMULATOR (Set keys)'}   ║
║   • DB Storage:      ${config.databaseUrl ? 'PostgreSQL (Prisma Enabled) ' : 'In-Memory Transaction Cache'} ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
  `);
});
