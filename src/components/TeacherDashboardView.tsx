import React, { useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { Calendar as CalendarIcon, Clock, Users, ArrowUpRight, CheckCircle2, Shield, Radio, Lock } from 'lucide-react';

export const TeacherDashboardView: React.FC = () => {
  const {
    schedule,
    teacherStats,
    latestTeacherHighlight,
    blockSlot,
    rescheduleBooking,
    bookings,
  } = usePlatform();

  const [activeSidebarItem, setActiveSidebarItem] = useState('Calendar');
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [targetSlotToReschedule, setTargetSlotToReschedule] = useState('9:30 AM');
  const [targetDayToReschedule, setTargetDayToReschedule] = useState('Thu 22');

  const wednesdaySchedule = schedule['Wed 21'];
  const wednesdaySlots = wednesdaySchedule?.slots || [];

  // Check if there's a confirmed booking for 9:30 AM
  const bookingAt930 = bookings.find((b) => b.dayLabel === 'Wed 21' && b.timeSlot === '9:30 AM' && b.status === 'CONFIRMED');
  const studentDisplayName = bookingAt930?.studentName || (latestTeacherHighlight ? latestTeacherHighlight.studentName : '[Student name]');
  const isBooked930 = Boolean(bookingAt930 || latestTeacherHighlight);

  const sidebarLinks = ['Calendar', 'Bookings', 'Availability', 'Earnings', 'Profile'];

  const handleRescheduleSubmit = () => {
    if (bookingAt930) {
      rescheduleBooking(bookingAt930.id, targetDayToReschedule, '9:30 AM');
    }
    setRescheduleModalOpen(false);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '48px', alignItems: 'start' }}>
        {/* Left Sidebar matching Wireframe 1 */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '26px',
              fontWeight: 500,
              color: '#1C2621',
              letterSpacing: '0.5px',
            }}>
              [STUDIO NAME]
            </h1>
            <p style={{ fontSize: '12px', color: '#57635C', marginTop: '2px' }}>Teacher Portal</p>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sidebarLinks.map((link) => {
              const isActive = activeSidebarItem === link;
              return (
                <button
                  key={link}
                  onClick={() => setActiveSidebarItem(link)}
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '16px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#1C2621' : '#57635C',
                    cursor: 'pointer',
                    padding: '4px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{link}</span>
                  {link === 'Bookings' && bookings.length > 0 && (
                    <span style={{
                      backgroundColor: '#344C3D',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      padding: '2px 7px',
                      borderRadius: '999px',
                      fontWeight: 700,
                    }}>
                      {bookings.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Teacher Info */}
          <div style={{
            paddingTop: '24px',
            borderTop: '1px solid #E7E2D9',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: '#DFE8E2',
              border: '1px solid #C4D3C9',
            }}>
              <img
                src="/assets/teacher_ananya.jpg"
                alt="Teacher"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#1C2621' }}>Ananya Sharma</p>
              <p style={{ fontSize: '12px', color: '#57635C' }}>Teacher ID: tch_921</p>
            </div>
          </div>

          {/* WebSocket Status */}
          <div style={{
            backgroundColor: '#EBF1ED',
            padding: '10px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#273A2E',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Radio size={14} style={{ color: '#273A2E' }} className="animate-pulse-glow" />
            <div>
              <p style={{ fontWeight: 600 }}>WebSocket Live</p>
              <p style={{ fontSize: '10px', color: '#57635C' }}>teacher:ananya:cal</p>
            </div>
          </div>
        </aside>

        {/* Main Content Area matching Wireframe 1 */}
        <main>
          {/* Greeting */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '40px',
              fontWeight: 400,
              color: '#1C2621',
              lineHeight: 1.2,
            }}>
              Good morning, [Teacher name]
            </h2>
            <p style={{ fontSize: '15px', color: '#57635C', marginTop: '4px' }}>
              Here is your live schedule for today. New student bookings sync instantly without page refresh.
            </p>
          </div>

          {/* 3 Stat Cards matching Wireframe 1 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '32px',
          }}>
            {/* Card 1: Classes this week */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E7E2D9',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <p style={{ fontSize: '13px', color: '#57635C', marginBottom: '8px' }}>
                Classes this week
              </p>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '36px',
                fontWeight: 500,
                color: '#1C2621',
              }}>
                [{teacherStats.classesThisWeek}]
              </div>
            </div>

            {/* Card 2: Open slots */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E7E2D9',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <p style={{ fontSize: '13px', color: '#57635C', marginBottom: '8px' }}>
                Open slots
              </p>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '36px',
                fontWeight: 500,
                color: '#1C2621',
              }}>
                [{teacherStats.openSlots}]
              </div>
            </div>

            {/* Card 3: Earned this month */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E7E2D9',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <p style={{ fontSize: '13px', color: '#57635C', marginBottom: '8px' }}>
                Earned this month
              </p>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '36px',
                fontWeight: 500,
                color: '#1C2621',
              }}>
                ₹[{teacherStats.earnedThisMonth.toLocaleString('en-IN')}]
              </div>
            </div>
          </div>

          {/* Schedule Card matching Wireframe 1 */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E7E2D9',
            borderRadius: '12px',
            padding: '28px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            {/* Header: Wednesday 21 October */}
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '26px',
              fontWeight: 500,
              color: '#1C2621',
              paddingBottom: '20px',
              borderBottom: '1px solid #E7E2D9',
              marginBottom: '20px',
            }}>
              Wednesday 21 October
            </h3>

            {/* List of Time Slots */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
              {/* Row 1: 7:00 AM */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 16px',
                fontSize: '15px',
                color: '#1C2621',
              }}>
                <div>
                  <strong>7:00 AM</strong> · Morning Flow
                </div>
                <div style={{ color: '#57635C', fontSize: '14px' }}>
                  3 of 8 booked
                </div>
              </div>

              {/* Row 2: 9:30 AM (The Highlighted New Booking row from Wireframe 1!) */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                fontSize: '15px',
                borderRadius: '8px',
                backgroundColor: isBooked930 ? '#DFE8E2' : '#F7F5F0',
                border: isBooked930 ? '1px solid #B8CCC0' : '1px solid #E7E2D9',
                transition: 'all 0.3s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong>9:30 AM</strong> · [{studentDisplayName}] · {isBooked930 ? 'New booking' : 'Available slot'}
                  {isBooked930 && (
                    <span style={{
                      backgroundColor: '#344C3D',
                      color: '#FFFFFF',
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 700,
                      letterSpacing: '0.5px',
                    }}>
                      LIVE SYNC
                    </span>
                  )}
                </div>
                <div style={{
                  fontWeight: 600,
                  color: isBooked930 ? '#273A2E' : '#57635C',
                  fontSize: '15px',
                }}>
                  {isBooked930 ? 'Paid ₹[PRICE]' : 'Open'}
                </div>
              </div>

              {/* Row 3: 6:00 PM */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 16px',
                fontSize: '15px',
                color: '#1C2621',
              }}>
                <div>
                  <strong>6:00 PM</strong> · Evening Restore
                </div>
                <div style={{ color: '#57635C', fontSize: '14px' }}>
                  Open
                </div>
              </div>
            </div>

            {/* Action Buttons matching Wireframe 1 */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={() => setRescheduleModalOpen(true)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '8px',
                  border: '1px solid #344C3D',
                  backgroundColor: '#FFFFFF',
                  color: '#344C3D',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Reschedule
              </button>

              <button
                onClick={() => blockSlot('Wed 21', '6:00 PM')}
                style={{
                  padding: '10px 22px',
                  borderRadius: '8px',
                  border: '1px solid #344C3D',
                  backgroundColor: '#FFFFFF',
                  color: '#344C3D',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Block time
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Reschedule Modal */}
      {rescheduleModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            width: '420px',
            boxShadow: 'var(--shadow-lg)',
          }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: '12px' }}>
              Reschedule Class Slot
            </h4>
            <p style={{ fontSize: '14px', color: '#57635C', marginBottom: '16px' }}>
              Move student <strong>{studentDisplayName}</strong> from Wednesday 21 Oct, 9:30 AM to another open slot.
            </p>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Select New Day & Time:
              </label>
              <select
                value={targetDayToReschedule}
                onChange={(e) => setTargetDayToReschedule(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #D5CEBF',
                  fontSize: '14px',
                }}
              >
                <option value="Thu 22">Thursday 22 Oct - 9:30 AM</option>
                <option value="Fri 23">Friday 23 Oct - 9:30 AM</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setRescheduleModalOpen(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #D5CEBF',
                  background: 'none',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRescheduleSubmit}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#344C3D',
                  color: '#FFFFFF',
                  fontWeight: 600,
                }}
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
