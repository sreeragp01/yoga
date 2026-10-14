import React from 'react';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { Navbar } from './components/Navbar';
import { StudentWebView } from './components/StudentWebView';
import { MobileSimulatorView } from './components/MobileSimulatorView';
import { TeacherDashboardView } from './components/TeacherDashboardView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { DualLiveDemoView } from './components/DualLiveDemoView';
import { RazorpayModal } from './components/RazorpayModal';

const AppContent: React.FC = () => {
  const { activeView } = usePlatform();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-canvas)' }}>
      <Navbar />

      <main style={{ flex: 1, paddingBottom: '60px' }}>
        {activeView === 'student_web' && <StudentWebView />}
        {activeView === 'student_mobile' && <MobileSimulatorView />}
        {activeView === 'teacher_portal' && <TeacherDashboardView />}
        {activeView === 'admin_panel' && <AdminDashboardView />}
        {activeView === 'dual_live' && <DualLiveDemoView />}
      </main>

      <RazorpayModal />

      {/* Production System Footer */}
      <footer style={{
        borderTop: '1px solid #E7E2D9',
        backgroundColor: '#FFFFFF',
        padding: '24px',
        fontSize: '13px',
        color: '#57635C',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div>
            <strong style={{ color: '#1C2621' }}>Prāṇa Yoga Booking Platform</strong> — Unified Turborepo Production Architecture (Web + iOS + Android)
          </div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '12px' }}>
            <span>PostgreSQL GiST Exclusion Constraints</span>
            <span>·</span>
            <span>Redis 10m Holds</span>
            <span>·</span>
            <span>Razorpay Standard & UPI</span>
            <span>·</span>
            <span>Apple Pay Domestic</span>
            <span>·</span>
            <span>WebSockets</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PlatformProvider>
      <AppContent />
    </PlatformProvider>
  );
};

export default App;
