import { Router } from 'express';
import { razorpayService } from '../payments/razorpay.service.js';
import { store } from '../db/store.js';
import { BookingGateway } from '../gateway/booking.gateway.js';

export const paymentsRouter = Router();

// Create Razorpay Order
paymentsRouter.post('/create-order', async (req, res) => {
  try {
    const { bookingId, amountPaise, dayKey, slotTime, studentName } = req.body;

    if (!amountPaise) {
      return res.status(400).json({ error: 'amountPaise is required' });
    }

    const order = await razorpayService.createOrder({
      bookingId: bookingId || `temp_${Date.now()}`,
      amountPaise,
      currency: 'INR',
      notes: {
        studentName: studentName || 'Guest Student',
        slot: `${dayKey || ''} ${slotTime || ''}`,
      },
    });

    res.json(order);
  } catch (err: any) {
    console.error('Error creating Razorpay order:', err);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// Verify Payment and Finalize Booking
paymentsRouter.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dayKey,
      slotTime,
      studentName,
      studentEmail,
      studentPhone,
      paymentMethod,
      priceInr,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ error: 'Order ID and Payment ID are required' });
    }

    // Verify signature
    const isValid = razorpayService.verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid payment signature. Verification failed.' });
    }

    // Confirm booking in store
    const booking = store.confirmBooking({
      studentName: studentName || 'Aarav Sharma',
      studentEmail: studentEmail || 'aarav@example.com',
      studentPhone,
      dayKey,
      slotTime,
      paymentMethod: paymentMethod || 'UPI',
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      priceInr: priceInr || 1200,
    });

    // Broadcast live event to Teacher Calendar & Admin Panel
    BookingGateway.broadcast('bookings', 'BOOKING_CONFIRMED', {
      booking,
      dayKey,
      slotTime,
      studentName: booking.studentName,
    });

    res.json({
      success: true,
      message: 'Payment verified and booking confirmed successfully',
      booking,
    });
  } catch (err: any) {
    console.error('Error verifying payment:', err);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// Official Razorpay Server Webhook Endpoint
paymentsRouter.post('/webhook', (req, res) => {
  const signature = req.headers['x-razorpay-signature'] as string;
  const rawBody = JSON.stringify(req.body);

  if (!signature || !razorpayService.verifyWebhookSignature(rawBody, signature)) {
    console.warn('⚠️ Webhook signature verification failed');
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  const event = req.body.event;
  const eventId = req.headers['x-razorpay-event-id'] as string;

  if (eventId && razorpayService.isEventProcessed(eventId)) {
    console.log(`ℹ Idempotency skip: event ${eventId} already processed`);
    return res.json({ status: 'already_processed' });
  }

  console.log(`✔ Razorpay Webhook Event: ${event}`);

  if (event === 'payment.captured') {
    const payment = req.body.payload.payment.entity;
    console.log(`💰 Payment captured: ${payment.id} for ₹${payment.amount / 100}`);
  }

  res.json({ status: 'ok' });
});

// Virtual Account details for Bank Transfer / NEFT
paymentsRouter.get('/virtual-account', (req, res) => {
  const bookingId = (req.query.bookingId as string) || `BK${Date.now()}`;
  const studentName = (req.query.studentName as string) || 'Student';
  const va = razorpayService.generateVirtualAccount(bookingId, studentName);
  res.json(va);
});
