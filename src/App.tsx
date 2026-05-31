/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import SosnowiecBezStygmy from './pages/SosnowiecBezStygmy';
import SEOManager from './components/SEOManager';
import { SITE_CONFIG } from './data/siteConfig';
import NewsletterPage from './pages/NewsletterPage';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  React.useEffect(() => {
    if (hash) {
      const timer = setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

export default function App() {
  useEffect(() => {
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
      <BrowserRouter>
        <SEOManager />
        <ScrollToTop />
        <div className="min-h-screen flex flex-col selection:bg-amber-100 selection:text-amber-900 pb-20 lg:pb-0 bg-[#FBF9F4]">
          <Header />
          
          <main id="main-content" className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dash" element={<ArticleCreator />} />
              <Route path="/newsletter" element={<NewsletterPage />} />
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
              <Route path="/sosnowiec-bez-stygmy" element={<SosnowiecBezStygmy />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>

          <Footer />
          <ChatWidget />
          <BottomNav />

          {/* Stały, ukryty/dyskretny przycisk "Szybkie Wyjście (ESC)" */}
          <div className="fixed bottom-22 left-4 lg:bottom-6 lg:right-6 lg:left-auto z-[9999] pointer-events-none">
            <button
              onClick={triggerEmergencyRedirect}
              className="pointer-events-auto bg-rose-600 hover:bg-rose-700 text-white px-4 py-3 rounded-full font-sans text-[10px] font-black uppercase tracking-widest border border-rose-500 shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              title="Szybkie Wyjście ze strony (Skrót: ESC) - natychmiastowe przekierowanie na Google"
            >
              <span className="w-2 h-2 bg-white rounded-full animate-ping" />
              Szybkie wyjście (ESC)
            </button>
          </div>
        </div>
      </BrowserRouter>
    </A11yProvider>
  );
}

