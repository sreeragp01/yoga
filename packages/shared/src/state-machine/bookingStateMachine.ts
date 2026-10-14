import { BookingStatus } from '../types';

export interface RefundCalculation {
  eligible: boolean;
  refundPercentage: number;
  refundAmountPaise: number;
  reason: string;
}

export class BookingStateMachine {
  /**
   * Allowed state transitions
   */
  private static readonly TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
    AVAILABLE: ['HELD'],
    HELD: ['AVAILABLE', 'PAYMENT_PENDING'],
    PAYMENT_PENDING: ['HELD', 'CONFIRMED', 'AVAILABLE'],
    CONFIRMED: ['RESCHEDULED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'],
    RESCHEDULED: ['CONFIRMED', 'CANCELLED'],
    CANCELLED: [],
    NO_SHOW: [],
    COMPLETED: [],
  };

  /**
   * Validate if a state transition is legal
   */
  public static canTransition(current: BookingStatus, target: BookingStatus): boolean {
    const allowed = this.TRANSITIONS[current] || [];
    return allowed.includes(target);
  }

  /**
   * Calculate cancellation refund according to the Studio Policy:
   * - > 24 hours before class: 100% full refund
   * - 4 hours to 24 hours before: 50% partial refund or free reschedule
   * - < 4 hours before: 0% refund (late cancellation)
   */
  public static calculateRefund(
    classStartTimeUtc: string,
    paidAmountPaise: number,
    requestTimeUtc: string = new Date().toISOString()
  ): RefundCalculation {
    const classTime = new Date(classStartTimeUtc).getTime();
    const reqTime = new Date(requestTimeUtc).getTime();
    const hoursRemaining = (classTime - reqTime) / (1000 * 60 * 60);

    if (hoursRemaining >= 24) {
      return {
        eligible: true,
        refundPercentage: 100,
        refundAmountPaise: paidAmountPaise,
        reason: 'Cancelled more than 24 hours in advance (Full refund)',
      };
    } else if (hoursRemaining >= 4) {
      return {
        eligible: true,
        refundPercentage: 50,
        refundAmountPaise: Math.round(paidAmountPaise * 0.5),
        reason: 'Cancelled between 4 and 24 hours in advance (50% refund applied)',
      };
    } else {
      return {
        eligible: false,
        refundPercentage: 0,
        refundAmountPaise: 0,
        reason: 'Cancelled less than 4 hours before class (Non-refundable window)',
      };
    }
  }

  /**
   * Check if session is eligible for free reschedule
   */
  public static isRescheduleAllowed(
    classStartTimeUtc: string,
    requestTimeUtc: string = new Date().toISOString()
  ): { allowed: boolean; message: string } {
    const classTime = new Date(classStartTimeUtc).getTime();
    const reqTime = new Date(requestTimeUtc).getTime();
    const hoursRemaining = (classTime - reqTime) / (1000 * 60 * 60);

    if (hoursRemaining >= 24) {
      return { allowed: true, message: 'Eligible for complimentary reschedule' };
    }
    return {
      allowed: false,
      message: 'Rescheduling requires at least 24 hours advance notice under studio policy',
    };
  }
}
