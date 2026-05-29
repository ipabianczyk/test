/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { A11yProvider } from './components/A11yProvider';
import Header from './components/Header';
import Footer from './components/Footer';
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
import ChatWidget from './components/ChatWidget';
import CrisisDictionary from './pages/CrisisDictionary';
import NeedsFinder from './pages/NeedsFinder';
import ZenZone from './pages/ZenZone';
import QuickHelp from './pages/QuickHelp';
import ArticleCreator from './pages/ArticleCreator';
import TeczkaSprawy from './pages/TeczkaSprawy';
import CookieBanner from './components/CookieBanner';
import { SITE_CONFIG } from './data/siteConfig';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  useEffect(() => {
    document.title = `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`;
    
    // Dynamiczne SEO (Uproszczone)
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", SITE_CONFIG.description);
    }

    // Globalny ESC key listener dla natychmiastowego przekierowania (Szybkie Wyjście)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.warn('[Safety Protocol] Escape pressed. Overwriting history and redirecting to google.com...');
        // hard-redirect to google.com replacing back state
        window.location.replace('https://google.com');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const triggerEmergencyRedirect = () => {
    window.location.replace('https://google.com');
  };

  return (
    <A11yProvider>
      <HashRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col selection:bg-amber-100 selection:text-amber-900 pb-20 lg:pb-0 bg-[#FBF9F4]">
          <Header />
          
          <main id="main-content" className="flex-grow">
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
              <Route path="/admin" element={<ArticleCreator />} />
              <Route path="/teczka-sprawy" element={<TeczkaSprawy />} />
            </Routes>
          </main>

          <Footer />
          <ChatWidget />
          <BottomNav />
          <CookieBanner />

          {/* Stały, ukryty/dyskretny przycisk "Szybkie Wyjście (ESC)" */}
          <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none sm:block">
            <button
              onClick={triggerEmergencyRedirect}
              className="pointer-events-auto bg-slate-900 hover:bg-[#0f1412] text-white px-5 py-3 rounded-full font-sans text-[10px] font-black uppercase tracking-widest border border-slate-700 shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              title="Szybkie Wyjście ze strony (Skrót: ESC) - natychmiastowe przekierowanie na Google"
            >
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              Szybkie wyjście (ESC)
            </button>
          </div>
        </div>
      </HashRouter>
    </A11yProvider>
  );
}

