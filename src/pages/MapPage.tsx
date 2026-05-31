import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, MapPin, Phone, Mail, Clock, ArrowRight, Info,
  Heart, Sparkles, Accessibility, Baby, FileText, ExternalLink,
  Scale, Filter, Shield, BookOpen, Handshake, Users, ClipboardList
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { mapCategories } from '../data/mapData';

// Types for local, high-contrast, silesian database
interface SilesianFacility {
  id: string;
  name: string;
  category: string;
  city: 'Sosnowiec' | 'Katowice' | 'Dąbrowa Górnicza';
  address: string;
  phone: string;
  email: string;
  hours: string;
  desc: string;
}

// Statically defined verified facilities list – fast, clean, easy to edit/maintain directly here!
const SILESIAN_FACILITIES: SilesianFacility[] = [
  {
    id: 'sosnowiec-mops',
    name: 'Miejski Ośrodek Pomocy Społecznej w Sosnowcu',
    category: 'Sytuacja materialna i prawo',
    city: 'Sosnowiec',
    address: 'ul. 3 Maja 33, 41-200 Sosnowiec',
    phone: '32 296 22 00',
    email: 'mops@mops.sosnowiec.pl',
    hours: 'Poniedziałek - Piątek: 7:30 - 15:30',
    desc: 'Dział Świadczeń Socjalnych, Rodzinnych i Alimentacyjnych. Kompleksowe doradztwo z zakresu Funduszu Alimentacyjnego oraz Niebieskiej Karty.'
  },
  {
    id: 'sosnowiec-oik',
    name: 'Ośrodek Interwencji Kryzysowej w Sosnowcu',
    category: 'Emocje i Kryzys',
    city: 'Sosnowiec',
    address: 'ul. Szymanowskiego 5a, 41-200 Sosnowiec',
    phone: '32 298 93 87',
    email: 'oik@mops.sosnowiec.pl',
    hours: 'Całodobowo 24/7',
    desc: 'Natychmiastowe schronienie dla ofiar przemocy domowej, wsparcie psychoterapeutyczne, interwencja kryzysowa.'
  },
  {
    id: 'katowice-mops',
    name: 'Miejski Ośrodek Pomocy Społecznej w Katowicach',
    category: 'Sytuacja materialna i prawo',
    city: 'Katowice',
    address: 'ul. Wita Stwosza 7, 40-037 Katowice',
    phone: '32 251 00 87',
    email: 'mops@mops.katowice.pl',
    hours: 'Poniedziałek - Piątek: 7:30 - 15:30',
    desc: 'Dział Świadczeń Rodzinnych i Osłonowych. Realizacja spraw alimentacyjnych, wniosków z tytułu samotnego rodzicielstwa oraz programów socjalnych.'
  },
  {
    id: 'katowice-oik',
    name: 'Ośrodek Interwencji Kryzysowej w Katowicach',
    category: 'Emocje i Kryzys',
    city: 'Katowice',
    address: 'ul. Mikołowska 13a, 40-066 Katowice',
    phone: '32 251 15 99',
    email: 'oik@mops.katowice.pl',
    hours: 'Całodobowo 24/7',
    desc: 'Specjalistyczna pomoc psychologiczna, prawna oraz pedagogiczna dla osób i rodzin w kryzysie życiowym.'
  },
  {
    id: 'dabrowa-mops',
    name: 'Miejski Ośrodek Pomocy Społecznej w Dąbrowie Górniczej',
    category: 'Sytuacja materialna i prawo',
    city: 'Dąbrowa Górnicza',
    address: 'ul. Sobieskiego 13, 41-300 Dąbrowa Górnicza',
    phone: '32 262 33 22',
    email: 'mops@mops.dabrowa-gornicza.pl',
    hours: 'Poniedziałek - Piątek: 7:00 - 15:00',
    desc: 'Pełna obsługa świadczeń z Funduszu Alimentacyjnego. Pomoc materialna, psychologiczna i asystentura rodzinna.'
  },
  {
    id: 'dabrowa-oik',
    name: 'Ośrodek Interwencji Kryzysowej w Dąbrowie Górniczej',
    category: 'Emocje i Kryzys',
    city: 'Dąbrowa Górnicza',
    address: 'ul. 3 Maja 22, 41-300 Dąbrowa Górnicza',
    phone: '32 262 86 31',
    email: 'oik@mops.dabrowa-gornicza.pl',
    hours: 'Całodobowo 24/7',
    desc: 'Wielofunkcyjne wsparcie w nagłych kryzysach osobistych, małżeńskich i rodzinnych. Pomoc pedagogiczna oraz socjalna.'
  }
];

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<'Wszystkie' | 'Sosnowiec' | 'Katowice' | 'Dąbrowa Górnicza'>('Wszystkie');
  const [selectedCategory, setSelectedCategory] = useState<string>('Wszystkie');

  // List of all active cities for display
  const cities = ['Wszystkie', 'Sosnowiec', 'Katowice', 'Dąbrowa Górnicza'] as const;

  // List of all distinct support categories for filter based on mapCategories
  const categoriesList = useMemo(() => {
    return ['Wszystkie', ...mapCategories.map(cat => cat.title)];
  }, []);

  // Filter facilities based on typed search, city, and category
  const filteredFacilities = useMemo(() => {
    return SILESIAN_FACILITIES.filter(fac => {
      const matchesCity = selectedCity === 'Wszystkie' || fac.city === selectedCity;
      const matchesCategory = selectedCategory === 'Wszystkie' || fac.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        fac.name.toLowerCase().includes(q) ||
        fac.desc.toLowerCase().includes(q) ||
        fac.address.toLowerCase().includes(q) ||
        fac.city.toLowerCase().includes(q);
      
      return matchesCity && matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCity, selectedCategory]);

  return (
    <div className="bg-[#FBF9F4] min-h-screen text-[#1a211e]">
      {/* Editorial Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-6 sm:px-12 py-6 text-xs font-black uppercase tracking-widest text-[#6B7280]">
        <Link to="/" className="hover:text-black transition-colors">Start</Link>
        <span className="mx-2 opacity-30">›</span>
        <span className="text-[#0f1412]">Poradnik i Baza Pomocy</span>
      </nav>

      {/* Hero Section styled strictly according to layout specifications */}
      <header className="max-w-7xl mx-auto px-6 sm:px-12 pt-10 pb-16 text-left">
        <span className="text-amber-700 font-sans font-black text-[10px] uppercase tracking-[0.25em] block mb-3">Wygodny Spis i Rejestr Specjalistyczny</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight text-[#0f1412] leading-tight mb-6">
          Kategorie Pomocy i Regionalna Baza Wsparcia
        </h1>
        <p className="text-[#1a211e] text-base md:text-lg leading-relaxed max-w-2xl font-serif">
          Zastąpiliśmy skomplikowane systemy map w przeglądarkach lekkim i bezpośrednim rejestrem. Wybierz odpowiedni dział pomocy poniżej lub wyszukaj punkt w miastach Sosnowiec, Katowice i Dąbrowa Górnicza.
        </p>

        {/* Quick Jumper Links for Premium Experience */}
        <div className="flex flex-wrap border-b border-[#EFECE6] mt-12 pb-4 gap-6 justify-start font-sans">
          <button
            onClick={() => document.getElementById('kategorie-pomocy')?.scrollIntoView({ behavior: 'smooth' })}
            className="pb-2 text-xs font-black uppercase tracking-widest text-slate-900 border-b-2 border-amber-600 transition-all cursor-pointer"
          >
            📋 1. Wybierz Dział Pomocy
          </button>
          <button
            onClick={() => document.getElementById('baza-placowek')?.scrollIntoView({ behavior: 'smooth' })}
            className="pb-2 text-xs font-black uppercase tracking-widest text-[#6B7280] hover:text-black hover:border-b-2 hover:border-[#6B7280] transition-all cursor-pointer"
          >
            🏢 2. Lokalne Ośrodki (MOPS/OIK)
          </button>
          <button
            onClick={() => document.getElementById('infolinie-alarmowe')?.scrollIntoView({ behavior: 'smooth' })}
            className="pb-2 text-xs font-black uppercase tracking-widest text-[#6B7280] hover:text-black hover:border-b-2 hover:border-[#6B7280] transition-all cursor-pointer"
          >
            📞 3. Telefony Zaufania (24/7)
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 pb-24 space-y-24">
        
        {/* SECTION 1: KATEGORIE POMOCY - PRIMARY HERO */}
        <section id="kategorie-pomocy" className="scroll-mt-6 space-y-8 text-left">
          <div className="border-l-4 border-amber-600 pl-4 py-1">
            <h2 className="text-2xl font-serif font-black tracking-tight text-[#0f1412] uppercase">
              1. Wybierz Dział Pomocy i Prawnikę
            </h2>
            <p className="text-xs text-[#55605a]">
              Kliknij na odpowiedni kafelek potrzeb, aby zobaczyć darmowe artykuły, prawa przysługujące każdemu obywatelowi oraz oficjalną asystę.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {mapCategories.map((cat, i) => (
              <motion.article
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="bg-white border border-[#EFECE6] rounded-[28px] p-8 flex flex-col justify-between group hover:border-amber-600 hover:bg-[#FFFDF9] transition-all min-h-[280px] text-left shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
              >
                <div>
                  <div className="text-4xl mb-6">{cat.emoji}</div>
                  <h3 className="text-xl font-serif font-black text-[#0f1412] leading-tight mb-4 group-hover:text-amber-800 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-[#1a211e] font-sans font-medium text-xs md:text-sm leading-relaxed mb-6">
                    {cat.shortDesc}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-5 mt-auto flex justify-between items-center">
                  <Link
                    to={`/mapa/${cat.id}`}
                    className="text-[10px] font-black uppercase tracking-widest text-[#0f1412] hover:translate-x-1.5 transition-transform flex items-center gap-2 group-hover:text-amber-800"
                  >
                    Baza praw i linków <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* SECTION 2: BAZA JEDNOSTEK REGIONALNYCH (SOSNOWIEC, KATOWICE, DĄBROWA) */}
        <section id="baza-placowek" className="scroll-mt-6 space-y-8 text-left">
          <div className="border-l-4 border-[#0f1412] pl-4 py-1">
            <h2 className="text-2xl font-serif font-black tracking-tight text-[#0f1412] uppercase">
              2. Baza Regionalnych Ośrodków Pomocy
            </h2>
            <p className="text-xs text-[#55605a]">
              Zawsze aktualne, urzędowe punkty interwencji psychologicznej, opieki materialnej oraz osłon alimentacyjnych i socjalnych.
            </p>
          </div>

          {/* Clean Interactive Directory Controls */}
          <div className="bg-white border border-[#EFECE6] rounded-[32px] p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Text search */}
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Wpisz np. MOPS, Katowice, OIK..."
                  className="w-full bg-[#FAF8F3] pl-11 pr-4 py-3.5 rounded-2xl border border-[#EFECE6] text-xs font-sans font-semibold text-[#1a211e] placeholder-[#6B7280] focus:outline-none focus:border-black transition-all"
                />
              </div>

              {/* City filter selection dropdown */}
              <div className="flex items-center gap-2 bg-[#FAF8F3] border border-[#EFECE6] px-4 py-1.5 rounded-2xl">
                <span className="text-[9px] font-black text-[#6B7280] uppercase tracking-wider block">Miasto:</span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value as any)}
                  className="flex-1 bg-transparent text-xs font-black text-[#0f1412] focus:outline-none border-0 h-auto cursor-pointer"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Support category dropdown selector */}
              <div className="flex items-center gap-2 bg-[#FAF8F3] border border-[#EFECE6] px-4 py-1.5 rounded-2xl">
                <span className="text-[9px] font-black text-[#6B7280] uppercase tracking-wider block">Dział:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 bg-transparent text-xs font-black text-[#0f1412] focus:outline-none border-0 h-auto cursor-pointer"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Interactive Search Status information */}
            <div className="flex items-center justify-between text-xs text-[#6B7280] px-1 font-sans">
              <span>
                Znaleziono: <strong>{filteredFacilities.length}</strong> {filteredFacilities.length === 1 ? 'placówkę' : 'placówki'}
              </span>
              {(selectedCity !== 'Wszystkie' || selectedCategory !== 'Wszystkie' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCity('Wszystkie');
                    setSelectedCategory('Wszystkie');
                    setSearchQuery('');
                  }}
                  className="text-amber-800 font-bold hover:underline"
                >
                  Wyczyść filtry
                </button>
              )}
            </div>
          </div>

          {/* List display with clean, heavy magazine borders and clear white backgrounds */}
          {filteredFacilities.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredFacilities.map((fac) => (
                <div
                  key={fac.id}
                  className="bg-white border border-[#EFECE6] rounded-[32px] p-8 md:p-10 flex flex-col justify-between group shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:border-[#1a211e] transition-colors"
                >
                  <div className="space-y-6">
                    {/* Header line */}
                    <div className="flex justify-between items-start gap-3">
                      <span className="px-3 py-1 bg-[#FAF8F3] text-slate-800 text-[9px] font-black uppercase tracking-widest rounded-lg border border-[#EFECE6]">
                        {fac.city}
                      </span>
                      <span className="text-[9px] font-black text-[#6B7280] uppercase tracking-wider">
                        {fac.category}
                      </span>
                    </div>

                    {/* Facility main info */}
                    <div>
                      <h3 className="text-xl md:text-2xl font-serif font-black text-[#0f1412] leading-tight mb-3">
                        {fac.name}
                      </h3>
                      <p className="text-[#1a211e] font-sans font-medium text-xs md:text-sm leading-relaxed">
                        {fac.desc}
                      </p>
                    </div>

                    {/* High contrast, WCAG compliant contact list */}
                    <div className="border-t border-slate-100 pt-6 space-y-3.5 font-sans">
                      <div className="flex items-center gap-3 text-xs md:text-sm text-[#1a211e]">
                        <MapPin className="w-4 h-4 text-[#6B7280] shrink-0" />
                        <span className="font-semibold">{fac.address}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs md:text-sm text-[#1a211e]">
                        <Phone className="w-4 h-4 text-[#6B7280] shrink-0" />
                        <a href={`tel:${fac.phone.replace(/\s+/g, '')}`} className="font-black text-black border-b-2 border-slate-900 leading-none">
                          {fac.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-3 text-xs md:text-sm text-[#1a211e]">
                        <Mail className="w-4 h-4 text-[#6B7280] shrink-0" />
                        <a href={`mailto:${fac.email}`} className="font-semibold text-slate-800 hover:text-black hover:underline">
                          {fac.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-3 text-xs md:text-sm text-[#1a211e]">
                        <Clock className="w-4 h-4 text-[#6B7280] shrink-0" />
                        <span className="font-medium text-[#6B7280]">{fac.hours}</span>
                      </div>
                    </div>
                  </div>

                  {/* Absolute zero maintenance out-link launcher */}
                  <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-between">
                    <Link
                      to="/teczka-sprawy"
                      className="text-[10px] font-black uppercase tracking-widest text-slate-900 hover:text-amber-800 flex items-center gap-1.5 transition-colors"
                    >
                      Przygotuj się przed wizytą <ArrowRight className="w-4 h-4 text-amber-600" />
                    </Link>

                    {/* Dynamic Google Search query ensuring user always gets up-to-date schedule and routing */}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${fac.name} ${fac.city}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0f1412] hover:bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-wider max-sm:w-full justify-center transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Otwórz Nawigację Google Maps
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white border border-[#EFECE6] rounded-[32px]">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-serif font-black text-[#0f1412]">Brak wyników</h3>
              <p className="text-xs text-[#6B7280] mt-1">Żadne silesijskie punkty nie odpowiadają wybranym filtrom.</p>
            </div>
          )}
        </section>

        {/* SECTION 3: EMERGENCY INFOLINES (SOS HOTLINES) */}
        <section id="infolinie-alarmowe" className="scroll-mt-6">
          <div className="bg-[#0f1412] text-white rounded-[40px] p-8 md:p-16 relative overflow-hidden border border-slate-800 text-left">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-900 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-20" />
            <div className="relative z-10 max-w-3xl space-y-6">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-amber-500 block">Darmowe Infolinie Ogólnopolskie 24/7</span>
              <h2 className="text-3xl md:text-4xl font-serif font-black tracking-tight leading-tight">Pilna pomoc psychologiczna i kryzysowa</h2>
              <p className="text-[#DFE1E0] text-sm md:text-base leading-relaxed font-sans">
                Jeśli Ty lub Twoje bliskie osoby potrzebujecie natychmiastowego wsparcia specjalisty, zadzwoń pod jeden z bezpłatnych numerów telefonu zaufania. Rozmowy są w pełni anonimowe i bezpieczne.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-wider text-amber-400">Telefon dla Osób w Kryzysie (Dorośli)</span>
                  <a href="tel:116123" className="block text-3xl font-serif font-black hover:text-amber-400 transition-colors">
                    116 123
                  </a>
                  <p className="text-xs text-slate-400">Czynny całą dobę przez 7 dni w tygodniu.</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-wider text-amber-400">Telefon Zaufania dla Dzieci i Młodzieży</span>
                  <a href="tel:116111" className="block text-3xl font-serif font-black hover:text-amber-400 transition-colors">
                    116 111
                  </a>
                  <p className="text-xs text-slate-400">Całkowicie bezpłatne wsparcie psychologów.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
