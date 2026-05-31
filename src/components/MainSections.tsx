import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { HelpCircle, Heart, Info, BookOpen, Phone, Download, CheckCircle2, ArrowRight, MessageSquare, Bot } from 'lucide-react';

export function QuickPaths() {
  const paths = [
    {
      title: "Sosnowiec bez stygmy",
      desc: "Oficjalna kampania i deklaracja równego traktowania. Dowiedz się, dlaczego prośba o pomoc to odwaga.",
      icon: "🤝",
      href: "/sosnowiec-bez-stygmy"
    },
    {
      title: "Potrzebuję pomocy teraz",
      desc: "Przeżywasz trudny moment i nie wiesz dokąd pójść? Znajdź najbliższą placówkę interwencji.",
      icon: "🆘",
      href: "/mapa"
    },
    {
      title: "Dla Rodziny i Seniorów",
      desc: "Opieka, świadczenia, wsparcie psychologiczne i prawne dla rodzin oraz osób starszych.",
      icon: "🏠",
      href: "/mapa"
    },
    {
      title: "Wsparcie Onkologiczne",
      desc: "Przewodnik dla pacjentów i ich bliskich. Jak poruszać się w systemie opieki zdrowotnej?",
      icon: "🩺",
      href: "/mapa/onkologia"
    },
    {
      title: "Zrozumieć Pomoc",
      desc: "Obalamy mity. Dowiedz się, dlaczego prośba o pomoc to odwaga, a nie słabość.",
      icon: "💭",
      href: "#destygmatyzacja"
    }
  ];

  return (
    <section className="py-24 bg-white" id="szybkie-kroki">
      <div className="max-w-7xl mx-auto px-4 sm:px-10">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-12">Obszary wsparcia</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {paths.map((path, i) => (
            <motion.article 
              key={path.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card group flex flex-col items-start cursor-pointer transition-all border border-slate-200 bg-[#FCFAF2] p-6 rounded-2xl"
            >
              <Link to={path.href} className="w-full h-full flex flex-col">
                <span className="text-4xl mb-6 block transform group-hover:scale-110 transition-transform">
                  {path.icon}
                </span>
                <h4 className="font-bold text-[#0f1412] mb-3 text-lg leading-tight">{path.title}</h4>
                <p className="text-xs text-[#1a211e] leading-relaxed mb-6 flex-grow font-semibold">
                  {path.desc}
                </p>
                <div className="flex items-center text-blue-600 text-xs font-bold">
                  Otwórz ścieżkę <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Destigmatization() {
  const facts = [
    "Rozmowa z pracownikiem socjalnym jest poufna.",
    "Korzystanie z pomocy społecznej nie jest wstydem.",
    "Nie musisz być w „ekstremalnej\" sytuacji.",
    "Pomoc może być jednorazowa lub długoterminowa.",
    "Możesz poprosić o pomoc anonimowo."
  ];

  return (
    <section className="py-24 bg-slate-50 border-y border-slate-100" id="destygmatyzacja">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="section-tag">Wiedza</div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight text-[#0f1412]">
            Pracownik socjalny – <br/>
            <span className="text-blue-600 italic font-serif font-normal text-[0.9em]">przewodnik, nie policja.</span>
          </h2>
          <p className="text-lg text-[#1a211e] leading-relaxed max-w-xl font-bold">
            Jednym z największych mitów na temat pomocy społecznej jest strach przed konsekwencjami. Chcemy ten mit obalić. Pracownik socjalny to osoba, której zadaniem jest pomoc – nie nadzór.
          </p>
          
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-3">
            {facts.map((fact, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-300">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-xs font-black text-[#1a211e]">{fact}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative group">
          <div className="aspect-square bg-blue-600 rounded-[40px] p-12 flex flex-col justify-end text-white relative overflow-hidden shadow-2xl shadow-blue-600/30">
            <div className="absolute top-10 right-10 text-white/10 text-9xl font-black select-none italic">MIT</div>
            <Heart className="w-20 h-20 mb-8 relative z-10" />
            <p className="text-2xl font-black leading-tight relative z-10">
              „Pomaganie to moja praca, a Twoje prawo. Razem znajdziemy wyjście.”
            </p>
          </div>
          <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl border border-[#d6cfbe] shadow-xl max-w-xs hidden xl:block">
            <p className="text-[#1a211e] text-sm font-black italic">
              Zaufaj systemowi, który jest tu dla Ciebie.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Compass() {
  const steps = [
    { title: "Nazwij problem", icon: "1" },
    { title: "Twoje prawa", icon: "2" },
    { title: "Znajdź miejsce", icon: "3" },
    { title: "Zrób krok", icon: "4" },
    { title: "Bądź wytrwały", icon: "5" }
  ];

  return (
    <section className="py-24 bg-white" id="kompas">
      <div className="max-w-7xl mx-auto px-4 sm:px-10">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-16 text-center">Kompas Pomocy: 5 Kroków</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4 relative">
          <div className="absolute top-6 left-0 w-full h-[2px] bg-slate-200 hidden md:block border-slate-250"></div>
          
          {steps.map((step, i) => (
            <motion.div 
              key={step.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative z-10 text-center group"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black mx-auto border-4 border-white shadow-lg transition-all mb-4 ${
                i === 0 ? 'bg-blue-600 text-white scale-110 shadow-blue-600/30' : 'bg-slate-350 text-slate-900 group-hover:bg-slate-400'
              }`}>
                {step.icon}
              </div>
              <p className="text-[11px] font-black text-[#0f1412] leading-tight uppercase tracking-tighter">
                {step.title.split(' ').map((word, j) => (
                  <React.Fragment key={j}>{word}<br/></React.Fragment>
                ))}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 max-w-2xl mx-auto text-center space-y-6">
          <p className="text-[#1a211e] font-black italic">
            „Nie musisz znać wszystkich odpowiedzi na początku. Ważne, żeby zacząć od jednej rzeczy.”
          </p>
          <div className="pt-8 flex justify-center">
             <button className="btn btn-primary shadow-2xl">
              Pokaż szczegóły kompasu
             </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function YouthSection() {
  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden" id="dzieci">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 border-8 border-white rounded-full" />
        <div className="absolute bottom-20 left-20 w-32 h-32 border-4 border-white rotate-45" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div className="inline-block px-3 py-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded border border-white/20">
              Młodzi
            </div>
            <h2 className="text-5xl font-black tracking-tighter leading-none text-white">
              Nie jesteś <br/><span className="text-blue-400 italic font-serif">sam/sama.</span>
            </h2>
            <p className="text-xl text-slate-200 leading-relaxed font-semibold max-w-xl">
              Jeśli masz mniej niż 18 lat i doświadczasz czegoś trudnego, masz prawo do pomocy. Gwarantujemy anonimowość i wsparcie specjalistów, którzy Cię wysłuchają.
            </p>
            
            <div className="flex flex-wrap gap-4">
               <div className="px-6 py-4 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-sm">
                 <span className="block text-[10px] font-black text-slate-300 mb-1 uppercase tracking-wider">Strona WWW</span>
                 <span className="text-lg font-black text-white">116111.pl</span>
               </div>
               <div className="px-6 py-4 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-sm">
                 <span className="block text-[10px] font-black text-slate-300 mb-1 uppercase tracking-wider">Czynne</span>
                 <span className="text-lg font-black text-white">24h / 7 dni</span>
               </div>
            </div>
          </div>

          <div className="bg-white text-slate-900 p-12 md:p-16 rounded-[40px] shadow-2xl relative border-2 border-slate-200">
            <div className="space-y-8 text-center">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.3em] mb-4">Numer Zaufania</h3>
                <a href="tel:116111" className="text-7xl md:text-8xl font-black tracking-tighter text-blue-600 block hover:scale-105 transition-transform">
                  116 <span className="text-slate-400 mx-1">/</span> 111
                </a>
              </div>
              <p className="text-[#0f1412] font-black text-lg uppercase tracking-tight">
                Bezpłatnie • Anonimowo • Całą dobę
              </p>
              <div className="pt-8 border-t border-slate-200 font-black text-slate-700 text-sm italic">
                Każde połączenie to krok w stronę bezpieczeństwa.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SocialProof() {
  const testimonials = [
    { name: "Anna", role: "Mama trójki dzieci", text: "Dzięki Potrzebomatowi dowiedziałam się o zasiłku, o którym nikt wcześniej mi nie powiedział. To zmieniło naszą sytuację." },
    { name: "Marek", role: "Senior", text: "Obsługa strony jest bardzo prosta. Znalazłem numer do infolinii onkologicznej w minutę." },
    { name: "Kasia", role: "Studentka", text: "Czat pomógł mi przełamać lęk przed pójściem do ośrodka interwencji. Anonimowość była kluczowa." }
  ];

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 text-center">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.3em] mb-16">Pomoc, która działa</h3>
        <div className="grid md:grid-cols-3 gap-12">
          {testimonials.map((t, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="text-4xl mb-6 text-amber-600">"</div>
              <p className="text-xl font-bold text-[#1a211e] leading-relaxed italic mb-8">
                {t.text}
              </p>
              <div className="w-12 h-1 bg-amber-500 mb-4" />
              <div className="font-black text-[#0f1412] uppercase text-xs tracking-widest">{t.name}</div>
              <div className="text-slate-700 text-[10px] font-black uppercase tracking-tight">{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GuideSection() {
  return (
    <section className="py-24 bg-white overflow-hidden" id="bezpiecznik">
      <div className="max-w-7xl mx-auto px-4 sm:px-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="aspect-[4/5] bg-slate-100 rounded-[40px] border-4 border-slate-200 shadow-2xl p-10 flex flex-col justify-between group overflow-hidden">
               <div className="absolute top-0 right-0 w-full h-full bg-blue-600/5 -translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
               <div className="w-16 h-24 bg-white rounded shadow-lg flex items-center justify-center font-black text-slate-900 text-xs border border-slate-250">PDF</div>
               <div className="space-y-4 relative z-10">
                 <div className="w-20 h-2 bg-blue-600 rounded-full" />
                 <h4 className="text-3xl font-black tracking-tighter leading-none text-slate-900">Bezpiecznik v1.0</h4>
                 <p className="text-sm font-black text-slate-800 uppercase tracking-widest">Twoja baza wiedzy</p>
               </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <div className="section-tag">Zasoby</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight text-[#0f1412]">
              Bezpiecznik – <br/>
              <span className="text-blue-600 italic font-serif font-normal text-[0.8em]">twój kieszonkowy poradnik.</span>
            </h2>
            <div className="space-y-6 text-lg text-[#1a211e] leading-relaxed max-w-xl font-bold">
              <p>
                Przygotowujemy bezpłatny poradnik w formie PDF, który możesz pobrać i mieć zawsze pod ręką. Znajdziesz w nim numery telefonu, adresy instytucji i praktyczne wskazówki.
              </p>
              <p>
                Bądź gotowy na każdą sytuację. Nasz poradnik jest dostosowany do czytników ekranu (WCAG).
              </p>
            </div>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button className="btn btn-primary px-10">
                Powiadom mnie
              </button>
              <button className="btn btn-outline border-2">
                Demo PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ZenZoneTeaser() {
  return (
    <section className="py-12 bg-white px-4">
      <div className="max-w-7xl mx-auto">
        <Link 
          to="/strefa-spokoju"
          className="group relative block bg-slate-900 rounded-[48px] overflow-hidden p-10 md:p-16 shadow-2xl shadow-slate-900/20"
        >
          {/* Atmospheric Background Effects */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-600/20 to-transparent pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-white/10">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Interaktywne ćwiczenia (Statyczne)
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                Złap oddech w naszej <br/> <span className="text-emerald-500 italic font-serif">strefie spokoju.</span>
              </h2>
              <p className="text-xl text-slate-200 font-semibold max-w-md leading-relaxed">
                Potrzebujesz chwili wytchnienia? Skorzystaj z naszych ćwiczeń oddechowych i przeczytaj kojące afirmacje. To Twój bezpieczny port w cyfrowym świecie.
              </p>
              <div className="pt-4 flex items-center gap-4 text-white font-black text-xs uppercase tracking-widest group-hover:gap-6 transition-all">
                Przejdź do strefy <ArrowRight className="w-5 h-5 text-emerald-500" />
              </div>
            </div>

            <div className="relative hidden lg:flex justify-center">
              <div className="w-64 h-64 bg-white/5 rounded-[40px] border border-white/10 p-8 flex flex-col justify-center items-center group-hover:scale-105 transition-transform duration-500">
                <div className="w-32 h-32 border-4 border-emerald-500/30 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-16 h-16 bg-emerald-500/50 rounded-full blur-sm" />
                </div>
              </div>
              <div className="absolute -top-6 -right-6 px-6 py-4 bg-white rounded-3xl shadow-xl text-slate-900 font-black text-xs rotate-12">
                Wdech...
              </div>
              <div className="absolute -bottom-6 -left-6 px-6 py-4 bg-emerald-500 rounded-3xl shadow-xl text-white font-black text-xs -rotate-6">
                Wydech...
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
