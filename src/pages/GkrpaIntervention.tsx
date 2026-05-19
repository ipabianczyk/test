import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, Send, MapPin, AlertTriangle, 
  CheckCircle2, RefreshCw, ArrowRight, Info,
  Phone, AlertOctagon, Heart, Scale
} from 'lucide-react';
import { SITE_CONFIG } from '../data/siteConfig';
import { CRISIS_KEYWORDS } from '../constants/crisisKeywords';

/**
 * OGÓLNOPOLSKI MODUŁ ZGŁOSZEŃ INTERWENCYJNYCH DO GKRPA
 * Narzędzie dla otoczenia (sąsiad, rodzina) do generowania wniosku o leczenie.
 */

export default function GkrpaIntervention() {
  // Stan formularza
  const [city, setCity] = useState('');
  const [legalMedical, setLegalMedical] = useState<string[]>([]);
  const [aggressionDesc, setAggressionDesc] = useState('');
  const [peaceDisturbanceDesc, setPeaceDisturbanceDesc] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  
  // Statusy systemowe
  const [isCrisis, setIsCrisis] = useState(false);
  const [showSos, setShowSos] = useState(false);
  const [copied, setCopied] = useState(false);

  // SEO & Analytics
  useEffect(() => {
    // 1. Meta Tagi
    document.title = "Zgłoszenie do GKRPA | Wniosek o leczenie odwykowe | MostPomocy.pl";
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Wygeneruj unikalny, profesjonalny wniosek do Gminnej Komisji Rozwiązywania Problemów Alkoholowych. Pomóż osobie bliskiej wyjść z nałogu.");
    }

    // 2. GA4 Simulation (Anonimowe śledzenie)
    // W rzeczywistym Jekyllu byłoby to wstrzyknięte przez site.google_analytics
    console.log("GA4: Anonimowe śledzenie wejścia na podstronę GKRPA zainicjowane.");
  }, []);

  // Opcje wyboru wielokrotnego (Sytuacja Prawno-Medyczna)
  const LEGAL_OPTIONS = [
    { id: 'police', label: 'Osoba była zatrzymywana przez Policję / Izbę Wytrzeźwień' },
    { id: 'blue_card', label: 'Wobec osoby prowadzona jest procedura "Niebieskiej Karty"' },
    { id: 'past_treatment', label: 'Osoba podejmowała już próby leczenia odwykowego' },
  ];

  // Silnik Triage (Kryzysowe Słowa)
  useEffect(() => {
    const fullText = (aggressionDesc + peaceDisturbanceDesc + additionalDetails).toLowerCase();
    const hasCrisis = CRISIS_KEYWORDS.some(keyword => fullText.includes(keyword));
    
    if (hasCrisis) {
      setIsCrisis(true);
      setShowSos(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [aggressionDesc, peaceDisturbanceDesc, additionalDetails]);

  // Generator Treści Maila
  const messageData = useMemo(() => {
    const selectedOptionsStr = legalMedical.length > 0 
      ? legalMedical.map(id => LEGAL_OPTIONS.find(o => o.id === id)?.label).join('\n- ')
      : 'Brak wcześniejszych notatek lub brak wiedzy o historii prawnej.';

    const subject = `Wniosek Interwencyjny GKRPA — Miejscowość: ${city || 'Pilne'} — Pilne!`;
    const body = `Dzień dobry,\n\n` +
                 `Działając na podstawie art. 4(1) ust. 1 ustawy o wychowaniu w trzeźwości i przeciwdziałaniu alkoholizmowi, za pośrednictwem platformy MostPomocy.pl, składam uzasadniony wniosek o skierowanie na badanie przez biegłych oraz podjęcie czynności zmierzających do orzeczenia obowiązku leczenia odwykowego wobec mieszkańca miejscowości: ${city || '..........'}.\n\n` +
                 `UZASADNIENIE SFORMUŁOWANE NA PODSTAWIE WYWIADU INTERWENCYJNEGO:\n` +
                 `- Informacje o przemocy / historii prawnej:\n- ${selectedOptionsStr}\n\n` +
                 `- Zachowanie pod wpływem alkoholu / Agresja:\n${aggressionDesc || 'Nie podano'}\n\n` +
                 `- Zakłócanie spokoju publicznego:\n${peaceDisturbanceDesc || 'Nie podano'}\n\n` +
                 `- Dodatkowe informacje o uzależnieniu:\n${additionalDetails || 'Brak dodatkowych uwag'}\n\n` +
                 `Wskazane zachowania powodują poważny rozkład życia rodzinnego oraz systematyczne zakłócanie spokoju otoczenia. Proszę o przekazanie sprawy do właściwej Gminnej Komisji Rozwiązywania Problemów Alkoholowych w celu podjęcia natychmiastowej interwencji z urzędu.\n\n` +
                 `Z poważaniem,\n` +
                 `Zgłoszenie przesłane anonimowo przez system MostPomocy.pl (GKRPA_MOD)`;

    return { subject, body, email: 'pracownik.socjalny@centrumwsparcia.pl' };
  }, [city, legalMedical, aggressionDesc, peaceDisturbanceDesc, additionalDetails]);

  const mailtoUrl = `mailto:${messageData.email}?subject=${encodeURIComponent(messageData.subject)}&body=${encodeURIComponent(messageData.body)}`;

  const handleCopy = () => {
    // Używamy surowych danych, aby uniknąć błędów kodowania
    const decodedText = `Temat: ${messageData.subject}\n\n${messageData.body}`;
    navigator.clipboard.writeText(decodedText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isFormValid = city.length > 2 && aggressionDesc.length > 5;

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* HEADER SEO i WIZUALNY */}
      <section className="bg-white border-b border-slate-100 py-16 md:py-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-rose-100"
          >
            <ShieldAlert className="w-4 h-4" /> Moduł Interwencyjny GKRPA
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none mb-8">
            Uruchom <br/><span className="text-rose-600 italic">machinę pomocy.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Przygotuj formalny wniosek do Gminnej Komisji Rozwiązywania Problemów Alkoholowych. 
            Twoje zgłoszenie może uratować bezpieczeństwo rodziny i zdrowie osoby uzależnionej.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 -mt-12">
        <AnimatePresence mode="wait">
          {showSos ? (
            <motion.div
              key="sos"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[48px] p-12 md:p-20 border-[16px] border-rose-500 shadow-2xl text-center"
            >
              <AlertOctagon className="w-24 h-24 text-rose-600 mx-auto mb-8 animate-pulse" />
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">Wykryto sytuację kryzysową!</h2>
              <p className="text-xl text-slate-500 mb-12 max-w-xl mx-auto">
                Wykryliśmy w Twoim opisie słowa wskazujące na bezpośrednie zagrożenie życia. W takiej sytuacji procedura urzędowa GKRPA jest zbyt powolna.
              </p>
              <div className="bg-rose-500 text-white p-10 rounded-[40px] shadow-xl mb-10">
                <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-2">Linia Wsparcia 24/7</p>
                <a href="tel:116123" className="text-5xl md:text-7xl font-black tracking-tighter cursor-pointer hover:underline">116 123</a>
              </div>
              <button 
                onClick={() => setShowSos(false)}
                className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900"
              >
                Ignoruj i wróć do formularza (Logika Lokalna)
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[56px] p-8 md:p-16 shadow-2xl space-y-12 border border-slate-100"
            >
              {/* SEKCJA 1: LOKALIZACJA */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black">1</div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Gdzie mieszka osoba?</h3>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    type="text" 
                    placeholder="Wpisz miejscowość / gminę..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border-4 border-transparent focus:border-blue-500 focus:bg-white rounded-3xl p-6 pl-16 text-xl font-bold transition-all outline-none"
                  />
                </div>
              </div>

              {/* SEKCJA 2: HISTORIA */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black">2</div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Sytuacja Prawno-Medyczna</h3>
                </div>
                <div className="grid gap-3">
                  {LEGAL_OPTIONS.map((opt) => (
                    <label 
                      key={opt.id}
                      className={`flex items-center gap-4 p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                        legalMedical.includes(opt.id) 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                          : 'bg-slate-50 border-transparent text-slate-600 hover:bg-white hover:border-indigo-100'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={legalMedical.includes(opt.id)}
                        onChange={() => {
                          setLegalMedical(prev => 
                            prev.includes(opt.id) ? prev.filter(i => i !== opt.id) : [...prev, opt.id]
                          );
                        }}
                        className="hidden"
                      />
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${legalMedical.includes(opt.id) ? 'bg-white border-white' : 'bg-white border-slate-200'}`}>
                        {legalMedical.includes(opt.id) && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <span className="font-bold text-sm md:text-base leading-tight">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* SEKCJA 3: ZACHOWANIE */}
              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center font-black">3</div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Wywiad Środowiskowy</h3>
                </div>

                <div className="space-y-4">
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 pl-2">Opis zachowania i agresji</label>
                  <textarea 
                    placeholder="Jak osoba reaguje pod wpływem? Czy występuje przemoc lub agresja?"
                    value={aggressionDesc}
                    onChange={(e) => setAggressionDesc(e.target.value)}
                    className="w-full bg-slate-50 border-4 border-transparent focus:border-rose-500 focus:bg-white rounded-4xl p-8 text-lg font-medium transition-all outline-none min-h-[150px] resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 pl-2">Zakłócanie spokoju</label>
                  <textarea 
                    placeholder="Czy dochodzi do awantur na klatce schodowej, zakłócania ciszy nocnej lub innych incydentów publicznych?"
                    value={peaceDisturbanceDesc}
                    onChange={(e) => setPeaceDisturbanceDesc(e.target.value)}
                    className="w-full bg-slate-50 border-4 border-transparent focus:border-rose-500 focus:bg-white rounded-4xl p-8 text-lg font-medium transition-all outline-none min-h-[150px] resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 pl-2">Dodatkowe szczegóły (Długi, Zdrowie, Dzieci)</label>
                  <textarea 
                    placeholder="Wszelkie inne ważne informacje, które pomogą GKRPA ocenić stopień rozkładu życia rodzinnego..."
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    className="w-full bg-slate-50 border-4 border-transparent focus:border-rose-500 focus:bg-white rounded-4xl p-8 text-lg font-medium transition-all outline-none min-h-[150px] resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* GENEROWANIE */}
              <div className="pt-10 border-t border-slate-100 flex flex-col items-center gap-8">
                <div className="p-8 bg-slate-900 rounded-[40px] w-full text-white space-y-6 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32" />
                  
                  <div className="relative z-10 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Gotowy list interwencyjny:</p>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-xs font-mono whitespace-pre-wrap leading-relaxed opacity-80">
                      {messageData.body}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 relative z-10 w-full">
                    <button 
                      onClick={() => {
                        if (!isFormValid) {
                          alert("Proszę uzupełnij przynajmniej miejscowość i opis zachowania (min. kilka słów).");
                          return;
                        }
                        
                        if (mailtoUrl.length > 2000) {
                          if (!window.confirm("Wiadomość jest bardzo długa. Niektóre programy pocztowe mogą mieć problem z jej otwarciem. Czy chcesz spróbować mimo to?")) {
                            return;
                          }
                        }

                        // Tworzymy ukryty link i klikamy go
                        const link = document.createElement('a');
                        link.href = mailtoUrl;
                        link.style.display = 'none';
                        document.body.appendChild(link);
                        link.click();
                        
                        // Usuwamy po chwili
                        setTimeout(() => {
                          if (document.body.contains(link)) {
                            document.body.removeChild(link);
                          }
                        }, 500);
                      }}
                      className={`flex-1 flex items-center justify-center gap-3 px-10 py-6 rounded-3xl font-black text-lg uppercase tracking-tight transition-all shadow-xl ${
                        isFormValid 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40 cursor-pointer' 
                        : 'bg-slate-800 text-slate-500 grayscale opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-5 h-5" /> Wyślij do GKRPA
                    </button>

                    <button 
                      onClick={handleCopy}
                      className={`px-10 py-6 rounded-3xl font-black text-xs uppercase tracking-widest transition-all border-2 flex items-center justify-center gap-3 ${
                        copied 
                        ? 'bg-emerald-500 text-white border-emerald-400' 
                        : 'bg-slate-800 text-white border-white/10 hover:bg-slate-700'
                      }`}
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                      {copied ? 'Skopiowano!' : 'Kopiuj Treść'}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-3xl max-w-2xl border border-blue-100">
                  <Info className="w-10 h-10 text-blue-600 shrink-0" />
                  <p className="text-xs text-blue-900 font-medium leading-relaxed">
                    <strong>Pamiętaj:</strong> Zgłoszenie interwencyjne w trybie ustawy o wychowaniu w trzeźwości nie wymaga Twojego podpisu elektronicznego, aby komisja podjęła czynności sprawdzające z urzędu. Działasz dla wspólnego dobra.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="mt-20 grid md:grid-cols-2 gap-8">
           <div className="p-10 bg-white rounded-[40px] shadow-lg border-2 border-slate-50 flex items-start gap-6">
              <Scale className="w-12 h-12 text-slate-400 shrink-0" />
              <div>
                <h4 className="text-lg font-black text-slate-900 mb-2">Podstawa Prawna</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">Ustawa z dnia 26 października 1982 r. o wychowaniu w trzeźwości i przeciwdziałaniu alkoholizmowi (Art. 4(1)).</p>
              </div>
           </div>
           <div className="p-10 bg-white rounded-[40px] shadow-lg border-2 border-slate-50 flex items-start gap-6">
              <Heart className="w-12 h-12 text-rose-400 shrink-0" />
              <div>
                <h4 className="text-lg font-black text-slate-900 mb-2">Dla Ciebie</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">Jesteś osobą współuzależnioną? Zajrzyj do sekcji Poradników, aby dowiedzieć się jak zadbać o siebie w tym procesie.</p>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
