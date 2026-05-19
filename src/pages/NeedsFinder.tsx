import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Wallet, 
  ShieldAlert, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Zap,
  MapPin,
  ExternalLink,
  Activity,
  Handshake
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface PathOption {
  id: string;
  label: string;
  category: string;
  hint: string;
  searchQuery: string; // What to search for in Google
}

interface SupportPath {
  id: string;
  title: string;
  icon: any;
  color: string;
  description: string;
  options: PathOption[];
}

const SUPPORT_PATHS: SupportPath[] = [
  {
    id: 'emotions',
    title: 'Moje emocje i nastrój',
    icon: Heart,
    color: 'emerald',
    description: 'Relacje, lęk, smutek lub poczucie pustki.',
    options: [
      { id: 'e1', label: 'Ciągle czuję się zmęczony i nic mnie nie cieszy', category: 'zdrowie', hint: 'To może być sygnał, że Twój organizm nie radzi sobie z depresją. To choroba, nie lenistwo.', searchQuery: 'jak rozpoznać objawy depresji test' },
      { id: 'e2', label: 'Boję się rzeczy, które kiedyś były proste', category: 'zdrowie', hint: 'Lęk potrafi sparaliżować życie. Uznanie go za problem to pierwszy krok do wolności.', searchQuery: 'zaburzenia lękowe jak sobie radzić' },
      { id: 'e3', label: 'Czuję, że nie mam już siły na kolejny dzień', category: 'zdrowie', hint: 'To stan kryzysu emocjonalnego. Twoje życie jest wartościowe, nawet gdy tego teraz nie czujesz.', searchQuery: 'gdzie szukać pomocy w kryzysie psychicznym' }
    ]
  },
  {
    id: 'material',
    title: 'Moja stabilność życiowa',
    icon: Wallet,
    color: 'amber',
    description: 'Praca, mieszkanie, długi lub brak środków.',
    options: [
      { id: 'm1', label: 'Nie starcza mi do pierwszego, mimo że się staram', category: 'sytuacja-materialna', hint: 'Bieda nie jest powodem do wstydu. To sytuacja, w której masz prawo do wsparcia systemowego.', searchQuery: 'pomoc finansowa MOPS zasady' },
      { id: 'm2', label: 'Boje się otwierać koperty z rachunkami', category: 'sytuacja-materialna', hint: 'Pętla zadłużenia narasta w ukryciu. Konfrontacja z prawnikiem może przynieść ulgę.', searchQuery: 'darmowa pomoc prawna dla zadłużonych' },
      { id: 'm3', label: 'Moje mieszkanie nie jest bezpiecznym miejscem', category: 'sytuacja-materialna', hint: 'Brak stabilnego dachu nad głową to kryzys podstawowy. Masz prawo do schronienia.', searchQuery: 'pomoc dla osób bezdomnych lub zagrożonych eksmisją' }
    ]
  },
  {
    id: 'safety',
    title: 'Moje bezpieczeństwo osobiste',
    icon: ShieldAlert,
    color: 'rose',
    description: 'Przemoc, nękanie lub trudna sytuacja w domu.',
    options: [
      { id: 's1', label: 'Ktoś bliski sprawia, że czuję się mały i zastraszony', category: 'przemoc', hint: 'To przemoc psychiczna. Nie musisz na to pozwalać, nawet jeśli nie ma sińców.', searchQuery: 'rozpoznawanie przemocy psychicznej w rodzinie' },
      { id: 's2', label: 'Zaczynam wierzyć, że wszystko co złe, to moja wina', category: 'przemoc', hint: 'To efekt manipulacji (gaslighting). Zasługujesz na relacje oparte na szacunku.', searchQuery: 'co to jest gaslighting i jak się bronić' }
    ]
  },
  {
    id: 'health_plus',
    title: 'Moje ciało i sprawność',
    icon: Activity,
    color: 'cyan',
    description: 'Choroby przewlekłe, niepełnosprawność, rehabilitacja.',
    options: [
      { id: 'h1', label: 'Choroba odebrała mi dotychczasową samodzielność', category: 'onkologia', hint: 'Diagnoza zmienia wszystko, ale nie odbiera Ci godności i praw pacjenta.', searchQuery: 'prawa pacjenta w chorobie przewlekłej' },
      { id: 'h2', label: 'Moje mieszkanie stało się dla mnie torem przeszkód', category: 'niepelnosprawnosc', hint: 'Niepełnosprawność wymaga adaptacji otoczenia. Są na to środki publiczne.', searchQuery: 'dofinansowanie do likwidacji barier architektonicznych PFRON' },
      { id: 'h3', label: 'Całe moje życie kręci się wokół opieki nad chorym', category: 'seniorzy', hint: 'Opiekun też potrzebuje opieki. Twoje wypalenie to sygnał, że potrzebujesz wsparcia.', searchQuery: 'zespół wypalenia opiekuna pomoc' }
    ]
  },
  {
    id: 'addictions',
    title: 'Moje nawyki i więzi',
    icon: Handshake,
    color: 'indigo',
    description: 'Alkohol, narkotyki, hazard lub bliska osoba w nałogu.',
    options: [
      { id: 'a1', label: 'Obiecuję sobie, że to był ostatni raz, ale wracam do tego', category: 'uzaleznienia', hint: 'Mechanizm nałogu jest silniejszy niż "silna wola". To choroba mózgu.', searchQuery: 'jak rozpoznać początek uzależnienia' },
      { id: 'a2', label: 'Wszystko w domu zależy od nastroju osoby, która pije', category: 'uzaleznienia', hint: 'To współuzależnienie. Ratując kogoś, powoli tracisz siebie.', searchQuery: 'współuzależnienie jak zacząć dbać o siebie' }
    ]
  }
];

export default function NeedsFinder() {
  const [activePathId, setActivePathId] = useState<string | null>(null);

  const activePath = SUPPORT_PATHS.find(p => p.id === activePathId);

  const handleSearchGoogle = (query: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-32">
      <nav className="max-w-5xl mx-auto px-4 sm:px-10 py-8">
        <Link to="/" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Powrót
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-10">
        <div className="text-center mb-16">
          <div className="section-tag mb-4">Lustro Sygnałów</div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6">
            Kiedy czujesz, że <span className="text-blue-600 italic">coś jest nie tak...</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Czasami najtrudniej jest nazwać to, co nas boli. Wybierz obszar, który rezonuje z Twoją sytuacją, aby zobaczyć "lustro" swoich potrzeb.
          </p>
        </div>

        <div className="space-y-4">
          {SUPPORT_PATHS.map((path) => {
            const isOpen = activePathId === path.id;
            
            return (
              <div key={path.id} className="relative">
                <button
                  onClick={() => setActivePathId(isOpen ? null : path.id)}
                  className={`w-full text-left p-8 rounded-[40px] border-4 transition-all flex items-center gap-8 ${
                    isOpen 
                      ? 'bg-white border-blue-400 shadow-2xl scale-[1.01]' 
                      : 'bg-white border-slate-50 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 transition-all ${
                     isOpen ? 'bg-blue-600 text-white rotate-3' : 'bg-slate-50 text-slate-400'
                  }`}>
                    <path.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-black text-slate-900 mb-0.5">{path.title}</h3>
                    <p className="text-slate-400 text-sm font-medium">{path.description}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${
                     isOpen ? 'border-blue-600 bg-blue-50 text-blue-600 rotate-90' : 'border-slate-100 text-slate-300'
                  }`}>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 pb-10 px-6 space-y-3">
                        {path.options.map((opt) => (
                          <div key={opt.id} className="group p-6 bg-white border-2 border-slate-50 rounded-[32px] hover:border-blue-200 transition-all shadow-sm">
                             <div className="flex items-start justify-between gap-6 mb-3">
                               <div className="font-bold text-lg text-slate-900 leading-tight">{opt.label}</div>
                               <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
                             </div>
                             <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed italic border-l-2 border-slate-100 pl-4">
                               {opt.hint}
                             </p>
                             
                             <div className="flex flex-col sm:flex-row gap-2">
                               <button 
                                 onClick={() => handleSearchGoogle(opt.searchQuery)}
                                 className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                               >
                                 <ExternalLink className="w-3.5 h-3.5" /> Dowiedz się więcej
                               </button>
                               <Link 
                                 to="/blog"
                                 className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all"
                               >
                                 Czytaj poradniki
                               </Link>
                             </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="mt-20 flex flex-col md:flex-row gap-6">
          <Link to="/strefa-spokoju" className="flex-grow p-10 bg-emerald-50 rounded-[48px] border-2 border-emerald-100 group">
             <div className="flex items-center justify-between mb-4 text-emerald-600">
               <Sparkles className="w-8 h-8 group-hover:scale-110 transition-transform" />
               <div className="text-[10px] font-black uppercase tracking-widest">Relaks i oddech</div>
             </div>
             <h4 className="text-2xl font-black text-emerald-900 mb-2">Czujesz chwilowe napięcie?</h4>
             <p className="text-emerald-700 text-sm font-medium leading-relaxed mb-6">Przejdź do strefy spokoju, aby wyregulować oddech i odnaleźć równowagę przed dalszymi krokami.</p>
             <div className="text-emerald-600 font-black text-xs uppercase tracking-widest flex items-center gap-2">
               Otwórz strefę spokoju <ArrowRight className="w-4 h-4" />
             </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
