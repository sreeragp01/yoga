import { Router } from 'express';
import { availabilityService } from '../availability/availability.service.js';
import { BookingGateway } from '../gateway/booking.gateway.js';

export const slotsRouter = Router();

// Hold a slot for 10 minutes
slotsRouter.post('/hold', (req, res) => {
  const { dayKey, slotTime, studentId } = req.body;
  if (!dayKey || !slotTime) {
    return res.status(400).json({ error: 'dayKey and slotTime are required' });
  }

  const result = availabilityService.holdSlot(dayKey, slotTime, studentId || 'student_guest');
  if (!result.success) {
    return res.status(409).json(result);
  }

  // Broadcast to all other devices/screens that this slot is held
  BookingGateway.broadcast('slots', 'SLOT_HELD', {
    dayKey,
    slotTime,
    heldUntil: result.expiresAt,
  });

  return res.json(result);
});

// Release a hold
slotsRouter.post('/release', (req, res) => {
  const { dayKey, slotTime } = req.body;
  if (!dayKey || !slotTime) {
    return res.status(400).json({ error: 'dayKey and slotTime are required' });
  }

  availabilityService.releaseHold(dayKey, slotTime);

  BookingGateway.broadcast('slots', 'SLOT_RELEASED', { dayKey, slotTime });
  return res.json({ success: true });
});

// Teacher toggles slot availability (block/unblock)
slotsRouter.post('/toggle', (req, res) => {
  const { dayKey, slotTime } = req.body;
  if (!dayKey || !slotTime) {
    return res.status(400).json({ error: 'dayKey and slotTime are required' });
  }

  const result = availabilityService.toggleSlot(dayKey, slotTime);
  if (!result.success) {
    return res.status(400).json(result);
  }

  BookingGateway.broadcast('slots', 'SLOT_TOGGLED', {
    dayKey,
    slotTime,
    newStatus: result.slot?.status,
  });

  return res.json(result);
});
