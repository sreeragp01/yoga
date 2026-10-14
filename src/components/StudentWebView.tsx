import React, { useState } from 'react';
import { usePlatform, PaymentMethod } from '../context/PlatformContext';
import { Clock, ShieldCheck, CheckCircle2, ChevronRight, User, AlertCircle } from 'lucide-react';

export const StudentWebView: React.FC = () => {
  const {
    selectedDay,
    selectedSlot,
    selectSlot,
    schedule,
    holdCountdown,
    triggerCheckout,
    bookings,
    downloadICS,
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<'booking' | 'my_bookings'>('booking');

  const daysOrder = ['Mon 19', 'Tue 20', 'Wed 21', 'Thu 22', 'Fri 23'];
  const userConfirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED');

  const formatHoldTime = (sec: number | null) => {
    if (sec === null || sec <= 0) return '00:00';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Studio Header matching Wireframe 3 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '24px',
        borderBottom: '1px solid #E7E2D9',
        marginBottom: '32px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h1 style={{
            fontSize: '28px',
            fontFamily: 'var(--font-serif)',
            fontWeight: 500,
            letterSpacing: '0.5px',
            color: '#1C2621',
          }}>
            [STUDIO NAME]
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <button
            onClick={() => setActiveTab('booking')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '15px',
              fontWeight: activeTab === 'booking' ? 600 : 400,
              color: activeTab === 'booking' ? '#1C2621' : '#57635C',
              paddingBottom: '4px',
              borderBottom: activeTab === 'booking' ? '2px solid #344C3D' : '2px solid transparent',
            }}
          >
            Classes
          </button>
          <button
            onClick={() => setActiveTab('booking')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '15px',
              color: '#57635C',
            }}
          >
            Teachers
          </button>
          <button
            onClick={() => setActiveTab('my_bookings')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '15px',
              fontWeight: activeTab === 'my_bookings' ? 600 : 400,
              color: activeTab === 'my_bookings' ? '#1C2621' : '#57635C',
              paddingBottom: '4px',
              borderBottom: activeTab === 'my_bookings' ? '2px solid #344C3D' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>My bookings</span>
            {userConfirmedBookings.length > 0 && (
              <span style={{
                backgroundColor: '#344C3D',
                color: '#FFFFFF',
                fontSize: '11px',
                padding: '1px 6px',
                borderRadius: '999px',
                fontWeight: 600,
              }}>
                {userConfirmedBookings.length}
              </span>
            )}
          </button>
          <div style={{
            border: '1px solid #D5CEBF',
            padding: '7px 18px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#1C2621',
            backgroundColor: '#FFFFFF',
          }}>
            Sign in
          </div>
        </div>
      </div>

      {activeTab === 'my_bookings' ? (
        /* My Bookings View */
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E7E2D9', padding: '32px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginBottom: '20px' }}>Your Confirmed Bookings</h2>
          {userConfirmedBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#57635C' }}>
              <p style={{ fontSize: '16px', marginBottom: '16px' }}>No active bookings yet.</p>
              <button
                onClick={() => setActiveTab('booking')}
                style={{
                  backgroundColor: '#344C3D',
                  color: '#FFFFFF',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '14px',
                }}
              >
                Explore & Book a Class
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {userConfirmedBookings.map((b) => (
                <div
                  key={b.id}
                  style={{
                    border: '1px solid #E7E2D9',
                    borderRadius: '8px',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#FAF8F5',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{
                        backgroundColor: '#DFE8E2',
                        color: '#273A2E',
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: 600,
                      }}>
                        CONFIRMED
                      </span>
                      <span style={{ fontSize: '13px', color: '#57635C' }}>ID: {b.id}</span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', margin: '4px 0' }}>
                      {b.classTitle} with {b.teacherName}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#57635C' }}>
                      {b.fullDate} at {b.timeSlot} · Paid ₹{b.priceInr} via {b.paymentMethod}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => downloadICS(b)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '6px',
                        border: '1px solid #D5CEBF',
                        backgroundColor: '#FFFFFF',
                        fontSize: '13px',
                        fontWeight: 500,
                      }}
                    >
                      Add to Calendar (.ics)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Main Booking View */
        <>
          {/* Top Hold Banner (Server 10-Minute Lock) */}
          <div style={{
            backgroundColor: '#FAF2E6',
            border: '1px solid #E6D2B5',
            borderRadius: '8px',
            padding: '10px 16px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13px',
            color: '#714B15',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} />
              <span>
                <strong>10-Minute Slot Hold Active:</strong> Your selected slot (<strong>{selectedDay}, {selectedSlot}</strong>) is currently locked for you in Redis. Nobody else can book it while checkout is pending.
              </span>
            </div>
            <span style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9C3A3',
              padding: '2px 10px',
              borderRadius: '999px',
              fontFamily: 'monospace',
              fontWeight: 700,
              fontSize: '13px',
            }}>
              ⏱ {formatHoldTime(holdCountdown)}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '36px', alignItems: 'start' }}>
            {/* Left Column: Teacher Card (Wireframe 3) */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E7E2D9',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
            }}>
              {/* Teacher Avatar & Initials Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  backgroundColor: '#E5ECE7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #D0DDD4',
                  position: 'relative',
                }}>
                  <img
                    src="/assets/teacher_ananya.jpg"
                    alt="Teacher portrait"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '20px',
                    color: '#344C3D',
                    fontWeight: 600,
                  }}>
                    [AS]
                  </span>
                </div>
                <div>
                  <h2 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '24px',
                    fontWeight: 500,
                    color: '#1C2621',
                    lineHeight: 1.2,
                  }}>
                    [Teacher name]
                  </h2>
                  <span style={{ fontSize: '13px', color: '#57635C' }}>Ananya Sharma</span>
                </div>
              </div>

              {/* Subtitle / Details */}
              <p style={{
                fontSize: '14px',
                color: '#57635C',
                marginBottom: '12px',
                fontWeight: 500,
              }}>
                Hatha and Vinyasa · 60 min · English, Malayalam
              </p>

              {/* Short Bio */}
              <p style={{
                fontSize: '14px',
                color: '#1C2621',
                lineHeight: 1.5,
                marginBottom: '20px',
              }}>
                [Short teacher bio, two lines.]<br />
                Mindful breathwork, alignment-focused flow, and restorative deep stretch.
              </p>

              {/* Price Per Class */}
              <div style={{
                paddingTop: '16px',
                borderTop: '1px solid #E7E2D9',
                display: 'flex',
                alignItems: 'baseline',
                gap: '4px',
              }}>
                <span style={{
                  fontSize: '20px',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 600,
                  color: '#1C2621',
                }}>
                  ₹[PRICE]
                </span>
                <span style={{ fontSize: '14px', color: '#57635C' }}>per class (₹1,200)</span>
              </div>
            </div>

            {/* Right Column: Calendar Grid & Schedule (Wireframe 3) */}
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '32px',
                  fontWeight: 500,
                  color: '#1C2621',
                  marginBottom: '4px',
                }}>
                  Choose a time
                </h2>
                <p style={{ fontSize: '14px', color: '#57635C' }}>
                  Week of 19 October · times shown in your local time
                </p>
              </div>

              {/* 5-Column Week Calendar Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '12px',
                marginBottom: '32px',
              }}>
                {daysOrder.map((dayKey) => {
                  const daySchedule = schedule[dayKey];
                  if (!daySchedule) return null;

                  return (
                    <div key={dayKey} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {/* Column Header */}
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#1C2621',
                        paddingBottom: '8px',
                        textAlign: 'center',
                      }}>
                        {daySchedule.label}
                      </div>

                      {/* Slot Buttons */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {daySchedule.slots.map((slot) => {
                          const isSelected = selectedDay === dayKey && selectedSlot === slot.time;
                          const isFull = slot.status === 'FULL' || slot.status === 'CONFIRMED';

                          if (isFull && !isSelected) {
                            return (
                              <div
                                key={slot.id}
                                style={{
                                  backgroundColor: '#EFECE6',
                                  border: '1px solid #DCD6CA',
                                  borderRadius: '8px',
                                  padding: '12px 6px',
                                  textAlign: 'center',
                                  fontSize: '13px',
                                  color: '#7B857F',
                                  cursor: 'not-allowed',
                                  fontWeight: 500,
                                }}
                              >
                                {slot.time} · Full
                              </div>
                            );
                          }

                          return (
                            <button
                              key={slot.id}
                              onClick={() => selectSlot(dayKey, slot.time)}
                              style={{
                                backgroundColor: isSelected ? '#344C3D' : '#FFFFFF',
                                color: isSelected ? '#FFFFFF' : '#1C2621',
                                border: isSelected ? '1px solid #344C3D' : '1px solid #D5CEBF',
                                borderRadius: '8px',
                                padding: '12px 6px',
                                textAlign: 'center',
                                fontSize: '14px',
                                fontWeight: isSelected ? 600 : 500,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                boxShadow: isSelected ? '0 2px 8px rgba(52, 76, 61, 0.25)' : 'none',
                              }}
                            >
                              {slot.time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Card: "Your booking" matching Wireframe 3 */}
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E2D9',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '24px',
                  fontWeight: 500,
                  color: '#1C2621',
                  marginBottom: '12px',
                }}>
                  Your booking
                </h3>

                <div style={{ marginBottom: '8px' }}>
                  <p style={{ fontSize: '16px', fontWeight: 600, color: '#1C2621' }}>
                    {schedule[selectedDay]?.fullDate || 'Wednesday 21 October'}, {selectedSlot}
                  </p>
                  <p style={{ fontSize: '14px', color: '#57635C' }}>
                    [Teacher name] (Ananya Sharma), 60 min
                  </p>
                </div>

                <p style={{
                  fontSize: '13px',
                  color: '#57635C',
                  marginBottom: '20px',
                }}>
                  Free reschedule up to [24] hours before
                </p>

                {/* Total Line */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  paddingTop: '16px',
                  borderTop: '1px solid #E7E2D9',
                  marginBottom: '20px',
                }}>
                  <span style={{ fontSize: '16px', fontWeight: 600, color: '#1C2621' }}>
                    Total
                  </span>
                  <span style={{
                    fontSize: '22px',
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 600,
                    color: '#1C2621',
                  }}>
                    ₹[PRICE] <span style={{ fontSize: '15px', fontWeight: 500, color: '#57635C' }}>(₹1,200)</span>
                  </span>
                </div>

                {/* 4 Payment Buttons matching Wireframe 3 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Button 1: Pay with UPI (Solid dark green) */}
                  <button
                    onClick={() => triggerCheckout('UPI')}
                    style={{
                      backgroundColor: '#344C3D',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '14px',
                      fontSize: '15px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>Pay with UPI</span>
                  </button>

                  {/* Button 2: Card (Outline) */}
                  <button
                    onClick={() => triggerCheckout('CARD')}
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#1C2621',
                      border: '1px solid #D5CEBF',
                      borderRadius: '8px',
                      padding: '13px',
                      fontSize: '15px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Card
                  </button>

                  {/* Button 3: Apple Pay (Outline) */}
                  <button
                    onClick={() => triggerCheckout('APPLE_PAY')}
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#1C2621',
                      border: '1px solid #D5CEBF',
                      borderRadius: '8px',
                      padding: '13px',
                      fontSize: '15px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Apple Pay
                  </button>

                  {/* Button 4: Netbanking / bank transfer (Outline) */}
                  <button
                    onClick={() => triggerCheckout('NETBANKING')}
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#1C2621',
                      border: '1px solid #D5CEBF',
                      borderRadius: '8px',
                      padding: '13px',
                      fontSize: '15px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Netbanking / bank transfer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
