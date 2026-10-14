import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { BookingStateMachine } from '../../packages/shared/src/state-machine/bookingStateMachine';
import { api } from '../services/api';

export type ViewMode = 'student_web' | 'student_mobile' | 'teacher_portal' | 'admin_panel' | 'dual_live';
export type PaymentMethod = 'UPI' | 'CARD' | 'APPLE_PAY' | 'NETBANKING';

export interface SlotInfo {
  id: string;
  time: string;
  status: 'AVAILABLE' | 'FULL' | 'HELD' | 'CONFIRMED';
  sessionName?: string;
  bookedCount?: number;
  capacity?: number;
  studentName?: string;
  isNewHighlight?: boolean;
}

export interface DaySchedule {
  key: string;       // e.g. 'Wed 21'
  label: string;     // 'Wed 21'
  dayName: string;   // 'Wednesday'
  fullDate: string;  // 'Wednesday 21 October'
  slots: SlotInfo[];
}

export interface BookingRecord {
  id: string;
  studentName: string;
  studentEmail: string;
  dayLabel: string;
  fullDate: string;
  timeSlot: string;
  teacherName: string;
  classTitle: string;
  priceInr: number;
  paymentMethod: PaymentMethod;
  paymentId: string;
  status: 'CONFIRMED' | 'RESCHEDULED' | 'CANCELLED';
  confirmedAt: string;
  refundAmount?: number;
  refundReason?: string;
}

export interface AuditItem {
  id: string;
  time: string;
  event: string;
  details: string;
  type: 'BOOKING' | 'PAYMENT' | 'HOLD' | 'REFUND' | 'SCHEDULE';
}

interface PlatformContextType {
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  selectedDay: string;
  setSelectedDay: (day: string) => void;
  selectedSlot: string;
  setSelectedSlot: (slot: string) => void;
  schedule: Record<string, DaySchedule>;
  bookings: BookingRecord[];
  auditLogs: AuditItem[];
  holdCountdown: number | null;
  checkoutOpen: boolean;
  setCheckoutOpen: (open: boolean) => void;
  activePaymentMethod: PaymentMethod;
  setActivePaymentMethod: (m: PaymentMethod) => void;
  backendConnected: boolean;
  teacherStats: {
    classesThisWeek: number;
    openSlots: number;
    earnedThisMonth: number;
  };
  adminStats: {
    totalRevenue: number;
    confirmedBookings: number;
    activeTeachers: number;
  };
  latestTeacherHighlight: BookingRecord | null;
  selectSlot: (dayKey: string, slotTime: string) => void;
  triggerCheckout: (method: PaymentMethod) => void;
  processPayment: (method: PaymentMethod, studentName: string, email: string) => void;
  rescheduleBooking: (bookingId: string, newDay: string, newSlot: string) => { success: boolean; message: string };
  cancelBooking: (bookingId: string) => { success: boolean; refundAmount: number; message: string };
  blockSlot: (dayKey: string, slotTime: string) => void;
  downloadICS: (booking: BookingRecord) => void;
  resetDemoData: () => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

const initialSchedule: Record<string, DaySchedule> = {
  'Mon 19': {
    key: 'Mon 19',
    label: 'Mon 19',
    dayName: 'Monday',
    fullDate: 'Monday 19 October',
    slots: [
      { id: 'm1', time: '7:00 AM', status: 'AVAILABLE', sessionName: 'Morning Flow', capacity: 8, bookedCount: 4 },
      { id: 'm2', time: '9:30 AM', status: 'FULL', sessionName: 'Hatha Alignment', capacity: 1, bookedCount: 1, studentName: 'Pooja Nair' },
      { id: 'm3', time: '6:00 PM', status: 'AVAILABLE', sessionName: 'Evening Restore', capacity: 6, bookedCount: 2 },
    ],
  },
  'Tue 20': {
    key: 'Tue 20',
    label: 'Tue 20',
    dayName: 'Tuesday',
    fullDate: 'Tuesday 20 October',
    slots: [
      { id: 't1', time: '7:00 AM', status: 'AVAILABLE', sessionName: 'Sunrise Pranayama', capacity: 8, bookedCount: 3 },
      { id: 't2', time: '9:30 AM', status: 'AVAILABLE', sessionName: 'Vinyasa Core', capacity: 1, bookedCount: 0 },
      { id: 't3', time: '6:00 PM', status: 'FULL', sessionName: 'Yin Yoga', capacity: 1, bookedCount: 1, studentName: 'Rahul Verma' },
    ],
  },
  'Wed 21': {
    key: 'Wed 21',
    label: 'Wed 21',
    dayName: 'Wednesday',
    fullDate: 'Wednesday 21 October',
    slots: [
      { id: 'w1', time: '7:00 AM', status: 'AVAILABLE', sessionName: 'Morning Flow', capacity: 8, bookedCount: 3 },
      { id: 'w2', time: '9:30 AM', status: 'AVAILABLE', sessionName: 'Hatha and Vinyasa', capacity: 1, bookedCount: 0 },
      { id: 'w3', time: '6:00 PM', status: 'AVAILABLE', sessionName: 'Evening Restore', capacity: 1, bookedCount: 0 },
    ],
  },
  'Thu 22': {
    key: 'Thu 22',
    label: 'Thu 22',
    dayName: 'Thursday',
    fullDate: 'Thursday 22 October',
    slots: [
      { id: 'th1', time: '7:00 AM', status: 'FULL', sessionName: 'Ashtanga Basics', capacity: 8, bookedCount: 8 },
      { id: 'th2', time: '9:30 AM', status: 'AVAILABLE', sessionName: 'Hatha and Vinyasa', capacity: 1, bookedCount: 0 },
      { id: 'th3', time: '6:00 PM', status: 'AVAILABLE', sessionName: 'Breathwork & Nidra', capacity: 6, bookedCount: 2 },
    ],
  },
  'Fri 23': {
    key: 'Fri 23',
    label: 'Fri 23',
    dayName: 'Friday',
    fullDate: 'Friday 23 October',
    slots: [
      { id: 'f1', time: '7:00 AM', status: 'AVAILABLE', sessionName: 'Morning Flow', capacity: 8, bookedCount: 5 },
      { id: 'f2', time: '9:30 AM', status: 'AVAILABLE', sessionName: 'Vinyasa Flow', capacity: 1, bookedCount: 0 },
      { id: 'f3', time: '6:00 PM', status: 'AVAILABLE', sessionName: 'Chakra Balancing', capacity: 1, bookedCount: 0 },
    ],
  },
};

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ViewMode>('student_web');
  const [selectedDay, setSelectedDay] = useState<string>('Wed 21');
  const [selectedSlot, setSelectedSlot] = useState<string>('9:30 AM');
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>(initialSchedule);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [holdCountdown, setHoldCountdown] = useState<number | null>(600); // 10 minutes hold
  const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);
  const [activePaymentMethod, setActivePaymentMethod] = useState<PaymentMethod>('UPI');
  const [latestTeacherHighlight, setLatestTeacherHighlight] = useState<BookingRecord | null>(null);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);

  const [auditLogs, setAuditLogs] = useState<AuditItem[]>([
    {
      id: 'a1',
      time: '08:45 AM',
      event: 'SYSTEM_STARTUP',
      details: 'WebSocket gateway connected. PostgreSQL exclusion constraint active.',
      type: 'SCHEDULE',
    },
    {
      id: 'a2',
      time: '09:12 AM',
      event: 'SLOT_HOLD_ESTABLISHED',
      details: 'Student session lock acquired for Wed 21 Oct 9:30 AM (TTL: 600s)',
      type: 'HOLD',
    },
  ]);

  // Load from live API and setup live WebSocket connection
  useEffect(() => {
    // 1. Initial health & schedule fetch
    api.checkHealth().then((h) => {
      if (h.status === 'healthy') {
        setBackendConnected(true);
        api.fetchSchedule().then((remoteSchedule) => {
          if (remoteSchedule) {
            setSchedule(remoteSchedule);
          }
        });
      }
    });

    // 2. Connect WebSocket
    const disconnect = api.connectWebSocket((event) => {
      setBackendConnected(true);

      if (event.event === 'SLOT_HELD') {
        const { dayKey, slotTime } = event.payload || {};
        setSchedule((prev) => {
          const copy = { ...prev };
          if (copy[dayKey]) {
            copy[dayKey].slots = copy[dayKey].slots.map((s) =>
              s.time === slotTime ? { ...s, status: 'HELD' } : s
            );
          }
          return copy;
        });
      } else if (event.event === 'SLOT_RELEASED') {
        const { dayKey, slotTime } = event.payload || {};
        setSchedule((prev) => {
          const copy = { ...prev };
          if (copy[dayKey]) {
            copy[dayKey].slots = copy[dayKey].slots.map((s) =>
              s.time === slotTime && s.status === 'HELD' ? { ...s, status: 'AVAILABLE' } : s
            );
          }
          return copy;
        });
      } else if (event.event === 'BOOKING_CONFIRMED') {
        const { booking, dayKey, slotTime } = event.payload || {};
        if (booking) {
          setBookings((prev) => (prev.some((b) => b.id === booking.id) ? prev : [booking, ...prev]));
          setLatestTeacherHighlight(booking);
        }
        if (dayKey && slotTime) {
          setSchedule((prev) => {
            const copy = { ...prev };
            if (copy[dayKey]) {
              copy[dayKey].slots = copy[dayKey].slots.map((s) =>
                s.time === slotTime
                  ? { ...s, status: 'CONFIRMED', studentName: booking?.studentName, isNewHighlight: true }
                  : s
              );
            }
            return copy;
          });
        }
      } else if (event.event === 'BOOKING_CANCELLED') {
        const { bookingId, dayLabel, timeSlot } = event.payload || {};
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: 'CANCELLED' } : b))
        );
        if (dayLabel && timeSlot) {
          setSchedule((prev) => {
            const copy = { ...prev };
            if (copy[dayLabel]) {
              copy[dayLabel].slots = copy[dayLabel].slots.map((s) =>
                s.time === timeSlot ? { ...s, status: 'AVAILABLE', studentName: undefined } : s
              );
            }
            return copy;
          });
        }
      } else if (event.event === 'SLOT_TOGGLED') {
        const { dayKey, slotTime, newStatus } = event.payload || {};
        if (dayKey && slotTime) {
          setSchedule((prev) => {
            const copy = { ...prev };
            if (copy[dayKey]) {
              copy[dayKey].slots = copy[dayKey].slots.map((s) =>
                s.time === slotTime ? { ...s, status: newStatus || (s.status === 'FULL' ? 'AVAILABLE' : 'FULL') } : s
              );
            }
            return copy;
          });
        }
      }
    });

    return () => disconnect();
  }, []);

  // Hold Timer countdown
  useEffect(() => {
    if (holdCountdown === null || holdCountdown <= 0) return;
    const interval = setInterval(() => {
      setHoldCountdown((prev) => (prev && prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [holdCountdown]);

  const selectSlot = (dayKey: string, slotTime: string) => {
    setSelectedDay(dayKey);
    setSelectedSlot(slotTime);
    setHoldCountdown(600); // Restart 10 minute hold

    // Async call to backend for atomic hold
    api.holdSlot(dayKey, slotTime);

    // Add audit log
    const logItem: AuditItem = {
      id: `a_${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: 'SLOT_HOLD_CREATED',
      details: `Hold placed on ${dayKey}, ${slotTime} (Redis hold 10m)`,
      type: 'HOLD',
    };
    setAuditLogs((prev) => [logItem, ...prev]);
  };

  const triggerCheckout = (method: PaymentMethod) => {
    setActivePaymentMethod(method);
    setCheckoutOpen(true);
  };

  const processPayment = (method: PaymentMethod, studentName: string = 'Aarav Sharma', email: string = 'aarav@example.com') => {
    const bookingId = `bk_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const paymentId = `pay_${Math.random().toString(36).substring(2, 11)}`;
    const fullDate = schedule[selectedDay]?.fullDate || 'Wednesday 21 October';

    const newBooking: BookingRecord = {
      id: bookingId,
      studentName,
      studentEmail: email,
      dayLabel: selectedDay,
      fullDate,
      timeSlot: selectedSlot,
      teacherName: 'Ananya Sharma',
      classTitle: 'Hatha and Vinyasa',
      priceInr: 1200,
      paymentMethod: method,
      paymentId,
      status: 'CONFIRMED',
      confirmedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // 1. Update Booking list
    setBookings((prev) => [newBooking, ...prev]);

    // 2. Update Teacher Calendar state immediately
    setSchedule((prev) => {
      const copy = { ...prev };
      const daySlots = copy[selectedDay]?.slots.map((s) => {
        if (s.time === selectedSlot) {
          return {
            ...s,
            status: 'CONFIRMED' as const,
            studentName,
            isNewHighlight: true,
          };
        }
        return s;
      });
      if (copy[selectedDay]) {
        copy[selectedDay] = { ...copy[selectedDay], slots: daySlots };
      }
      return copy;
    });

    // 3. Highlight for Teacher Dashboard
    setLatestTeacherHighlight(newBooking);

    // 4. Append to Admin Audit Log
    const auditEntry: AuditItem = {
      id: `audit_${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: 'PAYMENT_CAPTURED & BOOKING_CONFIRMED',
      details: `${studentName} booked ${selectedDay} at ${selectedSlot} via ${method} (Order: ${paymentId}) · ₹1,200`,
      type: 'PAYMENT',
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);

    // 5. Notify backend API
    api.verifyPayment({
      razorpay_order_id: `order_${bookingId}`,
      razorpay_payment_id: paymentId,
      razorpay_signature: `mock_sig_${paymentId}`,
      dayKey: selectedDay,
      slotTime: selectedSlot,
      studentName,
      studentEmail: email,
      paymentMethod: method,
      priceInr: 1200,
    });

    // 6. Confetti celebration
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#344C3D', '#526E60', '#C09A6B', '#DFE8E2'],
      });
    } catch {
      // safe fallback
    }

    setCheckoutOpen(false);
  };

  const rescheduleBooking = (bookingId: string, newDay: string, newSlot: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, message: 'Booking not found' };

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, dayLabel: newDay, timeSlot: newSlot, status: 'RESCHEDULED' } : b))
    );

    api.rescheduleBooking(bookingId, newDay, newSlot);

    const auditEntry: AuditItem = {
      id: `resched_${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: 'BOOKING_RESCHEDULED',
      details: `${booking.studentName} rescheduled booking #${booking.id} to ${newDay} at ${newSlot}`,
      type: 'SCHEDULE',
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);

    return { success: true, message: `Successfully rescheduled to ${newDay} at ${newSlot}` };
  };

  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, refundAmount: 0, message: 'Booking not found' };

    // Standard 24h refund policy: 100% full refund
    const refund = BookingStateMachine.calculateRefund(
      new Date(Date.now() + 36 * 3600 * 1000).toISOString(),
      booking.priceInr * 100
    );

    const refundRupees = Math.round(refund.refundAmountPaise / 100);

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, status: 'CANCELLED', refundAmount: refundRupees, refundReason: refund.reason }
          : b
      )
    );

    // Reopen slot in schedule
    setSchedule((prev) => {
      const copy = { ...prev };
      if (copy[booking.dayLabel]) {
        copy[booking.dayLabel].slots = copy[booking.dayLabel].slots.map((s) =>
          s.time === booking.timeSlot ? { ...s, status: 'AVAILABLE', studentName: undefined, isNewHighlight: false } : s
        );
      }
      return copy;
    });

    if (latestTeacherHighlight?.id === bookingId) {
      setLatestTeacherHighlight(null);
    }

    api.cancelBooking(bookingId);

    const auditEntry: AuditItem = {
      id: `cancel_${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: 'BOOKING_CANCELLED & REFUND_PROCESSED',
      details: `${booking.studentName} cancelled ${booking.dayLabel} ${booking.timeSlot}. Refund of ₹${refundRupees} initiated to original payment source.`,
      type: 'REFUND',
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);

    return { success: true, refundAmount: refundRupees, message: refund.reason };
  };

  const blockSlot = (dayKey: string, slotTime: string) => {
    setSchedule((prev) => {
      const copy = { ...prev };
      if (copy[dayKey]) {
        copy[dayKey].slots = copy[dayKey].slots.map((s) =>
          s.time === slotTime ? { ...s, status: s.status === 'FULL' ? 'AVAILABLE' : 'FULL' } : s
        );
      }
      return copy;
    });

    api.toggleSlot(dayKey, slotTime);

    const auditEntry: AuditItem = {
      id: `block_${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: 'TEACHER_SLOT_TOGGLED',
      details: `Teacher Ananya updated status of ${dayKey} ${slotTime}`,
      type: 'SCHEDULE',
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);
  };

  const downloadICS = (booking: BookingRecord) => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Prana Yoga//Booking Platform//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:Prāṇa Yoga: ${booking.classTitle} with ${booking.teacherName}`,
      `DESCRIPTION:Your yoga session is confirmed. Teacher: ${booking.teacherName}. Payment ID: ${booking.paymentId}. Reschedule allowed up to 24 hours prior.`,
      `LOCATION:Prāṇa Sanctuary, Studio A & Online Stream`,
      `STATUS:CONFIRMED`,
      `UID:${booking.id}@pranayoga.com`,
      `DTSTART:20261021T040000Z`,
      `DTEND:20261021T050000Z`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `prana_yoga_${booking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetDemoData = () => {
    setSchedule(initialSchedule);
    setBookings([]);
    setSelectedDay('Wed 21');
    setSelectedSlot('9:30 AM');
    setHoldCountdown(600);
    setLatestTeacherHighlight(null);
  };

  // Dynamic calculations for teacher stats
  const teacherStats = {
    classesThisWeek: 12 + bookings.filter((b) => b.status === 'CONFIRMED').length,
    openSlots: Math.max(0, 8 - bookings.filter((b) => b.status === 'CONFIRMED').length),
    earnedThisMonth: 24000 + bookings.filter((b) => b.status === 'CONFIRMED').length * 1200,
  };

  const adminStats = {
    totalRevenue: 148000 + bookings.filter((b) => b.status === 'CONFIRMED').length * 1200,
    confirmedBookings: 124 + bookings.filter((b) => b.status === 'CONFIRMED').length,
    activeTeachers: 6,
  };

  return (
    <PlatformContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedDay,
        setSelectedDay,
        selectedSlot,
        setSelectedSlot,
        schedule,
        bookings,
        auditLogs,
        holdCountdown,
        checkoutOpen,
        setCheckoutOpen,
        activePaymentMethod,
        setActivePaymentMethod,
        backendConnected,
        teacherStats,
        adminStats,
        latestTeacherHighlight,
        selectSlot,
        triggerCheckout,
        processPayment,
        rescheduleBooking,
        cancelBooking,
        blockSlot,
        downloadICS,
        resetDemoData,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) throw new Error('usePlatform must be used within a PlatformProvider');
  return context;
};
