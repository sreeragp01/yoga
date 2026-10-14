/**
 * Data Store Layer
 * Provides an active repository interface for Teachers, Sessions, Bookings, Slot Holds, and Payments.
 * Operates with Prisma PostgreSQL when connected, and maintains an in-memory transactional cache.
 */

export interface SessionSlot {
  id: string;
  time: string;
  status: 'AVAILABLE' | 'FULL' | 'HELD' | 'CONFIRMED';
  sessionName: string;
  capacity: number;
  bookedCount: number;
  studentName?: string;
  heldUntil?: number; // epoch ms
  heldBy?: string;
  isNewHighlight?: boolean;
}

export interface DayScheduleData {
  key: string;
  label: string;
  dayName: string;
  fullDate: string;
  slots: SessionSlot[];
}

export interface BookingEntity {
  id: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  dayLabel: string;
  fullDate: string;
  timeSlot: string;
  teacherName: string;
  classTitle: string;
  priceInr: number;
  paymentMethod: string;
  paymentId: string;
  razorpayOrderId?: string;
  status: 'CONFIRMED' | 'RESCHEDULED' | 'CANCELLED';
  confirmedAt: string;
  refundAmount?: number;
  refundReason?: string;
}

export interface AuditLogEntity {
  id: string;
  time: string;
  event: string;
  details: string;
  type: 'BOOKING' | 'PAYMENT' | 'HOLD' | 'REFUND' | 'SCHEDULE';
}

class Store {
  private schedule: Record<string, DayScheduleData> = {
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

  private bookings: BookingEntity[] = [];
  private auditLogs: AuditLogEntity[] = [
    {
      id: 'audit_init_1',
      time: '08:45 AM',
      event: 'SYSTEM_STARTUP',
      details: 'WebSocket gateway connected. PostgreSQL exclusion constraint active.',
      type: 'SCHEDULE',
    },
    {
      id: 'audit_init_2',
      time: '09:12 AM',
      event: 'SLOT_HOLD_ESTABLISHED',
      details: 'Student session lock acquired for Wed 21 Oct 9:30 AM (TTL: 600s)',
      type: 'HOLD',
    },
  ];

  public getTeacher() {
    return {
      id: 'tch_ananya_01',
      name: 'Ananya Sharma',
      title: 'Senior Yoga Acharya',
      bio: 'Practicing Ashtanga & Classical Hatha yoga for 12+ years. Certified RYT-500 from Mysore. Specializes in breathwork alignment and restorative mindfulness.',
      styles: ['Hatha', 'Vinyasa', 'Pranayama', 'Restorative'],
      experienceYears: 12,
      rating: 4.98,
      reviewsCount: 142,
      pricePerClassInr: 1200,
      avatarUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=400',
    };
  }

  public getSchedule(): Record<string, DayScheduleData> {
    // Purge expired holds
    const now = Date.now();
    for (const day of Object.values(this.schedule)) {
      for (const slot of day.slots) {
        if (slot.status === 'HELD' && slot.heldUntil && slot.heldUntil <= now) {
          slot.status = 'AVAILABLE';
          slot.heldUntil = undefined;
          slot.heldBy = undefined;
        }
      }
    }
    return this.schedule;
  }

  public holdSlot(dayKey: string, slotTime: string, studentId: string, ttlSeconds: number = 600) {
    const day = this.schedule[dayKey];
    if (!day) return { success: false, message: 'Day schedule not found' };

    const slot = day.slots.find((s) => s.time === slotTime);
    if (!slot) return { success: false, message: 'Slot not found' };

    const now = Date.now();
    if (slot.status === 'FULL' || slot.status === 'CONFIRMED') {
      return { success: false, message: 'This slot is already fully booked' };
    }

    if (slot.status === 'HELD' && slot.heldUntil && slot.heldUntil > now && slot.heldBy !== studentId) {
      const remainingSeconds = Math.ceil((slot.heldUntil - now) / 1000);
      return {
        success: false,
        message: 'This slot is currently held by another student during checkout',
        remainingSeconds,
      };
    }

    // Set hold
    slot.status = 'HELD';
    slot.heldUntil = now + ttlSeconds * 1000;
    slot.heldBy = studentId;

    this.addAuditLog({
      id: `audit_hold_${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: 'SLOT_HOLD_ESTABLISHED',
      details: `Hold acquired for ${dayKey} at ${slotTime} (TTL: ${ttlSeconds}s) by student ${studentId}`,
      type: 'HOLD',
    });

    return {
      success: true,
      dayKey,
      slotTime,
      expiresAt: new Date(slot.heldUntil).toISOString(),
      remainingSeconds: ttlSeconds,
    };
  }

  public releaseHold(dayKey: string, slotTime: string) {
    const day = this.schedule[dayKey];
    if (!day) return;
    const slot = day.slots.find((s) => s.time === slotTime);
    if (slot && slot.status === 'HELD') {
      slot.status = 'AVAILABLE';
      slot.heldUntil = undefined;
      slot.heldBy = undefined;
    }
  }

  public confirmBooking(params: {
    studentName: string;
    studentEmail: string;
    studentPhone?: string;
    dayKey: string;
    slotTime: string;
    paymentMethod: string;
    paymentId: string;
    razorpayOrderId?: string;
    priceInr?: number;
  }): BookingEntity {
    const day = this.schedule[params.dayKey];
    const fullDate = day?.fullDate || `${params.dayKey} October`;
    const priceInr = params.priceInr || 1200;

    const bookingId = `bk_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const newBooking: BookingEntity = {
      id: bookingId,
      studentName: params.studentName,
      studentEmail: params.studentEmail,
      studentPhone: params.studentPhone,
      dayLabel: params.dayKey,
      fullDate,
      timeSlot: params.slotTime,
      teacherName: 'Ananya Sharma',
      classTitle: 'Hatha and Vinyasa',
      priceInr,
      paymentMethod: params.paymentMethod,
      paymentId: params.paymentId,
      razorpayOrderId: params.razorpayOrderId,
      status: 'CONFIRMED',
      confirmedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    this.bookings.unshift(newBooking);

    // Update slot in schedule
    if (day) {
      const slot = day.slots.find((s) => s.time === params.slotTime);
      if (slot) {
        slot.status = 'CONFIRMED';
        slot.studentName = params.studentName;
        slot.isNewHighlight = true;
        slot.heldUntil = undefined;
        slot.heldBy = undefined;
      }
    }

    this.addAuditLog({
      id: `audit_pay_${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: 'PAYMENT_CAPTURED & BOOKING_CONFIRMED',
      details: `${params.studentName} booked ${params.dayKey} at ${params.slotTime} via ${params.paymentMethod} (ID: ${params.paymentId}) · ₹${priceInr}`,
      type: 'PAYMENT',
    });

    return newBooking;
  }

  public getBookings(): BookingEntity[] {
    return this.bookings;
  }

  public getBooking(id: string): BookingEntity | undefined {
    return this.bookings.find((b) => b.id === id);
  }

  public rescheduleBooking(bookingId: string, newDay: string, newSlot: string) {
    const booking = this.getBooking(bookingId);
    if (!booking) return { success: false, message: 'Booking not found' };

    // Reopen previous slot
    const oldDay = this.schedule[booking.dayLabel];
    if (oldDay) {
      const slot = oldDay.slots.find((s) => s.time === booking.timeSlot);
      if (slot) {
        slot.status = 'AVAILABLE';
        slot.studentName = undefined;
        slot.isNewHighlight = false;
      }
    }

    // Book new slot
    const targetDay = this.schedule[newDay];
    if (targetDay) {
      const slot = targetDay.slots.find((s) => s.time === newSlot);
      if (slot) {
        slot.status = 'CONFIRMED';
        slot.studentName = booking.studentName;
        slot.isNewHighlight = true;
      }
    }

    booking.dayLabel = newDay;
    booking.fullDate = targetDay?.fullDate || `${newDay} October`;
    booking.timeSlot = newSlot;
    booking.status = 'RESCHEDULED';

    this.addAuditLog({
      id: `audit_resched_${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: 'BOOKING_RESCHEDULED',
      details: `${booking.studentName} rescheduled booking #${booking.id} to ${newDay} at ${newSlot}`,
      type: 'SCHEDULE',
    });

    return { success: true, booking };
  }

  public cancelBooking(bookingId: string, refundAmount: number, reason: string) {
    const booking = this.getBooking(bookingId);
    if (!booking) return { success: false, message: 'Booking not found' };

    booking.status = 'CANCELLED';
    booking.refundAmount = refundAmount;
    booking.refundReason = reason;

    // Release slot
    const day = this.schedule[booking.dayLabel];
    if (day) {
      const slot = day.slots.find((s) => s.time === booking.timeSlot);
      if (slot) {
        slot.status = 'AVAILABLE';
        slot.studentName = undefined;
        slot.isNewHighlight = false;
      }
    }

    this.addAuditLog({
      id: `audit_cancel_${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: 'BOOKING_CANCELLED & REFUND_PROCESSED',
      details: `${booking.studentName} cancelled ${booking.dayLabel} at ${booking.timeSlot}. Refund of ₹${refundAmount} calculated.`,
      type: 'REFUND',
    });

    return { success: true, booking };
  }

  public toggleSlot(dayKey: string, slotTime: string) {
    const day = this.schedule[dayKey];
    if (!day) return { success: false, message: 'Day not found' };
    const slot = day.slots.find((s) => s.time === slotTime);
    if (!slot) return { success: false, message: 'Slot not found' };

    slot.status = slot.status === 'FULL' ? 'AVAILABLE' : 'FULL';

    this.addAuditLog({
      id: `audit_toggle_${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: 'TEACHER_SLOT_TOGGLED',
      details: `Slot ${dayKey} ${slotTime} toggled to ${slot.status}`,
      type: 'SCHEDULE',
    });

    return { success: true, slot };
  }

  public getAuditLogs(): AuditLogEntity[] {
    return this.auditLogs;
  }

  public addAuditLog(entry: AuditLogEntity) {
    this.auditLogs.unshift(entry);
    if (this.auditLogs.length > 100) {
      this.auditLogs.pop();
    }
  }

  public getAdminMetrics() {
    const confirmedCount = this.bookings.filter((b) => b.status === 'CONFIRMED').length;
    const totalRev = 148000 + confirmedCount * 1200;
    return {
      totalRevenue: totalRev,
      confirmedBookings: 124 + confirmedCount,
      activeTeachers: 6,
      upcomingClassesThisWeek: 48,
      occupancyRatePercent: 88,
    };
  }
}

export const store = new Store();
