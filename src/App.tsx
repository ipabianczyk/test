import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { A11yProvider } from './components/A11yProvider';
import { useA11y } from './components/A11yProvider';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminBar from './components/AdminBar';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import CategoryPage from './pages/CategoryPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import SupportFinder from './pages/SupportFinder';
import GkrpaIntervention from './pages/GkrpaIntervention';
import SelfCheckPage from './pages/SelfCheckPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contact from './pages/Contact';
import Bezpiecznik from './pages/Bezpiecznik';
import CrisisDictionary from './pages/CrisisDictionary';
import NeedsFinder from './pages/NeedsFinder';
import ZenZone from './pages/ZenZone';
import QuickHelp from './pages/QuickHelp';
import ArticleCreator from './pages/ArticleCreator';
import { SITE_CONFIG } from './data/siteConfig';
import { motion, AnimatePresence } from 'motion/react';

function ScrollToTop() {
  const { pathname, search } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
}

function MainLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 transition-colors duration-200">
      
      {/* 1. Global Stateful Secret Admin Ribbon */}
      <AdminBar />

      {/* 2. Top Navigation Hub */}
      <Header />

      {/* 3. Main Wide Centered Content Canvas with plenty of breathing room */}
      <main 
        id="main-content" 
        className="max-w-7xl mx-auto px-4 sm:px-10 py-8 sm:py-12 min-h-[80vh] overflow-hidden"
      >
        {children}
      </main>

      {/* 4. Brand Footer with Hidden Admin double click options */}
      <Footer />

      {/* 5. Mobile Only Overlay Emergency Callout */}
      <div className="block lg:hidden border-t-2 border-rose-500 bg-rose-50 p-4 text-center mt-6 mb-20 rounded-t-3xl shadow-inner mx-4">
        <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping mr-2" />
        <span className="text-xs font-black text-rose-900 uppercase tracking-wider">Potrzebujesz natychmiastowej rozmowy? </span>
        <a href="tel:116123" className="block text-sm font-black text-rose-600 font-mono mt-1 hover:underline">Zadzwoń: 116 123 (Darmowy)</a>
      </div>

      {/* 6. Sticky Bottom Mobile Nav bar */}
      <BottomNav />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    document.title = `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`;
    
    // Dynamic SEO
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", SITE_CONFIG.description);
    }
  }, []);

  return (
    <A11yProvider>
      <HashRouter>
        <ScrollToTop />
        <MainLayoutShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dash" element={<QuickHelp />} />
            <Route path="/mapa" element={<MapPage />} />
            <Route path="/mapa/:id" element={<CategoryPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/potrzebomat" element={<SupportFinder />} />
            <Route path="/gkrpa-interwencja" element={<GkrpaIntervention />} />
            <Route path="/autodiagnoza" element={<SelfCheckPage />} />
            <Route path="/polityka-prywatnosci" element={<PrivacyPolicy />} />
            <Route path="/kontakt" element={<Contact />} />
            <Route path="/bezpiecznik" element={<Bezpiecznik />} />
            <Route path="/slownik-kryzysowy" element={<CrisisDictionary />} />
            <Route path="/znajdz-potrzebe" element={<NeedsFinder />} />
            <Route path="/strefa-spokoju" element={<ZenZone />} />
            <Route path="/kreator-artykulow" element={<ArticleCreator />} />
          </Routes>
        </MainLayoutShell>
      </HashRouter>
    </A11yProvider>
  );
}
