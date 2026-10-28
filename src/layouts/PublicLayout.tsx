import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { CookieConsentBanner } from '../components/common/CookieConsentBanner';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-700 overflow-x-hidden">
      {/* WCAG 2.1 AA Skip to Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#1E3A8A] focus:text-white focus:rounded-xl focus:shadow-xl focus:font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        Skip to main content
      </a>

      <Navbar />

      <main className="flex-1 w-full bg-white" id="main-content" role="main">
        <Outlet />
      </main>

      <Footer />

      {/* Persistent Privacy and Cookie Consent Notice */}
      <CookieConsentBanner />
    </div>
  );
};
