import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, Download, ShieldCheck, Info, ArrowLeft, 
  Search, BookOpen, Scale, FileText, Activity, ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CRISIS_KEYWORDS } from '../data/chatFlow';

interface DictionaryTerm {
  term: string;
  category: 'rodzina' | 'socjalne' | 'zdrowie' | 'bezpieczenstwo';
  categoryLabel: string;
  shortDesc: string;
  longDesc: string;
  whoUses: string;
  howToApply: string;
}

const DICTIONARY_TERMS: DictionaryTerm[] = [
  {
    term: 'Niebieska Karta',
    category: 'bezpieczenstwo',
    categoryLabel: 'Przemoc i Bezpieczeństwo',
    shortDesc: 'Oficjalna procedura rządowa uruchamiana w sytuacjach podejrzenia przemocy w rodzinie.',
    longDesc: 'Niebieska Karta to systemowa procedura, której celem jest powstrzymanie przemocy fizycznej, psychicznej, ekonomicznej lub seksualnej w rodzinie oraz skoordynowane wsparcie ofiar. Wszczęcie procedury nie wymaga zgody osoby dotkniętej przemocą ani dowodów w postaci obdukcji – samo uzasadnione podejrzenie wystarczy do podjęcia działań przez powołaną Grupę Diagnostyczno-Pomocową.',
    whoUses: 'Policja, pracownik socjalny (MOPS/OPS), nauczyciel (szkoła), lekarz/pielęgniarka, przedstawiciel Gminnej Komisji Rozwiązywania Problemów Alkoholowych.',
    howToApply: 'Każdy organ uprawniony ma obowiązek wypełnić formularz "Niebieska Karta – A" w Twojej obecności lub natychmiast po powzięciu zgłoszenia od sąsiadów czy świadków. Formularz jest przesyłany do zespołu interdyscyplinarnego w ciągu 7 dni.'
  },
  {
    term: 'GKRPA (Gminna Komisja)',
    category: 'rodzina',
    categoryLabel: 'Sprawy Rodzinne i Uzależnienia',
    shortDesc: 'Instytucja samorządowa orzekająca o skierowaniu alkoholika na badanie i przymusowe leczenie odwykowe.',
    longDesc: 'Gminna Komisja Rozwiązywania Problemów Alkoholowych (GKRPA) zajmuje się zapobieganiem problemom alkoholowym oraz m.in. procedurą zobowiązania do leczenia odwykowego. Komisja ma prawo skierować osobę uzależnioną na badanie przez biegłych (psychiatrę i psychologa), a w przypadku odmowy lub potwierdzenia choroby – wdrożyć sprawę sądową z urzędu w celu orzeczenia przymusowego odwyku.',
    whoUses: 'Członkowie rodziny, sąsiedzi, pracownicy socjalni, kuratorzy sądowi oraz Policja doświadczająca zakłócania spokoju/agresji.',
    howToApply: 'Składa się pisemny wniosek o przymusowe leczenie odwykowe do właściwego urzędu gminy/miasta (można wygenerować taki wniosek w naszym Potrzebomacie w zakładce "Zgłoś osobę (GKRPA)"). Postępowanie komisji jest darmowe i anonimowe dla zgłaszającego.'
  },
  {
    term: 'MOPS / OPS / MOPR',
    category: 'socjalne',
    categoryLabel: 'Pomoc Socjalna i Świadczenia',
    shortDesc: ' Miejski/Gminny Ośrodek Pomocy Społecznej to główna instytucja wsparcia finansowego i rzeczowego.',
    longDesc: 'MOPS (Miejski Ośrodek Pomocy Społecznej), OPS lub MOPR to lokalna instytucja realizująca zadania pomocy społecznej. W jej murach pracownicy socjalni, asystenci rodziny i koordynatorzy pomagają osobom i rodzinom w przezwyciężeniu trudnych sytuacji życiowych, których nie są oni w stanie pokonać za pomocą własnych środków.',
    whoUses: 'Osoby o niskich dochodach, bezrobotni, rodziny wielodzietne, samotni rodzice, seniorzy requiring opieki, asystenci rodziny.',
    howToApply: 'Zgłoś się osobiście lub listownie do ośrodka właściwego dla Twojego miejsca zamieszkania. Konieczne będzie przeprowadzenie wywiadu środowiskowego (rozmowy w Twoim domu) w celu ustalenia planu pomocy.'
  },
  {
    term: 'Alimenty Natychmiastowe',
    category: 'rodzina',
    categoryLabel: 'Sprawy Rodzinne i Uzależnienia',
    shortDesc: 'Szybki, maksymalnie uproszczony sądowy tryb uzyskania środków na utrzymanie dziecka.',
    longDesc: 'Tryb alimentów natychmiastowych ma na celu ochronę ekonomiczną dzieci poprzez skrócenie procedur sądowych do absolutnego minimum. Sąd wydaje nakaz alimentacji natychmiastowej w ciągu kilkunastu dni, opierając się na stałych wskaźnikach ryczałtowych (będących odsetkiem minimalnego wynagrodzenia w kraju), bez konieczności długiego badania zarobków dłużnika.',
    whoUses: 'Rodzice samotnie wychowujący potomstwo, którzy potrzebują natychmiastowego zabezpieczenia finansowego bez czekania na pełny proces sądowy.',
    howToApply: 'Składa się pozew na gotowym, prostym formularzu urzędowym w Sądzie Rejonowym. Do pozwu dołącza się jedynie podstawowe odpisy aktów stanu cywilnego (np. akt urodzenia).'
  },
  {
    term: 'Fundusz Alimentacyjny',
    category: 'socjalne',
    categoryLabel: 'Pomoc Socjalna i Świadczenia',
    shortDesc: 'Państwowy program zastępczego wypłacania alimentów w przypadku ich bezskutecznej egzekucji.',
    longDesc: 'Gdy drugi rodzic uchyla się od płacenia zasądzonych alimentów, a komornik sądowy nie jest w stanie wyegzekwować długu ze względu na ukrywanie dochodów, państwo przejmuje wypłatę części środków (do 500 PLN miesięcznie na dziecko). Wypłata z Funduszu zależy od spełnienia kryterium dochodowego na członka rodziny, które jest sukcesywnie waloryzowane.',
    whoUses: 'Rodzic z dzieckiem mający wyrok sądowy zasądzający alimenty oraz oficjalne zaświadczenie od komornika o bezskuteczności egzekucji.',
    howToApply: 'Złóż wniosek w Dziale Świadczeń Alimentacyjnych w lokalnym MOPS/OPS lub przez rządowy portal Emp@tia. Do wniosku dołącza się postanowienie o bezskuteczności egzekucji komorniczej za ostatnie 2 miesiące.'
  },
  {
    term: 'OIK (Ośrodek Interwencji Kryzysowej)',
    category: 'bezpieczenstwo',
    categoryLabel: 'Przemoc i Bezpieczeństwo',
    shortDesc: 'Całodobowe placówki specjalistycznego wsparcia i bezpiecznego, awaryjnego schronienia.',
    longDesc: 'Ośrodek Interwencji Kryzysowej (OIK) to bezpieczne miejsce, gdzie osoby dotknięte nagłym kryzysem (przemoc domowa, katastrofa, śmierć bliskiego, myśli rezygnacyjne) otrzymują natychmiastową asystę psychologiczną, psychiatryczną i prawną. Większość OIK dysponuje tzw. pokojami interwencyjnymi/schroniskowymi, w których ofiary przemocy mogą bezpłatnie zamieszkać na okres od kilku tygodni do 3 miesięcy.',
    whoUses: 'Kobiety i mężczyźni z dziećmi uciekający przed bezpośrednim zagrożeniem ze strony sprawcy przemocy domowej.',
    howToApply: 'Do OIK można zgłosić się bezpośrednio "z ulicy", o każdej porze dnia i nocy. Nie potrzebujesz skierowania ani wcześniejszego zgłoszenia na Policję. Pomoc i pobyt są całkowicie bezpłatne.'
  },
  {
    term: 'Karta DiLO (Szybka Onkologia)',
    category: 'zdrowie',
    categoryLabel: 'Zdrowie i Opieka',
    shortDesc: 'Karta Diagnostyki i Leczenia Onkologicznego, dająca bezwzględne pierwszeństwo w kolejkach medycznych.',
    longDesc: 'Karta DiLO działa jak "zielone światło" w systemie publicznej ochrony zdrowia. Osoba z podejrzeniem lub rozpoznaniem nowotworu zostaje skierowana na tzw. Szybką Ścieżkę Onkologiczną. Gwarantuje to ominięcie standardowych, wielomiesięcznych kolejek do specjalistów i badań obrazowych (TK, MRI, PET). Ustawa narzuca maksymalne terminy na rozpoczęcie diagnostyki i leczenia (zwykle do 2-4 tygodni).',
    whoUses: 'Pacjenci z podejrzeniem choroby nowotworowej oraz ich lekarze prowadzący.',
    howToApply: 'Kartę DiLO może wystawić lekarz rodzinny (POZ) w przypadku podejrzenia choroby oraz lekarz specjalista (np. onkolog) w szpitalu. Karta ma postać elektroniczną i papierową.'
  },
  {
    term: 'Opieka Wytchnieniowa',
    category: 'zdrowie',
    categoryLabel: 'Zdrowie i Opieka',
    shortDesc: 'Bezpłatne, czasowe zastępstwo dla opiekunów osób ze znaczną niepełnosprawnością.',
    longDesc: 'Darmowy program rządowy, którego celem jest odciążenie członków rodzin lub opiekunów sprawujących całodobową opiekę nad dziećmi lub dorosłymi ze znacznym stopniem niepełnosprawności. Zapewnia pomoc asystenta w opiece domowej (do określonej liczby godzin w roku, np. 240h) lub pobyt niepełnosprawnego w ośrodku stacjonarnym (np. do 14 dni), umożliwiając opiekunom odpoczynek, podreperowanie zdrowia czy załatwienie spraw urzędowych.',
    whoUses: 'Opiekunowie osób leżących, niesamodzielnych, z ciężkimi chorobami neurologicznymi lub niepełnosprawnością intelektualną.',
    howToApply: 'Wnioski składa się raz w roku do lokalnego MOPS/OPS lub PCPR, które realizują program finansowany z państwowego Funduszu Solidarnościowego.'
  },
  {
    term: 'Świadczenie Pielęgnacyjne',
    category: 'socjalne',
    categoryLabel: 'Pomoc Socjalna i Świadczenia',
    shortDesc: 'Zasiłek dla opiekuna rezygnującego z pracy zarobkowej na rzecz opieki nad niepełnosprawnym.',
    longDesc: 'Wysokie miesięczne świadczenie finansowe wypłacane osobom, które rezygnują z aktywności zawodowej (lub jej nie podejmują), aby sprawować stałą, osobistą opiekę nad osobą legitymującą się orzeczeniem o niepełnosprawności ze wskazaniem konieczności stałej lub długotrwałej opieki. Od 2024 roku nastąpiły kluczowe zmiany pozwalające na łączenie pobierania świadczenia z podjęciem częściowej pracy zarobkowej pod pewnymi warunkami.',
    whoUses: 'Rodzice, rodzeństwo, małżonkowie oraz faktyczni opiekunowie osób ze znacznym stopniem niepełnosprawności.',
    howToApply: 'Wniosek o ustalenie prawa do świadczenia pielęgnacyjnego składa się w Wydziale Świadczeń Rodzinnych w MOPS/OPS, załączając aktualne orzeczenie o niepełnosprawności wydane przez Miejski lub Powiatowy Zespół.'
  },
  {
    term: 'PCPR (Centrum Pomocy Rodzinie)',
    category: 'socjalne',
    categoryLabel: 'Pomoc Socjalna i Świadczenia',
    shortDesc: 'Powiatowa instytucja koordynująca pomoc medyczno-społeczną, rehabilitację i pieczę zastępczą.',
    longDesc: 'Powiatowe Centrum Pomocy Rodzinie (PCPR) to jednostka nadzorująca zadania z zakresu m.in. rehabilitacji społecznej osób niepełnosprawnych oraz wsparcia rodzin. PCPR decyduje o dystrybucji funduszy PFRON na turnusy rehabilitacyjne, zakup wózków, aparatów słuchowych czy likwidację barier architektonicznych w mieszkaniach oraz prowadzi Rodzinne Domy Dziecka czy nadzór nad Domami Pomocy Społecznej (DPS).',
    whoUses: 'Osoby niepełnosprawne, ich opiekunowie, rodziny zastępcze, osoby szukające miejsca w DPS.',
    howToApply: 'Dokumenty o dofinansowanie ze środków PFRON składa się w PCPR właściwym dla Twojego Powiatu (np. w Będzinie dla powiatu będzińskiego) lub wygodnie online za pośrednictwem platformy SOW (System Obsługi Wsparcia PFRON).'
  }
];

export default function CrisisDictionary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'rodzina' | 'socjalne' | 'zdrowie' | 'bezpieczenstwo'>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // SEO & Dynamic Metadata alignment
  React.useEffect(() => {
    document.title = "Słownik Kryzysowy | Pojęcia Urzędowe i Prawne | MostPomocy.pl";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Przewodnik po terminologii urzędowej, MOPS, sądach i Niebieskiej Karcie. Dowiedz się, co oznaczają skomplikowane i zniechęcające pojęcia prawne.");
    }
  }, []);

  const filteredTerms = useMemo(() => {
    return DICTIONARY_TERMS.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.longDesc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen text-[#1a211e] pb-32">
      {/* Editorial Navigation */}
      <nav className="max-w-4xl mx-auto px-4 sm:px-10 py-8 print:hidden">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Powrót do Startu
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-10">
        
        {/* Page Typography Header */}
        <header className="mb-14 text-left border-b border-slate-200 pb-10">
          <span className="text-[#6B7280] font-black text-[11px] uppercase tracking-[0.25em] block mb-3">Tłumacz języka urzędowego na ludzki</span>
          <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-[#0f1412] leading-none mb-6">
            Słownik pojęć <span className="text-amber-700 italic font-normal">urzędowo-kryzysowych.</span>
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-xl font-serif">
            Instytucje pomocowe, sądy i urzędy często posługują się skomplikowanymi definicjami. 
            Stworzyliśmy ten słownik, abyś poczuł/a się pewniej przed pójściem do MOPS, złożeniem pozwu lub wezwaniem pomocy.
          </p>
        </header>

        {/* Content Layout Grid */}
        <div className="space-y-8">
          
          {/* Filters & Search Toolbar (Hidden in Print) */}
          <div className="space-y-4 print:hidden">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Czego szukasz? Wpisz pojęcie (np. Niebieska Karta, PCPR, alimenty)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white pl-12 pr-6 py-4 rounded-2xl border border-slate-200 focus:border-black focus:ring-1 focus:ring-black/10 text-sm font-sans font-medium text-[#1a211e] placeholder-slate-400 shadow-xs transition-all"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-2 px-2 scrollbar-none">
              {[
                { id: 'all', label: '🗂️ Wszystkie' },
                { id: 'socjalne', label: '🍲 Pomoc Socjalna' },
                { id: 'rodzina', label: '👨‍👩‍👦 Rodzina i Uzależnienia' },
                { id: 'bezpieczenstwo', label: '🛡️ Bezpieczeństwo i Przemoc' },
                { id: 'zdrowie', label: '🏥 Zdrowie i DiLO' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as any)}
                  className={`px-4.5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border shrink-0 whitespace-nowrap outline-none ${
                    selectedCategory === tab.id
                      ? 'bg-black text-white border-black shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results terms Accordion List */}
          <div className="space-y-4">
            {filteredTerms.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
                <span className="text-4xl select-none">🧐</span>
                <p className="font-serif font-black text-[#0f1412] text-lg">Brak pasujących haseł</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Spróbuj wpisać inną frazę lub zresetuj filtre kategorii, by wyświetlić wszystkie definicje słownika.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="px-6 py-3 bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all font-sans"
                >
                  Pokaż wszystkie hasła
                </button>
              </div>
            ) : (
              filteredTerms.map((item, index) => {
                const isExpanded = expandedIndex === index;
                return (
                  <motion.article
                    key={item.term}
                    layout="position"
                    className={`bg-white rounded-2xl border transition-all text-left overflow-hidden ${
                      isExpanded 
                        ? 'border-black shadow-md shadow-slate-100' 
                        : 'border-slate-200/80 hover:border-slate-350'
                    }`}
                  >
                    <button
                      onClick={() => toggleExpand(index)}
                      className="w-full text-left p-6 flex justify-between items-center gap-4 focus:outline-none"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-serif font-black text-lg md:text-xl text-[#0f1412]">
                            {item.term}
                          </span>
                          <span className={`px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${
                            item.category === 'bezpieczenstwo' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                            item.category === 'rodzina' ? 'bg-amber-50 text-amber-800 border border-amber-100' :
                            item.category === 'zdrowie' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                            'bg-emerald-50 text-emerald-800 border border-emerald-100'
                          }`}>
                            {item.categoryLabel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-sans leading-relaxed">
                          {item.shortDesc}
                        </p>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 print:hidden ${
                        isExpanded ? 'rotate-180 text-black' : ''
                      }`} />
                    </button>

                    <AnimatePresence initial={false}>
                      {(isExpanded || window.matchMedia('print').matches) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-slate-100 bg-[#FCFBF8]/60 p-6 md:p-8 space-y-6 text-sm"
                        >
                          <div className="space-y-2">
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-450 flex items-center gap-2">
                              <BookOpen className="w-3.5 h-3.5" /> Opis szczegółowy
                            </h4>
                            <p className="text-[#1a211e] leading-relaxed font-serif text-[15px]">
                              {item.longDesc}
                            </p>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-150">
                            <div className="space-y-2">
                              <h4 className="text-xs font-black uppercase tracking-wider text-slate-450 flex items-center gap-2">
                                <Scale className="w-3.5 h-3.5" /> Kto jest uprawniony lub inicjuje?
                              </h4>
                              <p className="text-xs text-slate-700 font-sans leading-relaxed font-semibold">
                                {item.whoUses}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <h4 className="text-xs font-black uppercase tracking-wider text-slate-450 flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5" /> Jak złożyć, gdzie szukać?
                              </h4>
                              <p className="text-xs text-slate-700 font-sans leading-relaxed font-semibold">
                                {item.howToApply}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.article>
                );
              })
            )}
          </div>

          {/* Interactive Toggle for Automated Keyword Dictionary list */}
          <div className="bg-white rounded-[32px] border border-slate-200/80 p-6 md:p-10 space-y-6">
            <div className="flex items-start gap-4">
              <ShieldAlert className="w-8 h-8 text-rose-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-serif font-black text-xl text-[#0f1412] mb-1.5">Algorytmiczne Filtry Bezpieczeństwa (Triage)</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  Dla pełnego zaufania i poczucia bezpieczeństwa pokazujemy wykaz {CRISIS_KEYWORDS.length} zwrotów, 
                  które nasz asystent-bot stale skanuje offline w wiadomościach. Jeśli wpiszesz którykolwiek z nich, 
                  system rozpozna realny kryzys zdrowia lub życia i skieruje Cię bezpośrednio do uwiarygodnionego wsparcia.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2 text-[10px] text-slate-600">
              <span className="font-black text-slate-400 uppercase tracking-wider self-center mr-2">Częściowy wykaz:</span>
              {CRISIS_KEYWORDS.slice(0, 15).map((word, i) => (
                <span key={i} className="px-2.5 py-1 bg-slate-50 border border-slate-150 rounded-md font-mono font-bold text-slate-700">
                  {word}
                </span>
              ))}
              <span className="px-2.5 py-1 bg-rose-50 border border-rose-100 rounded-md font-bold text-rose-700">
                + {CRISIS_KEYWORDS.length - 15} fraz samobójczych i rezygnacyjnych
              </span>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-6 flex flex-col sm:flex-row gap-4 print:hidden">
            <button
              onClick={handlePrint}
              className="flex-1 py-5.5 bg-black hover:bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all font-sans text-center flex items-center justify-center gap-3"
            >
              <Download className="w-4 h-4" /> Pobierz Słownik w PDF (Zoptymalizowany pod druk)
            </button>
            <Link
              to="/kontakt"
              className="flex-1 py-5.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-2xl text-xs font-black uppercase tracking-widest transition-all font-sans text-center flex items-center justify-center gap-3"
            >
              <Info className="w-4 h-4" /> Zaproponuj hasło pomocowe
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}
