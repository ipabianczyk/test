import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Map, Heart, ClipboardCheck, BookOpen, 
  BookMarked, HelpCircle, Wind, PenTool, Download, 
  Mail, Accessibility, Sun, Moon, Sparkles, LogIn, Laptop
} from 'lucide-react';
import { useA11y } from './A11yProvider';
import { SITE_CONFIG } from '../data/siteConfig';

interface LeftSidebarProps {
  onCloseMobile?: () => void;
}

export default function LeftSidebar({ onCloseMobile }: LeftSidebarProps) {
  const location = useLocation();
  const { 
    fontSize, setFontSize, 
    highContrast, toggleHighContrast,
    underlineLinks, toggleUnderlineLinks,
    dyslexicFont, toggleDyslexicFont,
    reset 
  } = useA11y();

  const menuItems = [
    { name: 'Start', href: '/', icon: Home },
    { name: 'Mapa Wsparcia', href: '/mapa', icon: Map },
    { name: 'Potrzebomat SOS', href: '/potrzebomat', icon: Heart, alert: true },
    { name: 'Autodiagnoza', href: '/autodiagnoza', icon: ClipboardCheck },
    { name: 'Baza Wiedzy', href: '/blog', icon: BookOpen },
    { name: 'Słownik Kryzysowy', href: '/slownik-kryzysowy', icon: BookMarked },
    { name: 'Zrozumieć Potrzeby', href: '/znajdz-potrzebe', icon: HelpCircle },
    { name: 'Strefa Spokoju', href: '/strefa-spokoju', icon: Wind, accent: true },
    { name: 'Kreator Artykułów', href: '/kreator-artykulow', icon: PenTool },
    { name: 'Bezpiecznik PDF', href: '/bezpiecznik', icon: Download },
    { name: 'Kontakt i Wsparcie', href: '/kontakt', icon: Mail },
  ];

  const handleLinkClick = (href: string) => {
    if (onCloseMobile) onCloseMobile();
    if (location.pathname === href) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <aside className="w-full flex flex-col justify-between h-full bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 overflow-y-auto no-scrollbar">
      {/* Profile / Website Info */}
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center pb-6 border-b border-neutral-100">
          <Link to="/" onClick={() => handleLinkClick('/')} className="group relative block mb-4">
            <div className="relative w-24 h-24 bg-gradient-to-tr from-blue-600 via-amber-500 to-rose-500 rounded-3xl flex items-center justify-center p-1 shadow-lg shadow-blue-500/10 group-hover:rotate-6 transition-all duration-300">
              <div className="w-full h-full bg-slate-900 rounded-2.5xl flex items-center justify-center text-white text-3xl font-black italic tracking-tighter">
                M
              </div>
            </div>
            {/* Status light */}
            <span className="absolute bottom-0 right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full animate-pulse" />
          </Link>

          <Link to="/" onClick={() => handleLinkClick('/')} className="block mt-2">
            <h1 className="text-xl font-black text-neutral-900 tracking-tighter flex items-center justify-center gap-1">
              MostPomocy
              <span className="text-blue-600">.pl</span>
            </h1>
          </Link>
          <p className="text-xs text-neutral-400 font-bold uppercase tracking-[0.2em] mt-1">
            Twoja Mapa Wsparcia
          </p>
          <p className="text-[11px] text-neutral-500 font-medium leading-relaxed max-w-[200px] mt-2">
            Zintegrowany system interwencji kryzysowej i edukacji.
          </p>
        </div>

        {/* Menu Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => handleLinkClick(item.href)}
                className={`relative flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold tracking-tight transition-all group ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : item.alert
                    ? 'text-rose-600 hover:bg-rose-50'
                    : item.accent
                    ? 'text-emerald-600 hover:bg-emerald-50'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <div className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-blue-600' : ''}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <span className="flex-grow">{item.name}</span>
                
                {/* Visual Indicators */}
                {item.alert && (
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping absolute right-4" />
                )}
                {item.accent && (
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider scale-90">
                    Zen
                  </span>
                )}
                
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Accessibility & Credits */}
      <div className="pt-6 border-t border-neutral-100 mt-6 space-y-5">
        
        {/* Rapid Accessibility Toggles */}
        <div className="bg-neutral-50 rounded-2xl p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Accessibility className="w-3.5 h-3.5" /> Dostępność (WCAG)
            </span>
            { (fontSize !== 0 || highContrast || dyslexicFont) && (
              <button 
                onClick={reset}
                className="text-[9px] font-black text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md uppercase tracking-wider"
              >
                Reset
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Contrast Mode Button */}
            <button
              onClick={toggleHighContrast}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                highContrast 
                  ? 'bg-slate-900 border-slate-900 text-amber-400 shadow-sm' 
                  : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
              }`}
              title="Przełącz wysoki kontrast"
            >
              {highContrast ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              <span>Kontrast</span>
            </button>

            {/* Dyslexia Mode Button */}
            <button
              onClick={toggleDyslexicFont}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                dyslexicFont 
                  ? 'bg-amber-100 border-amber-300 text-amber-900 font-dyslexic shadow-sm' 
                  : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
              }`}
              title="Przełącz specjalną czcionkę ułatwiającą czytanie"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dysleksja</span>
            </button>
          </div>

          {/* Text Size Control */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Tekst:</span>
            <div className="flex gap-1.5">
              {[-1, 0, 1].map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`w-7 h-7 flex items-center justify-center text-xs font-black rounded-lg border transition-all ${
                    fontSize === size 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  {size === -1 ? 'S' : size === 0 ? 'M' : 'L'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Micro Footer Credits */}
        <div className="text-[10px] text-neutral-400 font-medium leading-relaxed">
          <p className="font-bold text-neutral-600 mb-0.5">Projekt Dyplomowy UŚ</p>
          <p>Autor: Igor Pabiańczyk</p>
          <p className="text-[9px] text-neutral-300 mt-2 uppercase tracking-widest font-bold">
            © 2026 MostPomocy.pl
          </p>
          <div className="flex gap-2.5 mt-2.5 text-[9px] font-bold text-neutral-400 hover:text-neutral-500">
            <Link to="/polityka-prywatnosci" onClick={() => handleLinkClick('/polityka-prywatnosci')} className="hover:underline">
              Prywatność
            </Link>
            <span>•</span>
            <Link to="/kontakt" onClick={() => handleLinkClick('/kontakt')} className="hover:underline">
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
