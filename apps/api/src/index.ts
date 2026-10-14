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

// Create HTTP server & attach WebSocket Gateway
const server = http.createServer(app);
BookingGateway.init(server);

// Start server
server.listen(config.port, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║   🌿 PRĀṆA YOGA BOOKING PLATFORM — PRODUCTION API ACTIVE          ║
║                                                                   ║
║   • REST API:        http://localhost:${config.port}                        ║
║   • Health Endpoint: http://localhost:${config.port}/api/health             ║
║   • WebSocket Stream:ws://localhost:${config.port}/ws                      ║
║   • Razorpay Mode:   ${config.razorpay.isConfigured ? 'LIVE/TEST KEYS CONNECTED  ' : 'SANDBOX SIMULATOR (Set keys)'}   ║
║   • DB Storage:      ${config.databaseUrl ? 'PostgreSQL (Prisma Enabled) ' : 'In-Memory Transaction Cache'} ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
  `);
});
