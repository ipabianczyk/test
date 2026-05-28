import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Heart, RefreshCw, ArrowRight, Check, X, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Question {
  id: string;
  category: string;
  text: string;
  redFlagReason: string;
}

const questions: Question[] = [
  {
    id: 'q1',
    category: 'Relacje i dom',
    text: 'Czy często czujesz, że musisz "chodzić na palcach" i uważać na każde słowo, żeby nie rozzłościć osoby, z którą mieszkasz?',
    redFlagReason: 'Ciągły strach przed reakcją domownika nie jest normalny. To jeden z pierwszych sygnałów przemocy psychicznej.'
  },
  {
    id: 'q2',
    category: 'Samopoczucie',
    text: 'Czy od dłuższego czasu (ponad 2 tygodnie) brakuje Ci sił na codzienne obowiązki i wstanie z łóżka wydaje się ogromnym wysiłkiem?',
    redFlagReason: 'Długotrwały brak energii i motywacji może być objawem depresji lub wyczerpania. To stan, w którym warto poszukać medycznego wsparcia.'
  },
  {
    id: 'q3',
    category: 'Relacje i dom',
    text: 'Czy ktoś bliski kontroluje Twoje wydatki, zabiera Ci pieniądze lub rozlicza z każdego grosza?',
    redFlagReason: 'Kontrola finansowa to forma przemocy ekonomicznej. Masz prawo decydować o własnych środkach.'
  },
  {
    id: 'q4',
    category: 'Granice',
    text: 'Czy często słyszysz od innych, że "przesadzasz", "wymyślasz problemy" lub że "inni mają gorzej"?',
    redFlagReason: 'Tzw. gaslighting i bagatelizowanie Twoich uczuć to forma manipulacji. Twoje uczucia są ważne i prawdziwe.'
  },
  {
    id: 'q5',
    category: 'Społeczeństwo',
    text: 'Czy unikasz znajomych i rodziny, ponieważ wstydzisz się powiedzieć im o swojej obecnej sytuacji (związku, zdrowiu, finansach)?',
    redFlagReason: 'Izolacja to znak, że ciężar jest zbyt duży, by nieść go w pojedynkę. Sprawcy kryzysów często celowo izolują swoje ofiary.'
  }
];

export default function SelfCheckPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [showSummary, setShowSummary] = useState(false);

  const currentQuestion = questions[currentIdx] || questions[0];

   const handleAnswer = (value: boolean) => {
    if (showSummary || currentIdx >= questions.length) return;

    const q = questions[currentIdx];
    if (!q) return;

    setAnswers(prev => ({ ...prev, [q.id]: value }));

    if (currentIdx >= questions.length - 1) {
      setShowSummary(true);
    } else {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const reset = () => {
    setCurrentIdx(0);
    setAnswers({});
    setShowSummary(false);
  };

  // Calculate insights
  const redFlagsCount = Object.values(answers || {}).filter(Boolean).length;
  const trueAnswers = questions.filter(q => answers && answers[q.id]);

  return (
    <div className="bg-slate-50 min-h-screen pb-32">
      {/* Breadcrumb */}
      <nav className="max-w-3xl mx-auto px-4 sm:px-10 py-6 text-xs font-bold uppercase tracking-widest text-slate-400">
        <Link to="/" className="hover:text-amber-600">Start</Link>
        <span className="mx-2 opacity-30">›</span>
        <span className="text-slate-900">Autodiagnoza</span>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-10 pt-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-[0.2em] rounded border border-amber-200 mb-6">
            <ShieldAlert className="w-3 h-3" /> Bezpieczna Przestrzeń
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-slate-900 mb-6">
            Spójrz na to <span className="text-amber-500 italic font-serif font-normal">z boku.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Odpowiedz anonimowo na 5 pytań. Czasem to, co wydaje nam się "normalne", wcale takie nie jest. Masz prawo wiedzieć, na czym stoisz.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!showSummary && (
            <motion.div 
              key={`q-${currentIdx}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border-4 border-slate-50 relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
                <div 
                  className="h-full bg-amber-500 transition-all duration-500" 
                  style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                  {currentQuestion.category}
                </span>
                <span className="text-sm font-bold text-slate-300">
                  {currentIdx + 1} / {questions.length}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-12">
                {currentQuestion.text}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleAnswer(true)}
                  className="p-6 rounded-3xl border-2 border-slate-100 hover:border-amber-500 hover:bg-amber-50 text-slate-700 hover:text-amber-700 font-bold text-xl transition-all flex flex-col items-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    <Check className="w-6 h-6" />
                  </div>
                  Tak
                </button>
                <button 
                  onClick={() => handleAnswer(false)}
                  className="p-6 rounded-3xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold text-xl transition-all flex flex-col items-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </div>
                  Nie
                </button>
              </div>
            </motion.div>
          )}

          {showSummary && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border-4 border-slate-50">
                <div className="text-center mb-10">
                  <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 ${
                    redFlagsCount > 0 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {redFlagsCount > 0 ? <ShieldAlert className="w-10 h-10" /> : <Heart className="w-10 h-10" />}
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-4">Podsumowanie</h2>
                  <p className="text-lg text-slate-500">
                    {redFlagsCount === 0 
                      ? "Z Twoich odpowiedzi wynika, że prawdopodobnie znajdujesz się w stabilnej sytuacji. Pamiętaj jednak, że zawsze masz prawo szukać wsparcia."
                      : `Rozpoznaliśmy ${redFlagsCount} ${redFlagsCount === 1 ? 'sygnał' : redFlagsCount > 4 ? 'sygnałów' : 'sygnały'}, na które warto zwrócić uwagę.`
                    }
                  </p>
                </div>

                {redFlagsCount > 0 && (
                  <div className="space-y-4 mb-10">
                    {trueAnswers.map((q, i) => (
                      <div key={i} className="bg-amber-50/50 border border-amber-100 p-6 rounded-3xl flex gap-4">
                        <Info className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-sm text-slate-500 mb-2 font-medium">Na pytanie o: <span className="italic">{q.category.toLowerCase()}</span>, odpowiedziałeś/aś "Tak".</p>
                          <p className="text-slate-800 font-bold">{q.redFlagReason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {redFlagsCount > 0 && (
                  <div className="bg-slate-900 text-white p-8 rounded-3xl text-center">
                    <h3 className="text-xl font-black mb-4">To nie Twoja wina</h3>
                    <p className="text-slate-400 mb-8">
                      Często osoby w trudnych sytuacjach przyzwyczajają się do nich. Widzimy, że masz się z czym zmagać. Pozwól nam pomóc.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link to="/potrzebomat" className="btn bg-white text-slate-900 hover:bg-slate-100">
                        Przejdź do Potrzebomatu
                      </Link>
                      <a href="tel:116123" className="btn btn-primary">
                        Zadzwoń na 116 123
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                <button onClick={reset} className="btn btn-outline flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Wykonaj test ponownie
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
