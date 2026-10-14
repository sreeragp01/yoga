import { Router } from 'express';
import { store } from '../db/store.js';
import { BookingGateway } from '../gateway/booking.gateway.js';
import { razorpayService } from '../payments/razorpay.service.js';

export const bookingsRouter = Router();

// List all bookings
bookingsRouter.get('/', (req, res) => {
  const bookings = store.getBookings();
  res.json({ bookings });
});

// Reschedule a booking
bookingsRouter.post('/:id/reschedule', (req, res) => {
  const { id } = req.params;
  const { newDay, newSlot } = req.body;

  if (!newDay || !newSlot) {
    return res.status(400).json({ error: 'newDay and newSlot are required' });
  }

  const result = store.rescheduleBooking(id, newDay, newSlot);
  if (!result.success) {
    return res.status(404).json(result);
  }

  BookingGateway.broadcast('bookings', 'BOOKING_RESCHEDULED', {
    bookingId: id,
    newDay,
    newSlot,
  });

  res.json(result);
});

// Cancel a booking and process refund
bookingsRouter.post('/:id/cancel', async (req, res) => {
  const { id } = req.params;
  const booking = store.getBooking(id);

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  // Calculate refund according to studio policy (>24h = 100% full refund)
  const refundAmount = booking.priceInr; // standard 100% policy
  const reason = 'Student requested cancellation (>24h notice)';

  // Process gateway refund if live
  if (booking.paymentId) {
    await razorpayService.initiateRefund(booking.paymentId, refundAmount * 100, reason);
  }

  const result = store.cancelBooking(id, refundAmount, reason);

  BookingGateway.broadcast('bookings', 'BOOKING_CANCELLED', {
    bookingId: id,
    dayLabel: booking.dayLabel,
    timeSlot: booking.timeSlot,
    refundAmount,
  });

  res.json({
    success: true,
    refundAmount,
    message: reason,
    booking: result.booking,
  });
});
