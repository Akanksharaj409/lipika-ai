import React, { useState } from 'react';
import { Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Header } from '../components/shared/Header';
import { Sidebar } from '../components/shared/Sidebar';
import { MobileNav } from '../components/shared/MobileNav';
import { ToastNotification } from '../components/shared/ToastNotification';
import { BackgroundGrid } from '../components/reactbits/BackgroundGrid';
import { PageTransition } from '../components/reactbits/PageTransition';
import { useInscriptionPipeline } from '../hooks/useInscriptionPipeline';

export const MainLayout: React.FC = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const location = useLocation();
  const pipeline = useInscriptionPipeline('ins-ashoka-03');

  return (
    <div className="relative min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-white/20 selection:text-white overflow-x-hidden">
      {/* Background Ambient Grid Layer */}
      <BackgroundGrid />

      {/* Reusable Header */}
      <Header
        inscriptions={pipeline.allInscriptions}
        activeId={pipeline.activeId}
        onSelectInscription={pipeline.setActiveId}
        onOpenMobileNav={() => setMobileNavOpen(true)}
        onOpenNotifications={() => setToastOpen(true)}
      />

      {/* Main Workspace Split Layout */}
      <div className="relative z-10 flex flex-1 w-full">
        {/* Reusable Sidebar Navigation */}
        <Sidebar />

        {/* Page Container with Subtle Framer Motion Transitions */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <PageTransition routeKey={location.pathname}>
              <Outlet context={pipeline} />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>

      {/* Responsive Mobile Drawer */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Notification Area */}
      <ToastNotification isOpen={toastOpen} onClose={() => setToastOpen(false)} />
    </div>
  );
};

export function usePipelineContext() {
  return useOutletContext<ReturnType<typeof useInscriptionPipeline>>();
}
