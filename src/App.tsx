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
  }, []);

  return (
    <A11yProvider>
      <HashRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col selection:bg-primary/10 selection:text-primary pb-20 lg:pb-0">
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
            </Routes>
          </main>

          <Footer />
          <ChatWidget />
          <BottomNav />
        </div>
      </HashRouter>
    </A11yProvider>
  );
}

