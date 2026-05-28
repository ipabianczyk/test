import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { A11yProvider } from './components/A11yProvider';
import { useA11y } from './components/A11yProvider';
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
import { Menu, X, Phone, ShieldAlert, Accessibility } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function ScrollToTop() {
  const { pathname, search } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
}

function MainLayoutShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#f6f6f6] text-neutral-800 transition-colors duration-200">
      
      {/* Mobile Top Header (Fixed floating style) */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200/50 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 border border-neutral-200/70 hover:bg-neutral-50 rounded-xl transition-colors"
            aria-label="Otwórz menu"
          >
            <Menu className="w-5 h-5 text-neutral-700" />
          </button>
          
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center text-white text-md font-black italic">
              M
            </div>
            <span className="font-black text-md tracking-tighter text-neutral-900">
              MostPomocy
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <a 
            href={`tel:${SITE_CONFIG.contact.emergency_phone}`}
            className="px-3 py-1.5 bg-rose-600 font-black text-[10px] uppercase tracking-wider text-white rounded-xl flex items-center gap-1.5 shadow-sm animate-pulse"
          >
            <Phone className="w-3 h-3" /> SOS 24H
          </a>
        </div>
      </header>

      {/* Responsive Three-Column Container */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 xl:px-8 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUMN 1: LEFT SIDEBAR (Desktop - Sticky) */}
          <div className="hidden lg:block lg:col-span-3 xl:col-span-3 sticky top-6 h-[calc(100vh-3rem)] max-h-[850px]">
            <LeftSidebar />
          </div>

          {/* COLUMN 2: MAIN CONTENT AREA (Center - Feed-style card wrapper) */}
          <main 
            id="main-content" 
            className="col-span-1 lg:col-span-6 xl:col-span-6 bg-white rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm border border-neutral-200/60 min-h-[calc(100vh-6rem)] overflow-hidden"
          >
            {children}
          </main>

          {/* COLUMN 3: RIGHT SIDEBAR (Desktop - Sticky widgets) */}
          <div className="hidden lg:block lg:col-span-3 xl:col-span-3 sticky top-6 h-[calc(100vh-3rem)] overflow-y-auto no-scrollbar max-h-[900px]">
            <RightSidebar />
          </div>

        </div>
      </div>

      {/* Mobile Slider Menu (Left sidebar drawer) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-[280px] bg-white z-50 p-4 shadow-2xl overflow-y-auto lg:hidden"
            >
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-neutral-100">
                <span className="font-black text-lg text-neutral-900 tracking-tighter">Menu Portalu</span>
                <button 
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500"
                  aria-label="Zamknij menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="h-[calc(100vh-6rem)]">
                <LeftSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Tiny SOS emergency ribbon for fine mobile utility */}
      <div className="block lg:hidden border-t-2 border-rose-500 bg-rose-50 p-4 text-center mt-6 mb-20 rounded-t-3xl shadow-inner mx-4">
        <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping mr-2" />
        <span className="text-xs font-black text-rose-900 uppercase tracking-wider">Potrzebujesz natychmiastowej rozmowy? </span>
        <a href="tel:116123" className="block text-sm font-black text-rose-600 font-mono mt-1 hover:underline">Zadzwoń: 116 123 (Darmowy)</a>
      </div>

      {/* Sticky Mobile Nav bar */}
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
