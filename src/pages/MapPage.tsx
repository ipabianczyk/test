import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, MapPin, Phone, Mail, Clock, ChevronRight, Info, 
  Sparkles, Heart, Users, Shield, Ribbon, Accessibility, Baby, 
  Handshake, ClipboardList, Zap, ArrowRight, BookOpen, ExternalLink, Scale
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { mapCategories } from '../data/mapData';
import MapaLeafletView from '../components/MapaLeafletView';


interface Facility {
  id: string;
  name: string;
  city: 'Sosnowiec' | 'Katowice' | 'Dąbrowa Górnicza' | 'Inne';
  address: string;
  phone: string;
  email: string;
  hours: string;
  desc: string;
}

const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'sosnowiec-mops',
    name: 'Miejski Ośrodek Pomocy Społecznej w Sosnowcu',
    city: 'Sosnowiec',
    address: 'ul. 3 Maja 33, 41-200 Sosnowiec',
    phone: '32 296 22 00',
    email: 'mops@mops.sosnowiec.pl',
    hours: 'Poniedziałek - Piątek: 7:30 - 15:30',
    desc: 'Dział Świadczeń Socjalnych, Rodzinnych i Alimentacyjnych. Kompleksowe doradztwo z zakresu Funduszu Alimentacyjnego oraz Niebieskiej Karty.'
  },
  {
    id: 'katowice-mops',
    name: 'Miejski Ośrodek Pomocy Społecznej w Katowicach',
    city: 'Katowice',
    address: 'ul. Wita Stwosza 7, 40-037 Katowice',
    phone: '32 251 00 87',
    email: 'mops@mops.katowice.pl',
    hours: 'Poniedziałek - Piątek: 7:30 - 15:30',
    desc: 'Dział Świadczeń Rodzinnych i Osłonowych. Realizacja spraw alimentacyjnych, wniosków z tytułu samotnego rodzicielstwa.'
  },
  {
    id: 'dabrowa-mops',
    name: 'Miejski Ośrodek Pomocy Społecznej w Dąbrowie Górniczej',
    city: 'Dąbrowa Górnicza',
    address: 'ul. Sobieskiego 13, 41-300 Dąbrowa Górnicza',
    phone: '32 262 33 22',
    email: 'mops@mops.dabrowa-gornicza.pl',
    hours: 'Poniedziałek - Piątek: 7:00 - 15:00',
    desc: 'Pełna obsługa świadczeń z Funduszu Alimentacyjnego. Pomoc materialna, psychologiczna i asystentura rodzinna.'
  }
];

export default function MapPage() {
  const MAX_DEFAULT_FACILITIES = 1000;
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<'Wszystkie' | 'Sosnowiec' | 'Katowice' | 'Dąbrowa Górnicza' | 'Inne'>('Wszystkie');

  // Load facilities dynamically from localStorage to link with ArticleCreator / admin CRUD
  const facilitiesList = useMemo<Facility[]>(() => {
    try {
      const saved = localStorage.getItem('mostpomocy_facilities');
      return saved ? JSON.parse(saved) : INITIAL_FACILITIES;
    } catch {
      return INITIAL_FACILITIES;
    }
  }, []);

  // Filter facilities based on search query and city selection
  const filteredFacilities = useMemo(() => {
    return facilitiesList.filter(fac => {
      const cityMatches = selectedCity === 'Wszystkie' || fac.city === selectedCity;
      const searchLower = searchQuery.toLowerCase();
      const queryMatches = 
        fac.name.toLowerCase().includes(searchLower) ||
        fac.address.toLowerCase().includes(searchLower) ||
        fac.desc.toLowerCase().includes(searchLower) ||
        fac.phone.includes(searchLower);
      return cityMatches && queryMatches;
    });
  }, [facilitiesList, selectedCity, searchQuery]);

  const shouldSuppressDefaultFacilities = facilitiesList.length > MAX_DEFAULT_FACILITIES && selectedCity === 'Wszystkie' && searchQuery.trim() === '';
  const visibleFacilities = shouldSuppressDefaultFacilities ? [] : filteredFacilities;

  return (
    <div className="bg-[#FAF8F3] min-h-screen text-[#1a211e]">
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-10 py-6 text-xs font-black uppercase tracking-widest text-[#6B7280]">
        <Link to="/" className="hover:text-black transition-colors">Start</Link>
        <span className="mx-2 opacity-30">›</span>
        <span className="text-[#0f1412]">Mapa pomocy</span>
      </nav>

      {/* Editorially Designed Hero */}
      <header className="max-w-7xl mx-auto px-4 sm:px-10 py-12 md:py-16 text-left">
        <span className="text-[#6B7280] font-black text-[10px] uppercase tracking-[0.25em] block mb-3">Rejestr Regionalny / Śląsk i Zagłębie</span>
        <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-[#0f1412] leading-none mb-6">
          Gdzie Szukać Pomocy?
        </h1>
        <p className="text-[#1a211e] text-base md:text-lg leading-relaxed max-w-2xl font-serif">
          Interaktywny, zweryfikowany skorowidz placówek pomocowych w miastach Sosnowiec, Katowice i Dąbrowa Górnicza, zintegrowany z krajowymi kategoriami wsparcia.
        </p>

        {/* Smooth Anchor Jumper Navigation */}
        <div className="flex flex-wrap border-b border-slate-200 mt-12 pb-4 gap-4 sm:gap-6 justify-start">
          <button
            onClick={() => document.getElementById('interactive-map-tool')?.scrollIntoView({ behavior: 'smooth' })}
            className="pb-2 text-xs font-black uppercase tracking-widest text-slate-800 hover:text-black flex items-center gap-2 border-b-2 border-black transition-all"
          >
            🗺️ Lektor & Mapa Interaktywna
          </button>
          <button
            onClick={() => document.getElementById('regional-facility-index')?.scrollIntoView({ behavior: 'smooth' })}
            className="pb-2 text-xs font-black uppercase tracking-widest text-[#6B7280] hover:text-black hover:border-b-2 hover:border-slate-500 flex items-center gap-1.5 transition-all"
          >
            📋 Baza Śląskich Placówek (MOPS)
          </button>
          <button
            onClick={() => document.getElementById('legal-needs-guides')?.scrollIntoView({ behavior: 'smooth' })}
            className="pb-2 text-xs font-black uppercase tracking-widest text-[#6B7280] hover:text-black hover:border-b-2 hover:border-slate-500 flex items-center gap-1.5 transition-all"
          >
            📚 Poradniki & Prawa Polskie
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-10 pb-28 space-y-24">
        
        {/* SECTION 1: MAPA I SZYBKI TEST POTRZEB - IMMEDIATELY ENGAGED */}
        <section id="interactive-map-tool" className="scroll-mt-6 space-y-4 text-left">
          <div className="border-l-4 border-amber-500 pl-4 py-1">
            <h2 className="text-2xl font-serif font-black tracking-tight text-[#0f1412] uppercase">
              1. Mapa Interaktywna & Test Potrzeb
            </h2>
            <p className="text-xs text-slate-550">
              Ustal potrzeby za pomocą szybkiego testu na dole lub znajdź wolny e-mail interwencyjny placówki w Polsce.
            </p>
          </div>
          <MapaLeafletView />
        </section>

        {/* SECTION 2: ŚLĄSKI REJESTR POMOCY (SOSNOWIEC, KATOWICE, DĄBROWA GÓRNICZA) */}
        <section id="regional-facility-index" className="scroll-mt-6 space-y-8 text-left">
          <div className="border-l-4 border-slate-900 pl-4 py-1">
            <h2 className="text-2xl font-serif font-black tracking-tight text-[#0f1412] uppercase">
              2. Baza Śląskich Placówek Pomocowych
            </h2>
            <p className="text-xs text-slate-550">
              Zweryfikowane, tradycyjne ośrodki i fundacje działające w rejonie Sosnowca, Katowic i Dąbrowy Górniczej.
            </p>
          </div>

          {/* Dynamic Filter Controls */}
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                <Search className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSearchQuery(searchInput);
                  }
                }}
                placeholder="Szukaj ośrodka według nazwy..."
                className="w-full bg-[#FBF9F4] pl-12 pr-4 py-3 rounded-2xl border border-slate-200 text-sm font-sans font-medium text-[#1a211e] focus:outline-none focus:border-black transition-all"
              />
            </div>

            {/* City filters */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
              {(['Wszystkie', 'Sosnowiec', 'Katowice', 'Dąbrowa Górnicza', 'Inne'] as const).map((city) => {
                const isActive = selectedCity === city;
                return (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all ${
                      isActive
                        ? 'bg-black text-white border-black'
                        : 'bg-white border-slate-200 text-[#1a211e] hover:border-slate-350'
                    }`}
                  >
                    {city}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic List outputting Editorial Layout Cards */}
          {visibleFacilities.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {visibleFacilities.map((fac) => (
                <div
                  key={fac.id}
                  className="bg-white border border-slate-200 hover:border-slate-350 transition-all rounded-[32px] p-8 md:p-10 flex flex-col justify-between group"
                >
                  <div className="space-y-6 text-left">
                    {/* Meta */}
                    <div className="flex justify-between items-start gap-4">
                      <span className="px-3 py-1 bg-[#FBF9F4] text-[#0f1412] text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-200">
                        {fac.city}
                      </span>
                      <a 
                        href={`https://www.google.com/search?q=${encodeURIComponent(fac.name + ' ' + fac.city + ' mops kontakt telefon')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] uppercase font-black tracking-widest text-blue-600 hover:text-black flex items-center gap-1 hover:underline whitespace-nowrap"
                      >
                        🔍 Pokaż aktualne godziny i telefon w Google
                      </a>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-xl md:text-2xl font-serif font-black text-[#0f1412] leading-tight mb-4 group-hover:text-black transition-colors">
                        {fac.name}
                      </h3>
                      <p className="text-[#374151] font-sans font-medium text-xs md:text-sm leading-relaxed">
                        {fac.desc}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-100 pt-6 space-y-3">
                      <div className="flex items-center gap-3 text-sm text-[#1a211e]">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="font-medium text-xs md:text-sm">{fac.address}</span>
                      </div>
                      {fac.phone && (
                        <div className="flex items-center gap-3 text-sm text-[#1a211e]">
                          <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                          <a href={`tel:${fac.phone.replace(/\s+/g, '')}`} className="font-extrabold text-xs md:text-sm text-black underline">
                            {fac.phone}
                          </a>
                        </div>
                      )}
                      {fac.email && (
                        <div className="flex items-center gap-3 text-sm text-[#1a211e]">
                          <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                          <a href={`mailto:${fac.email}`} className="font-medium text-xs md:text-sm text-slate-600 hover:text-black transition-colors">
                            {fac.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action / Guidance */}
                  <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                    <Link 
                      to="/teczka-sprawy" 
                      className="text-[10px] font-black uppercase tracking-widest text-[#DFCBB1] hover:text-black flex items-center gap-2 transition-all transition-colors"
                    >
                      Generuj Teczkę Kosztorysu Sprawy <ArrowRight className="w-4 h-4 text-slate-300" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center bg-white rounded-[32px] border border-slate-200">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="text-xl font-serif font-bold text-[#0f1412] mb-2">
                {shouldSuppressDefaultFacilities ? 'Wybierz filtr lub wyszukaj' : 'Brak wyników'}
              </h3>
              <p className="text-sm text-[#6B7280]">
                {shouldSuppressDefaultFacilities
                  ? 'Dla dużej bazy placówek nie pokazujemy wszystkich rekordów domyślnie. Wpisz frazę i naciśnij Enter albo wybierz miasto.'
                  : 'Brak placówek odpowiadających wybranym miastom. Zmień filtry powyżej.'}
              </p>
            </div>
          )}
        </section>

        {/* SECTION 3: KATEGORIE POMOCY I PRAWA */}
        <section id="legal-needs-guides" className="scroll-mt-6 space-y-8 text-left">
          <div className="border-l-4 border-amber-600 pl-4 py-1">
            <h2 className="text-2xl font-serif font-black tracking-tight text-[#0f1412] uppercase">
              3. Poradniki Prawne według Twojej Potrzeby
            </h2>
            <p className="text-xs text-slate-550">
              Przewodniki krok po kroku, gotowe artykuły oraz asysta prawna dla osób samotnie wychowujących dzieci, w kryzysie lub borykających się z długami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {mapCategories.map((cat, i) => (
              <motion.article
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-slate-200 rounded-[28px] p-6 md:p-8 flex flex-col justify-between group hover:border-[#DFCBB1] hover:bg-[#FFFDF9] transition-all min-h-[300px] text-left shadow-xs"
              >
                <div>
                  <div className="text-4xl mb-6 relative z-10">{cat.emoji}</div>
                  <h2 className="text-xl font-serif font-black text-[#0f1412] leading-tight mb-4 group-hover:text-black">
                    {cat.title}
                  </h2>
                  <p className="text-[#374151] font-sans font-medium text-xs md:text-sm leading-relaxed line-clamp-3">
                    {cat.shortDesc}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-6 mt-6 flex justify-between items-center">
                  <Link
                    to={`/mapa/${cat.id}`}
                    className="text-[10px] font-black uppercase tracking-widest text-[#0f1412] hover:translate-x-1 transition-transform flex items-center gap-2"
                  >
                    Baza praw i linków <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* High Contrast Emergency Hotline Block */}
        <section className="mt-20 bg-slate-950 text-white rounded-[40px] p-8 md:p-16 relative overflow-hidden border border-slate-800 text-left">
          <div className="absolute top-0 right-0 w-96 h-96 bg-slate-900 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-40" />
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-slate-400 block mb-3">Bezpłatne całodobowe wsparcie</span>
            <h2 className="text-2xl md:text-4xl font-serif font-black tracking-tight mb-4">Pilna rozmowa kryzysowa?</h2>
            <p className="text-[#DFE1E0] text-sm md:text-base leading-relaxed mb-10 font-sans">
              Zadzwoń na darmowy, zaufany i w pełni anonimowy numer interwencyjny. Doradcy są dostępni całą dobę przez 7 dni w tygodniu.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <a href="tel:116123" className="text-4xl md:text-5xl font-serif font-black tracking-tighter hover:scale-105 hover:text-amber-400 transition-all">
                116 123
              </a>
              <div className="h-10 w-[2px] bg-white/10 hidden sm:block" />
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-[#6B7280]">
                Bezpłatnie • Anonimowo • Całodobowo (24/7)
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
