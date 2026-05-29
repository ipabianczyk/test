import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, Heart, Sparkles, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ZenZone() {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [counter, setCounter] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const [bubbles, setBubbles] = useState(Array(12).fill(true));

  const popBubble = (index: number) => {
    const newBubbles = [...bubbles];
    newBubbles[index] = false;
    setBubbles(newBubbles);
  };

  const resetBubbles = () => {
    setBubbles(Array(12).fill(true));
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive) {
      timer = setInterval(() => {
        setCounter((prev) => {
          if (prev <= 1) {
            switch (phase) {
              case 'inhale': 
                setPhase('hold'); 
                return 7; // Hold for 7 seconds
              case 'hold': 
                setPhase('exhale'); 
                return 8; // Exhale for 8 seconds
              case 'exhale': 
                setPhase('inhale'); 
                return 4; // Inhale for 4 seconds
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, phase]);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Wdech (Nosem)';
      case 'hold': return 'Zatrzymaj Oddech';
      case 'exhale': return 'Wydech (Ustami)';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'text-slate-800 font-serif';
      case 'hold': return 'text-[#8C6239]';
      case 'exhale': return 'text-slate-600';
    }
  };

  const getTimingRatio = () => {
    switch (phase) {
      case 'inhale': return 4;
      case 'hold': return 7;
      case 'exhale': return 8;
    }
  };

  return (
    <div className="bg-[#FBF9F4] min-h-screen pb-32">
      <nav className="max-w-4xl mx-auto px-4 sm:px-10 py-8">
        <Link to="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Powrót
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-10 font-sans">
        <div className="text-center mb-16 space-y-4">
          <div className="text-[10px] uppercase font-black tracking-[0.3em] text-[#6B7280]">Twój bezpieczny port</div>
          <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-[#0f1412]">
            Strefa <span className="italic font-normal">Ciszy.</span>
          </h1>
          <p className="text-base text-[#1a211e] max-w-xl mx-auto leading-relaxed">
            Zatrzymaj się na chwilę. Wyreguluj oddech za pomocą certyfikowanego trenera oddechowego 4-7-8. Nie musisz teraz nic robić, poza byciem tutaj.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Breathing Exercise */}
          <div className="bg-white rounded-[32px] border border-slate-200 p-10 flex flex-col items-center text-center">
            <h2 className="text-xs font-black text-[#0f1412] uppercase tracking-[0.2em] mb-1">Trener Oddechowy</h2>
            <p className="text-[#6B7280] text-[10px] uppercase tracking-widest mb-10">Metoda 4-7-8 (Inhale, Hold, Exhale)</p>

            <div className="relative w-64 h-64 flex items-center justify-center mb-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase}
                  initial={{ 
                    scale: phase === 'inhale' ? 0.75 : phase === 'hold' ? 1.3 : 1.35, 
                    opacity: 0.4 
                  }}
                  animate={{ 
                    scale: phase === 'inhale' ? 1.3 : phase === 'hold' ? 1.3 : 0.75,
                    opacity: 1 
                  }}
                  transition={{ duration: getTimingRatio(), ease: "easeInOut" }}
                  className={`absolute inset-0 rounded-full border border-slate-200/50 transition-colors duration-1000 ${
                    phase === 'inhale' ? 'bg-[#ECEAE4]' : 
                    phase === 'hold' ? 'bg-[#E3DFD5]' : 
                    'bg-[#F0EEE6]'
                  }`}
                />
              </AnimatePresence>
              
              <div className="relative z-10 flex flex-col items-center">
                <motion.div 
                  key={phase + counter}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-6xl font-serif font-bold mb-2 ${getPhaseColor()}`}
                >
                  {counter}
                </motion.div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0f1412]">
                  {getPhaseText()}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setIsActive(!isActive);
                if (!isActive) {
                  setPhase('inhale');
                  setCounter(4);
                }
              }}
              className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                isActive 
                  ? 'bg-white border border-slate-300 text-slate-500 hover:bg-slate-50' 
                  : 'bg-slate-900 hover:bg-black text-white'
              }`}
            >
              {isActive ? 'Zatrzymaj ćwiczenie' : 'Zacznij Oddech 4-7-8'}
            </button>
            
            <div className="mt-4 text-[10px] text-slate-400 max-w-xs leading-relaxed">
              Wdech nosem (4s) • Zatrzymanie (7s) • Głęboki wydech ustami (8s)
            </div>
          </div>

          {/* Bubble Pop Game */}
          <div className="bg-white rounded-[32px] border border-slate-200 p-10 flex flex-col items-center text-center">
            <h2 className="text-xs font-black text-[#0f1412] uppercase tracking-[0.2em] mb-1">Stres-Reduktor</h2>
            <p className="text-[#6B7280] text-[10px] uppercase tracking-widest mb-10">Pstrykaj bąbelki (Bubble Pop)</p>
            
            <div className="grid grid-cols-4 gap-4 mb-10">
              {bubbles.map((active, i) => (
                <button
                  key={i}
                  disabled={!active}
                  onClick={() => popBubble(i)}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full border transition-all duration-300 ${
                    active 
                      ? 'bg-[#ECEAE4] border-slate-300 cursor-pointer hover:bg-slate-200 hover:scale-105 active:scale-95' 
                      : 'bg-white border-dashed border-slate-200 scale-90 opacity-40 pointer-events-none'
                  }`}
                  aria-label={`Bąbelek ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={resetBubbles}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#6B7280] hover:text-[#0f1412] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Zresetuj bąbelki
            </button>
          </div>
        </div>

        {/* Quick Affirmations */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-8 bg-white border border-slate-200 rounded-3xl text-center">
            <Heart className="w-6 h-6 text-[#6B7280] mx-auto mb-4" />
            <p className="text-sm text-[#1a211e] italic font-serif leading-relaxed">"Jestem bezpieczny/a tutaj, w tym momencie."</p>
          </div>
          <div className="p-8 bg-white border border-slate-200 rounded-3xl text-center">
            <Sparkles className="w-6 h-6 text-[#6B7280] mx-auto mb-4" />
            <p className="text-sm text-[#1a211e] italic font-serif leading-relaxed">"Moje emocje są ważne, ale one mnie nie definiują."</p>
          </div>
          <div className="p-8 bg-white border border-slate-200 rounded-3xl text-center">
            <Wind className="w-6 h-6 text-[#6B7280] mx-auto mb-4" />
            <p className="text-sm text-[#1a211e] italic font-serif leading-relaxed">"Daję sobie czas na spokój i regenerację."</p>
          </div>
        </div>

        <div className="mt-20 p-10 bg-white border border-slate-200 rounded-[32px] flex items-center justify-between gap-10 flex-wrap md:flex-nowrap">
          <div className="flex-grow">
            <div className="text-[#6B7280] font-black uppercase text-[10px] tracking-widest mb-2">Potrzebujesz czegoś więcej?</div>
            <h3 className="text-2xl font-serif font-black text-[#0f1412] tracking-tight mb-3">Jeśli ćwiczenie to za mało, sprawdź mapę wsparcia.</h3>
            <p className="text-sm text-[#1a211e] leading-relaxed max-w-sm">
              Spokój umysłu często wymaga profesjonalnego wsparcia. Nie wahaj się szukać pomocy u specjalistów.
            </p>
          </div>
          <Link to="/mapa" className="px-6 py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-black transition-colors whitespace-nowrap">
            Przejdź do Mapy Pomocy
          </Link>
        </div>
      </div>
    </div>
  );
}
