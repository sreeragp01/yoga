export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED';

export type BookingStatus = 
  | 'AVAILABLE'
  | 'HELD'
  | 'PAYMENT_PENDING'
  | 'CONFIRMED'
  | 'RESCHEDULED'
  | 'CANCELLED'
  | 'NO_SHOW'
  | 'COMPLETED';

export type PaymentMethod = 'UPI' | 'CARD' | 'APPLE_PAY' | 'NETBANKING' | 'BANK_TRANSFER';
export type PaymentStatus = 'CREATED' | 'CAPTURED' | 'FAILED' | 'REFUNDED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  initials: string;
  bio: string;
  styles: string[];
  languages: string[];
  timezone: string;
  pricePerClass: number; // in INR
  pricePaise: number;    // in Paise (e.g. 120000 = ₹1,200)
  isApproved: boolean;
  rating?: number;
  classesCount?: number;
}

export interface ClassSession {
  id: string;
  teacherId: string;
  classTitle: string;
  dateStr: string; // YYYY-MM-DD
  dayLabel: string; // e.g., 'Wed 21 Oct'
  timeSlot: string; // e.g., '9:30 AM'
  startUtc: string;
  endUtc: string;
  durationMinutes: number;
  capacity: number;
  bookedCount: number;
  isFull: boolean;
  pricePaise: number;
  priceInr: number;
  heldUntil?: string; // ISO string if held
  heldByUserId?: string;
}

export interface Booking {
  id: string;
  sessionId: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  classTitle: string;
  dateStr: string;
  timeSlot: string;
  startUtc: string;
  endUtc: string;
  status: BookingStatus;
  pricePaise: number;
  priceInr: number;
  paymentMethod?: PaymentMethod;
  paymentId?: string;
  razorpayOrderId?: string;
  createdAt: string;
  updatedAt: string;
  isNewNotification?: boolean;
}

export interface PaymentTransaction {
  id: string;
  bookingId: string;
  orderId: string;
  paymentId: string;
  method: PaymentMethod;
  amountPaise: number;
  amountInr: number;
  status: PaymentStatus;
  studentName: string;
  teacherName: string;
  createdAt: string;
}

export interface WebSocketEvent<T = any> {
  channel: string; // e.g. 'teacher:1:calendar', 'admin:bookings', 'user:1:notifications'
  event: 'SLOT_HELD' | 'BOOKING_CONFIRMED' | 'BOOKING_CANCELLED' | 'SLOT_RESCHEDULED' | 'NEW_TRANSACTION';
  payload: T;
  timestamp: string;
}
