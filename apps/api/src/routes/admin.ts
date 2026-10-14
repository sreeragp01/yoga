import { Router } from 'express';
import { store } from '../db/store.js';

export const adminRouter = Router();

adminRouter.get('/metrics', (req, res) => {
  const metrics = store.getAdminMetrics();
  res.json({ metrics });
});

adminRouter.get('/audit-logs', (req, res) => {
  const auditLogs = store.getAuditLogs();
  res.json({ auditLogs });
});
