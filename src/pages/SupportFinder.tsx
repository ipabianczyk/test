import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Send, Mail, MapPin, AlertTriangle, Phone, 
  ShieldAlert, ArrowRight, Heart, Info, RefreshCw,
  CheckCircle2, Users
} from 'lucide-react';
import { SITE_CONFIG } from '../data/siteConfig';
import { CRISIS_KEYWORDS } from '../constants/crisisKeywords';
import ParentingWizard from '../components/ParentingWizard';

/**
 * POTRZEBOMAT - Główny moduł interwencji
 * Implementacja logiki lokalnej (bez AI) wg wytycznych projektowych.
 */

export default function SupportFinder() {
  // Tryby: 'selection', 'form', 'preview', 'crisis', 'parenting'
  const [mode, setMode] = useState<'selection' | 'form' | 'preview' | 'crisis' | 'parenting'>('selection');
  
  // Stan formularza
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [problemTypes, setProblemTypes] = useState<string[]>([]);
  const [isCrisis, setIsCrisis] = useState(false);

  const detectLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      if (data.city) {
        setLocation(data.city);
      }
    } catch (e) {
      console.error('Location detection failed', e);
    }
  };

  const READY_TEMPLATES = [
    { label: "Alimenty i opieka", text: "Zgłaszam się z prośbą o pomoc w sprawie alimentacyjnej oraz ustalenia opieki nad dziećmi. Moja sytuacja finansowa uległa pogorszeniu i potrzebuję porady prawnej oraz ewentualnego wsparcia socjalnego." },
    { label: "Rozwód i psycholog", text: "Jestem w trakcie trudnego rozwodu. Potrzebuję wsparcia psychologicznego, aby poradzić sobie z emocjami, oraz konsultacji z prawnikiem w sprawie podziału majątku." },
    { label: "Mobbing w pracy", text: "W miejscu pracy doświadczam zachowań o charakterze mobbingu. Chciałbym dowiedzieć się, jakie mam prawa jako pracownik i czy mogę liczyć na interwencję prawną." },
    { label: "Wsparcie w nałogu", text: "Szukam pomocy w walce z uzależnieniem. Potrzebuję kontaktu z terapeutą, który pomoże mi postawić pierwsze kroki w procesie zdrowienia." },
    { label: "Przemoc domowa", text: "Doświadczam przemocy w domu. Szukam bezpiecznego schronienia, pomocy prawnej (Niebieska Karta) oraz wsparcia dla moich dzieci." },
  ];

  const DEPARTMENTS = [
    { id: 'psychiatrist', label: 'Psychiatra', email: 'psychiatra@centrumwsparcia.pl', icon: Heart, desc: 'Konsultacja psychiatryczna' },
    { id: 'lawyer', label: 'Prawnik', email: 'prawnik@centrumwsparcia.pl', icon: ShieldAlert, desc: 'Porady prawne' },
    { id: 'sexologist', label: 'Seksuolog', email: 'seksuolog@centrumwsparcia.pl', icon: Heart, desc: 'Problemy sfery intymnej' },
    { id: 'addiction', label: 'Terapeuta uzależnień', email: 'terapeuta.uzaleznien@centrumwsparcia.pl', icon: AlertTriangle, desc: 'Terapia uzależnień' },
    { id: 'recovery_assistant', label: 'Asystent zdrowienia', email: 'asystent.zdrowienia@centrumwsparcia.pl', icon: Info, desc: 'Wsparcie w procesie zdrowienia' },
    { id: 'social_worker', label: 'Pracownik socjalny', email: 'pracownik.socjalny@centrumwsparcia.pl', icon: MapPin, desc: 'Pomoc socjalna i urzędowa' },
    { id: 'uniformed_services', label: 'Służby mundurowe', email: 'liniamundurowa@centrumwsparcia.pl', icon: AlertTriangle, desc: 'Ratownicy i służby' },
    { id: 'general', label: 'Szerokie spektrum', email: 'porady@centrumwsparcia.pl', icon: Mail, desc: 'Ogólne zapytania' },
  ];

  // Treść wiadomości
  const messageData = React.useMemo(() => {
    const isMulti = problemTypes.length > 1;
    const isNone = problemTypes.length === 0;
    
    // Jeśli wybrano kilka lub zero, używamy konta ogólnego
    const targetDept = isMulti || isNone
      ? DEPARTMENTS.find(d => d.id === 'general')!
      : DEPARTMENTS.find(d => d.id === problemTypes[0])!;

    const selectedLabels = problemTypes.map(id => DEPARTMENTS.find(d => d.id === id)?.label).join(', ');
    const subject = `MostPomocy Potrzebomat - ${isMulti ? 'Wiele potrzeb' : targetDept.label} [${location.toUpperCase()}]`;
    const body = `Szanowny Specjalisto (MostPomocy Centrom Wsparcia),\n\n` +
                 `Przesyłam zgłoszenie wygenerowane przez asystenta MostPomocy (Potrzebomat).\n\n` +
                 `DANE ZGŁOSZENIA:\n` +
                 `- Wybrane obszary: ${selectedLabels}\n` +
                 `- Miejscowość: ${location}\n\n` +
                 `OPIS SYTUACJI:\n${description}\n\n` +
                 `---\n` +
                 `Wiadomość wysłana z portalu MostPomocy.pl (Potrzebomat)`;
    
    return { subject, body, email: targetDept.email, label: targetDept.label };
  }, [description, location, problemTypes, DEPARTMENTS]);

  useEffect(() => {
    if (mode === 'form') {
      const lowerText = description.toLowerCase();
      const hasCrisis = CRISIS_KEYWORDS.some(keyword => lowerText.includes(keyword));
      
      if (hasCrisis) {
        setIsCrisis(true);
        setMode('crisis');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [description, mode]);

  const mailtoUrl = `mailto:${messageData.email}?subject=${encodeURIComponent(messageData.subject)}&body=${encodeURIComponent(messageData.body)}`;

  const [copied, setCopied] = useState(false);

  const resetForm = () => {
    setDescription('');
    setLocation('');
    setProblemTypes([]);
    setMode('selection');
    setIsCrisis(false);
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 md:py-16 px-4 md:px-0">
      <div className="max-w-5xl mx-auto">
        
        <AnimatePresence mode="wait">
          {/* EKRAN WYBORU ŚCIEŻKI */}
          {mode === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 md:space-y-12"
            >
              <div className="text-center mb-10 md:mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 md:mb-6 border border-blue-100">
                  Wybierz rodzaj wsparcia
                </div>
                <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-4 md:mb-6">
                  Nie jesteś <span className="text-blue-600 italic">sam.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed px-4">
                  MostPomocy to Twoje bezpieczne przejście od problemu do rozwiązania. Wybierz ścieżkę kontaktu.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {/* OPCJA 1: POTRZEBOMAT / E-MAIL */}
                <button 
                  onClick={() => setMode('form')}
                  className="group bg-white p-6 md:p-10 rounded-[32px] md:rounded-[48px] border-4 border-white hover:border-blue-500 shadow-xl hover:shadow-2xl transition-all text-left flex flex-col h-full"
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 text-blue-600 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-10 group-hover:bg-blue-600 group-hover:text-white transition-all group-hover:rotate-6">
                    <Mail className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <h3 className="text-xl md:text-3xl font-black text-slate-900 mb-2 md:mb-4 tracking-tight">Asystent E-mail</h3>
                  <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed flex-grow">
                    Przygotujemy profesjonalny wzór zgłoszenia do specjalisty na podstawie Twojego opisu.
                  </p>
                  <div className="mt-6 md:mt-8 flex items-center gap-2 font-black text-[10px] md:text-xs uppercase tracking-widest text-blue-600 group-hover:translate-x-2 transition-transform">
                    Otwórz Kreator <ArrowRight className="w-4 h-4" />
                  </div>
                </button>

                {/* OPCJA NOWA: SAMODZIELNE RODZICIELSTWO / BRAK ALIMENTÓW */}
                <button 
                  onClick={() => setMode('parenting')}
                  className="group bg-white p-6 md:p-10 rounded-[32px] md:rounded-[48px] border-4 border-white hover:border-amber-500 shadow-xl hover:shadow-2xl transition-all text-left flex flex-col h-full"
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-50 text-[#8C6239] rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-10 group-hover:bg-[#8C6239] group-hover:text-white transition-all group-hover:rotate-6">
                    <Users className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <h3 className="text-xl md:text-3xl font-black text-slate-900 mb-2 md:mb-4 tracking-tight">Samotny Rodzic / Brak Alimentów</h3>
                  <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed flex-grow">
                    Dedykowany, krok po kroku asystent badający kryterium i generujący gotowy wniosek (Katowice, Sosnowiec, Dąbrowa Górnicza).
                  </p>
                  <div className="mt-6 md:mt-8 flex items-center gap-2 font-black text-[10px] md:text-xs uppercase tracking-widest text-amber-700 group-hover:translate-x-2 transition-transform">
                    Zbadaj Ścieżkę <ArrowRight className="w-4 h-4" />
                  </div>
                </button>

                {/* OPCJA 4: GKRPA INTERWENCJA */}
                <Link 
                  to="/gkrpa-interwencja"
                  className="group bg-blue-50 p-6 md:p-10 rounded-[32px] md:rounded-[48px] border-4 border-blue-50 hover:border-blue-500 shadow-xl hover:shadow-2xl transition-all text-left flex flex-col h-full"
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white text-blue-600 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-10 group-hover:bg-blue-600 group-hover:text-white transition-all group-hover:-rotate-6 shadow-sm">
                    <ShieldAlert className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <h3 className="text-xl md:text-3xl font-black text-slate-900 mb-2 md:mb-4 tracking-tight">Zgłoś osobę (GKRPA)</h3>
                  <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed flex-grow">
                    Zgłoś osobę potrzebującą pomocy z Twojego otoczenia do Komisji Rozwiązywania Problemów Alkoholowych.
                  </p>
                  <div className="mt-6 md:mt-8 flex items-center gap-2 font-black text-[10px] md:text-xs uppercase tracking-widest text-blue-600 group-hover:translate-x-2 transition-transform">
                    Rozpocznij Interwencję <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>

                {/* OPCJA 2: TELEFONY SOS */}
                <button 
                  onClick={() => { setIsCrisis(true); setMode('crisis'); }}
                  className="group bg-rose-500 p-6 md:p-10 rounded-[32px] md:rounded-[48px] border-4 border-rose-500 hover:bg-rose-600 shadow-xl hover:shadow-rose-500/20 transition-all text-left flex flex-col h-full text-white relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 text-white rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-10 group-hover:scale-110 transition-all relative z-10">
                    <Phone className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <h3 className="text-xl md:text-3xl font-black mb-2 md:mb-4 tracking-tight relative z-10">Szybki Kontakt SOS</h3>
                  <p className="text-white/80 font-medium text-sm md:text-base leading-relaxed flex-grow relative z-10">
                    Telefony zaufania dostępne 24/7 dla osób w nagłym kryzysie emocjonalnym.
                  </p>
                  <div className="mt-6 md:mt-8 flex items-center gap-2 font-black text-[10px] md:text-xs uppercase tracking-widest relative z-10 group-hover:translate-x-2 transition-transform">
                    Pokaż Telefony <ArrowRight className="w-4 h-4" />
                  </div>
                </button>

                {/* OPCJA 3: BAZA PLACÓWEK */}
                <Link 
                  to="/mapa"
                  className="group bg-white p-6 md:p-10 rounded-[32px] md:rounded-[48px] border-4 border-white hover:border-emerald-500 shadow-xl hover:shadow-2xl transition-all text-left flex flex-col h-full"
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-50 text-emerald-600 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-10 group-hover:bg-emerald-600 group-hover:text-white transition-all group-hover:-rotate-6">
                    <MapPin className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <h3 className="text-xl md:text-3xl font-black text-slate-900 mb-2 md:mb-4 tracking-tight">Baza Placówek</h3>
                  <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed flex-grow">
                    Znajdź najbliższy Ośrodek Interwencji lub MOPS na interaktywnej mapie.
                  </p>
                  <div className="mt-6 md:mt-8 flex items-center gap-2 font-black text-[10px] md:text-xs uppercase tracking-widest text-emerald-600 group-hover:translate-x-2 transition-transform">
                    Szukaj na Mapie <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </div>

              {/* DODATKOWE WSPARCIE */}
              <div className="pt-10 flex flex-col md:flex-row gap-6">
                <Link to="/blog" className="flex-1 p-8 bg-amber-50 rounded-[40px] border-2 border-amber-100 group flex items-start gap-6">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-amber-900 mb-1">Strefa Edukacji</h4>
                    <p className="text-amber-800/60 font-medium text-sm">Artykuły i poradniki, które pomogą Ci zrozumieć Twoje prawa.</p>
                  </div>
                </Link>
                <Link to="/bezpiecznik" className="flex-1 p-8 bg-indigo-50 rounded-[40px] border-2 border-indigo-100 group flex items-start gap-6">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-indigo-900 mb-1">Przycisk Bezpieczeństwa</h4>
                    <p className="text-indigo-800/60 font-medium text-sm">Dyskretny sposób na szybkie zamknięcie strony w razie potrzeby.</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          )}

          {/* EKRAN BLOKADY SOS */}
          {mode === 'crisis' && (
            <motion.div
              key="sos-blocked"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-[40px] md:rounded-[80px] p-8 md:p-20 border-[8px] md:border-[24px] border-rose-500 shadow-[0_0_120px_rgba(244,63,94,0.3)] text-center relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-8 bg-rose-500 animate-pulse flex items-center justify-center overflow-hidden">
                <div className="flex gap-10 whitespace-nowrap text-[10px] font-black text-white uppercase tracking-[0.4em]">
                  {Array(10).fill('NATYCHMIASTOWE WSPARCIE •').map((t, i) => <span key={i}>{t}</span>)}
                </div>
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-50/50 via-transparent to-transparent opacity-100" />
              
              <div className="relative z-10">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.15, 1],
                    boxShadow: ["0 0 0px rgba(244,63,94,0)", "0 0 40px rgba(244,63,94,0.4)", "0 0 0px rgba(244,63,94,0)"]
                  }} 
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-24 h-24 md:w-32 md:h-32 bg-rose-100 text-rose-600 rounded-[32px] md:rounded-[48px] flex items-center justify-center mx-auto mb-8 shadow-xl"
                >
                  <ShieldAlert className="w-12 h-12 md:w-16 md:h-16" />
                </motion.div>

                <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-none px-4">
                  {isCrisis ? 'To nie Twoja wina. ' : 'Nie jesteś sam. '} <br/>
                  <span className="text-rose-600 drop-shadow-sm">Jesteśmy z Tobą.</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-slate-500 font-medium mb-12 md:mb-20 max-w-2xl mx-auto leading-relaxed px-4">
                  Wybierz numer poniżej. Połączenie jest <span className="text-slate-900 font-bold italic underline">całkowicie darmowe</span> i anonimowe.
                </p>

                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 mb-12 md:mb-20">
                  <motion.a 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={`tel:${SITE_CONFIG.contact.child_emergency_phone.replace(/\s/g, '')}`}
                    className="group bg-rose-600 text-white p-8 md:p-14 rounded-[40px] md:rounded-[56px] hover:bg-rose-700 transition-all shadow-2xl shadow-rose-500/40 text-left relative overflow-hidden ring-8 ring-rose-50"
                  >
                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-4">Dla Dzieci i Młodzieży</p>
                      <h2 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter tabular-nums leading-none">{SITE_CONFIG.contact.child_emergency_phone}</h2>
                      <div className="flex items-center gap-3 font-black text-xs uppercase tracking-widest bg-white/20 w-fit px-8 py-4 rounded-full backdrop-blur-md">
                        Zadzwoń teraz <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
                      </div>
                    </div>
                    <Phone className="absolute bottom-[-30px] right-[-30px] w-56 h-56 md:w-80 md:h-80 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                  </motion.a>

                  <motion.a 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={`tel:${SITE_CONFIG.contact.emergency_phone.replace(/\s/g, '')}`}
                    className="group bg-slate-900 text-white p-8 md:p-14 rounded-[40px] md:rounded-[56px] hover:bg-black transition-all shadow-2xl shadow-slate-900/40 text-left relative overflow-hidden ring-8 ring-slate-50"
                  >
                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-4">Dla Dorosłych (Kryzysowe)</p>
                      <h2 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter tabular-nums leading-none">{SITE_CONFIG.contact.emergency_phone.replace(' ', '\u00A0')}</h2>
                      <div className="flex items-center gap-3 font-black text-xs uppercase tracking-widest bg-white/20 w-fit px-8 py-4 rounded-full backdrop-blur-md">
                        Pomoc 24/7 <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
                      </div>
                    </div>
                    <Phone className="absolute bottom-[-30px] right-[-30px] w-56 h-56 md:w-80 md:h-80 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                  </motion.a>
                </div>

                <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                  <button 
                    onClick={() => { setMode('selection'); setIsCrisis(false); }} 
                    className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> Wróć do opcji kontaktu
                  </button>
                  <span className="hidden md:block w-1 h-1 bg-slate-200 rounded-full" />
                  <Link 
                    to="/mapa"
                    className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    <MapPin className="w-4 h-4" /> Szukaj placówki osobiście
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {mode === 'parenting' && (
            <motion.div
              key="potrzebomat-parenting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12 animate-fade-in"
            >
              <ParentingWizard onBack={() => setMode('selection')} />
            </motion.div>
          )}

          {/* EKRAN PODGLĄDU WIADOMOŚCI */}
          {mode === 'preview' && (
            <motion.div
              key="potrzebomat-preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12"
            >
              <nav className="mb-8">
                <button 
                  onClick={() => setMode('form')}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Wróć do edycji
                </button>
              </nav>

              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none mb-6">
                  Podgląd <br/><span className="text-blue-600 italic">Twojej wiadomości.</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                  Tak będzie wyglądać e-mail wysłany do specjalisty. Przeczytaj go uważnie i jeśli wszystko się zgadza – kliknij przycisk na dole.
                </p>
              </div>

              <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-[48px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
                  {/* Nagłówek "Pocztowy" */}
                  <div className="bg-slate-50 p-6 md:p-10 border-b border-slate-100 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 w-24">Do:</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold border border-blue-200">
                        {messageData.label} ({messageData.email})
                      </span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 w-24">Temat:</span>
                       <span className="text-slate-700 font-black text-sm">{messageData.subject}</span>
                    </div>
                  </div>

                  {/* Treść "Dokumentu" */}
                  <div className="p-8 md:p-16 bg-white min-h-[400px] relative">
                    {/* Znak wodny MostPomocy */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-50 font-black text-[10vw] pointer-events-none select-none uppercase tracking-tighter -rotate-12 opacity-40">
                      MostPomocy
                    </div>
                    
                    <div className="relative z-10 whitespace-pre-wrap font-medium text-slate-700 leading-relaxed text-lg italic">
                      {messageData.body}
                    </div>
                  </div>

                  {/* Stopka z przyciskiem */}
                  <div className="p-8 md:p-12 bg-slate-900 border-t border-slate-800 flex flex-col items-center gap-6">
                    <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
                      <a 
                        id="link-mailto"
                        href={mailtoUrl}
                        className="flex-1 md:flex-initial px-12 py-6 bg-blue-600 text-white rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-blue-500 transition-all shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-4 group"
                      >
                        Otwórz w Poczcie <Send className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                      </a>
                      
                      <button 
                        onClick={() => {
                          // Realizacja poprawki kluczowej: upewniamy się, że kopiujemy czysty, odkodowany tekst
                          // W React używamy bezpośrednio messageData.body, który jest surowym tekstem (niezakodowanym URL)
                          const bodyToCopy = messageData.body;
                          navigator.clipboard.writeText(bodyToCopy).then(() => {
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          });
                        }}
                        className={`px-8 py-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 border ${
                          copied 
                            ? 'bg-emerald-500 text-white border-emerald-400' 
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {copied ? <CheckCircle2 className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                        {copied ? 'Skopiowano treść!' : 'Kopiuj Treść'}
                      </button>
                    </div>
                    
                    <div className="space-y-2 text-center">
                      <p className="text-slate-500 text-[10px] font-medium max-w-sm uppercase tracking-widest mx-auto">
                        Jeśli przycisk nie otwiera Twojej poczty (np. przez zbyt długą wiadomość), użyj opcji "Kopiuj Treść" i wklej ją ręcznie.
                      </p>
                      {mailtoUrl.length > 2000 && (
                        <p className="text-amber-500 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                          <AlertTriangle className="w-3 h-3" /> Wiadomość jest długa - zalecamy kopiowanie ręczne
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {/* STANDARDOWY FORMULARZ POTRZEBOMATU */}
          {mode === 'form' && (
            <motion.div
              key="potrzebomat-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <nav className="mb-8">
                <button 
                  onClick={() => setMode('selection')}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Cofnij do wyboru
                </button>
              </nav>

              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-blue-100">
                  <Info className="w-4 h-4" /> 100% Bezpieczeństwa (Local Triage)
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-6">
                  Opisz swoimi <br/><span className="text-blue-600 italic">słowami.</span>
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                  Przygotujemy profesjonalny szablon wiadomości, którą wyślesz do specjalisty z <strong>Centrum Wsparcia</strong>.
                </p>
              </div>

              <div className="bg-white rounded-[56px] p-8 md:p-14 shadow-2xl border-4 border-slate-50">
                <div className="space-y-10">
                  {/* WYBÓR PROBLEMU */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-400">
                        <Heart className="w-4 h-4" /> Czego dotyczy zgłoszenie?
                      </label>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${problemTypes.length >= 3 ? 'bg-amber-100 text-amber-600 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
                        {problemTypes.length >= 3 ? 'Limit (wybierz najważniejsze)' : `Wybrano ${problemTypes.length} / 3`}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                      {DEPARTMENTS.map((dept) => {
                        const Icon = dept.icon;
                        const isActive = problemTypes.includes(dept.id);
                        return (
                          <button
                            key={dept.id}
                            onClick={() => {
                              setProblemTypes(prev => {
                                if (prev.includes(dept.id)) {
                                  return prev.filter(id => id !== dept.id);
                                }
                                if (prev.length < 3) {
                                  return [...prev, dept.id];
                                }
                                return prev;
                              });
                            }}
                            className={`flex items-center gap-4 p-6 rounded-3xl border-2 transition-all text-left group ${
                              isActive 
                                ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200 scale-[1.02]' 
                                : 'bg-slate-50 border-transparent text-slate-600 hover:border-blue-200 hover:bg-white'
                            }`}
                          >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${isActive ? 'bg-white/20' : 'bg-white shadow-sm group-hover:bg-blue-50'}`}>
                              <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-blue-500'}`} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="block font-black text-[12px] uppercase tracking-tight leading-tight">{dept.label}</span>
                                  {isActive && <CheckCircle2 className="w-3 h-3" />}
                                </div>
                                <span className={`block text-[10px] font-medium leading-none ${isActive ? 'text-white/60' : 'text-slate-400'}`}>{(dept as any).desc}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* LOKALIZACJA */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-400">
                        <MapPin className="w-4 h-4" /> Twoja Miejscowość
                      </label>
                      <button 
                        onClick={() => detectLocation()}
                        className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 flex items-center gap-2"
                      >
                        <RefreshCw className="w-3 h-3" /> Wykryj moją lokalizację
                      </button>
                    </div>
                    <input 
                      type="text"
                      placeholder="np. Sosnowiec, Radom, Bytom..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-slate-50 border-4 border-transparent focus:border-blue-500 focus:bg-white rounded-3xl p-6 text-xl font-bold transition-all outline-none shadow-inner"
                    />
                  </div>

                  {/* OPIS PROBLEMU */}
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                      <label className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-400">
                        <AlertTriangle className="w-4 h-4" /> Co się dzieje w Twoim życiu?
                      </label>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest self-center mr-2">Podpowiedzi:</span>
                        {READY_TEMPLATES.map((tmpl, i) => (
                          <button
                            key={i}
                            onClick={() => setDescription(tmpl.text)}
                            className="px-4 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-500 rounded-xl text-[10px] font-bold transition-colors border border-transparent hover:border-blue-100"
                          >
                            {tmpl.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <textarea 
                      placeholder="Napisz swobodnie o tym, z czym się mierzysz. Możesz pisać o emocjach, pracy, zdrowiu lub rodzinie..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-50 border-4 border-transparent focus:border-blue-500 focus:bg-white rounded-4xl p-8 text-lg font-medium transition-all outline-none min-h-[250px] resize-none leading-relaxed shadow-inner"
                    />
                  </div>

                  {/* PRZYCISK PODGLĄDU */}
                  <button 
                    onClick={() => {
                      if (description && location && problemTypes.length > 0) {
                        setMode('preview');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    disabled={!description || !location || problemTypes.length === 0}
                    className={`w-full group p-8 rounded-[36px] flex flex-col items-center justify-center gap-2 transition-all shadow-2xl ring-4 ring-blue-50 ${
                      (!description || !location || problemTypes.length === 0) 
                        ? 'bg-slate-300 text-slate-500 opacity-50 grayscale cursor-not-allowed shadow-none' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30 cursor-pointer'
                    }`}
                  >
                    <span className="text-2xl font-black flex items-center justify-center gap-3">
                      Zobacz podgląd wiadomości 
                      <ArrowRight className={`w-6 h-6 ${(!description || !location || problemTypes.length === 0) ? '' : 'group-hover:translate-x-2 transition-transform'}`} />
                    </span>
                  </button>
                  
                  <div className="text-center pt-4">
                    {problemTypes.length > 0 && (
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter mb-2">
                        Wybrany odbiorca: <span className="text-blue-400">{messageData.email}</span>
                      </p>
                    )}
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                      Wiadomość trafi do specjalisty z Twojego regionu lub centralnego punktu triage-u.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


      </div>
    </div>
  );
}
