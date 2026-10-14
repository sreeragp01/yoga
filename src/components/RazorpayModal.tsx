import React, { useState } from 'react';
import { usePlatform, PaymentMethod } from '../context/PlatformContext';
import { X, QrCode, CreditCard, Apple, Building2, ShieldCheck, Check, Smartphone } from 'lucide-react';
import { api } from '../services/api';

export const RazorpayModal: React.FC = () => {
  const {
    checkoutOpen,
    setCheckoutOpen,
    activePaymentMethod,
    setActivePaymentMethod,
    processPayment,
    selectedDay,
    selectedSlot,
  } = usePlatform();

  const [studentName, setStudentName] = useState('Aarav Sharma');
  const [studentEmail, setStudentEmail] = useState('aarav.sharma@example.com');
  const [studentPhone, setStudentPhone] = useState('+91 98765 43210');

  // Card state
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('10/29');
  const [cardCvv, setCardCvv] = useState('482');

  // OTP Simulation
  const [otpStage, setOtpStage] = useState(false);
  const [otpCode, setOtpCode] = useState('491823');

  if (!checkoutOpen) return null;

  const handlePayNow = async (method: PaymentMethod = activePaymentMethod) => {
    if (method === 'CARD' && !otpStage) {
      setOtpStage(true);
      return;
    }
    
    // Call backend API to initiate official Razorpay order
    await api.createPaymentOrder({
      amountPaise: 120000,
      dayKey: selectedDay,
      slotTime: selectedSlot,
      studentName,
    });

    processPayment(method, studentName, studentEmail);
    setOtpStage(false);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(28, 38, 33, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '16px',
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '540px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid #E7E2D9',
        animation: 'fadeIn 0.2s ease-out',
      }}>
        {/* Gateway Header */}
        <div style={{
          backgroundColor: '#344C3D',
          color: '#FAF8F5',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600 }}>
                PRĀṆA YOGA
              </span>
              <span style={{
                fontSize: '10px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: 600,
              }}>
                Razorpay Test Mode
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#DCE6DE', marginTop: '2px' }}>
              Slot: {selectedDay} Oct, {selectedSlot} · ₹1,200
            </p>
          </div>
          <button
            onClick={() => {
              setCheckoutOpen(false);
              setOtpStage(false);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#FAF8F5',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 3-D Secure OTP Step */}
        {otpStage ? (
          <div style={{ padding: '28px 24px', textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#DFE8E2',
              color: '#344C3D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
            }}>
              <ShieldCheck size={26} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: '8px' }}>
              Bank 3-D Secure Authentication
            </h3>
            <p style={{ fontSize: '13px', color: '#57635C', marginBottom: '20px' }}>
              An authentication OTP has been sent to your registered mobile number for ₹1,200.00.
            </p>
            <div style={{ maxWidth: '240px', margin: '0 auto 20px auto' }}>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  textAlign: 'center',
                  fontSize: '22px',
                  fontWeight: 700,
                  letterSpacing: '6px',
                  border: '2px solid #344C3D',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setOtpStage(false)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: '1px solid #D5CEBF',
                  backgroundColor: '#FFFFFF',
                  fontSize: '14px',
                }}
              >
                Back
              </button>
              <button
                onClick={() => handlePayNow('CARD')}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#344C3D',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Approve & Pay ₹1,200
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '20px 24px' }}>
            {/* Student Details Form */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '1px solid #E7E2D9',
            }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#57635C', display: 'block', marginBottom: '4px' }}>
                  Student Name
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #D5CEBF',
                    fontSize: '13px',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#57635C', display: 'block', marginBottom: '4px' }}>
                  Email for Confirmation
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #D5CEBF',
                    fontSize: '13px',
                  }}
                />
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '6px',
              marginBottom: '20px',
            }}>
              {[
                { id: 'UPI' as const, label: 'UPI', icon: <Smartphone size={16} /> },
                { id: 'CARD' as const, label: 'Card', icon: <CreditCard size={16} /> },
                { id: 'APPLE_PAY' as const, label: 'Apple Pay', icon: <Apple size={16} /> },
                { id: 'NETBANKING' as const, label: 'Bank Transfer', icon: <Building2 size={16} /> },
              ].map((m) => {
                const isSelected = activePaymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setActivePaymentMethod(m.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '10px 4px',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #344C3D' : '1px solid #D5CEBF',
                      backgroundColor: isSelected ? '#DFE8E2' : '#FFFFFF',
                      color: isSelected ? '#344C3D' : '#57635C',
                      fontWeight: isSelected ? 600 : 500,
                      fontSize: '12px',
                    }}
                  >
                    {m.icon}
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Method Content */}
            {activePaymentMethod === 'UPI' && (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <p style={{ fontSize: '13px', color: '#57635C', marginBottom: '12px' }}>
                  Scan dynamic QR with Google Pay, PhonePe, Paytm, or BHIM:
                </p>
                {/* Simulated Dynamic QR Code */}
                <div style={{
                  width: '150px',
                  height: '150px',
                  margin: '0 auto 16px auto',
                  border: '2px solid #344C3D',
                  borderRadius: '12px',
                  padding: '10px',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                    <rect width="100" height="100" fill="#FFFFFF" />
                    <rect x="10" y="10" width="25" height="25" fill="#344C3D" />
                    <rect x="65" y="10" width="25" height="25" fill="#344C3D" />
                    <rect x="10" y="65" width="25" height="25" fill="#344C3D" />
                    <rect x="15" y="15" width="15" height="15" fill="#FFFFFF" />
                    <rect x="70" y="15" width="15" height="15" fill="#FFFFFF" />
                    <rect x="15" y="70" width="15" height="15" fill="#FFFFFF" />
                    <rect x="42" y="20" width="16" height="60" fill="#344C3D" />
                    <rect x="20" y="42" width="60" height="16" fill="#344C3D" />
                    <circle cx="50" cy="50" r="8" fill="#FFFFFF" />
                    <circle cx="50" cy="50" r="4" fill="#344C3D" />
                  </svg>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
                  {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                    <span
                      key={app}
                      style={{
                        fontSize: '11px',
                        backgroundColor: '#EFECE6',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        color: '#1C2621',
                        fontWeight: 500,
                      }}
                    >
                      {app}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handlePayNow('UPI')}
                  style={{
                    width: '100%',
                    backgroundColor: '#344C3D',
                    color: '#FFFFFF',
                    padding: '14px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '15px',
                  }}
                >
                  Simulate UPI Payment Success (₹1,200)
                </button>
              </div>
            )}

            {activePaymentMethod === 'CARD' && (
              <div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#57635C', display: 'block', marginBottom: '4px' }}>
                    Card Number (RBI Tokenization Compliant)
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D5CEBF', fontSize: '14px' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#57635C', display: 'block', marginBottom: '4px' }}>
                      Valid Thru
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D5CEBF', fontSize: '14px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#57635C', display: 'block', marginBottom: '4px' }}>
                      CVV
                    </label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D5CEBF', fontSize: '14px' }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => handlePayNow('CARD')}
                  style={{
                    width: '100%',
                    backgroundColor: '#344C3D',
                    color: '#FFFFFF',
                    padding: '14px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '15px',
                  }}
                >
                  Pay ₹1,200 via Card (Proceed to 3DS)
                </button>
              </div>
            )}

            {activePaymentMethod === 'APPLE_PAY' && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{
                  border: '1px solid #D5CEBF',
                  borderRadius: '12px',
                  padding: '20px',
                  backgroundColor: '#FAF8F5',
                  marginBottom: '20px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                    <Apple size={36} color="#1C2621" />
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: '#1C2621' }}>Apple Pay Sheet Simulation</p>
                  <p style={{ fontSize: '13px', color: '#57635C', margin: '4px 0 12px 0' }}>
                    Domestic Indian Cards enabled via Razorpay integration (Safari & iOS Native)
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '6px',
                    fontSize: '13px',
                  }}>
                    <span>Prāṇa Yoga Pass</span>
                    <strong>₹1,200.00</strong>
                  </div>
                </div>
                <button
                  onClick={() => handlePayNow('APPLE_PAY')}
                  style={{
                    width: '100%',
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    padding: '14px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <Apple size={18} />
                  <span>Pay with Apple Pay</span>
                </button>
              </div>
            )}

            {activePaymentMethod === 'NETBANKING' && (
              <div>
                <p style={{ fontSize: '13px', color: '#57635C', marginBottom: '12px' }}>
                  Per-booking dedicated virtual account for automated NEFT / IMPS reconciliation:
                </p>
                <div style={{
                  backgroundColor: '#F3EFE9',
                  borderRadius: '8px',
                  padding: '16px',
                  fontSize: '13px',
                  marginBottom: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#57635C' }}>Bank:</span>
                    <strong>ICICI Bank Ltd</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#57635C' }}>Virtual Account:</span>
                    <strong style={{ fontFamily: 'monospace' }}>YOGABK98321</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#57635C' }}>IFSC Code:</span>
                    <strong style={{ fontFamily: 'monospace' }}>ICIC0000104</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#57635C' }}>Beneficiary:</span>
                    <strong>Prāṇa Yoga Studios</strong>
                  </div>
                </div>
                <button
                  onClick={() => handlePayNow('NETBANKING')}
                  style={{
                    width: '100%',
                    backgroundColor: '#344C3D',
                    color: '#FFFFFF',
                    padding: '14px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '15px',
                  }}
                >
                  Simulate Bank Transfer Receipt (₹1,200)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
