import React, { useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { Shield, TrendingUp, Users, CalendarCheck, CheckCircle2, AlertTriangle, RefreshCw, Sliders } from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { adminStats, auditLogs, bookings, cancelBooking } = usePlatform();

  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'teachers' | 'settings'>('overview');
  const [teachers, setTeachers] = useState([
    { id: 't1', name: 'Ananya Sharma', email: 'ananya@pranayoga.com', status: 'APPROVED', style: 'Hatha & Vinyasa', classes: 12 },
    { id: 't2', name: 'Vikram Mehta', email: 'vikram@pranayoga.com', status: 'APPROVED', style: 'Ashtanga Yoga', classes: 8 },
    { id: 't3', name: 'Devika Pillai', email: 'devika@pranayoga.com', status: 'PENDING_APPROVAL', style: 'Kundalini & Breathwork', classes: 0 },
  ]);

  const toggleTeacherApproval = (id: string) => {
    setTeachers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === 'APPROVED' ? 'PENDING_APPROVAL' : 'APPROVED' } : t
      )
    );
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Admin Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Shield size={20} color="#344C3D" />
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: '#1C2621' }}>
              Studio Owner & Admin Command Center
            </h1>
          </div>
          <p style={{ fontSize: '14px', color: '#57635C' }}>
            Real-time multi-tenant visibility across bookings, transactions, teacher payouts, and database constraints.
          </p>
        </div>

        {/* Tab Controls */}
        <div style={{
          display: 'flex',
          backgroundColor: '#EFECE6',
          padding: '4px',
          borderRadius: '8px',
          gap: '4px',
        }}>
          {[
            { id: 'overview' as const, label: 'Overview' },
            { id: 'audit' as const, label: 'Live Audit Log' },
            { id: 'teachers' as const, label: 'Teachers' },
            { id: 'settings' as const, label: 'Policies' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '13px',
                fontWeight: activeTab === tab.id ? 600 : 500,
                backgroundColor: activeTab === tab.id ? '#FFFFFF' : 'transparent',
                color: activeTab === tab.id ? '#344C3D' : '#57635C',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 Real-time Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '32px',
      }}>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7E2D9', borderRadius: '12px', padding: '20px' }}>
          <p style={{ fontSize: '12px', color: '#57635C', fontWeight: 600, textTransform: 'uppercase' }}>
            Total Platform Volume
          </p>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 600, color: '#1C2621', margin: '4px 0' }}>
            ₹{adminStats.totalRevenue.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '12px', color: '#273A2E', backgroundColor: '#DFE8E2', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
            +18.4% this month
          </span>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7E2D9', borderRadius: '12px', padding: '20px' }}>
          <p style={{ fontSize: '12px', color: '#57635C', fontWeight: 600, textTransform: 'uppercase' }}>
            Confirmed Bookings
          </p>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 600, color: '#1C2621', margin: '4px 0' }}>
            {adminStats.confirmedBookings}
          </div>
          <span style={{ fontSize: '12px', color: '#57635C' }}>
            Across web and mobile apps
          </span>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7E2D9', borderRadius: '12px', padding: '20px' }}>
          <p style={{ fontSize: '12px', color: '#57635C', fontWeight: 600, textTransform: 'uppercase' }}>
            Active Teachers
          </p>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 600, color: '#1C2621', margin: '4px 0' }}>
            {adminStats.activeTeachers}
          </div>
          <span style={{ fontSize: '12px', color: '#57635C' }}>
            1 KYC pending review
          </span>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7E2D9', borderRadius: '12px', padding: '20px' }}>
          <p style={{ fontSize: '12px', color: '#57635C', fontWeight: 600, textTransform: 'uppercase' }}>
            Concurrency Defense
          </p>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 600, color: '#273A2E', margin: '4px 0' }}>
            PostgreSQL GiST
          </div>
          <span style={{ fontSize: '12px', color: '#273A2E', backgroundColor: '#DFE8E2', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
            Exclusion Constraints ON
          </span>
        </div>
      </div>

      {/* Tab 1: Overview & Recent Transactions */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
          {/* Recent Live Bookings Table */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7E2D9', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', marginBottom: '16px' }}>
              Real-time Bookings & Payments Stream
            </h3>
            {bookings.length === 0 ? (
              <p style={{ color: '#57635C', fontSize: '14px', padding: '24px 0', textAlign: 'center' }}>
                No new bookings created in this session. Book a slot from the Web or Mobile view to see it log here live!
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E7E2D9', textAlign: 'left', color: '#57635C' }}>
                      <th style={{ padding: '8px 12px' }}>Student</th>
                      <th style={{ padding: '8px 12px' }}>Session</th>
                      <th style={{ padding: '8px 12px' }}>Method</th>
                      <th style={{ padding: '8px 12px' }}>Amount</th>
                      <th style={{ padding: '8px 12px' }}>Status</th>
                      <th style={{ padding: '8px 12px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} style={{ borderBottom: '1px solid #F3EFE9' }}>
                        <td style={{ padding: '12px' }}>
                          <strong>{b.studentName}</strong>
                          <div style={{ fontSize: '11px', color: '#57635C' }}>{b.studentEmail}</div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          {b.dayLabel} at {b.timeSlot}
                          <div style={{ fontSize: '11px', color: '#57635C' }}>{b.teacherName}</div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ backgroundColor: '#EFECE6', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                            {b.paymentMethod}
                          </span>
                        </td>
                        <td style={{ padding: '12px', fontWeight: 600 }}>
                          ₹{b.priceInr}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            backgroundColor: b.status === 'CONFIRMED' ? '#DFE8E2' : '#FCEBEA',
                            color: b.status === 'CONFIRMED' ? '#273A2E' : '#A12B26',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontWeight: 600,
                            fontSize: '11px',
                          }}>
                            {b.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          {b.status === 'CONFIRMED' && (
                            <button
                              onClick={() => cancelBooking(b.id)}
                              style={{
                                border: '1px solid #D5CEBF',
                                background: 'none',
                                color: '#A12B26',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                cursor: 'pointer',
                              }}
                            >
                              Refund & Cancel
                            </button>
                          )}
                          {b.status === 'CANCELLED' && (
                            <span style={{ fontSize: '11px', color: '#57635C' }}>
                              Refunded ₹{b.refundAmount}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Live WebSocket Event Stream Box */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7E2D9', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px' }}>
                WebSocket Channel Stream
              </h3>
              <span style={{
                fontSize: '11px',
                backgroundColor: '#DFE8E2',
                color: '#273A2E',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: 600,
              }}>
                Redis Pub/Sub
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    backgroundColor: '#FAF8F5',
                    border: '1px solid #E7E2D9',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ color: '#344C3D', fontSize: '11px' }}>{log.event}</strong>
                    <span style={{ color: '#828E87', fontSize: '10px' }}>{log.time}</span>
                  </div>
                  <p style={{ color: '#1C2621', lineHeight: 1.4 }}>{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Full Audit Log */}
      {activeTab === 'audit' && (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7E2D9', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: '16px' }}>
            Full System Audit Log
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {auditLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderBottom: '1px solid #F3EFE9',
                  fontSize: '13px',
                }}
              >
                <div>
                  <span style={{
                    display: 'inline-block',
                    width: '180px',
                    fontWeight: 600,
                    color: '#344C3D',
                  }}>
                    {log.event}
                  </span>
                  <span>{log.details}</span>
                </div>
                <span style={{ color: '#828E87', fontSize: '12px' }}>{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Teachers */}
      {activeTab === 'teachers' && (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7E2D9', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: '16px' }}>
            Teacher Management & Approvals
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {teachers.map((t) => (
              <div
                key={t.id}
                style={{
                  border: '1px solid #E7E2D9',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 600 }}>{t.name}</h4>
                  <p style={{ fontSize: '13px', color: '#57635C' }}>{t.style} · {t.email}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: t.status === 'APPROVED' ? '#DFE8E2' : '#FAF2E6',
                    color: t.status === 'APPROVED' ? '#273A2E' : '#875317',
                  }}>
                    {t.status}
                  </span>
                  <button
                    onClick={() => toggleTeacherApproval(t.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #D5CEBF',
                      backgroundColor: '#FFFFFF',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    {t.status === 'APPROVED' ? 'Suspend' : 'Approve'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Studio Policies */}
      {activeTab === 'settings' && (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7E2D9', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: '16px' }}>
            Platform Policy Configuration
          </h3>
          <div style={{ maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Hold Duration (Redis Lock)
              </label>
              <input
                type="text"
                defaultValue="10 minutes (600 seconds)"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D5CEBF' }}
                disabled
              />
              <span style={{ fontSize: '11px', color: '#57635C' }}>Ensures zero race-condition overbooking during checkout.</span>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Full Refund Cancellation Notice
              </label>
              <input
                type="text"
                defaultValue="24 hours before class start"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D5CEBF' }}
                disabled
              />
              <span style={{ fontSize: '11px', color: '#57635C' }}>Cancellations &gt;24h get 100% refund; 4-24h get 50%; &lt;4h get 0%.</span>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Platform Commission Fee
              </label>
              <input
                type="text"
                defaultValue="15% (Razorpay Route automated split)"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D5CEBF' }}
                disabled
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
