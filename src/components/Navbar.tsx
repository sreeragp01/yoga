import React from 'react';
import { usePlatform, ViewMode } from '../context/PlatformContext';
import { Smartphone, Monitor, Calendar, ShieldCheck, SplitSquareVertical, RotateCcw, Radio } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeView, setActiveView, resetDemoData, bookings, backendConnected } = usePlatform();

  const navItems: { id: ViewMode; label: string; icon: React.ReactNode; badge?: string } = [
    { id: 'student_web', label: 'Web Booking (Wireframe 3)', icon: <Monitor size={16} /> },
    { id: 'student_mobile', label: 'Mobile App (Wireframe 2)', icon: <Smartphone size={16} /> },
    { 
      id: 'teacher_portal', 
      label: 'Teacher Portal (Wireframe 1)', 
      icon: <Calendar size={16} />,
      badge: bookings.length > 0 ? `${bookings.length} New` : undefined
    },
    { id: 'admin_panel', label: 'Studio Admin', icon: <ShieldCheck size={16} /> },
    { id: 'dual_live', label: 'Live Dual-Screen (Milestone 1 Gate)', icon: <SplitSquareVertical size={16} />, badge: 'Live Test' },
  ];

  return (
    <header style={{
      backgroundColor: '#FAF8F5',
      borderBottom: '1px solid #E7E2D9',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Top Banner Notice for Production Milestone Gate */}
      <div style={{
        backgroundColor: '#344C3D',
        color: '#FAF8F5',
        fontSize: '12px',
        padding: '6px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Radio size={12} className="animate-pulse-glow" style={{ color: '#A3D9B1' }} />
            <strong style={{ letterSpacing: '0.5px' }}>LIVE FULL-STACK ARCHITECTURE:</strong>
            PostgreSQL GiST Schema · 10m Atomic Holds · Real Razorpay Orders · Zero-Latency WebSockets
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: backendConnected ? '#A3D9B1' : '#FCD34D' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: backendConnected ? '#10B981' : '#F59E0B',
              boxShadow: backendConnected ? '0 0 8px #10B981' : 'none',
              display: 'inline-block',
            }} />
            <span>{backendConnected ? 'API & WebSocket Sync Live' : 'Backend Ready'}</span>
          </div>

          <span style={{ color: '#D2DEC5', fontSize: '11px' }}>Asia/Kolkata (UTC+5:30)</span>

          <button
            onClick={resetDemoData}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#FAF8F5',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
            }}
            title="Reset slots and bookings to original wireframe state"
          >
            <RotateCcw size={10} /> Reset Demo
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        {/* Studio Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            fontSize: '24px',
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            letterSpacing: '1px',
            color: '#1C2621',
          }}>
            PRĀṆA YOGA
          </span>
          <span style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            backgroundColor: '#EBF1ED',
            color: '#344C3D',
            padding: '3px 8px',
            borderRadius: '4px',
            fontWeight: 600,
          }}>
            PRODUCTION READY
          </span>
        </div>

        {/* View Switcher Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#EFECE6',
          padding: '4px',
          borderRadius: '10px',
        }}>
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                  color: isActive ? '#344C3D' : '#57635C',
                  boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: '10px',
                    backgroundColor: isActive ? '#344C3D' : '#D0DDD4',
                    color: isActive ? '#FFFFFF' : '#1C2621',
                    padding: '1px 6px',
                    borderRadius: '999px',
                    fontWeight: 700,
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
