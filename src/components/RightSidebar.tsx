import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Phone, ShieldAlert, Check, HelpCircle, Wind, Volume2, AlertCircle } from 'lucide-react';
import { SITE_CONFIG } from '../data/siteConfig';

export default function RightSidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Mini breather widget state
  const [breathState, setBreathState] = useState<'IDLE' | 'INHALE' | 'HOLD' | 'EXHALE'>('IDLE');
  const [secLeft, setSecLeft] = useState(0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blog?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const startBreathing = () => {
    if (breathState !== 'IDLE') return;
    
    // Quick breathing loop logic
    setBreathState('INHALE');
    setSecLeft(4);
    
    let state: 'INHALE' | 'HOLD' | 'EXHALE' = 'INHALE';
    let secs = 4;
    
    const interval = setInterval(() => {
      secs--;
      if (secs <= 0) {
        if (state === 'INHALE') {
          state = 'HOLD';
          secs = 4;
          setBreathState('HOLD');
        } else if (state === 'HOLD') {
          state = 'EXHALE';
          secs = 4;
          setBreathState('EXHALE');
        } else {
          clearInterval(interval);
          setBreathState('IDLE');
          return;
        }
      }
      setSecLeft(secs);
    }, 1000);
  };

  // rotating tips & fact-checks
  const tips = [
    "Pracownik socjalny nie jest policjantem – jego zadaniem jest wsparcie, nie nadzór.",
    "Pomoc w Ośrodku Interwencji Kryzysowej jest w pełni bezpłatna.",
    "Możesz ubiegać się o dofinansowanie PFRON do barier architektonicznych bez limitu wieku.",
    "Wstyd jest naturalny, ale przełamanie go daje dostęp do realnych praw.",
    "Wniosek o Alimenty z Funduszu nie wymaga opłat sądowych."
  ];

  const [activeTipIdx] = useState(() => Math.floor(Math.random() * tips.length));

  return (
    <div className="w-full flex flex-col gap-6 h-full pb-10">
      
      {/* Widget 1: Universal Search Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-neutral-200/60">
        <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-3.5 flex items-center gap-1.5">
          <Search className="w-4 h-4 text-neutral-400" /> Przeszukaj Portal
        </h3>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input 
            type="text"
            placeholder="Wpisz np. alimenty, przemoc..."
            className="w-full pl-4 pr-10 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold placeholder:text-neutral-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-blue-600 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Widget 2: Emergency SOS Hotlines */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-neutral-200/60 relative overflow-hidden">
        {/* Pulsing indicator decor */}
        <div className="absolute top-5 right-5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </div>

        <h3 className="text-xs font-black uppercase tracking-wider text-rose-600 mb-3.5 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-rose-600" /> Szybkie Wsparcie 24/7
        </h3>
        <p className="text-[11px] text-neutral-500 font-medium leading-relaxed mb-4">
          Przeżywasz trudny moment? Te infolinie są poufne, darmowe i zawsze czynne.
        </p>

        <div className="space-y-2.5">
          {/* Adult helpline */}
          <a
            href={`tel:${SITE_CONFIG.contact.emergency_phone}`}
            className="flex items-center justify-between p-3 bg-neutral-50 hover:bg-rose-50 border border-neutral-200 hover:border-rose-200 rounded-2xl transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center font-black text-sm">
                123
              </div>
              <div className="text-left">
                <span className="block text-[10px] uppercase font-black tracking-widest text-neutral-400 group-hover:text-rose-500">Dla Dorosłych</span>
                <span className="block text-sm font-black text-neutral-800 tracking-tight">116 123</span>
              </div>
            </div>
            <Phone className="w-4 h-4 text-neutral-400 group-hover:text-rose-600 group-hover:rotate-12 transition-all" />
          </a>

          {/* Child helpline */}
          <a
            href={`tel:${SITE_CONFIG.contact.child_emergency_phone}`}
            className="flex items-center justify-between p-3 bg-neutral-50 hover:bg-amber-50 border border-neutral-200 hover:border-amber-200 rounded-2xl transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-black text-sm">
                111
              </div>
              <div className="text-left">
                <span className="block text-[10px] uppercase font-black tracking-widest text-neutral-400 group-hover:text-amber-500">Młodzież i Dzieci</span>
                <span className="block text-sm font-black text-neutral-800 tracking-tight">116 111</span>
              </div>
            </div>
            <Phone className="w-4 h-4 text-neutral-400 group-hover:text-amber-600 group-hover:rotate-12 transition-all" />
          </a>

          {/* Standard 112 */}
          <a
            href="tel:112"
            className="flex items-center justify-between p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl transition-all group shadow-sm shadow-rose-500/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center font-black text-white text-sm">
                SOS
              </div>
              <div className="text-left">
                <span className="block text-[9px] uppercase font-black tracking-widest text-white/70">Alarmowy</span>
                <span className="block text-sm font-black tracking-tight text-white">Zadzwoń pod 112</span>
              </div>
            </div>
            <Phone className="w-4 h-4 text-white group-hover:rotate-12 transition-all" />
          </a>
        </div>
      </div>

      {/* Widget 3: Mini Zen Breath Widget */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-neutral-200/60">
        <h3 className="text-xs font-black uppercase tracking-wider text-emerald-600 mb-3.5 flex items-center gap-1.5">
          <Wind className="w-4 h-4 text-emerald-600" /> Chwila Oddechu
        </h3>
        <p className="text-[11px] text-neutral-500 font-medium leading-relaxed mb-4">
          Poczuj ulgę w 12 sekund. Skup się wyłącznie na poniższym wskaźniku.
        </p>

        {breathState === 'IDLE' ? (
          <button
            onClick={startBreathing}
            className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl border border-emerald-200 font-black text-xs uppercase tracking-widest transition-all"
          >
            Zatrzymaj się i Odetchnij
          </button>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 bg-neutral-50 rounded-2xl border border-neutral-100 transition-all duration-500">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-emerald-400 absolute transition-all duration-1000 ${
              breathState === 'INHALE' ? 'scale-130 bg-emerald-100/30' : 
              breathState === 'HOLD' ? 'scale-130 bg-emerald-200/50 border-emerald-500' : 
              'scale-100 bg-emerald-50'
            }`}>
              <span className="text-lg font-black text-emerald-700">{secLeft}</span>
            </div>
            {/* Height buffer for absolute */}
            <div className="h-16 w-16 mb-4" />
            <span className="text-xs font-black text-emerald-800 tracking-wider uppercase animate-pulse">
              {breathState === 'INHALE' && 'WDECH...'}
              {breathState === 'HOLD' && 'ZATRZYMAJ...'}
              {breathState === 'EXHALE' && 'WYDECH...'}
            </span>
          </div>
        )}
      </div>

      {/* Widget 4: Fact Checker Tooltip */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-neutral-200/60">
        <div className="flex items-center gap-1.5 mb-3">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400">
            Fakty o Wsparciu
          </h4>
        </div>
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4">
          <p className="text-xs font-bold text-slate-700 leading-relaxed text-center italic">
            "{tips[activeTipIdx]}"
          </p>
        </div>
      </div>
      
    </div>
  );
}
