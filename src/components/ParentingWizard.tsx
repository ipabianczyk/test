import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, BookOpen, MapPin, Calculator, Phone, Mail, FileText, ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface ParentingWizardProps {
  onBack: () => void;
}

export default function ParentingWizard({ onBack }: ParentingWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [alimonyStatus, setAlimonyStatus] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [income, setIncome] = useState<string>('');
  const [hasExec, setHasExec] = useState<boolean | null>(null);

  const CITIES_DATA: { [key: string]: { mops: string, court: string, tips: string } } = {
    'Sosnowiec': {
      mops: 'MOPS Sosnowiec – Dział Świadczeń Alimentacyjnych, ul. 3 Maja 33, 41-200 Sosnowiec, tel. 32 296 22 00.',
      court: 'Sąd Rejonowy w Sosnowcu – III Wydział Rodzinny i Nieletnich, ul. 1 Maja 19, 41-200 Sosnowiec.',
      tips: 'W Sosnowcu bezpłatne porady prawne dla samotnych rodziców realizowane są m.in. przy MOPS oraz w punktach NPP Urzędu Miejskiego.'
    },
    'Katowice': {
      mops: 'MOPS Katowice – Dział Świadczeń Rodzinnych, ul. Wita Stwosza 7, 40-037 Katowice, tel. 32 251 00 87.',
      court: 'Sąd Rejonowy Katowice-Zachód lub Katowice-Wschód (w zależności od dzielnicy) – Wydziały Rodzinne.',
      tips: 'Katowicki MOPS prowadzi ułatwioną ścieżkę składania wniosków o Fundusz Alimentacyjny drogą elektroniczną (Emp@tia).'
    },
    'Dąbrowa Górnicza': {
      mops: 'MOPS Dąbrowa Górnicza – Dział Świadczeń, ul. Sobieskiego 13, 41-300 Dąbrowa Górnicza, tel. 32 262 33 22.',
      court: 'Sąd Rejonowy w Dąbrowie Górniczej – III Wydział Rodzinny i Nieletnich, ul. Graniczna 23, 41-300 Dąbrowa Górnicza.',
      tips: 'Dąbrowski MOPS współpracuje bezpośrednio z komornikami sądowymi przy ul. Granicznej w celu przyspieszenia wydawania zaświadczeń o bezskuteczności egzekucji.'
    }
  };

  const checkEligibility = () => {
    if (!income) return null;
    const incVal = parseFloat(income);
    if (isNaN(incVal)) return null;
    
    // Próg dochodowy dla Funduszu Alimentacyjnego wynosi 1209 zł netto na osobę (od 2023/2024 roku)
    const threshold = 1209;
    return incVal <= threshold;
  };

  const generateActionPlan = () => {
    const isEligible = checkEligibility();
    const cityDetails = CITIES_DATA[city] || {
      mops: 'Lokalny Ośrodek Pomocy Społecznej (MOPS/OPS) we wskazanej miejscowości.',
      court: 'Właściwy Sąd Rejonowy – Wydział Rodzinny i Nieletnich dla Twojego miejsca zamieszkania.',
      tips: 'Zgłoś się do najbliższego Punktu Nieodpłatnej Pomocy Prawnej w celu bezpłatnego sporządzenia pism procesowych.'
    };

    let plan = [];
    
    if (alimonyStatus === 'no-ruling') {
      plan.push({
        title: 'Krok 1: Wniesienie pozwu o alimenty (lub zabezpieczenie)',
        desc: `Musisz uzyskać tytuł egzekucyjny. Złóż pozew do Sądu Rodzinnego. Wniosek jest wolny od kosztów sądowych dla rodzica dochodzącego alimentów. Adres: ${cityDetails.court}`,
        tip: 'Zawnioskuj w pozwie o „Zabezpieczenie alimentów na czas trwania procesu” – sąd może nakazać płacenie już od pierwszej rozprawy.'
      });
    }

    if (alimonyStatus === 'has-ruling' && hasExec === false) {
      plan.push({
        title: 'Krok 1: Skierowanie wniosku do Komornika Sądowego',
        desc: 'Zanieś odpis wyroku z klauzulą wykonalności do dowolnego komornika sądowego i złóż wniosek o wszczęcie egzekucji alimentów.',
        tip: 'Egzekucja komornicza jest warunkiem ubiegania się o pomoc z Funduszu Alimentacyjnego.'
      });
    }

    if (alimonyStatus === 'has-ruling' && hasExec === true) {
      if (isEligible === true) {
        plan.push({
          title: 'Krok 1: Wniosek o Fundusz Alimentacyjny w MOPS',
          desc: `Ponieważ egzekucja komornicza jest bezskuteczna przez min. 2 miesiące, a Twój dochód wynosi ${income} zł/os (poniżej progu 1209 zł), przysługuje Ci świadczenie z Funduszu Alimentacyjnego (do 500 zł na dziecko miesięcznie). Złóż wniosek w: ${cityDetails.mops}`,
          tip: 'Wymagane zaświadczenie o bezskuteczności egzekucji komornik wydaje na żądanie w ciągu kilku dni.'
        });
      } else if (isEligible === false) {
        plan.push({
          title: 'Krok 1: Alternatywne wsparcie oraz egzekucja rozszerzona',
          desc: `Twój dochód (${income} zł) przekracza próg Funduszu Alimentacyjnego (1209 zł), ale nadal masz pełne prawo do ścigania dłużnika alimentacyjnego. Możesz złożyć wniosek o wpisanie dłużnika do Krajowego Rejestru Długów (KRD) oraz zawiadomienie do prokuratury z art. 209 kk o uchylaniu się od obowiązku alimentacyjnego.`,
          tip: 'Alimentów możesz także dochodzić od wstępnych dłużnika (np. od dziadków dziecka – tzw. alimenty subsydiarne).'
        });
      } else {
        plan.push({
          title: 'Krok 1: Sprawdzenie kryterium dochodowego',
          desc: `Aby wnioskować o Fundusz Alimentacyjny w ${cityDetails.mops}, Twój dochód netto na osobę nie może przekraczać 1209 zł. Jeżeli przekracza próg, świadczenie może być przyznane na zasadzie „złotówka za złotówkę” lub przysługują inne środki pomocy prawnej.`,
          tip: 'Warto złożyć wniosek, ponieważ mechanizm „złotówka za złotówkę” uratuje część środków nawet przy lekkim przekroczeniu progu.'
        });
      }
    }

    plan.push({
      title: 'Krok duszpasterski i osłonowy',
      desc: cityDetails.tips,
      tip: 'Skorzystaj z wsparcia psychologicznego w naszej Strefie Ciszy, aby złagodzić stres związany z batalią prawną.'
    });

    return plan;
  };

  const getYamlOutput = () => {
    return `---
typ_kreatora: "Samodzielne Rodzicielstwo i Alimenty"
miasto: "${city || 'Niepodane'}"
status_alimentow: "${alimonyStatus}"
egzekucja_komornicza: ${hasExec === null ? 'null' : hasExec}
dochód_na_osobe: "${income || 'Niepodany'} zł"
data_generowania: "${new Date().toISOString().split('T')[0]}"
rekomendacja: "Dedykowana ścieżka wsparcia dla samotnego rodzica"
---
`;
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-200 p-8 md:p-12 font-sans text-[#1a211e]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-8">
        <div>
          <span className="text-[10px] font-black uppercase text-[#6B7280] tracking-[0.2em] block">Asystent Samodzielnego Rodzica</span>
          <h2 className="text-2xl md:text-3xl font-serif font-black text-[#0f1412] tracking-tight">Kreator Ścieżki Alimentacyjnej</h2>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-black text-slate-800 hover:text-black transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Powrót
        </button>
      </div>

      {step === 1 && (
        <div className="space-y-8">
          <div className="space-y-2">
            <h3 className="text-lg font-serif font-black text-[#0f1412]">Etap 1: Jaka jest obecnie sytuacja prawna Twoich alimentów?</h3>
            <p className="text-sm text-[#1a211e] font-bold">Wybierz opcję, która najlepiej odpowiada Twojemu obecnemu statusowi formalnemu.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => { setAlimonyStatus('no-ruling'); setStep(2); }}
              className={`p-6 bg-slate-50 border-2 rounded-2xl text-left block transition-all hover:border-slate-400 ${alimonyStatus === 'no-ruling' ? 'border-slate-800 bg-white ring-2 ring-slate-100' : 'border-transparent'}`}
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-4 font-black text-[#0f1412]">A</div>
              <h4 className="font-bold text-slate-900 text-sm mb-1.5 leading-tight">Nie mam jeszcze wyroku ani ugody</h4>
              <p className="text-xs text-[#1a211e] leading-relaxed font-bold">Dopiero dążę do formalnego ustalenia alimentów lub drugie rodzic dobrowolnie przestał płacić bez orzeczenia sądu.</p>
            </button>

            <button
              onClick={() => { setAlimonyStatus('has-ruling'); setHasExec(false); setStep(2); }}
              className={`p-6 bg-slate-50 border-2 rounded-2xl text-left block transition-all hover:border-slate-400 ${alimonyStatus === 'has-ruling' && hasExec === false ? 'border-slate-800 bg-white ring-2 ring-slate-100' : 'border-transparent'}`}
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-4 font-black text-[#0f1412]">B</div>
              <h4 className="font-bold text-slate-900 text-sm mb-1.5 leading-tight">Mam wyrok, ale dłużnik nie płaci (Brak komornika)</h4>
              <p className="text-xs text-[#1a211e] leading-relaxed font-bold">Sąd przyznał mi alimenty, ale drugi rodzic unika płatności, a ja nie skierowałem/am sprawy jeszcze do komornika sądowego.</p>
            </button>

            <button
              onClick={() => { setAlimonyStatus('has-ruling'); setHasExec(true); setStep(2); }}
              className={`p-6 bg-slate-50 border-2 rounded-2xl text-left block transition-all hover:border-slate-400 ${alimonyStatus === 'has-ruling' && hasExec === true ? 'border-slate-800 bg-white ring-2 ring-slate-100' : 'border-transparent'}`}
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-4 font-black text-[#0f1412]">C</div>
              <h4 className="font-bold text-slate-900 text-sm mb-1.5 leading-tight">Mam wyrok i nieskutecznego komornika</h4>
              <p className="text-xs text-[#1a211e] leading-relaxed font-bold">Sprawa is u komornika, egzekucja bezskuteczna. Chciałbym/am starać się o Fundusz Alimentacyjny lub świadczenia socjalne.</p>
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setStep(1)}
              className="text-xs font-black text-slate-800 hover:text-black transition-colors uppercase tracking-widest flex items-center gap-1"
            >
              ← Cofnij
            </button>
            <span className="text-slate-400">|</span>
            <span className="text-xs font-black uppercase text-slate-800 tracking-wider">Krok 2 z 3: Informacje lokalne i socjalne</span>
          </div>

          <div className="space-y-6 max-w-xl">
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase text-[#1a211e] tracking-wider">1. Wybierz miejscowość w województwie śląskim</label>
              <div className="grid grid-cols-3 gap-3">
                {['Sosnowiec', 'Katowice', 'Dąbrowa Górnicza'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCity(c)}
                    className={`py-3 rounded-xl border font-black text-xs uppercase tracking-wider transition-all ${city === c ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-350 text-slate-900 hover:bg-slate-100'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCity('Inna')}
                className={`text-[10px] underline font-black transition-all block text-right w-full ${city === 'Inna' ? 'text-slate-900 font-extrabold' : 'text-slate-800 hover:text-slate-950'}`}
              >
                Mieszkam poza tymi miastami
              </button>
            </div>

            {alimonyStatus === 'has-ruling' && hasExec === true && (
              <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <label className="block text-xs font-black uppercase text-[#0f1412] tracking-wider">
                  2. Średni miesięczny dochód netto na członka rodziny (zł)
                </label>
                <p className="text-xs text-[#1a211e] leading-relaxed mb-4 font-bold">
                  Wymagane do oszacowania uprawnienia do Funduszu Alimentacyjnego (Próg wynosi 1209 zł na osobę netto).
                </p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800 font-black text-sm">PLN</span>
                  <input
                    type="number"
                    placeholder="Wpisz kwotę netto (np. 1100)"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl py-4.5 pl-14 pr-4 text-base font-bold text-[#0f1412] focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100">
            <button
              onClick={() => setStep(3)}
              disabled={!city || (alimonyStatus === 'has-ruling' && hasExec === true && !income)}
              className="w-full py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              Generuj plan działania <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setStep(2)}
              className="text-xs font-black text-slate-800 hover:text-black transition-colors uppercase tracking-widest flex items-center gap-1"
            >
              ← Popraw dane
            </button>
            <span className="text-xs font-black uppercase text-emerald-600 tracking-wider flex items-center gap-1">
              <Check className="w-4 h-4" /> Plan Wygenerowany
            </span>
          </div>

          {/* Dedykowany plan działania */}
          <div className="space-y-6">
            <div className="border-b border-rose-250 pb-2">
              <h3 className="text-lg font-serif font-black text-[#0f1412]">Twój Spersonalizowany Plan Krok po Kroku</h3>
              <p className="text-xs text-[#1a211e] mt-1 font-bold">Dostosowany dla: <span className="font-bold text-slate-800">{city}</span> • Status alimentacyjny: <span className="font-bold text-slate-800">{alimonyStatus === 'no-ruling' ? 'Brak wyroku' : 'Posiadam wyrok'}</span></p>
            </div>

            <div className="space-y-6">
              {generateActionPlan().map((p, i) => (
                <div key={i} className="flex gap-6 items-start p-6 bg-slate-50/50 border border-slate-350 rounded-2xl hover:border-slate-500 transition-all">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-sans text-xs font-black flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-[#0f1412] text-sm leading-none">{p.title}</h4>
                    <p className="text-xs text-[#0f1412] leading-relaxed font-semibold">{p.desc}</p>
                    <div className="bg-[#FAF9F4] border-l-2 border-slate-400 p-2 text-[11px] text-[#1a211e] font-bold italic rounded-r-lg">
                      {p.tip}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generator YAML Front Matter */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase text-[#6B7280] tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> Meta-Karta Dokumentu dla Administracji (YAML)
              </label>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getYamlOutput());
                  alert('Dane YAML skopiowane do schowka!');
                }}
                className="text-[10px] font-black uppercase tracking-widest text-[#6B7280] hover:text-[#0f1412]"
              >
                Kopiuj konfigurację YAML
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-slate-300 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed max-h-[160px] border border-slate-800">
              {getYamlOutput()}
            </pre>
          </div>

          <div className="pt-4 flex justify-between items-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <span className="text-xs text-[#1a211e] font-serif italic">Możesz pobrać plan w formacie PDF (Wykaz NPP przy Urzędach Miasta) klikając przycisk</span>
            <button 
              onClick={() => window.print()}
              className="px-6 py-3 bg-slate-900 hover:bg-black text-white rounded-lg text-[10px] font-black uppercase tracking-widest"
            >
              Drukuj / Pobierz plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
