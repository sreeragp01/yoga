/**
 * Availability Service
 * Manages teacher working hours, slot generation, and atomic 10-minute slot holds.
 */

import { store } from '../db/store.js';
import { config } from '../config.js';

export interface HoldResult {
  success: boolean;
  dayKey: string;
  slotTime: string;
  expiresAt?: string;
  remainingSeconds?: number;
  message?: string;
}

export class AvailabilityService {
  /**
   * Place an atomic 10-minute hold on a session slot
   */
  public holdSlot(dayKey: string, slotTime: string, studentId: string): HoldResult {
    const res = store.holdSlot(dayKey, slotTime, studentId, config.slotHoldTtlSeconds);
    if (!res.success) {
      return {
        success: false,
        dayKey,
        slotTime,
        message: res.message,
        remainingSeconds: res.remainingSeconds,
      };
    }

    return {
      success: true,
      dayKey,
      slotTime,
      expiresAt: res.expiresAt,
      remainingSeconds: res.remainingSeconds,
    };
  }

  /**
   * Release hold when booking succeeds or user backs out
   */
  public releaseHold(dayKey: string, slotTime: string): void {
    store.releaseHold(dayKey, slotTime);
  }

  /**
   * Get weekly schedule with active holds evaluated
   */
  public getSchedule() {
    return store.getSchedule();
  }

  /**
   * Toggle teacher slot availability
   */
  public toggleSlot(dayKey: string, slotTime: string) {
    return store.toggleSlot(dayKey, slotTime);
  }
}

export const availabilityService = new AvailabilityService();
