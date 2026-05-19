import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 py-16 md:py-24 grid lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7 space-y-8">
          <div className="section-tag">Bezpłatny Przewodnik</div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black leading-[1.1] text-slate-900 tracking-tighter"
          >
            Znajdź pomoc <br/>
            <span className="text-blue-600 italic font-serif font-normal">bez oceniania.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-xl"
          >
             MostPomocy to most między Tobą a pomocą – łączymy ludzi ze wsparciem, którego potrzebują. Pomożemy Ci postawić pierwszy krok w systemie, który często wydaje się zbyt skomplikowany.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/mapa" className="btn btn-primary">
              Znajdź wsparcie teraz
            </Link>
            <Link to="/dash" className="btn bg-slate-900 text-white hover:bg-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 group shadow-xl">
               Panel Szybki <Zap className="w-4 h-4 text-amber-500" />
            </Link>
          </motion.div>
        </div>

        <div className="lg:col-span-5 hidden lg:block">
          <div className="relative aspect-square bg-white rounded-[40px] border-2 border-slate-100 shadow-xl p-12 flex items-center justify-center overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-blue-100 transition-colors" />
            <div className="text-9xl mb-8 relative z-10">🧭</div>
            <div className="absolute bottom-10 left-10 text-slate-300 font-black text-8xl leading-none opacity-20 select-none">MAPA</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function EmergencyBanner() {
  return (
    <section className="bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 py-10">
        <div className="bg-rose-50 border-l-4 border-rose-500 p-8 rounded-r-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="bg-rose-500 text-white w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-lg shadow-rose-500/20">
              🚨
            </div>
            <div>
              <h2 className="text-xl font-black text-rose-900 tracking-tight leading-none mb-1">Zagrożenie życia lub bezpieczeństwa?</h2>
              <p className="text-rose-700 text-sm font-medium">Zadzwoń natychmiast pod numer alarmowy:</p>
            </div>
          </div>
          <a 
            href="tel:112" 
            className="text-rose-600 font-extrabold text-5xl tracking-tighter hover:scale-105 transition-transform"
          >
            112
          </a>
        </div>
      </div>
    </section>
  );
}
