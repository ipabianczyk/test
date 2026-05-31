import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Accessibility, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useA11y } from './A11yProvider';

export const HELP_CATEGORIES = [
  { name: 'Sosnowiec Bez Stygmy', href: '/sosnowiec-bez-stygmy', emoji: '🤝', desc: 'Oficjalna deklaracja równego wsparcia' },
  { name: 'Emocje i Kryzys', href: '/mapa/emocje', emoji: '🆘', desc: 'Szybkie wsparcie psychologiczne' },
  { name: 'Zdrowie psychiczne', href: '/mapa/zdrowie', emoji: '🧠', desc: 'Psychiatra NFZ bez skierowania' },
  { name: 'Uzależnienia/AA', href: '/mapa/uzaleznienia', emoji: '🤝', desc: 'Terapia i darmowe wsparcie' },
  { name: 'Rodzina i Dzieci', href: '/mapa/rodzina', emoji: '👨‍👩‍👧‍👦', desc: 'Pomoc społeczna i wsparcie opiekunów' },
  { name: 'Przemoc domowa', href: '/mapa/przemoc', emoji: '🛡️', desc: 'Interwencja oraz Niebieska Karta' },
];

export const SUB_PAGES = [
  { name: 'Sosnowiec Bez Stygmy', href: '/sosnowiec-bez-stygmy', emoji: '🤝', desc: 'Nasza kampania i równe traktowanie bez wstydu' },
  { name: 'Potrzebomat (Asystent)', href: '/potrzebomat', emoji: '📋', desc: 'Szybkie dopasowanie darmowej pomocy' },
  { name: 'Przygotownik wizyty', href: '/teczka-sprawy', emoji: '📂', desc: 'Checklista i notatki przed pójściem do urzędu' },
  { name: 'Autodiagnoza', href: '/autodiagnoza', emoji: '🩺', desc: 'Oceń objawy i natężenie kryzysu' },
  { name: 'Strefa Spokoju', href: '/strefa-spokoju', emoji: '🧘', desc: 'Trening oddechowy w stanach paniki' },
  { name: 'Baza Wiedzy', href: '/blog', emoji: '🖋️', desc: 'Poradniki, artykuły i zasoby do pobrania' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showA11y, setShowA11y] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);

  const location = useLocation();
  const { 
    fontSize, setFontSize, 
    highContrast, toggleHighContrast,
    underlineLinks, toggleUnderlineLinks,
    dyslexicFont, toggleDyslexicFont,
    reset 
  } = useA11y();

  const navLinks = [
    { name: 'Start', href: '/' },
    { name: 'Baza placówek', href: '/mapa' },
    { name: 'Newsletter', href: '/newsletter' },
    { name: 'Bezpiecznik PDF', href: '/bezpiecznik', pill: true },
    { name: 'Kontakt', href: '/kontakt' },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    setDesktopDropdownOpen(false);
    setMobileCategoriesOpen(false);
    setMobileToolsOpen(false);
    if (location.pathname === href) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogoClick = () => {
    setIsOpen(false);
    setDesktopDropdownOpen(false);
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top A11y Bar / Status Bar style */}
      <div className="bg-slate-900 text-white px-4 sm:px-10 py-2.5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
        <div className="flex gap-6">
          <button onClick={toggleHighContrast} className="hover:text-amber-500 transition-colors">Kontrast</button>
          <button onClick={toggleDyslexicFont} className="hover:text-amber-500 transition-colors hidden sm:inline">Dysleksja</button>
        </div>
        <div className="flex gap-6 items-center">
          <Link to="/potrzebomat" className="flex items-center gap-2 text-rose-400 font-black">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
            SOS
          </Link>
          <span className="text-white/40 hidden sm:inline">MostPomocy.pl</span>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 h-16 md:h-20 flex justify-between items-center text-slate-900">
          {/* Logo - Instagram Style */}
          <Link 
            to="/" 
            onClick={handleLogoClick}
            className="flex items-center gap-3 group transition-transform active:scale-95"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-900 rounded-[12px] flex items-center justify-center text-white text-lg md:text-xl font-black italic tracking-tighter shadow-xl shadow-slate-900/10 group-hover:bg-amber-600 transition-colors">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-black tracking-tighter leading-none group-hover:text-amber-600 transition-colors">MostPomocy</h1>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
              </div>
              <span className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-[#1a211e] font-black">Wiedza • Wsparcie • Nadzieja</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em]">
            {navLinks.filter(l => !l.pill).map((link) => (
              <Link 
                key={link.name} 
                to={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`transition-all duration-300 relative py-2 ${
                  location.pathname === link.href ? 'text-amber-600' : 'text-[#1a211e] hover:text-amber-600'
                }`}
              >
                {link.name}
                {location.pathname === link.href && (
                  <motion.div 
                    layoutId="desktop-nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full"
                  />
                )}
              </Link>
            ))}

            {/* Dynamic, fully responsive categories & subpages dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setDesktopDropdownOpen(true)}
              onMouseLeave={() => setDesktopDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setDesktopDropdownOpen(!desktopDropdownOpen)}
                className={`transition-all duration-300 flex items-center gap-1 py-2 cursor-pointer ${
                  desktopDropdownOpen ? 'text-amber-800' : 'text-[#1a211e] hover:text-amber-600'
                }`}
              >
                SPIS I NARZĘDZIA
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${desktopDropdownOpen ? 'rotate-180 text-amber-600' : 'text-slate-600'}`} />
              </button>

              {/* Mega Dropdown Panel */}
              <AnimatePresence>
                {desktopDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.98 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[720px] bg-white border border-[#EFECE6] rounded-[32px] p-8 z-[200] grid grid-cols-2 gap-8 text-left normal-case tracking-normal shadow-[0_15px_40px_rgba(0,0,0,0.12)] pointer-events-auto"
                  >
                    {/* Left Column: Pages & Tools */}
                    <div className="space-y-4">
                      <div className="border-b border-[#EFECE6] pb-2 flex items-center justify-between">
                        <span className="text-[10px] font-sans font-black uppercase tracking-wider text-slate-900">
                          🗂️ Główne Narzędzia
                        </span>
                        <span className="bg-slate-200 text-[8px] font-mono px-1.5 py-0.5 rounded text-slate-800 font-bold">5 linków</span>
                      </div>
                      <div className="space-y-1 max-h-[360px] overflow-y-auto pr-1">
                        {SUB_PAGES.map((page) => (
                          <Link
                            key={page.href}
                            to={page.href}
                            onClick={() => handleNavClick(page.href)}
                            className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-[#FAF8F3] transition-colors group"
                          >
                            <span className="text-lg shrink-0 group-hover:scale-110 transition-transform">
                              {page.emoji}
                            </span>
                            <div>
                              <h4 className="text-[11px] font-sans font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                                {page.name}
                              </h4>
                              <p className="text-[10px] text-[#1a211e] leading-normal font-semibold mt-0.5">
                                {page.desc}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Support Categories (Baza) */}
                    <div className="space-y-4">
                      <div className="border-b border-amber-200 pb-2 flex items-center justify-between">
                        <span className="text-[10px] font-sans font-black uppercase tracking-wider text-amber-900">
                          🆘 Główne Sektory Pomocy
                        </span>
                        <span className="bg-amber-100 text-[8px] font-mono px-1.5 py-0.5 rounded text-amber-950 font-bold">Baza darmowa</span>
                      </div>
                      <div className="space-y-1 max-h-[360px] overflow-y-auto pr-1">
                        {HELP_CATEGORIES.map((cat) => (
                          <Link
                            key={cat.href}
                            to={cat.href}
                            onClick={() => handleNavClick(cat.href)}
                            className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-amber-50/70 transition-colors group"
                          >
                            <span className="text-lg shrink-0 group-hover:scale-110 transition-transform">
                              {cat.emoji}
                            </span>
                            <div>
                              <h4 className="text-[11px] font-sans font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                                {cat.name}
                              </h4>
                              <p className="text-[10px] text-[#1a211e] leading-normal font-semibold mt-0.5">
                                {cat.desc}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.filter(l => l.pill).map((link) => (
              <Link 
                key={link.name} 
                to={link.href}
                onClick={() => handleNavClick(link.href)}
                className="bg-[#FAF8F3] border border-[#d6cfbe] px-5 py-2.5 rounded-full hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all duration-300 text-[#1a211e] font-black"
              >
                {link.name}
              </Link>
            ))}
            
            {/* Jaskrawy przycisk dla osób w kryzysie */}
            <a 
              href="https://www.google.com" 
              className="bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-[0.15em] px-4 py-2.5 rounded-xl border-2 border-red-800 transition focus:ring-4 focus:ring-red-400 shadow-lg cursor-pointer"
              aria-label="Szybkie wyjście ze strony, przekierowuje do google.com"
            >
              SZYBKIE WYJŚCIE
            </a>
          </nav>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2">
            {/* Jaskrawy przycisk na telefonach bezpośrednio w pasku */}
            <a 
              href="https://www.google.com" 
              className="lg:hidden bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-wider px-3 py-2 rounded-xl border-2 border-red-800 transition focus:ring-4 focus:ring-red-400 shadow-sm"
              aria-label="Szybkie wyjście ze strony, przekierowuje do google.com"
            >
              WYJŚCIE
            </a>

            <button
              onClick={() => setShowA11y(!showA11y)}
              className="p-2.5 bg-slate-50 text-slate-500 rounded-2xl hover:bg-amber-50 hover:text-amber-600 transition-all border border-slate-100"
              aria-label="Panel dostępności"
            >
              <Accessibility className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 bg-slate-900 text-white rounded-2xl shadow-lg shadow-slate-900/20 active:scale-90 transition-transform"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Accessibility Panel Overlay */}
      <AnimatePresence>
        {showA11y && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowA11y(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-[70] p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Dostępność</h2>
                <button onClick={() => setShowA11y(false)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-10">
                {/* Font Size */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Rozmiar tekstu</label>
                  <div className="flex gap-2">
                    {[ -1, 0, 1 ].map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={`flex-1 py-4 px-4 rounded-2xl border-4 transition-all font-black ${
                          fontSize === size ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-100'
                        }`}
                      >
                        {size === -1 ? 'Mały' : size === 0 ? 'Standard' : 'Duży'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-3">
                  <A11yToggle 
                    label="Wysoki kontrast" 
                    active={highContrast} 
                    onClick={toggleHighContrast} 
                    icon="⊙"
                  />
                  <A11yToggle 
                    label="Podkreśl linki" 
                    active={underlineLinks} 
                    onClick={toggleUnderlineLinks} 
                    icon="↗"
                  />
                  <A11yToggle 
                    label="Czcionka dla dysleksji" 
                    active={dyslexicFont} 
                    onClick={toggleDyslexicFont} 
                    icon="Aa"
                  />
                </div>

                <div className="pt-6">
                  <button 
                    onClick={reset}
                    className="w-full py-5 bg-slate-900 text-white rounded-[24px] text-xs font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-xl shadow-slate-900/10"
                  >
                    Resetuj ustawienia
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-2xl overflow-y-auto max-h-[80vh] z-40"
          >
            <div className="p-6 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`flex items-center justify-between px-6 py-4.5 rounded-[24px] text-sm font-black uppercase tracking-widest transition-all ${
                    location.pathname === link.href 
                      ? 'bg-amber-500 text-white shadow-xl shadow-amber-500/20' 
                      : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  {link.name}
                  <ChevronRight className={`w-4 h-4 ${location.pathname === link.href ? 'text-white' : 'text-slate-300'}`} />
                </Link>
              ))}

              {/* Accordion 1: Categories list */}
              <div className="border border-[#EFECE6] rounded-[24px] bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    setMobileCategoriesOpen(!mobileCategoriesOpen);
                    setMobileToolsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-6 py-4.5 font-sans text-xs font-black uppercase tracking-widest text-[#0f1412] bg-[#FAF8F3]"
                >
                  <span className="flex items-center gap-2">🆘 Główne Sekcje Pomocy (5)</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileCategoriesOpen ? 'rotate-180 text-amber-600' : 'text-slate-400'}`} />
                </button>
                
                <AnimatePresence>
                  {mobileCategoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-white px-4 py-2 space-y-1 divide-y divide-[#EFECE6]"
                    >
                      {HELP_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.href}
                          to={cat.href}
                          onClick={() => handleNavClick(cat.href)}
                          className="flex items-center justify-between py-3.5 px-3 hover:bg-[#FAF8F3] transition-colors rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{cat.emoji}</span>
                            <span className="text-xs font-bold text-[#0f1412]">{cat.name}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion 2: Tools list */}
              <div className="border border-[#EFECE6] rounded-[24px] bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    setMobileToolsOpen(!mobileToolsOpen);
                    setMobileCategoriesOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-6 py-4.5 font-sans text-xs font-black uppercase tracking-widest text-[#0f1412] bg-[#FAF8F3]"
                >
                  <span className="flex items-center gap-2">📂 Główne Narzędzia (5)</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileToolsOpen ? 'rotate-180 text-amber-600' : 'text-slate-400'}`} />
                </button>
                
                <AnimatePresence>
                  {mobileToolsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-white px-4 py-2 space-y-1 divide-y divide-[#EFECE6]"
                    >
                      {SUB_PAGES.map((page) => (
                        <Link
                          key={page.href}
                          to={page.href}
                          onClick={() => handleNavClick(page.href)}
                          className="flex items-center justify-between py-3.5 px-3 hover:bg-[#FAF8F3] transition-colors rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{page.emoji}</span>
                            <span className="text-xs font-bold text-[#0f1412]">{page.name}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* SZYBKIE WYJŚCIE button for mobile accessibility within overlay menu */}
              <a
                href="https://www.google.com"
                className="flex items-center justify-between px-6 py-5 rounded-[24px] text-sm font-black uppercase tracking-widest bg-red-600 text-white shadow-xl shadow-red-600/20 border-2 border-red-800 cursor-pointer"
              >
                <span>SZYBKIE WYJŚCIE</span>
                <span className="text-xs font-bold bg-black/20 px-2.5 py-1 rounded-full text-white/90">SOS</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function A11yToggle({ label, active, onClick, icon }: { label: string, active: boolean, onClick: () => void, icon: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
        active ? 'border-amber-500 bg-amber-50' : 'border-slate-50 hover:border-slate-100'
      }`}
    >
      <span className="flex items-center space-x-3">
        <span className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg text-[10px] font-black">{icon}</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{label}</span>
      </span>
      <div className={`w-10 h-6 rounded-full transition-colors relative ${active ? 'bg-amber-500' : 'bg-slate-200'}`}>
        <motion.div 
          animate={{ x: active ? 18 : 2 }}
          className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </div>
    </button>
  );
}
