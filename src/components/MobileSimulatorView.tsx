import React, { useState } from 'react';
import { usePlatform, PaymentMethod } from '../context/PlatformContext';
import { ArrowLeft, Wifi, Battery, Signal, CheckCircle2 } from 'lucide-react';

export const MobileSimulatorView: React.FC = () => {
  const {
    selectedDay,
    setSelectedDay,
    selectedSlot,
    setSelectedSlot,
    triggerCheckout,
    schedule,
  } = usePlatform();

  const [step, setStep] = useState<1 | 2>(1);

  const days = [
    { key: 'Mon 19', label: 'Mon 19' },
    { key: 'Tue 20', label: 'Tue 20' },
    { key: 'Wed 21', label: 'Wed 21' },
    { key: 'Thu 22', label: 'Thu 22' },
  ];

  const currentSlots = schedule[selectedDay]?.slots || [
    { id: '1', time: '7:00 AM', status: 'AVAILABLE' as const },
    { id: '2', time: '9:30 AM', status: 'AVAILABLE' as const },
    { id: '3', time: '6:00 PM', status: 'AVAILABLE' as const },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 16px',
    }}>
      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#1C2621' }}>
          Expo React Native Mobile App (iOS / Android)
        </h2>
        <p style={{ fontSize: '13px', color: '#57635C' }}>
          Interactive simulation of the Expo client matching Wireframe 2. Shares 100% types & booking logic with web.
        </p>
      </div>

      {/* Phone Frame */}
      <div className="mobile-device-frame">
        {/* Notch */}
        <div className="mobile-notch"></div>

        {/* Status Bar */}
        <div style={{
          padding: '12px 24px 6px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          fontWeight: 600,
          color: '#1C2621',
          zIndex: 60,
        }}>
          <span>9:41</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Signal size={12} />
            <Wifi size={12} />
            <Battery size={14} />
          </div>
        </div>

        {/* Mobile Viewport Content */}
        <div style={{
          flex: 1,
          padding: '16px 20px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflowY: 'auto',
        }}>
          <div>
            {/* Nav Row matching Wireframe 2 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  border: '1px solid #D5CEBF',
                  borderRadius: '6px',
                  padding: '5px 12px',
                  backgroundColor: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#1C2621',
                  cursor: 'pointer',
                }}
              >
                Back
              </button>
              <span style={{ fontSize: '12px', color: '#57635C' }}>
                Step {step} of 2
              </span>
            </div>

            {/* Header: [Teacher name] matching Wireframe 2 */}
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '32px',
                fontWeight: 400,
                color: '#1C2621',
                lineHeight: 1.1,
                marginBottom: '4px',
              }}>
                [Teacher name]
              </h2>
              <p style={{ fontSize: '14px', color: '#57635C' }}>
                Hatha and Vinyasa · 60 min · ₹[PRICE]
              </p>
            </div>

            {/* Day Selector Pills matching Wireframe 2 */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '24px',
              overflowX: 'auto',
              paddingBottom: '4px',
            }}>
              {days.map((day) => {
                const isSelected = selectedDay === day.key;
                return (
                  <button
                    key={day.key}
                    onClick={() => setSelectedDay(day.key)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: isSelected ? '1px solid #344C3D' : '1px solid #D5CEBF',
                      backgroundColor: isSelected ? '#344C3D' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : '#1C2621',
                      fontSize: '13px',
                      fontWeight: isSelected ? 600 : 500,
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>

            {/* Date Heading: Wed 21 October */}
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '22px',
              fontWeight: 500,
              color: '#1C2621',
              marginBottom: '16px',
            }}>
              {schedule[selectedDay]?.fullDate || 'Wednesday 21 October'}
            </h3>

            {/* Time Slots List matching Wireframe 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentSlots.map((slot) => {
                const isSelected = selectedSlot === slot.time;
                const isFull = slot.status === 'FULL';

                if (isFull) {
                  return (
                    <div
                      key={slot.id}
                      style={{
                        border: '1px solid #E7E2D9',
                        borderRadius: '8px',
                        padding: '14px',
                        textAlign: 'center',
                        backgroundColor: '#EFECE6',
                        color: '#7B857F',
                        fontSize: '15px',
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
                    onClick={() => setSelectedSlot(slot.time)}
                    style={{
                      border: isSelected ? '1px solid #344C3D' : '1px solid #D5CEBF',
                      borderRadius: '8px',
                      padding: '14px',
                      textAlign: 'center',
                      backgroundColor: isSelected ? '#344C3D' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : '#1C2621',
                      fontSize: '16px',
                      fontWeight: isSelected ? 600 : 500,
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 4px 12px rgba(52,76,61,0.2)' : 'none',
                    }}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sticky Bottom Card matching Wireframe 2 */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E7E2D9',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: 'var(--shadow-md)',
            marginTop: '20px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
            }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#1C2621' }}>
                {selectedDay} Oct, {selectedSlot}
              </span>
              <span style={{
                fontSize: '16px',
                fontFamily: 'var(--font-serif)',
                fontWeight: 600,
                color: '#1C2621',
              }}>
                ₹[PRICE]
              </span>
            </div>

            <button
              onClick={() => triggerCheckout('UPI')}
              style={{
                width: '100%',
                backgroundColor: '#344C3D',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '13px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: '8px',
              }}
            >
              Continue to payment
            </button>

            <p style={{
              fontSize: '11px',
              color: '#57635C',
              textAlign: 'center',
            }}>
              UPI · Card · Apple Pay · Netbanking
            </p>
          </div>
        </div>

        {/* Home Indicator */}
        <div style={{
          width: '120px',
          height: '4px',
          backgroundColor: '#1C2621',
          borderRadius: '999px',
          margin: '0 auto 8px auto',
        }}></div>
      </div>
    </div>
  );
};
