import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Heart, Map, ShieldAlert, ClipboardCheck, Sparkles, 
  BookMarked, ArrowRight, CornerDownRight, Landmark, GraduationCap, CheckCircle2
} from 'lucide-react';
import { SITE_CONFIG } from '../data/siteConfig';

export default function HomePage() {
  const bentoPaths = [
    {
      title: "Potrzebomat SOS",
      desc: "Rozwiąż interaktywny kwestionariusz i dowiedz się, jakie formy pomocy finansowej, prawnej i mieszkaniowej Ci przysługują.",
      icon: Heart,
      href: "/potrzebomat",
      color: "from-rose-500/10 to-pink-500/10 text-rose-600 hover:border-rose-400 border-rose-100",
      pill: "Pilne rozwiązanie"
    },
    {
      title: "Mapa Ośrodków",
      desc: "Przeglądaj zintegrowaną bazę placówek wsparcia społecznego, OIK, MOPS i centrów pomocy rodzinie w całej Polsce.",
      icon: Map,
      href: "/mapa",
      color: "from-blue-500/10 to-indigo-500/10 text-blue-600 hover:border-blue-400 border-blue-100",
      pill: "Geotargetowanie"
    },
    {
      title: "Strefa Spokoju",
      desc: "Zatrzymaj stres na minutę. Skorzystaj z interaktywnych ćwiczeń oddechowych i przeczytaj kojące afirmacje.",
      icon: Sparkles,
      href: "/strefa-spokoju",
      color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 hover:border-emerald-400 border-emerald-100",
      pill: "Chwila ulgi"
    },
    {
      title: "Słownik Kryzysowy",
      desc: "Wyjaśniamy zawiły urzędowy język: od procedury Niebieskiej Karty po opiekuńcze świadczenia MOPS.",
      icon: BookMarked,
      href: "/slownik-kryzysowy",
      color: "from-amber-500/10 to-orange-500/10 text-amber-600 hover:border-amber-400 border-amber-100",
      pill: "Baza pojęć"
    }
  ];

  const steps = [
    { id: "1", label: "Nazwij problem", detail: "Skorzystaj z sekcji potrzeb i nazwij sytuację." },
    { id: "2", label: "Poznaj swoje prawa", detail: "Przeczytaj kafelki praw i procedur." },
    { id: "3", label: "Zlokalizuj placówkę", detail: "Sprawdź naszą dynamiczną mapę." },
    { id: "4", label: "Zrób pierwszy krok", detail: "Zadzwoń lub zgłoś się osobiście." }
  ];

  return (
    <div className="space-y-8 text-left">
      
      {/* 1. Welcoming Hero Banner */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping" />
          Bezpłatny Przewodnik Pomocowy
        </div>
        
        <h2 className="text-3.5xl sm:text-5xl font-black text-neutral-900 tracking-tighter leading-[1.05] italic">
          Znajdź pomoc <br/>
          <span className="text-blue-600 not-italic font-bold">bez oceniania i strachu.</span>
        </h2>
        
        <p className="text-sm sm:text-base text-neutral-500 font-medium leading-relaxed max-w-xl">
          MostPomocy to Twój wirtualny przewodnik po systemie wsparcia społecznego w Polsce. Pomożemy Ci postawić pierwszy krok, otrzymać wsparcie finansowe, prawne i psychiczne bez zbędnych barier.
        </p>
      </div>

      {/* 2. Critical Emergency Alert Banner */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-pulse-slow">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center text-xl shrink-0 shadow-md shadow-rose-500/15">
            🚨
          </div>
          <div>
            <h4 className="text-sm font-black text-rose-900 tracking-tight leading-normal">
              Zagrożenie życia lub bezpieczeństwa?
            </h4>
            <p className="text-[11px] text-rose-700 font-bold uppercase tracking-wider mt-0.5">
              Zadzwoń pod ogólny numer alarmowy 112
            </p>
          </div>
        </div>
        <a 
          href="tel:112"
          className="w-full sm:w-auto text-center px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm"
        >
          Połącz z 112
        </a>
      </div>

      {/* 3. Bento Dashboard Paths */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
          <CornerDownRight className="w-4 h-4 text-neutral-400" /> Szybki Wybór Narzędzi
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bentoPaths.map((path) => {
            const IconComponent = path.icon;
            return (
              <Link 
                key={path.title}
                to={path.href}
                className={`group flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden bg-gradient-to-br ${path.color}`}
              >
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between items-center">
                    <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-wider bg-white/60 px-2 py-0.5 rounded">
                      {path.pill}
                    </span>
                  </div>

                  <h4 className="text-md sm:text-lg font-black text-neutral-900 tracking-tight group-hover:text-blue-700 transition-colors">
                    {path.title}
                  </h4>
                  <p className="text-xs text-neutral-500 leading-relaxed font-semibold">
                    {path.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/20 mt-4 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-neutral-600 group-hover:text-blue-600 transition-colors">
                  <span>Rozpocznij procedurę</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 4. Help Guide Box Checklist (Kompas) */}
      <div className="bg-neutral-50 border border-neutral-200/50 rounded-2xl p-5 sm:p-6 space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4 text-neutral-400" /> Kompas Usług: Jak Szukać Wsparcia?
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {steps.map((step) => (
            <div key={step.id} className="bg-white border border-neutral-200/40 p-3 rounded-xl space-y-2">
              <span className="inline-flex w-6 h-6 items-center justify-center bg-blue-50 border border-blue-100 rounded-full text-xs font-black text-blue-600">
                {step.id}
              </span>
              <h5 className="text-xs font-black text-neutral-900 leading-tight">
                {step.label}
              </h5>
              <p className="text-[10px] text-neutral-400 leading-snug font-medium">
                {step.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Destigmatization Box Info */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 sm:p-6 space-y-3">
        <h4 className="text-sm font-black text-blue-900 tracking-tight flex items-center gap-2">
          <CheckCircle2 className="w-4.5 h-4.5 text-blue-600" /> Przełam Barierę Przekonań
        </h4>
        <p className="text-xs text-neutral-600 leading-relaxed font-semibold">
          Praca socjalna to narzędzie wyrównywania szans. Rozmowa z pracownikiem socjalnym w Ośrodku Pomocy Społecznej (OPS) lub Centrum Usług Społecznych (CUS) jest zawsze pufna i bezpłatna. Masz prawo poszukiwać stabilizacji życiowej!
        </p>
      </div>

      {/* 6. Professional / Thesis Academic Context */}
      <div className="p-4 bg-neutral-900 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-neutral-800">
        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-3xl shrink-0 select-none">
          🎓
        </div>
        <div className="space-y-0.5 text-left">
          <h5 className="text-xs font-black uppercase tracking-wider text-neutral-400">
            Charakter Edukacyjno-Społeczny
          </h5>
          <p className="text-xs text-neutral-200 font-medium leading-relaxed">
            Portal <strong>MostPomocy.pl</strong> powstał jako projekt dyplomowy z zakresu Pracy Socjalnej na Uniwersytecie Śląskim. Opracował Igor Pabiańczyk.
          </p>
        </div>
      </div>

    </div>
  );
}
