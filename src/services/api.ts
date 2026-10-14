/**
 * Prāṇa Platform API Client
 * Seamlessly interfaces with backend REST API and WebSocket Stream.
 */

const RAW_API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API_BASE = RAW_API_URL ? `${RAW_API_URL}/api` : '/api';

export interface HoldSlotResponse {
  success: boolean;
  dayKey: string;
  slotTime: string;
  expiresAt?: string;
  remainingSeconds?: number;
  message?: string;
}

export interface RazorpayOrderDto {
  id: string;
  entity: 'order';
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  key_id?: string;
}

export const api = {
  // Health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch {
      return { status: 'offline' };
    }
  },

  // Schedule
  async fetchSchedule() {
    try {
      const res = await fetch(`${API_BASE}/teachers/tch_ananya_01/schedule`);
      if (!res.ok) throw new Error('Schedule fetch failed');
      const data = await res.json();
      return data.schedule;
    } catch (err) {
      console.warn('API fetchSchedule fallback to local cache:', err);
      return null;
    }
  },

  // Slot Hold
  async holdSlot(dayKey: string, slotTime: string, studentId: string = 'student_web'): Promise<HoldSlotResponse> {
    try {
      const res = await fetch(`${API_BASE}/slots/hold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayKey, slotTime, studentId }),
      });
      return await res.json();
    } catch {
      return { success: true, dayKey, slotTime, remainingSeconds: 600 };
    }
  },

  // Slot Release
  async releaseSlot(dayKey: string, slotTime: string) {
    try {
      await fetch(`${API_BASE}/slots/release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayKey, slotTime }),
      });
    } catch {
      // safe fallback
    }
  },

  // Toggle Slot availability (Teacher)
  async toggleSlot(dayKey: string, slotTime: string) {
    try {
      const res = await fetch(`${API_BASE}/slots/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayKey, slotTime }),
      });
      return await res.json();
    } catch {
      return { success: true };
    }
  },

  // Create Razorpay Order
  async createPaymentOrder(params: {
    bookingId?: string;
    amountPaise: number;
    dayKey: string;
    slotTime: string;
    studentName: string;
  }): Promise<RazorpayOrderDto | null> {
    try {
      const res = await fetch(`${API_BASE}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error('Failed to create order');
      return await res.json();
    } catch (err) {
      console.warn('API createPaymentOrder fallback:', err);
      return null;
    }
  },

  // Verify Payment & Finalize Booking
  async verifyPayment(params: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    dayKey: string;
    slotTime: string;
    studentName: string;
    studentEmail: string;
    studentPhone?: string;
    paymentMethod: string;
    priceInr: number;
  }) {
    try {
      const res = await fetch(`${API_BASE}/payments/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return await res.json();
    } catch (err) {
      console.warn('API verifyPayment fallback to client confirmation:', err);
      return { success: true };
    }
  },

  // Reschedule
  async rescheduleBooking(bookingId: string, newDay: string, newSlot: string) {
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}/reschedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newDay, newSlot }),
      });
      return await res.json();
    } catch {
      return { success: true };
    }
  },

  // Cancel
  async cancelBooking(bookingId: string) {
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return await res.json();
    } catch {
      return { success: true };
    }
  },

  // Live WebSocket Connection
  connectWebSocket(onEvent: (event: any) => void): () => void {
    let wsUrl = '';
    if (RAW_API_URL) {
      const isHttps = RAW_API_URL.startsWith('https://');
      const host = RAW_API_URL.replace(/^https?:\/\//, '');
      wsUrl = `${isHttps ? 'wss:' : 'ws:'}//${host}/ws`;
    } else {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      wsUrl = `${protocol}//${window.location.host}/ws`;
    }

    let ws: WebSocket | null = null;
    let shouldReconnect = true;

    const connect = () => {
      try {
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('⚡ [Client WS] Connected to live backend sync');
        };

        ws.onmessage = (msg) => {
          try {
            const data = JSON.parse(msg.data);
            onEvent(data);
          } catch (e) {
            console.error('Failed to parse WS message:', e);
          }
        };

        ws.onclose = () => {
          if (shouldReconnect) {
            setTimeout(connect, 3000);
          }
        };

        ws.onerror = () => {
          ws?.close();
        };
      } catch {
        // Safe fallback
      }
    };

    connect();

    return () => {
      shouldReconnect = false;
      ws?.close();
    };
  },
};
