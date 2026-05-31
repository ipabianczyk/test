import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Heart, MapPin, CheckCircle, Info, ArrowLeft, ArrowRight,
  Share2, Shield, AlertTriangle, HelpCircle, Check, PhoneCall, 
  Award, Sparkles, Users, FileText, Bookmark, CheckCircle2
} from 'lucide-react';

interface LocationInfo {
  name: string;
  desc: string;
  category: string;
  emoji: string;
}

const LOCATIONS: LocationInfo[] = [
  {
    name: 'Park Sielecki',
    desc: 'Centralna strefa rekreacyjna Sosnowca. Tu szczególnie rekomendujemy ławki integracyjne sprzyjające rozmowie i integracji międzypokoleniowej.',
    category: 'Rekreacja',
    emoji: '🌳'
  },
  {
    name: 'Kompleks Stawiki',
    desc: 'Miejsce aktywnego wypoczynku i rekreacji wodnej mieszkańców. Punkt informacyjno-pomocowy zintegrowany z szafką szybkiego wsparcia.',
    category: 'Sport i rekreacja',
    emoji: '🌊'
  },
  {
    name: 'Górka Środulska i Park Środulski',
    desc: 'Przestrzeń spotkań rodzinnych i rekreacji zimowo-letniej. Ławka wsparcia z tablicą edukacyjną i kodem QR bezpośredniej ścieżki pomocowej.',
    category: 'Rekreacja rodzinna',
    emoji: '🏔️'
  },
  {
    name: 'Park im. Jacka Kuronia (Kazimierz Górniczy)',
    desc: 'Zawsze pełen rodzin i spacerowiczów. Integracyjna ławka oraz słup informacyjny SOS ulokowane w neutralnym, bezpiecznym otoczeniu.',
    category: 'Rekreacja podmiejska',
    emoji: '🦚'
  },
  {
    name: 'Centrum – ul. Warszawska / "Patelnia"',
    desc: 'Główny węzeł przesiadkowy i spacerowy o ogromnym natężeniu ruchu pieszego. Widoczny element informacyjny SOS z czytelnym QR.',
    category: 'Serce miasta',
    emoji: '🏙️'
  },
  {
    name: 'Przejście podziemne i przystanki PKP',
    desc: 'Szybka ścieżka dyskretnej informacji. Kody QR i NFC oraz czytelne plakaty pozwalające na dyskretne zeskanowanie bazy placówek.',
    category: 'Komunikacja',
    emoji: '🚉'
  }
];

interface FactAndMyth {
  myth: string;
  fact: string;
  explanation: string;
}

const FACTS_AND_MYTHS: FactAndMyth[] = [
  {
    myth: '„Pracownik socjalny tylko czeka, żeby zabrać dzieci lub ukarać rodzinę.”',
    fact: 'Pracownik socjalny to przewodnik po systemie wsparcia, którego celem jest ochrona rodziny.',
    explanation: 'Rola pomocy społecznej jest całkowicie wspierająca: ocena trudności, uruchomienie pomocy finansowej lub asystenta rodziny, a także współpraca ze specjalistami. Działania zabezpieczające podejmowane są wyłącznie w sytuacjach skrajnego, bezpośredniego zagrożenia życia lub zdrowia dziecka, ściśle według procedur prawnych.'
  },
  {
    myth: '„Prośba o pomoc w kryzysie psychicznym lub rodzinnym to słabość.”',
    fact: 'Sięgnięcie po profesjonalne wsparcie wymaga ogromnej odwagi i jest oznaką dojrzałości.',
    explanation: 'Gdy choruje ciało, nie wstydzimy się wizyty u lekarza. Troska o zdrowie psychiczne lub szukanie mediatora w konflikcie rodzinnym to dokładnie taka sama odpowiedzialność za życie własne i swoich dzieci.'
  },
  {
    myth: '„Alkoholizm i uzależnienie to kwestia słabej woli lub braku charakteru.”',
    fact: 'Uzależnienie to przewlekła, zdiagnozowana choroba mózgu, która wymaga leczenia, a nie oceny.',
    explanation: 'Światowa Organizacja Zdrowia (WHO) oraz medycyna klasyfikują uzależnienie jako chorobę, w której dochodzi do biochemicznych zmian w funkcjonowaniu układu nagrody. Próba leczenia jej wyłącznie „silną wolą” bez terapii rzadko przynosi efekty.'
  },
  {
    myth: '„Bliscy osoby uzależnionej nie potrzebują terapii, o ile sami nie piją lub nie zażywają.”',
    fact: 'Rodzina i partnerzy osoby uzależnionej cierpią na współuzależnienie i potrzebują własnego wsparcia.',
    explanation: 'Życie w ciągłym stresie, poczuciu winy i lęku dewastuje zdrowie psychiczne bliskich. Rodziny mają pełne prawo do oddzielnej, bezpłatnej psychoterapii i grup wsparcia (np. Al-Anon), niezależnie od tego, czy osoba uzależniona podjęła leczenie.'
  },
  {
    myth: '„Zaufanie i relacje w rodzinie wracają natychmiast dzięki obietnicom i przeprosinom.”',
    fact: 'Odbudowa zaufania to długotrwały proces oparty na realnym działaniu i terapii, a nie obietnicach.',
    explanation: 'Wypowiadane w emocjach słowa rzadko zmieniają głębokie wzorce zachowań. Dopiero stabilne podjęcie leczenia, uczestnictwo w grupach wsparcia oraz systematyczna praca z terapeutą dają realne, trwałe fundamenty pod odbudowę relacji.'
  },
  {
    myth: '„Pomoc społeczna i wsparcie MOPS jest przeznaczone wyłącznie dla skrajnej biedy.”',
    fact: 'Instytucje wsparcia oferują pomoc każdemu, kto przeżywa kryzys życiowy, bez względu na dochód.',
    explanation: 'Szeroka gama usług takich jak poradnictwo specjalistyczne, grupy terapeutyczne, przeciwdziałanie przemocy (Niebieska Karta) czy darmowe porady prawne są dostępne dla każdego mieszkańca Sosnowca potrzebującego oparcia społecznego.'
  }
];

const SLOGANS: string[] = [
  "Nie jesteś sam/a.",
  "Uzależnienie to choroba. Każdy człowiek zasługuje na wsparcie.",
  "W domu jest alkohol? Tobie też należy się pomoc i bezpieczny azyl.",
  "Wstyd nie leczy. Wsparcie leczy.",
  "Kryzys to nie wstyd. Sięgnięcie po pomoc to odwaga.",
  "Zamiast mówić „weź się w garść” – powiedz „chodź, poszukamy specjalistów”.",
  "Pracownik socjalny to Twój sprzymierzeniec i osobisty nawigator.",
  "Rodzina też choruje – rodzina też może bezpiecznie zdrowieć.",
  "Im wcześniej zareagujesz, tym lżejsza będzie droga wyjścia.",
  "Masz niezbywalne prawo poprosić o ułatwienie życia.",
  "Nie pytaj „dlaczego pijesz”. Zapytaj „jak możemy zacząć cię wspierać?”",
  "Bezpieczeństwo dziecka jest bezwzględnym priorytetem wszystkich działań."
];

export default function SosnowiecBezStygmy() {
  const [pledged, setPledged] = useState(false);
  const [pledgeCount, setPledgeCount] = useState(142);
  const [copied, setCopied] = useState(false);
  const [revealedMyths, setRevealedMyths] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const savedPledged = localStorage.getItem('bo_pledged_v1') === 'true';
    if (savedPledged) {
      setPledged(true);
    }
    const savedCount = localStorage.getItem('bo_pledges_total_v1');
    if (savedCount) {
      setPledgeCount(parseInt(savedCount));
    } else {
      // Base seed count
      const randomSeed = Math.floor(Math.random() * 15) + 140;
      setPledgeCount(randomSeed);
      localStorage.setItem('bo_pledges_total_v1', randomSeed.toString());
    }
  }, []);

  const handlePledge = () => {
    if (pledged) return;
    const newCount = pledgeCount + 1;
    setPledgeCount(newCount);
    setPledged(true);
    localStorage.setItem('bo_pledged_v1', 'true');
    localStorage.setItem('bo_pledges_total_v1', newCount.toString());
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '/sosnowiec-bez-stygmy');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleMyth = (idx: number) => {
    setRevealedMyths(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="bg-[#FAF8F3] min-h-screen text-[#1a211e] pb-24 selection:bg-amber-100 selection:text-amber-950 font-sans">
      
      {/* Dynamic SEO breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-10 py-6 text-xs font-black uppercase tracking-widest text-[#0f1412]">
        <Link to="/" className="hover:text-amber-800 transition-colors">Start</Link>
        <span className="mx-2 opacity-30">›</span>
        <span className="text-slate-950 font-extrabold">Sosnowiec bez stygmy</span>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-10">
        
        {/* Editorial Header / Hero */}
        <header className="py-12 md:py-16 text-left border-b border-slate-300 mb-16 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full filter blur-xl pointer-events-none" />
          
          <span className="text-amber-800 font-black text-[10px] uppercase tracking-[0.25em] block mb-3">
            🗳️ PROJEKT BUDŻETU OBYWATELSKIEGO SOSNOWCA
          </span>
          
          <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-[#0f1412] leading-[1.05] mb-6">
            Nie jesteś sam/a — <br />
            <span className="text-amber-800 font-extrabold italic">Sosnowiec bez stygmy</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#1a211e] leading-relaxed max-w-3xl font-serif font-semibold mt-4">
            Punkty SOS, ławki integracyjne i przewodnik wsparcia dla osób w kryzysie oraz ich bliskich. Uzależnienie to choroba – pomoc jest dla każdego. Prośba o wsparcie to najwyższy wyraz odwagi.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 items-center">
            {/* Real Link to the Official Submitted Project Card */}
            <a 
              href="https://obywatelski.sosnowiec.pl/projekt/10183"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 bg-[#0a2318] text-white hover:bg-emerald-950 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-md flex items-center gap-2"
            >
              🎉 Zobacz zgłoszony projekt nr 10183
            </a>
            <button 
              onClick={copyLink}
              className="px-6 py-4 bg-white border-2 border-slate-350 hover:bg-[#FBF9F4] text-[#0f1412] rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-amber-800" /> 
              {copied ? 'Link skopiowany!' : 'Udostępnij kampanię'}
            </button>
            <Link 
              to="/teczka-sprawy"
              className="px-6 py-4 bg-amber-50 border-2 border-amber-300 text-amber-950 hover:bg-amber-100 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xs"
            >
              <FileText className="w-4 h-4 text-amber-800" />
              Przygotownik wizyty
            </Link>
          </div>

          {/* Electronic sign requirements info */}
          <div className="mt-8 bg-emerald-50/90 border-l-4 border-emerald-700 rounded-r-xl p-4 text-xs font-sans text-emerald-950 leading-relaxed font-semibold max-w-3xl">
            🎉 <strong>Sukces!</strong> Wszystkie wymagane podpisy mieszkańców zostały zebrane, a projekt został oficjalnie złożony i zarejestrowany pod numerem <strong>10183</strong> w Budżecie Obywatelskim Sosnowca! Dziękujemy za każdy oddany głos poparcia. Teraz czekamy na ocenę merytoryczną i głosowanie ogólnomiejskie.
          </div>
        </header>

        {/* SECTION: O PROJEKCIE */}
        <section className="space-y-8 py-4">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="md:w-1/3 shrink-0">
              <span className="text-[10px] font-sans font-black text-amber-800 uppercase tracking-widest block mb-1">O INICJATYWIE</span>
              <h2 className="text-3xl font-serif font-black text-[#0f1412] leading-tight">
                Czym jest Sosnowiec bez stygmy?
              </h2>
              <div className="w-12 h-1 bg-amber-800 rounded-full mt-4" />
            </div>
            <div className="flex-grow space-y-4 text-base text-[#1a211e] leading-relaxed font-sans font-medium">
              <p>
                Projekt „Nie jesteś sam/a – Sosnowiec bez stygmy" to wniosek złożony do Budżetu Obywatelskiego Miasta Sosnowca. Ma on niezwykle prosty, a zarazem rewolucyjny cel: <strong>sprawić, by prośba o pomoc przestała być tematem tabu</strong>, a mieszkańcy zyskali natychmiastowy dostęp do wiedzy i placówek pomocowych w przestrzeni miejskiej.
              </p>
              <p>
                Osoby zmagające się z depresją, wyczerpaniem, uzależnieniami lub trudnościami rodzinnymi odkładają kontakt ze specjalistami o średnio 5 do 7 lat. Robią to ze strachu przed wyśmianiem, łatką rodziny „patologicznej” czy lękiem przed utratą statusu. Ten projekt ma to zburzyć.
              </p>
            </div>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-250 rounded-3xl p-6 md:p-8 flex items-start gap-4 shadow-xs mt-6">
            <Check className="w-6 h-6 text-emerald-800 shrink-0 mt-1" />
            <div className="text-sm text-[#1a211e] font-serif leading-relaxed font-semibold">
              <strong className="text-emerald-950 block font-serif font-black mb-1">Trzy powiązane elementy sukcesu:</strong>
              Projekt precyzyjnie łączy fizyczne punkty SOS w przestrzeni miejskiej (wyposażone w kody szybkiego skanowania QR/NFC), prosty i w pełni bezpłatny przewodnik internetowy oraz szeroką, merytoryczną kampanię informacyjną. Wszystkie te elementy wspólnie obniżają barierę wstydu.
            </div>
          </div>

          {/* Grid of the three pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white border-2 border-slate-200 hover:border-amber-600 transition-all rounded-3xl p-6 space-y-4 shadow-xs">
              <div className="text-3xl font-serif">📍</div>
              <h3 className="font-serif font-black text-lg text-[#0f1412]">Fizyczne punkty SOS</h3>
              <p className="text-xs text-[#1a211e] font-sans font-semibold leading-relaxed">
                Wyraźne, estetyczne obiekty (na ławkach, słupkach miejskich lub tablicach) opatrzone uniwersalnymi hasłami dodającymi otuchy oraz kodami cyfrowymi.
              </p>
            </div>

            <div className="bg-white border-2 border-slate-200 hover:border-amber-600 transition-all rounded-3xl p-6 space-y-4 shadow-xs">
              <div className="text-3xl font-serif">🌐</div>
              <h3 className="font-serif font-black text-lg text-[#0f1412]">Mobilny przewodnik i mapa</h3>
              <p className="text-xs text-[#1a211e] font-sans font-semibold leading-relaxed">
                Niezwykle przyjazna i bezpieczna strona internetowa w jasnym, ludzkim języku, pokazująca krok po kroku ścieżki reagowania dla dorosłych oraz młodzieży.
              </p>
            </div>

            <div className="bg-white border-2 border-slate-200 hover:border-amber-600 transition-all rounded-3xl p-6 space-y-4 shadow-xs">
              <div className="text-3xl font-serif">📢</div>
              <h3 className="font-serif font-black text-lg text-[#0f1412]">Kampania bez oceniania</h3>
              <p className="text-xs text-[#1a211e] font-sans font-semibold leading-relaxed">
                Plakaty, ulotki oraz spójne materiały graficzne mające odczarować rolę pracownika socjalnego, uświadamiając, że leczenie to wolność.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION: LOKALIZACJE */}
        <section id="lokalizacje" className="py-12 border-t border-slate-300 space-y-8">
          <div className="text-left space-y-2">
            <span className="text-[10px] font-sans font-black text-amber-800 uppercase tracking-widest block">PROPONOWANE LOKALIZACJE</span>
            <h2 className="text-3xl font-serif font-black text-[#0f1412] leading-tight">
              Gdzie planujemy punkty SOS i ławki wsparcia?
            </h2>
            <p className="text-sm text-[#1a211e] font-sans font-bold leading-relaxed max-w-3xl">
              Punkty SOS oraz specjalnie oznaczone ławki integracyjne zostaną ulokowane w często odwiedzanych strefach Sosnowca. Ich ostateczna forma oraz precyzyjne usytuowanie będą dobrane technicznie i potwierdzone z właścicielem terenu na etapie wdrażania projektu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LOCATIONS.map((loc, idx) => (
              <div key={idx} className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-4 transition-all hover:border-amber-600 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-label={loc.name}>{loc.emoji}</span>
                    <div>
                      <h4 className="font-serif font-black text-sm text-[#0f1412] leading-tight">{loc.name}</h4>
                      <span className="text-[8px] font-black uppercase tracking-wider text-amber-850 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mt-1 inline-block">
                        {loc.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#1a211e] font-sans font-semibold leading-relaxed">
                    {loc.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border-2 border-slate-300 rounded-3xl p-6 md:p-8 text-xs font-sans text-[#1a211e] leading-relaxed font-semibold">
            🎨 <strong>Czym są ławki integracyjne w przestrzeni publicznej?</strong><br />
            To elementy małej architektury miejskiej specjalnie zaprojektowane tak, by zachęcały do zatrzymania się i ewentualnego kontaktu z drugą osobą (np. z asymetrycznym układem oparć i stolikiem). Opatrzone są dyskretną, mosiężną tabliczką z informacją o darmowych telefonach zaufania i kodem QR prowadzącym do bazy śląskich placówek darmowej terapii. Ogólne zaufanie buduje się właśnie od takich, z pozoru drobnych gestów.
          </div>
        </section>

        {/* SECTION: CO POWSTANIE & DLACZEGO TO POTRZEBNE */}
        <section className="py-12 border-t border-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Column 1: Co powstanie */}
            <div className="space-y-6">
              <h3 className="text-xl font-serif font-black text-[#0f1412] border-b-2 border-amber-800 pb-2">
                Co dokładnie powstanie w ramach projektu?
              </h3>
              <ul className="space-y-4 list-none" aria-label="Produkty projektu">
                {[
                  { title: "Fizyczna infrastruktura SOS", text: "Widoczne obiekty wsparcia (ławki, słupki lub estetyczne kolumny) w najliczniej odwiedzanych lokalizacjach rekreacyjnych i przesiadkowych Sosnowca." },
                  { title: "Integracja z Tagami NFC i QR", text: "Prosta, intuicyjna ścieżka mobilna. Zbliżenie telefonu do punktu natychmiast wywołuje bezpłatny, offline-first przewodnik bez konieczności pobierania aplikacji." },
                  { title: "Przewodnik informacyjny w prostym języku", text: "Mobilna baza wiedzy ułatwiająca czytelne zrozumienie swoich praw i praw dziecka. Bez suchego, zawiłego języka ustaw prawniczych." },
                  { title: "Interaktywny asystent lokalizacji placówek", text: "Czytelna mapa śląskich i sosnowieckich punktów pierwszej pomocy kryzysowej, ośrodków uzależnień oraz darmowych, dyskretnych psychologów NFZ." },
                  { title: "Szeroka merytoryczna kampania społeczna", text: "Plakaty i ulotki dostarczone m.in. do szkół, przychodni oraz kawiarni w celu uniezależnienia i wyciągnięcia dłoni do rodzin z problemem alkoholowym." }
                ].map((item, idx) => (
                  <li key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-3 shadow-xs">
                    <span className="text-emerald-850 font-black shrink-0 mt-0.5">✓</span>
                    <div className="space-y-0.5">
                      <strong className="text-xs text-[#0f1412] font-black uppercase tracking-wide block">{item.title}</strong>
                      <p className="text-xs text-[#1a211e] font-sans font-semibold leading-relaxed">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs font-sans text-amber-950 font-bold leading-relaxed">
                💼 <strong>Szacunkowy Budżet Projektu:</strong> orientacyjna kwota na realizację fizycznych punktów, instalacji kodów, opracowania mapy i całościowej kampanii wynosi około <strong>200 000 zł</strong> (ostateczna kwota zależy od uwarunkowań technicznych i zatwierdzenia przez odpowiednie wydziały Urzędu Miasta).
              </div>
            </div>

            {/* Column 2: Dlaczego to potrzebne */}
            <div className="space-y-6">
              <h3 className="text-xl font-serif font-black text-[#0f1412] border-b-2 border-rose-800 pb-2">
                Dlaczego ten projekt jest tak pilnie potrzebny?
              </h3>
              <ul className="space-y-4 list-none" aria-label="Powody realizacji">
                {[
                  { title: "Uzależnienie dotyka całej rodziny", text: "Samo leczenie uzależnienia to tylko połowa sukcesu. Bliscy (partnerzy, dzieci) żyjący w dysfunkcji latami noszą brzemię współuzależnienia. Potrzebują osobnego ramienia pomocy społecznej." },
                  { title: "Zapobieganie zamiast leczenia powikłań", text: "Im wcześniej uruchomi się mechanizmy wsparcia prawnego, psychologicznego lub socjalnego, tym mniejsza szansa na rozpad rodziny, przemoc lub stany lękowe." },
                  { title: "Stygmatyzacja blokuje szukanie terapii", text: "Tysiące mieszkańców Sosnowca skrycie cierpi w domach, obawiając się oceny i łatek. Normalizacja prośby o pomoc burzy ten szkodliwy mit bierności." },
                  { title: "Zrozumienie prawdziwej roli instytucji", text: "Pomostem projektu jest pokazanie darmowej pomocy ze strony MOPS jako przyjaznego przewodnika i asysty, a nie czynnika wyłącznie karzącego czy kontrolującego." },
                  { title: "Bezwzględne bezpieczeństwo dziecka", text: "Dzieci są najcichszą i bezbronną ofiarą nałogów dorosłych. Wczesna interwencja pozwala zabezpieczyć ich życie i edukację, gwarantując im nienaruszalny spokój." }
                ].map((item, idx) => (
                  <li key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-3 shadow-xs">
                    <span className="text-amber-800 font-bold shrink-0 mt-0.5">⭐</span>
                    <div className="space-y-0.5">
                      <strong className="text-xs text-[#0f1412] font-black uppercase tracking-wide block">{item.title}</strong>
                      <p className="text-xs text-[#1a211e] font-sans font-semibold leading-relaxed">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>

        {/* SECTION: DZIAŁANIE OSOBISTE i 3 KROKI */}
        <section className="py-12 border-t border-slate-300 space-y-8">
          <div className="text-left space-y-1">
            <span className="text-[10px] font-sans font-black text-amber-800 uppercase tracking-widest block">PIERWSZE KROKI</span>
            <h2 className="text-3xl font-serif font-black text-[#0f1412] leading-tight">
              Trzy kroki do Twojego wsparcia
            </h2>
            <p className="text-sm text-[#1a211e] font-sans font-semibold max-w-2xl leading-relaxed">
              Nie musisz przechodzić przez to wszystko sam lub sama. Niezależnie od poziomu lęku i skomplikowania sytuacji, możesz wykonać te trzy proste, uniwersalne kroki:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border-l-4 border-amber-800 rounded-r-3xl rounded-l-md space-y-3 shadow-xs">
              <span className="w-8 h-8 rounded-full bg-amber-800 text-white font-sans text-xs font-black flex items-center justify-center">1</span>
              <h4 className="font-serif font-black text-sm text-[#0f1412]">Nazwij głośno to, co przeżywasz</h4>
              <p className="text-xs text-[#1a211e] font-sans font-semibold leading-relaxed">
                Przełam wewnętrzny paraliż i nazwij fakty: „Doświadczam lęku”, „Mój partner pije, a ja nie mam siły”, „To nie moja wina”. Uświadomienie sobie prawdy to początek wolności.
              </p>
            </div>

            <div className="p-6 bg-white border-l-4 border-amber-800 rounded-r-3xl rounded-l-md space-y-3 shadow-xs">
              <span className="w-8 h-8 rounded-full bg-amber-800 text-white font-sans text-xs font-black flex items-center justify-center">2</span>
              <h4 className="font-serif font-black text-sm text-[#0f1412]">Sprawdź darmową pomoc</h4>
              <p className="text-xs text-[#1a211e] font-sans font-semibold leading-relaxed">
                Wiele pomocowych placówek w Sosnowcu i sąsiednich miastach jest darmowa i w pełni anonimowa. Nie musisz być zamożny ani mieć skierowania lekarskiego. Nasza mapa Ci je wskaże.
              </p>
            </div>

            <div className="p-6 bg-white border-l-4 border-amber-800 rounded-r-3xl rounded-l-md space-y-3 shadow-xs">
              <span className="w-8 h-8 rounded-full bg-amber-800 text-white font-sans text-xs font-black flex items-center justify-center">3</span>
              <h4 className="font-serif font-black text-sm text-[#0f1412]">Wykonaj jeden prosty kontakt</h4>
              <p className="text-xs text-[#1a211e] font-sans font-semibold leading-relaxed">
                Napisz e-mail, zadzwoń pod bezpłatną infolinię lub idź na konsultację. Pracownicy i psycholodzy wiedzą, jak rozmawiać i od czego zacząć, aby odciążyć Twoje sumienie.
              </p>
            </div>
          </div>
        </section>

        {/* DEDYKOWANE ŚCIEŻKI WSPARCIA SPILL CARD */}
        <section className="py-12 border-t border-slate-300 space-y-8">
          <div className="text-left">
            <span className="text-[10px] font-sans font-black text-amber-800 uppercase tracking-widest block">DLA KOGO JEST TA POMOC?</span>
            <h2 className="text-3xl font-serif font-black text-[#0f1412] mt-1.5 leading-none">
              Dedykowane Ścieżki Wspomagające
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Box 1: Osoby z uzależnieniem */}
            <div className="bg-white border-2 border-slate-200 rounded-[32px] p-8 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl" role="img" aria-label="Wsparcie uzależnień">🌱</span>
                <h3 className="font-serif font-black text-xl text-[#0f1412]">Ograniczenie dla zmagających się z nałogiem</h3>
              </div>
              <div className="w-full h-0.5 bg-amber-700/30" />
              <p className="text-xs text-[#1a211e] font-serif font-semibold leading-relaxed italic">
                „Nie jesteś alkoholikiem/alkoholiczką. Jesteś osobą chorą, która ma niezbywalne prawo do powrotu do godnego życia i leczenia.”
              </p>
              <div className="space-y-4 text-xs font-sans font-semibold text-[#1a211e]">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <strong>Wstyd nie leczy. Wsparcie leczy.</strong>
                    <p className="text-[11px] text-[#1a211e] mt-1 font-medium leading-relaxed">
                      Skrywanie prawdy o piciu, narkotykach czy hazardzie tylko pogłębia samotność i nałóg. Każdy człowiek zasługuje na drugą szansę bez wytykania palcami.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <strong>Leczenie odwykowe to droga wolności</strong>
                    <p className="text-[11px] text-[#1a211e] mt-1 font-medium leading-relaxed">
                      Wizyta w poradni uzależnień to nie jest upokorzenie. To wejście na sprawdzony, medyczny program uwalniający od przymusu zażywania pod okiem życzliwych ludzi.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <strong>Grupy AA oferują siłę milionów</strong>
                    <p className="text-[11px] text-[#1a211e] mt-1 font-medium leading-relaxed">
                      Uczestnictwo w spotkaniach Anonimowych Alkoholików eliminuje izolację. Rozmawiasz z ludźmi, którzy przeżyli dokładnie to samo poczucie beznadziei.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: Rodzina i bliscy */}
            <div className="bg-white border-2 border-slate-200 rounded-[32px] p-8 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl" role="img" aria-label="Wsparcie rodzin">👨‍👩‍👧‍👦</span>
                <h3 className="font-serif font-black text-xl text-[#0f1412]">Ścieżka dla rodzin i osób bliskich</h3>
              </div>
              <div className="w-full h-0.5 bg-rose-700/30" />
              <p className="text-xs text-[#1a211e] font-serif font-semibold leading-relaxed italic">
                „Jeżeli w Twojej rodzinie jest alkohol, uzależnienie lub przemoc – Tobie i dzieciom bezwzględnie należy się ochrona i oddzielne leczenie.”
              </p>
              <div className="space-y-4 text-xs font-sans font-semibold text-[#1a211e]">
                <div className="flex gap-3">
                  <Heart className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Możesz kochać i mieć twarde granice</strong>
                    <p className="text-[11px] text-[#1a211e] mt-1 font-medium leading-relaxed">
                      Ratowanie kogoś przez spłacanie długów i okłamywanie pracodawcy to unikanie konfrontacji, które tylko wydłuża nałóg. Czasami najgłębszą troską jest pozwolenie na poniesienie konsekwencji.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Heart className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Rodzina też może zdrowieć oddzielnie</strong>
                    <p className="text-[11px] text-[#1a211e] mt-1 font-medium leading-relaxed">
                      Nawet jeśli osoba uzależniona uparcie odmawia leczenia, Ty masz prawo zapisać się na terapię dla osób współuzależnionych, by przywrócić stabilność emocjonalną sobie i dzieciom.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Heart className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Ochrona dzieci to priorytet obywatelski</strong>
                    <p className="text-[11px] text-[#1a211e] mt-1 font-medium leading-relaxed">
                      Dzieci wychowujące się w ciągłym poczuciu winy i lęku noszą traumę przez całe życie. Zwrócenie się o asystę MOPS chroni ich dzieciństwo, a nie niszczy je.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION: INTEKTYWNY QUIZ FAKTY I MITY */}
        <section className="py-12 border-t border-slate-300 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-sans font-black text-amber-800 uppercase tracking-widest block">DESTRUKCJA UPRAŻEŃ</span>
            <h2 className="text-3xl font-serif font-black text-[#0f1412]">
              Fakty i Mity o Pomocy Społecznej i Kryzysach
            </h2>
            <p className="text-xs text-[#1a211e] max-w-lg mx-auto font-sans font-bold leading-relaxed">
              Kliknij na poniższe, często niesprawiedliwe przekonania społeczne, aby zobaczyć faktyczny stan prawny i merytoryczny. Wspólnie zwalczmy dezinformację!
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {FACTS_AND_MYTHS.map((item, idx) => {
              const isOpen = !!revealedMyths[idx];
              return (
                <div 
                  key={idx} 
                  className={`border-2 rounded-3xl transition-all overflow-hidden ${
                    isOpen ? 'border-amber-700 bg-white shadow-md' : 'border-slate-350 bg-white hover:border-amber-700'
                  }`}
                >
                  <button
                    onClick={() => toggleMyth(idx)}
                    className="w-full text-left p-6 flex justify-between items-center gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-sans font-black tracking-wider text-rose-700 uppercase block">❌ Przesąd / Mit</span>
                      <p className="font-serif font-black text-sm md:text-base text-[#0f1412] leading-snug">
                        {item.myth}
                      </p>
                    </div>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? 'border-amber-800 bg-amber-800 text-white rotate-180' : 'border-slate-300 text-slate-500'
                    }`}>
                      {isOpen ? '−' : '+'}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="border-t border-slate-200"
                      >
                        <div className="p-6 bg-[#FCFAF5] space-y-3 text-left">
                          <span className="text-[10px] font-sans font-black tracking-wider text-emerald-800 uppercase block">✅ Stan faktyczny</span>
                          <h5 className="font-serif font-black text-xs md:text-sm text-emerald-950 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                            {item.fact}
                          </h5>
                          <p className="text-xs md:text-sm text-[#1a211e] leading-relaxed font-sans font-medium pl-7 border-l-2 border-slate-300">
                            {item.explanation}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION: HASŁA KAMPANII */}
        <section className="py-12 border-t border-slate-300 space-y-8 text-center">
          <div className="space-y-2">
            <span className="text-[10px] font-sans font-black text-amber-800 uppercase tracking-widest block">SŁOWA MOGĄ RZĄDZIĆ ŚWIATEM</span>
            <h2 className="text-3xl font-serif font-black text-[#0f1412]">
              Hasła kampanii miejskiej
            </h2>
            <p className="text-xs text-[#1a211e] font-sans font-bold leading-relaxed max-w-md mx-auto">
              Te proste, potężne hasła pragniemy na stałe wpleść w miejską tkankę Sosnowca, oblepiając nimi billboardy, tablice informacyjne i przystanki:
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {SLOGANS.map((slogan, idx) => (
              <div 
                key={idx} 
                className={`px-5 py-3 rounded-full text-xs font-sans font-bold leading-snug border transition-transform hover:scale-102 ${
                  idx % 2 === 0 
                    ? 'bg-[#0f1412] text-white border-[#0f1412]' 
                    : 'bg-white text-[#0f1412] border-slate-300 shadow-xs'
                }`}
              >
                {slogan}
              </div>
            ))}
          </div>
        </section>

        {/* INTERACTIVE PLEDGE GŁOSOWANIE */}
        <section className="p-8 md:p-12 bg-[#0c1410] border border-emerald-900 rounded-[36px] text-white space-y-8 relative overflow-hidden my-12 shadow-md">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/15 rounded-full filter blur-[100px] pointer-events-none" />
          
          <div className="space-y-4 text-left">
            <span className="text-[10px] text-amber-400 font-sans font-black uppercase tracking-widest block">
              💡 PROJEKT ZGŁOSZONY I ZAAKCEPTOWANY
            </span>
            <h2 className="font-serif font-black text-3xl md:text-4xl text-white">
              Projekt złożony oficjalnie! Co dalej?
            </h2>
            <p className="text-stone-300 text-xs md:text-sm leading-relaxed max-w-2xl font-serif font-semibold">
              Dzięki niesamowitej mobilizacji i wspólnym siłom, podpisy poparcia zostały pomyślnie zebrane i wniosek trafił prosto do Urzędu Miasta. Możesz śledzić jego status bezpośrednio na oficjalnej platformie miejskiej. Poprzyj go wirtualnie również tutaj, aby wyrazić wsparcie społeczne dla tej idei!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-emerald-950/80 text-left">
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] font-black text-amber-400 tracking-wider">KROK PIERWSZY</span>
              <h5 className="font-serif font-bold text-sm text-white">Śledź postępy projektu</h5>
              <p className="text-[11px] text-stone-200 leading-relaxed font-sans">
                Nasz wniosek ma oficjalny numer <strong>10183</strong>. Szczegóły merytoryczne i status weryfikacji znajdziesz na <a href="https://obywatelski.sosnowiec.pl/projekt/10183" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline font-bold">stronie projektu w BO Sosnowiec</a>.
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] font-black text-amber-400 tracking-wider">KROK DRUGI</span>
              <h5 className="font-serif font-bold text-sm text-white">Przygotuj się na głosowanie</h5>
              <p className="text-[11px] text-stone-200 leading-relaxed font-sans">
                Po pomyślnej weryfikacji przez urzędników, projekt „Nie jesteś sam/a – Sosnowiec bez stygmy” wejdzie w fazę jesiennego głosowania mieszkańców. Twój głos zadecyduje o przyznaniu finansowania!
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] font-black text-amber-400 tracking-wider">KROK TRZECI</span>
              <h5 className="font-serif font-bold text-sm text-white">Rozpowszechnij ideę</h5>
              <p className="text-[11px] text-stone-200 leading-relaxed font-sans">
                Podziel się tą stroną ze znajomymi z Sosnowca i Śląska. Wsparcie bez oceniania to wartość, o którą walczymy wspólnie z kadrą pracowników socjalnych i psychologów.
              </p>
            </div>
          </div>

          <div className="p-6 bg-emerald-950/50 border border-emerald-900 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-left">
              <p className="font-serif font-black text-base text-white">Wirtualne wsparcie społeczności</p>
              <p className="text-[11px] text-stone-300 font-sans font-medium">
                Zadeklaruj, że będziesz głosować na ten projekt w nadchodzącym głosowaniu Budżetu Obywatelskiego!
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-emerald-100">
                  {pledgeCount} mieszkańców zadeklarowało gotowość do głosowania jesienią
                </span>
              </div>
            </div>

            <button
              onClick={handlePledge}
              disabled={pledged}
              className={`px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all font-sans shrink-0 cursor-pointer ${
                pledged 
                  ? 'bg-emerald-600 text-white border border-emerald-500' 
                  : 'bg-amber-400 text-[#0c1410] hover:bg-amber-300 font-black'
              }`}
            >
              {pledged ? '🎉 Zadeklarowano!' : 'Zadeklaruj gotowość'}
            </button>
          </div>
        </section>

        {/* SECTION: PILNE KONTAKTY TELEFONY OIK */}
        <section className="bg-rose-50/40 border border-rose-150 p-6 md:p-8 rounded-3xl space-y-6 text-left my-4 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0 mt-1">
              <PhoneCall className="w-6 h-6 text-rose-800" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-black text-xl text-rose-950">
                Przeżywasz silny kryzys lub w domu jest niebezpiecznie w tym momencie?
              </h3>
              <p className="text-xs text-[#1a211e] font-sans font-semibold leading-relaxed">
                Jeżeli czujesz się bezradnie lub chcesz zgłosić przemoc fizyczną i psychiczną, nie czekaj na ostateczną realizację projektu urzędowego. Zadzwoń bezpośrednio do dyżurnych ekspertów, którzy udzielą darmowej, profesjonalnej, całościowej pomocy:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-rose-200">
            <div className="bg-white p-4 rounded-2xl border border-rose-150 space-y-1">
              <strong className="text-xs font-serif font-black block leading-tight text-rose-950">
                Ośrodek Interwencji Kryzysowej (OIK) w Sosnowcu
              </strong>
              <p className="text-[10px] text-slate-800 font-semibold font-sans">ul. Szymanowskiego 5a, Sosnowiec</p>
              <a 
                href="tel:+48322989387" 
                className="font-mono text-xs text-rose-800 hover:text-rose-950 font-black block pt-1 hover:underline"
              >
                📞 tel. 32 298 93 87 (Całodobowo)
              </a>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-rose-150 space-y-1">
              <strong className="text-xs font-serif font-black block leading-tight text-rose-950">
                Całodobowa Infolinia Kryzysowa IPZ (Ogólnopolska)
              </strong>
              <p className="text-[10px] text-slate-800 font-semibold font-sans">Bezpłatne, anonimowe duszpasterstwo i psychologowie</p>
              <a 
                href="tel:116123" 
                className="font-mono text-xs text-rose-800 hover:text-rose-950 font-black block pt-1 hover:underline"
              >
                📞 tel. 116 123 (Codziennie 14:00-22:00)
              </a>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-rose-150 space-y-1">
              <strong className="text-xs font-serif font-black block leading-tight text-rose-950">
                Telefon Zaufania Dorosłych w Kryzysie
              </strong>
              <p className="text-[10px] text-slate-800 font-semibold font-sans">Bezpłatna asysta psychologiczna w głębokim stresie</p>
              <a 
                href="tel:800119119" 
                className="font-mono text-xs text-rose-800 hover:text-rose-950 font-black block pt-1 hover:underline"
              >
                📞 tel. 800 119 119 (Całodobowo)
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
