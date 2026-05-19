import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, Heart, Sparkles, ArrowLeft, RefreshCw, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ZenZone() {
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
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
              case 'inhale': setPhase('hold1'); return 4;
              case 'hold1': setPhase('exhale'); return 4;
              case 'exhale': setPhase('hold2'); return 4;
              case 'hold2': setPhase('inhale'); return 4;
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
      case 'inhale': return 'Wdech...';
      case 'hold1': return 'Zatrzymaj...';
      case 'exhale': return 'Wydech...';
      case 'hold2': return 'Zatrzymaj...';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'text-emerald-500';
      case 'hold1': return 'text-amber-500';
      case 'exhale': return 'text-blue-500';
      case 'hold2': return 'text-slate-400';
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-32">
      <nav className="max-w-4xl mx-auto px-4 sm:px-10 py-8">
        <Link to="/" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Powrót
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-10">
        <div className="text-center mb-16">
          <div className="section-tag mb-4">Twój bezpieczny port</div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6">
            Strefa <span className="text-emerald-500 italic text-serif font-normal">Spokoju.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Zatrzymaj się na chwilę. Wyreguluj oddech. Nie musisz teraz nic robić, poza byciem tutaj.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Breathing Exercise */}
          <div className="bg-white rounded-[60px] border-4 border-slate-50 shadow-2xl p-12 flex flex-col items-center text-center">
            <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Oddychanie</h2>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-12">Technika Pudełkowa</p>

            <div className="relative w-64 h-64 flex items-center justify-center mb-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase}
                  initial={{ scale: phase === 'inhale' ? 0.8 : 1.2, opacity: 0 }}
                  animate={{ 
                    scale: (phase === 'inhale' || phase === 'hold1') ? 1.2 : 0.8,
                    opacity: 1 
                  }}
                  transition={{ duration: 4, ease: "linear" }}
                  className={`absolute inset-0 rounded-full border-8 transition-colors duration-1000 ${
                    phase === 'inhale' ? 'border-emerald-200 bg-emerald-50' : 
                    phase === 'hold1' ? 'border-amber-200 bg-amber-50' : 
                    phase === 'exhale' ? 'border-blue-200 bg-blue-50' : 
                    'border-slate-100 bg-white'
                  }`}
                />
              </AnimatePresence>
              
              <div className="relative z-10 flex flex-col items-center">
                <motion.div 
                  key={phase + counter}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-5xl font-black mb-2 ${getPhaseColor()}`}
                >
                  {counter}
                </motion.div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  {getPhaseText()}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsActive(!isActive)}
              className={`btn px-12 py-6 rounded-3xl font-black uppercase tracking-widest transition-all ${
                isActive ? 'btn-outline border-2 text-slate-400' : 'btn-primary shadow-xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isActive ? 'Zatrzymaj' : 'Zacznij Koncentrację'}
            </button>
          </div>

          {/* Bubble Pop Game */}
          <div className="bg-white rounded-[60px] border-4 border-slate-50 shadow-2xl p-12 flex flex-col items-center text-center">
            <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Stres-Reduktor</h2>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-12">Pstrykaj bąbelki (Bubble Pop)</p>
            
            <div className="grid grid-cols-4 gap-4 mb-12">
              {bubbles.map((active, i) => (
                <button
                  key={i}
                  disabled={!active}
                  onClick={() => popBubble(i)}
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-full border-4 transition-all duration-300 ${
                    active 
                      ? 'bg-blue-100 border-blue-200 shadow-lg cursor-pointer hover:scale-110 active:scale-95' 
                      : 'bg-slate-50 border-slate-100 scale-90 opacity-40 grayscale pointer-events-none'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={resetBubbles}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-900 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Resetuj Bąbelki
            </button>
          </div>
        </div>

          {/* Quick Affirmations */}
          <div className="grid md:grid-cols-3 gap-6">
             <div className="p-8 bg-blue-50 rounded-[40px] border-2 border-blue-100 text-center">
               <Heart className="w-8 h-8 text-blue-500 mx-auto mb-4" />
               <p className="font-bold text-blue-900 italic">"Jestem bezpieczny/a tutaj, w tym momencie."</p>
             </div>
             <div className="p-8 bg-amber-50 rounded-[40px] border-2 border-amber-100 text-center">
               <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-4" />
               <p className="font-bold text-amber-900 italic">"Moje emocje są ważne, ale one mnie nie definiują."</p>
             </div>
             <div className="p-8 bg-rose-50 rounded-[40px] border-2 border-rose-100 text-center">
               <Wind className="w-8 h-8 text-rose-500 mx-auto mb-4" />
               <p className="font-bold text-rose-900 italic">"Daję sobie czas na spokój i regenerację."</p>
             </div>
          </div>
        </div>

        <div className="mt-20 p-10 bg-slate-900 rounded-[50px] text-white flex items-center justify-between gap-10 flex-wrap md:flex-nowrap">
           <div className="flex-grow">
             <div className="text-emerald-400 font-black uppercase text-xs tracking-widest mb-2">Potrzebujesz czegoś więcej?</div>
             <h3 className="text-2xl font-black mb-4">Jeśli ćwiczenie to za mało, sprawdź mapę wsparcia.</h3>
             <p className="text-slate-400 text-sm leading-relaxed max-w-md">
               Spokój umysłu często wymaga profesjonalnego wsparcia. Nie wahaj się szukać pomocy u specjalistów.
             </p>
           </div>
           <Link to="/mapa" className="btn btn-primary bg-white text-slate-900 hover:bg-emerald-400 hover:text-white border-white whitespace-nowrap">
             Przejdź do Mapy Pomocy
           </Link>
        </div>
      </div>
  );
}
