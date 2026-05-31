import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, Heart, RefreshCw, ArrowRight, Check, X, 
  Info, ShieldCheck, HelpCircle, ChevronRight, Activity, Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Question {
  id: string;
  text: string;
  redFlagReason: string;
}

interface TestSuite {
  id: string;
  title: string;
  serifTitle: string;
  description: string;
  icon: React.ElementType;
  colorClass: string;
  bgLightClass: string;
  borderClass: string;
  accentText: string;
  questions: Question[];
  conclusionSafe: string;
  conclusionWarning: string;
}

const TEST_SUITES: TestSuite[] = [
  {
    id: 'przemoc-kontrola',
    title: 'Kontrola i Relacje w Domu',
    serifTitle: 'Granice i bezpieczny dom.',
    description: 'Zbadaj, czy zachowania Twojego partnera lub członka rodziny nie noszą znamion przemocy psychicznej, fizycznej lub ekonomicznej.',
    icon: ShieldAlert,
    colorClass: 'bg-rose-500 text-white',
    bgLightClass: 'bg-rose-50/50',
    borderClass: 'border-rose-100 hover:border-rose-300',
    accentText: 'text-rose-700',
    conclusionSafe: 'Twój dom prawdopodobnie jest miejscem bezpiecznym. Pamiętaj jednak, że każda niepokojąca zmiana zachowania domowników zasługuje na uważność.',
    conclusionWarning: 'Zwróć uwagę na te sygnały. Poniżanie, nadmierna kontrola i rozliczanie z finansów to formy przemocy (psychicznej i ekonomicznej). Dom powinien nieść spokój, nie lęk.',
    questions: [
      {
        id: 'q1_1',
        text: 'Czy partner/ka lub domownik obraża Cię, krytykuje przy innych lub celowo sprawia, że czujesz się gorszy/a i bezwartościowy/a?',
        redFlagReason: 'Ciągłe poniżanie i agresja słowna niszczą poczucie własnej wartości. Żadne napięcie ani stres nie dają prawa do wyzyskującego traktowania.'
      },
      {
        id: 'q1_2',
        text: 'Czy druga strona ogranicza Twoje wyjścia, kontroluje z kim piszesz lub stopniowo odcina Cię od przyjaciół oraz rodziny?',
        redFlagReason: 'Izolowanie od najbliższych to klasyczna technika sprawców przemocy domowej mająca na celu pozbawienie Cię naturalnej sieci ratunkowej.'
      },
      {
        id: 'q1_3',
        text: 'Czy odczuwasz stały lęk w domu i masz wrażenie, że musisz "chodzić na palcach", aby nie wywołać gniewu czy awantury?',
        redFlagReason: 'Stała czujność we własnym domu (hipervigilance) obciąża układ nerwowy i wskazuje na brak elementarnego poczucia bezpieczeństwa.'
      },
      {
        id: 'q1_4',
        text: 'Czy ktoś ogranicza Twój dostęp do wspólnych pieniędzy, zabiera Twoje dochody lub utrudnia podjęcie pracy zarobkowej?',
        redFlagReason: 'To przemoc ekonomiczna. Uzależnianie finansowe ofiary ogranicza jej swobodę decydowania i utrudnia ewentualne odejście.'
      },
      {
        id: 'q1_5',
        text: 'Czy kiedykolwiek czułeś/aś fizyczne zagrożenie, byłeś/aś szarpany/a, popychany/a lub domownik celowo niszczył Twoje rzeczy?',
        redFlagReason: 'Szarpanie, popychanie i niszczenie mienia to przekroczenie fizycznej granicy agresji. Sytuacje te mają silną tendencję do eskalacji.'
      }
    ]
  },
  {
    id: 'depresja-wypalenie',
    title: 'Zdrowie Psychiczne i Wypalenie',
    serifTitle: 'Samopoczucie i siły mentalne.',
    description: 'Sprawdź poziom zmęczenia życiowego, chronicznego stresu oraz przesiewowe symptomy stanów depresyjno-lękowych.',
    icon: Heart,
    colorClass: 'bg-indigo-500 text-white',
    bgLightClass: 'bg-indigo-50/50',
    borderClass: 'border-indigo-100 hover:border-indigo-300',
    accentText: 'text-indigo-700',
    conclusionSafe: 'Wygląda na to, że Twoje siły psychiczne są stabilne. Jeśli miewasz trudne dni, to naturalna część życia, dbaj o odpoczynek.',
    conclusionWarning: 'Twój organizm wysyła wyraźne sygnały wyczerpania. Może to być reakcja na głęboki stres, depresję lub wypalenie (np. rodzicielskie). To nie słabość – to czas na pomoc.',
    questions: [
      {
        id: 'q2_1',
        text: 'Czy od ponad dwóch tygodni przez większość dnia odczuwasz smutek, pustkę lub poczucie beznadziei, które nie chcą ustąpić?',
        redFlagReason: 'Przewlekłe obniżenie nastroju jest podstawowym kryterium depresji. Nie mija samo z siebie wyłącznie przez "wzięcie się w garść".'
      },
      {
        id: 'q2_2',
        text: 'Czy brakuje Ci energii do podstawowych czynności i wstanie rano z łóżka wiąże się z poczuciem ogromnego fizycznego oporu?',
        redFlagReason: 'Ciężka apatia i brak energii biologicznej towarzyszą stanom depresyjnym oraz chronicznemu przeciążeniu układu nerwowego.'
      },
      {
        id: 'q2_3',
        text: 'Czy straciłeś/aś chęć i radość z robienia rzeczy, które do tej pory sprawiały Ci autentyczną przyjemność (hobby, spotkania)?',
        redFlagReason: 'Anhedonia to zanik odczuwania przyjemności. Wskazuje na głębokie wyczerpanie mediatorów w mózgu i wymaga konsultacji medycznej.'
      },
      {
        id: 'q2_4',
        text: 'Czy czujesz dojmujące, stałe wypalenie jako rodzic lub opiekun i czujesz, że nie masz już kompletnie nic do zaoferowania bliskim?',
        redFlagReason: 'Wypalenie rodzicielskie (parental burnout) to skrajne wycieńczenie rolą opiekuna. Masz prawo czuć zmęczenie i szukać wsparcia zewnętrznego.'
      },
      {
        id: 'q2_5',
        text: 'Czy miewasz nagłe ataki paniki, kołatania serca, duszności lub stały lęk o to, co przyniesie jutro?',
        redFlagReason: 'Stany lękowe (panika lub lęk ualgólniony) silnie niszczą jakość życia. Psychoterapia oraz farmakoterapia przynoszą tu szybką i trwałą ulgę.'
      }
    ]
  },
  {
    id: 'wspoluzaleznienie',
    title: 'Współuzależnienie i Nałogi Bliskich',
    serifTitle: 'Pętla nałogu w Twoim otoczeniu.',
    description: 'Choroba alkoholowa lub hazardowa bliskiego niszczy całe otoczenie. Dowiedz się, czy nie tkwisz w roli współuzależnionej.',
    icon: Activity,
    colorClass: 'bg-amber-600 text-white',
    bgLightClass: 'bg-amber-50/50',
    borderClass: 'border-amber-100 hover:border-amber-350',
    accentText: 'text-amber-800',
    conclusionSafe: 'Wygląda na to, że zachowujesz zdrowe granice wobec problemu nałogu bliskiego lub problem ten nie występuje w Twoim otoczeniu.',
    conclusionWarning: 'Prezentujesz klasyczne wzorce współuzależnienia. Przejmowanie odpowiedzialności za pijącego chroni go przed kryzysem i ułatwia picie, niszcząc Ciebie.',
    questions: [
      {
        id: 'q3_1',
        text: 'Czy nieustannie kontrolujesz osobę pijącą/zażywającą — szukasz ukrytych butelek, wylewasz alkohol, wąchasz jej oddech?',
        redFlagReason: 'Kontrola nad nałogiem innej osoby jest złudzeniem. Pochłania to ogromną część Twojego życia i jest kluczowym objawem współuzależnienia.'
      },
      {
        id: 'q3_2',
        text: 'Czy zdarza Ci się kłamać przed rodziną, sąsiadami lub szefem bliskiego, żeby usprawiedliwić jego pijaństwo lub zaniedbania?',
        redFlagReason: 'Tzw. "krycie" osoby uzależnionej i łagodzenie skutków jej nałogu chroni ją przed zderzeniem z konsekwencjami, co opóźnia decyzję o terapii.'
      },
      {
        id: 'q3_3',
        text: 'Czy Twój nastrój, plany oraz bieg każdego dnia są całkowicie podporządkowane temu, w jakim stanie wróci chory?',
        redFlagReason: 'Uzależnienie nastroju od stanu trzeźwości partnera oznacza, że tracisz autonomię nad własnym życiem emocjonalnym.'
      },
      {
        id: 'q3_4',
        text: 'Czy spłacasz długi, pilnujesz rachunków i przejmujesz wszystkie obowiązki domowe za uzależnioną osobę?',
        redFlagReason: 'Zdejmując z chorego odpowiedzialność za jego życie, pozbawiasz go bodźca (tzw. dna), od którego mógłby się odbić i podjąć leczenie.'
      },
      {
        id: 'q3_5',
        text: 'Czy mimo cierpienia i poczucia krzywdy marnujesz siły wierząc, że Twoje poświęcenie i miłość są w stanie samodzielnie go uleczyć?',
        redFlagReason: 'Naiwna wiara w uleczenie partnera "własną cierpliwością" to pułapka współuzależnienia. Uzależnienie to choroba przewlekła – wymaga terapii, nie poświęcenia.'
      }
    ]
  }
];

export default function SelfCheckPage() {
  const [selectedSuiteId, setSelectedSuiteId] = useState<string | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [showSummary, setShowSummary] = useState(false);

  // SEO & Document head metadata updates
  React.useEffect(() => {
    document.title = "Anonimowa Autodiagnoza | Wsparcie w Kryzysie | MostPomocy.pl";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Wykonaj darmowy, w pełni anonimowy test przesiewowy w kierunku depresji, współuzależnienia lub przemocy domowej. Poznaj sygnały ostrzegawcze.");
    }
  }, []);

  const activeSuite = TEST_SUITES.find(s => s.id === selectedSuiteId);
  const currentQuestion = activeSuite ? activeSuite.questions[currentIdx] : null;

  const handleStartTest = (suiteId: string) => {
    setSelectedSuiteId(suiteId);
    setCurrentIdx(0);
    setAnswers({});
    setShowSummary(false);
  };

  const handleAnswer = (value: boolean) => {
    if (!activeSuite || !currentQuestion || showSummary) return;

    setAnswers(prevAns => ({ ...prevAns, [currentQuestion.id]: value }));

    if (currentIdx >= activeSuite.questions.length - 1) {
      setShowSummary(true);
    } else {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const resetAll = () => {
    setSelectedSuiteId(null);
    setCurrentIdx(0);
    setAnswers({});
    setShowSummary(false);
  };

  const runAgain = () => {
    setCurrentIdx(0);
    setAnswers({});
    setShowSummary(false);
  };

  // Calculations
  const redFlagsCount = Object.values(answers).filter(Boolean).length;
  const trueAnswers = activeSuite ? activeSuite.questions.filter(q => answers[q.id]) : [];

  return (
    <div className="bg-[#FAF9F5] min-h-screen text-[#1a211e] pb-32">
      {/* Editorial Navigation */}
      <nav className="max-w-4xl mx-auto px-4 sm:px-10 py-8">
        {selectedSuiteId ? (
          <button 
            onClick={resetAll} 
            className="inline-flex items-center gap-2.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" /> Wybierz inny test
          </button>
        ) : (
          <Link 
            to="/" 
            className="inline-flex items-center gap-2.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" /> Powrót do Startu
          </Link>
        )}
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-10">
        
        {/* Hub Screen (No test selected) */}
        {!selectedSuiteId && (
          <div className="space-y-12">
            
            {/* Header section */}
            <header className="text-left border-b border-slate-200 pb-10">
              <span className="text-[#6B7280] font-black text-[11px] uppercase tracking-[0.25em] block mb-3">
                100% Prywatności i Anonimowości • Dane nie są zapisywane na serwerze
              </span>
              <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-[#0f1412] leading-none mb-6">
                Zatrzymaj się. <br /><span className="text-amber-700 italic font-normal">Spójrz obiektywnie.</span>
              </h1>
              <p className="text-base text-slate-600 leading-relaxed max-w-xl font-serif">
                Żyjąc w ciągłym stresie, chaosie lub pod presją nałogu bliskiego, łatwo przywyknąć do zachowań nieakceptowalnych. 
                Wybierz jeden z obszarów poniżej i odpowiedz szczerze na 5 pytań, aby uporządkować swoje spostrzeżenia.
              </p>
            </header>

            {/* Selection Grid */}
            <div className="space-y-6">
              {TEST_SUITES.map((suite) => {
                const SuiteIcon = suite.icon;
                return (
                  <button
                    key={suite.id}
                    onClick={() => handleStartTest(suite.id)}
                    className={`w-full group bg-white text-left p-8 md:p-10 rounded-[32px] border-2 border-slate-150 ${suite.borderClass} transition-all duration-300 shadow-xs hover:shadow-md flex flex-col md:flex-row gap-6 md:items-center`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${suite.colorClass} shadow-sm group-hover:scale-105 transition-transform`}>
                      <SuiteIcon className="w-7 h-7" />
                    </div>
                    <div className="flex-grow space-y-2">
                      <h3 className="font-serif font-black text-xl md:text-2xl text-[#0f1412]">
                        {suite.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-sans leading-relaxed">
                        {suite.description}
                      </p>
                    </div>
                    <div className="shrink-0 self-start md:self-center font-black text-[10px] uppercase tracking-widest text-[#0f1412] flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                      Rozpocznij test <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Informational reassurance block */}
            <footer className="bg-[#FCFBF8] border border-slate-150 p-6 md:p-8 rounded-[24px] flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs text-slate-500 leading-relaxed">
                <p className="font-bold text-slate-800">Dlaczego warto to zrobić?</p>
                <p>
                  Asystent Autodiagnozy bazuje na przesiewowych, ogólnodostępnych kryteriach stosowanych w psychologii oraz pracy socjalnej. 
                  Służy wyłącznie do celów edukacyjnych i nie ma charakteru diagnozy lekarskiej, lecz pomaga precyzyjnie nazwać zjawiska i przygotować argumenty przed wizytą u specjalisty.
                </p>
              </div>
            </footer>

          </div>
        )}

        {/* Active Test Screen */}
        {selectedSuiteId && activeSuite && currentQuestion && !showSummary && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedSuiteId}-${currentIdx}`}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              className="bg-white p-8 md:p-14 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden"
            >
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
                <div 
                  className={`h-full ${activeSuite.colorClass.split(' ')[0]} transition-all duration-500`}
                  style={{ width: `${((currentIdx) / activeSuite.questions.length) * 100}%` }}
                />
              </div>

              {/* Progress Text Category */}
              <div className="flex justify-between items-center mb-10">
                <span className="text-[#6B7280] font-black text-[10px] uppercase tracking-[0.2em]">
                  {activeSuite.title}
                </span>
                <span className="text-xs font-black text-slate-400 font-mono">
                  Zadanie {currentIdx + 1} z {activeSuite.questions.length}
                </span>
              </div>

              {/* Question text block rendered with gorgeous font style */}
              <div className="space-y-12">
                <h2 className="text-2xl md:text-4xl font-serif font-black tracking-tight text-[#0f1412] leading-tight">
                  {currentQuestion.text}
                </h2>

                {/* Yes / No buttons in beautiful big sizes */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleAnswer(true)}
                    className="p-6.5 rounded-2xl border-2 border-slate-200 hover:border-black text-slate-800 font-sans font-black text-lg transition-all flex items-center justify-between group focus:outline-none"
                  >
                    <span>👍 Tak, doświadczam tego</span>
                    <span className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                      <Check className="w-4 h-4" />
                    </span>
                  </button>
                  <button
                    onClick={() => handleAnswer(false)}
                    className="p-6.5 rounded-2xl border-2 border-slate-200 hover:border-slate-400 text-slate-800 font-sans font-black text-lg transition-all flex items-center justify-between group focus:outline-none"
                  >
                    <span>👎 Nie, to mnie nie dotyczy</span>
                    <span className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-350 tracking-widest text-[#0f1412] transition-all">
                      <X className="w-4 h-4" />
                    </span>
                  </button>
                </div>
              </div>

              {/* Bottom security reassurance */}
              <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Całkowicie anonimowe przetwarzanie lokalne
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Results / Summary screen */}
        {selectedSuiteId && activeSuite && showSummary && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 md:p-14 rounded-[40px] border border-slate-200 shadow-sm space-y-10">
              
              {/* Header result banner */}
              <div className="text-center pb-8 border-b border-slate-150 space-y-6">
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${
                  redFlagsCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {redFlagsCount > 0 ? <ShieldAlert className="w-8 h-8" /> : <Award className="w-8 h-8" />}
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Podsumowanie analizy</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-black text-[#0f1412] tracking-tight">
                    {activeSuite.serifTitle}
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-lg mx-auto">
                    {redFlagsCount === 0 ? activeSuite.conclusionSafe : activeSuite.conclusionWarning}
                  </p>
                </div>
              </div>

              {/* Red flags triggers descriptions */}
              {redFlagsCount > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#0f1412] mb-2">Zidentyfikowane punkty krytyczne:</h3>
                  {trueAnswers.map((q, idx) => (
                    <div key={idx} className="p-6 bg-[#FCFBF8] border border-slate-300 rounded-2xl flex gap-4">
                      <HelpCircle className="w-5 h-5 text-amber-900 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-xs font-serif font-black text-amber-900">Doświadczasz zjawiska:</p>
                        <p className="text-[#0f1412] font-serif font-black text-base">{q.text}</p>
                        <p className="text-xs text-[#1a211e] font-sans leading-relaxed pt-2 font-black border-t border-slate-300 mt-2">
                          <span className="font-bold text-amber-950">Dlaczego to kluczowe:</span> {q.redFlagReason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Educational reassuring statement */}
              {redFlagsCount > 0 ? (
                <div className="p-8 bg-[#0a0f0d] border border-slate-800 rounded-[28px] text-white text-center space-y-6">
                  <h3 className="font-serif font-black text-2xl text-white">To naprawdę nie Twoja wina.</h3>
                  <p className="text-stone-100 text-sm md:text-base leading-relaxed max-w-md mx-auto font-black">
                    Trudno jest samodzielnie wydostać się z zamkniętego kręgu przyzwyczajeń lub wyczerpania psychicznego. 
                    Najważniejszym i najtrudniejszym krokiem jest dostrzeżenie faktów. Pozwól sobie pomóc.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                    <Link 
                      to="/potrzebomat" 
                      className="px-6 py-4 bg-white text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all font-sans"
                    >
                      Skorzystaj z Potrzebomatu
                    </Link>
                    <a 
                      href="tel:116123" 
                      className="px-6 py-4 bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-all font-sans"
                    >
                      Infolinia Kryzysowa: 116 123
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-slate-50 border border-slate-300 rounded-[28px] text-center space-y-4">
                  <h3 className="font-serif font-black text-xl text-[#0f1412]">Wsparcie jest dostępne cały czas</h3>
                  <p className="text-[#1a211e] text-xs font-black leading-relaxed max-w-sm mx-auto">
                    Nawet jeśli ten test nie wykazał wyraźnych czerwonych flag, wciąż masz prawo rozmawiać, dowiadywać się i konsultować swoje sprawy.
                  </p>
                  <Link 
                    to="/blog" 
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#0f1412] hover:text-amber-800"
                  >
                    Przeczytaj merytoryczne artykuły na blogu <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

            </div>

            {/* Bottom auxiliary control buttons */}
            <div className="flex justify-center gap-4">
              <button 
                onClick={runAgain} 
                className="px-6 py-4 bg-white hover:bg-slate-50 text-[#0f1412] border border-slate-300 rounded-xl text-xs font-black uppercase tracking-widest transition-all font-sans flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Powtórz ten test
              </button>
              <button 
                onClick={resetAll} 
                className="px-6 py-4 bg-black hover:bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all font-sans flex items-center gap-2"
              >
                Inny temat testu
              </button>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}

// Icons
function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={3} 
      stroke="currentColor" 
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  );
}
