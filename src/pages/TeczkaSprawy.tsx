import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Printer, Download, Trash2, Save, Plus, CheckCircle2, 
  ShieldCheck, AlertCircle, ArrowRight, ArrowLeft, 
  ClipboardList, Info, FileText, Search, HelpCircle
} from 'lucide-react';

interface EvidenceItem {
  id: string;
  name: string;
  checked: boolean;
  notes?: string;
}

interface QuestionItem {
  id: string;
  name: string;
  checked: boolean;
}

interface CategoryTemplate {
  id: string;
  label: string;
  emoji: string;
  group: string;
  groupLabel: string;
  description: string;
  defaultEvidence: string[];
  essentialQuestions: string[];
  prepTips: string[];
}

const CATEGORIES: CategoryTemplate[] = [
  { 
    id: 'alimenty', 
    label: 'Sprawa o Alimenty / Wsparcie Dziecka', 
    emoji: '👶',
    group: 'rodzina',
    groupLabel: 'Rodzina i Bezpieczeństwo',
    description: 'Przygotowanie do złożenia pozwu o alimenty, spotkania z prawnikiem lub ubiegania się o wypłaty z Funduszu Alimentacyjnego.',
    defaultEvidence: [
      'Odpis skrócony aktu urodzenia dziecka (z Urzędu Stanu Cywilnego)',
      'Zaświadczenie o rentach, zasiłkach lub aktualnych dochodach rodzica (PIT, umowa o pracę, rachunki)',
      'Szczegółowy miesięczny spis potrzeb dziecka (rachunki za przedszkole, leki, podręczniki, ubrania, rehabilitację)',
      'Zaświadczenia lekarskie o stanie zdrowia dziecka (jeśli dziecko ma przewlekłe schorzenia wymagające leków)',
      'Wyciągi pocztowe, przelewy lub wyciąg bankowy dokumentujący brak regularnego wsparcia od drugiego rodzica'
    ],
    essentialQuestions: [
      "Czy kwalifikuję się do Funduszu Alimentacyjnego (próg dochodowy wynosi 1209 zł netto na osobę w rodzinie)?",
      "Jakie zaświadczenie od komornika o bezskuteczności egzekucji muszę dostarczyć, aby ubiegać się o świadczenia z funduszu?",
      "Do którego Sądu Rejonowego (ze względu na aktualne miejsce zamieszkania dziecka) należy złożyć pozew o alimenty?",
      "Jak prawidłowo sformułować wniosek o zabezpieczenie alimentów na czas trwania sprawy sądowej?",
      "Gdzie i na jakich zasadach mogę otrzymać bezpłatną pomoc prawną w sporządzeniu samego pozwu o alimenty?"
    ],
    prepTips: [
      "Zbierz oryginalne rachunki i faktury imienne (wystawione na nazwisko rodzica lub dziecka) z ostatnich 6-12 miesięcy. Służą jako główny dowód w sądzie.",
      "Zrób komplet kserokopii dla sądu. Do sądu wysyła się odpis dla sędziego oraz osobną kopię bezpośrednio dla drugiej strony (pozwanego).",
      "Zapisz pełne, ostatnie znane dane adresowe drugiego rodzica. Jeśli nie znasz jego adresu, przygotuj wniosek o ustalenie adresu przez MSWiA."
    ]
  },
  { 
    id: 'niepelnosprawnosc', 
    label: 'Orzecznictwo i Niepełnosprawność (PZON)', 
    emoji: '♿',
    group: 'zdrowie',
    groupLabel: 'Zdrowie i Opieka',
    description: 'Przygotowanie wniosku/wizyty w Powiatowym Zespole ds. Orzekania o Niepełnosprawności dotyczącej stopnia lub zasiłków.',
    defaultEvidence: [
      'Zaświadczenie lekarskie o stanie zdrowia wydane dla potrzeb zespołu orzekania (ważne tylko 30 dni od wystawienia!)',
      'Kserokopie kart informacyjnych leczenia szpitalnego (wypisy, opisy zabiegów, przebytych operacji)',
      'Aktualne wyniki badań specjalistycznych i opisy diagnostyczne (RTG, rezonans, TK, USG)',
      'Opinia psychologiczna, logopedyczna lub pedagogiczna z poradni (szczególnie ważne dla dzieci uczących się)',
      'Dowód tożsamości rodzica/opiekuna oraz wniosek o wydanie orzeczenia'
    ],
    essentialQuestions: [
      "Które konkretnie punkty w orzeczeniu (np. punkt 7 i 8 o konieczności stałej opieki) są wymagane do uzyskania świadczenia pielęgnacyjnego?",
      "Gdzie i w jakim terminie od otrzymania orzeczenia przysługuje mi prawo wniesienia odwołania (zwykle 14 dni do Wojewódzkiego Zespołu)?",
      "Czy z tym orzeczeniem przysługuje mi prawo do wyrobienia Karty Parkingowej osobie niepełnosprawnej?",
      "Z jakich form dofinansowań w programach PFRON (np. likwidacja barier architektonicznych lub technicznych) mogę skorzystać i w jakim terminie?",
      "Gdzie mam złożyć wniosek o przyznanie i wypłatę zasiłku pielęgnacyjnego lub refundacji pieluchomajtek?"
    ],
    prepTips: [
      "Zaświadczenie o stanie zdrowia ma bezwzględną ważność 30 dni. Jeśli nie zdążysz złożyć wniosku przed tym terminem, lekarz musi wystawić nowe.",
      "Uporządkuj dokumentację medyczną chronologicznie, układając najnowsze wpisy na początku teczki. Zawsze zabieraj oryginały do wglądu na komisję lekarską.",
      "Zastanów się i wynotuj na kartce codzienne czynności, przy których wymagasz pomocy: od ubrań i toalety, przez przygotowanie jedzenia, aż po wyjścia na zakupy."
    ]
  },
  { 
    id: 'sytuacja-materialna', 
    label: 'Pomoc Społeczna i Zasiłki (MOPS/OPS)', 
    emoji: '🍲',
    group: 'byt',
    groupLabel: 'Pieniądze i Byt',
    description: 'Przygotowanie dokumentów przed wizytą w MOPS, rozmową z pracownikiem socjalnym oraz wywiadem środowiskowym.',
    defaultEvidence: [
      'Dokumenty poświadczające dochód netto wszystkich domowników z miesiąca poprzedzającego złożenie wniosku (PIT-11, umowa, paski z ZUS)',
      'Decyzje o innych świadczeniach (zasiłki rodzinne, dodatki mieszkaniowe, fundusz alimentacyjny)',
      'Dowód osobisty wnioskodawcy lub paszport obcokrajowca',
      'Ostatnie rachunki za media (opłaty za prąd, gaz, wodę) oraz decyzja o wysokości czynszu mieszkaniowego',
      'Zaświadczenie z Urzędu Pracy o statusie osoby bezrobotnej z prawem lub bez prawa do zasiłku'
    ],
    essentialQuestions: [
      "Ile wynosi próg dochodowy dla zasiłku okresowego w mojej sytuacji (776 zł dla osoby samotnej, 600 zł na osobę w rodzinie)?",
      "Kiedy i w jakiej formie odbędzie się rodzinny wywiad środowiskowy w moim miejscu zamieszkania i kto musi być przy nim obecny?",
      "Czy kwalifikuję się do otrzymania pomocy celowej (np. na zakup odzieży, leków, żywności FEAD, opłacenie opału)?",
      "Czy moje dzieci mogą zostać objęte bezpłatnym programem dożywiania w szkole lub przedszkolu i jakie kwity są tu niezbędne?",
      "Jakie formy aktywnego wsparcia (np. kontrakt socjalny, pomoc asystenta rodziny) MOPS może mi zaproponować do wyjścia z kryzysu?"
    ],
    prepTips: [
      "Wywiad środowiskowy to rutynowa i ustawowa rozmowa w Twoim domu. Bądź szczery, opisz swoje wydatki i nie ukrywaj przed pracownikiem trudności.",
      "Zasiłek celowy jest przyznawany na sprecyzowaną potrzebę. Zbierz np. fakturę za leki lub rachunek za naprawę pieca, by udowodnić kwotę.",
      "Trzymaj zaświadczenia o dochodach netto bez błędów. Brak podpisu od pracodawcy w jednej rubryce to najczęstszy powód wezwań do poprawek."
    ]
  },
  { 
    id: 'zadluzenie', 
    label: 'Długi, Komornicy i Pisma Sądowe', 
    emoji: '📉',
    group: 'byt',
    groupLabel: 'Pieniądze i Byt',
    description: 'Przygotowanie do spotkania z prawnikiem, darmowym doradcą finansowym lub komornikiem sądowym w sprawie pętli chwilówek i wezwań.',
    defaultEvidence: [
      'Wszystkie odebrane z poczty fizyczne nakazy zapłaty z sądów z dokładnymi datami ich odbioru (koperty ze stemplami pocztowymi!)',
      'Aktualne pisma od komorników sądowych ze wskazaną sygnaturą akt (np. sygn. KM)',
      'Umowy kredytowe, umowy pożyczkowe, wezwania przedsądowe i ostateczne wezwania do zapłaty wraz z załącznikami',
      'Dokument dochodowy dla oceny zajęć komorniczych (odcinek emerytury, zaświadczenie o wynagrodzeniu za pracę)',
      'Kompletny spis znanych wierzycieli wraz ze wskazaniem kwot żądanych'
    ],
    essentialQuestions: [
      "Ile wynosi kwota wolna od zajęcia na moim rachunku bankowym oraz na moim wynagrodzeniu z umowy o pracę/zlecenie/emeryturze?",
      "Czy nakaz zapłaty został doręczony na mój prawidłowy adres zamieszkania i czy mam szansę złożyć spóźniony sprzeciw do sądu?",
      "Czy kwoty odsetek i prowizji pobieranych przez wierzyciela nie naruszają przepisów antylichwiarskich i można je podważyć w sądzie?",
      "Czy kwalifikuję się do przeprowadzenia procesu upadłości konsumenckiej i jakie są koszty oraz ryzyko dla mojego majątku?",
      "Jak napisać i uargumentować wniosek o restrukturyzację zadłużenia lub zawarcie ugody ratalnej bezpośrednio u wierzyciela?"
    ],
    prepTips: [
      "Zawsze przechowuj koperty. Data odbioru przesyłki z sądu (często 14 dni na sprzeciw) liczy się od dnia podpisania odbioru u listonosza.",
      "Nie ignoruj korespondencji. List nieodebrany z poczty (po podwójnym awizowaniu) uznaje się prawnie za doręczony (fikcja doręczenia), co ułatwia egzekucję.",
      "Załóż bezpłatny profil w e-Sądzie (EPU Lublin). To pozwoli Ci monitorować online, czy ktoś nie próbuje uzyskać nakazu bez Twojej wiedzy."
    ]
  },
  { 
    id: 'przemoc', 
    label: 'Procedura Niebieskiej Karty i Bezpieczeństwo', 
    emoji: '🛡️',
    group: 'rodzina',
    groupLabel: 'Rodzina i Bezpieczeństwo',
    description: 'Podręczna lista dowodów i pytań do grupy diagnostyczno-pomocowej, bezpłatnego psychologa i Ośrodka Interwencji Kryzysowej.',
    defaultEvidence: [
      'Formularz Niebieska Karta - Część A (jeśli został już wszczęty np. podczas nagłej interwencji policji w domu)',
      'Lista dat i numerów zgłoszeń na policję (można poprosić w komisariacie o wykaz interwencji pod Twoim adresem)',
      'Profesjonalne obdukcje medyczne lub jakiekolwiek zaświadczenie lekarskie potwierdzające fizyczne ślady przemocy',
      'Zrzuty ekranu, wydrukowane maile, SMS-y z groźbami lub nagrania dźwiękowe (awantur, poniżania)',
      'Pisemne oświadczenia najbliższych sąsiadów lub świadków o głośnych hałasach, krzykach lub prośbach o pomoc'
    ],
    essentialQuestions: [
      "Jak uzyskać natychmiastowy nakaz opuszczenia wspólnego mieszkania przez sprawcę oraz zakaz zbliżania się do mnie i dzieci?",
      "W jaki sposób spotyka się Grupa Diagnostyczno-Pomocowa i czy będę zmuszony rozmawiać w obecności sprawcy (nie, spotkania odbywają się oddzielnie)?",
      "Gdzie w pobliżu Katowic/Sosnowca znajduje się bezpieczny, całodobowy Specjalistyczny Ośrodek Wsparcia dla ofiar przemocy?",
      "Jakie bezpłatne wsparcie prawne (pisanie wniosków sądowych o zakazy) i pomoc psychologiczną oferuje miejski punkt interwencji?",
      "Co mam zrobić, jeśli sprawca złamie orzeczony zakaz zbliżania się lub kontaktu?"
    ],
    prepTips: [
      "Twoje bezpieczeństwo i życie są nadrzędne. Nie mów sprawcy o wizycie w urzędzie/OIK, zbieraniu dowodów czy planach odejścia.",
      "Spotkania w ramach Niebieskiej Karty są rozdzielone. Urzędnicy i policja najpierw wysłuchają Ciebie sam na sam, sprawca ma osobny termin.",
      "Przechowuj dowody (nagrania, zdjęcia) poza domem lub w chmurze, do której sprawca nie ma dostępu. Spakuj zawczasu tzw. 'teczkę ucieczkową' (dowód, leki, pieniądze) i zostaw u zaufanej sąsiadki."
    ]
  }
];

export default function TeczkaSprawy() {
  const [step, setStep] = useState(1);
  const [formCategory, setFormCategory] = useState('alimenty');

  const [initials, setInitials] = useState('');
  const [city, setCity] = useState('Sosnowiec');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [narrative, setNarrative] = useState('');
  const [caseGoals, setCaseGoals] = useState('');

  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);

  const [categorySearch, setCategorySearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');

  const [newEvName, setNewEvName] = useState('');
  const [newQuesName, setNewQuesName] = useState('');

  const activeTemplate = useMemo(() => {
    return CATEGORIES.find(c => c.id === formCategory) || CATEGORIES[0];
  }, [formCategory]);

  const filteredCategories = useMemo(() => {
    return CATEGORIES.filter(cat => {
      const matchesGroup = selectedGroup === 'all' || cat.group === selectedGroup;
      const matchesSearch = categorySearch === '' || 
        cat.label.toLowerCase().includes(categorySearch.toLowerCase()) ||
        cat.description.toLowerCase().includes(categorySearch.toLowerCase());
      return matchesGroup && matchesSearch;
    });
  }, [categorySearch, selectedGroup]);

  useEffect(() => {
    const saved = localStorage.getItem('mostpomocy_przygotownik_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.formCategory) setFormCategory(parsed.formCategory);
        if (parsed.initials) setInitials(parsed.initials);
        if (parsed.city) setCity(parsed.city);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.narrative) setNarrative(parsed.narrative);
        if (parsed.caseGoals) setCaseGoals(parsed.caseGoals);
        if (parsed.evidence) setEvidence(parsed.evidence);
        if (parsed.questions) setQuestions(parsed.questions);
      } catch (e) {
        console.error('Błąd podczas ładowania dokumentów', e);
      }
    } else {
      loadCategoryDefaults(formCategory);
    }
  }, []);

  const loadCategoryDefaults = (catId: string) => {
    const matched = CATEGORIES.find(c => c.id === catId);
    if (matched) {
      const defaultEvs: EvidenceItem[] = matched.defaultEvidence.map((name, idx) => ({
        id: `def-ev-${idx}-${catId}`,
        name,
        checked: false,
        notes: ''
      }));

      const defaultQues: QuestionItem[] = matched.essentialQuestions.map((name, idx) => ({
        id: `def-q-${idx}-${catId}`,
        name,
        checked: false
      }));

      setEvidence(defaultEvs);
      setQuestions(defaultQues);
    }
  };

  const handleCategoryChange = (catId: string) => {
    setFormCategory(catId);
    loadCategoryDefaults(catId);
  };

  const saveProgressDraft = () => {
    const data = {
      formCategory,
      initials,
      city,
      phone,
      email,
      narrative,
      caseGoals,
      evidence,
      questions
    };
    localStorage.setItem('mostpomocy_przygotownik_v1', JSON.stringify(data));
  };

  const clearAllData = () => {
    if (window.confirm('Czy na pewno chcesz usunąć wszystkie wprowadzone dane przygotowania? Ta operacja wyczyści pliki lokalne z tej przeglądarki.')) {
      localStorage.removeItem('mostpomocy_przygotownik_v1');
      setInitials('');
      setPhone('');
      setEmail('');
      setNarrative('');
      setCaseGoals('');
      setStep(1);
      loadCategoryDefaults(formCategory);
    }
  };

  const toggleEvidenceCheck = (id: string) => {
    setEvidence(evidence.map(e => e.id === id ? { ...e, checked: !e.checked } : e));
  };

  const updateEvidenceNote = (id: string, notes: string) => {
    setEvidence(evidence.map(e => e.id === id ? { ...e, notes } : e));
  };

  const addCustomEvidence = () => {
    if (!newEvName.trim()) return;
    const item: EvidenceItem = {
      id: `custom-ev-${Date.now()}`,
      name: newEvName,
      checked: true,
      notes: ''
    };
    setEvidence([...evidence, item]);
    setNewEvName('');
  };

  const removeEvidence = (id: string) => {
    setEvidence(evidence.filter(e => e.id !== id));
  };

  const toggleQuestionCheck = (id: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, checked: !q.checked } : q));
  };

  const addCustomQuestion = () => {
    if (!newQuesName.trim()) return;
    const item: QuestionItem = {
      id: `custom-q-${Date.now()}`,
      name: newQuesName,
      checked: false
    };
    setQuestions([...questions, item]);
    setNewQuesName('');
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleDownloadTxt = () => {
    const matchedCategory = CATEGORIES.find(c => c.id === formCategory)?.label || formCategory;
    const dateStr = new Date().toLocaleDateString('pl-PL');
    
    let text = `==================================================\n`;
    text += `       PRZYGOTOWNIK PRZED WIZYTĄ URZĘDOWĄ/SOCJALNĄ\n`;
    text += `             MostPomocy.pl - Portal Wsparcia\n`;
    text += `             Wygenerowano dnia: ${dateStr}\n`;
    text += `==================================================\n\n`;
    
    text += `I. PODSTAWOWE DANE IDENTYFIKACYJNE\n`;
    text += `----------------------------------\n`;
    text += `Kategoria Sprawy: ${matchedCategory}\n`;
    text += `Inicjały/Podpis: ${initials || 'Anonimowy'}\n`;
    text += `Miejscowość: ${city}\n`;
    if (phone) text += `Telefon: ${phone}\n`;
    if (email) text += `E-mail: ${email}\n\n`;
    
    text += `II. WYKAZ DOKUMENTÓW DO ZABRANIA (CHECKLISTA)\n`;
    text += `-----------------------------------------------\n`;
    evidence.forEach((e) => {
      text += `[${e.checked ? 'X' : ' '}] ${e.name} ${e.notes ? `(Uwagi: ${e.notes})` : ''}\n`;
    });
    text += `\n`;
    
    text += `III. PYTANIA, KTÓRE CHCĘ ZADAĆ URZĘDNIKOWI / PRAWNIKOWI\n`;
    text += `--------------------------------------------------------\n`;
    questions.forEach((q) => {
      text += `[${q.checked ? '✓ Zadane' : ' '}] ${q.name}\n`;
    });
    text += `\n`;
    
    text += `IV. OPIS SYTUACJI (DLA ROZJMÓWCY / KONSULTANTA)\n`;
    text += `------------------------------------------------\n`;
    text += `${narrative || 'Brak wpisanego opisu sytuacji.'}\n\n`;
    
    text += `V. MOJE CELE I POSTULATY\n`;
    text += `------------------------\n`;
    text += `${caseGoals || 'Brak wpisanych postulatów.'}\n\n`;
    
    text += `VI. PRAKTYCZNE PORADY PRZYGOTOWAWCZE\n`;
    text += `------------------------------------\n`;
    activeTemplate.prepTips.forEach((tip, idx) => {
      text += `${idx+1}. ${tip}\n`;
    });
    
    text += `\n==================================================\n`;
    text += `Dane są przechowywane wyłącznie lokalnie w przeglądarce i nie\n`;
    text += `były wysyłane na serwer. Wydruk służy celom organizacyjnym.\n`;
    text += `==================================================\n`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Przygotownik_Wizyty_${initials || 'Anonim'}_${city}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#FAF8F3] min-h-screen text-[#1a211e] pb-16">
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-10 py-6 text-xs font-black uppercase tracking-widest text-slate-800 print:hidden">
        <Link to="/" className="hover:text-amber-600 transition-colors">Start</Link>
        <span className="mx-2 opacity-30">›</span>
        <span className="text-slate-900 font-extrabold">Przygotownik wizyty</span>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-10">
        {/* Header */}
        <header className="py-8 text-left border-b border-slate-300 mb-12 print:hidden">
          <span className="text-amber-800 font-black text-[10px] uppercase tracking-[0.25em] block mb-3">
            📚 Bezpieczny organizer obywatelski
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-[#0f1412] leading-none mb-6">
            Przygotowanie do wizyty
          </h1>
          <p className="text-[#1a211e] text-base leading-relaxed max-w-2xl font-serif font-semibold">
            Bój, stres lub po prostu pośpiech sprawiają, że podczas spotkania w MOPS, u prawnika czy sądzie zapominamy o kluczowych dokumentach i ważnych pytaniach. Ta karta pozwoli Ci uporządkować wszystko w jednym pliku i bezpiecznie przynieść na konsultację. <strong>Gwarantujemy zero kosztów i pełną prywatność</strong>.
          </p>

          {/* Fully compliant WCAG Privacy Alert */}
          <div className="mt-8 bg-white border-2 border-slate-950 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
            <ShieldCheck className="w-6 h-6 text-emerald-800 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-[#1a211e] font-semibold leading-relaxed">
              <strong className="text-[#0f1412] font-black uppercase tracking-wide block mb-1">
                Pełna poufność (Brak przesyłania danych)
              </strong>
              Twoje dane nie opuszczają tego urządzenia. Ta strona nie posiada bazy serwerowej – wszystko wpisywane przez Ciebie gromadzi się w lokalnej pamięci Twojej przeglądarki. Możesz posłużyć się inicjałami (np. <i>A.K.</i>).
            </div>
          </div>
        </header>

        {/* Printable View (Hidden in Screen, Visible in Print) */}
        <div className="hidden print:block text-left font-serif text-black p-4 space-y-8 bg-white">
          <div className="text-center border-b-2 border-black pb-6">
            <h1 className="text-2xl font-bold uppercase tracking-wide">Karta Przygotowania do Wizyty</h1>
            <p className="text-sm italic">Opracowano samodzielnie na mostpomocy.pl</p>
            <p className="text-xs">Data wygenerowania: {new Date().toLocaleDateString('pl-PL')}</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold border-b border-black pb-1 uppercase">I. Dane Identyfikacyjne Sprawy</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Kategoria spotkania:</strong> {activeTemplate.label}</div>
              <div><strong>Obywatel (Inicjały):</strong> {initials || 'Anonimowy'}</div>
              <div><strong>Lokalizacja:</strong> {city}</div>
              {phone && <div><strong>Telefon:</strong> {phone}</div>}
              {email && <div><strong>E-mail:</strong> {email}</div>}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold border-b border-black pb-1 uppercase">II. Wykaz spakowanych dokumentów (Checklista)</h2>
            <div className="text-sm space-y-1.5">
              {evidence.map((ev, i) => (
                <div key={i} className="flex gap-3">
                  <span>[{ev.checked ? 'X' : ' '}]</span>
                  <span><strong>{ev.name}</strong> {ev.notes ? `— Uwagi: ${ev.notes}` : ''}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold border-b border-black pb-1 uppercase">III. Pytania, które należy zadać urzędnikowi / specjaliście</h2>
            <div className="text-sm space-y-1.5">
              {questions.map((q, i) => (
                <div key={i} className="flex gap-3">
                  <span>[ ]</span>
                  <span>{q.name}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold border-b border-black pb-1 uppercase">IV. Opis Sprawy i Tło Sytuacji</h2>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{narrative || 'Brak wpisanego opisu tła sprawy.'}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold border-b border-black pb-1 uppercase">V. Postulaty, cele i dążenia</h2>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{caseGoals || 'Brak sprecyzowanych celów.'}</p>
          </section>

          <section className="space-y-3 page-break-before">
            <h2 className="text-lg font-bold border-b border-black pb-1 uppercase">VI. Rekomendacje postępowania dla tej kategorii</h2>
            <ul className="text-sm space-y-2 list-decimal pl-5">
              {activeTemplate.prepTips.map((tip, idx) => (
                <li key={idx} className="leading-relaxed">{tip}</li>
              ))}
            </ul>
          </section>

          <footer className="pt-8 text-xs text-center border-t border-gray-200">
            Wydruk przygotowany dyskretnie przed wizytą. Serwis mostpomocy.pl służy celom informacyjnym i wspiera rzetelne przygotowanie do kontaktu z profesjonalistami.
          </footer>
        </div>

        {/* Screen Interactive Assistant UI (Hidden in Print) */}
        <div className="bg-white border-2 border-slate-200 rounded-[32px] overflow-hidden shadow-sm p-6 md:p-10 text-left print:hidden">
          {/* Progress Nav */}
          <div className="flex justify-between items-center mb-10 overflow-x-auto pb-4 gap-4 border-b border-slate-200">
            {[
              { num: 1, label: 'Wybór tematu i Dane' },
              { num: 2, label: 'Teczkowe dokumenty' },
              { num: 3, label: 'Pytania na wizytę' },
              { num: 4, label: 'Moja historia' },
              { num: 5, label: 'Karta i Druk' }
            ].map(s => (
              <button
                key={s.num}
                onClick={() => s.num <= step ? setStep(s.num) : null}
                className="flex items-center gap-2.5 shrink-0 focus:outline-none cursor-pointer"
                disabled={s.num > step}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-sans text-xs font-black transition-all ${
                  step === s.num 
                    ? 'bg-amber-600 text-white' 
                    : step > s.num 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-[#FBF9F4] text-slate-400 border border-slate-200'
                }`}>
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${step === s.num ? 'text-amber-800' : 'text-slate-900'}`}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>

          {/* Form Wizard Core */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-xl font-serif font-black text-[#0f1412] mb-2">Krok 1: Wybierz instytucję / sytuację, do której się szykujesz</h2>
                  <p className="text-xs text-[#1a211e] leading-relaxed font-bold">
                    System precyzyjnie dobierze podstawowe dokumenty, które na pewno będą potrzebne, oraz zagadnienia do poruszenia na miejscu.
                  </p>
                </div>

                {/* Szybka Wyszukiwarka */}
                <div className="space-y-4">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-800">
                      <Search className="w-5 h-5" />
                    </span>
                    <input
                      type="text"
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      placeholder="Co chcesz załatwić? Wpisz np. alimenty, przemoc, mops, orzeczenie..."
                      className="w-full bg-[#FBF9F4] pl-12 pr-12 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-amber-600 focus:outline-none text-sm font-sans font-bold text-black placeholder-slate-500 transition-all shadow-xs"
                    />
                    {categorySearch && (
                      <button
                        type="button"
                        onClick={() => setCategorySearch('')}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-black text-amber-700 hover:text-amber-900 transition-colors"
                      >
                        Wyczyść
                      </button>
                    )}
                  </div>

                  {/* Pills */}
                  <div className="flex gap-2 overflow-x-auto pb-1 -mx-2 px-2">
                    {[
                      { id: 'all', label: '🗂️ Wszystkie', count: CATEGORIES.length },
                      { id: 'rodzina', label: '👨‍👩‍👧‍👦 Rodzina', count: CATEGORIES.filter(c => c.group === 'rodzina').length },
                      { id: 'zdrowie', label: '🏥 Zdrowie/Komisje', count: CATEGORIES.filter(c => c.group === 'zdrowie').length },
                      { id: 'byt', label: '💸 Byt/Pieniądze', count: CATEGORIES.filter(c => c.group === 'byt').length },
                      { id: 'terapie', label: '🌱 Terapie', count: CATEGORIES.filter(c => c.group === 'terapie').length }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setSelectedGroup(tab.id)}
                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap shrink-0 border-2 ${
                          selectedGroup === tab.id
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-[#FBF9F4] text-slate-900 border-slate-200 hover:border-amber-600 hover:bg-[#FAF7F0]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCategories.map(cat => {
                    const isSelected = formCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`p-5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between min-h-[190px] focus:outline-none relative group cursor-pointer ${
                          isSelected 
                            ? 'border-amber-600 bg-amber-50/20' 
                            : 'border-slate-200 hover:border-amber-600 bg-white hover:shadow-xs'
                        }`}
                      >
                        <div className="space-y-3.5 w-full">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl shrink-0 select-none" role="img" aria-label={cat.label}>
                                {cat.emoji}
                              </span>
                              <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-amber-800 block">
                                  {cat.groupLabel}
                                </span>
                                <h3 className="font-serif font-black text-sm text-[#0f1412] leading-tight">
                                  {cat.label}
                                </h3>
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                              isSelected 
                                ? 'border-amber-600 bg-amber-600 text-white' 
                                : 'border-slate-200 group-hover:border-slate-400 text-transparent'
                            }`}>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                          </div>

                          <p className="text-xs text-[#1a211e] font-semibold leading-relaxed">
                            {cat.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 flex justify-between items-center w-full text-[9px] uppercase font-black tracking-widest border-t border-slate-200">
                          <span className={isSelected ? 'text-amber-800' : 'text-slate-500'}>
                            {isSelected ? 'Wybrany organizer' : 'Kliknij, aby wybrać'}
                          </span>
                          <span className="transition-transform duration-300 group-hover:translate-x-1">
                            {isSelected ? 'Wybrany ✓' : 'Użyj tego szablonu →'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Patient basics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-800 block">
                      Inicjały lub pseudonim (Zalecane)
                    </label>
                    <input
                      type="text"
                      value={initials}
                      onChange={(e) => setInitials(e.target.value)}
                      placeholder="Wpisz np. K.K. w celach bezpieczeństwa"
                      className="w-full bg-[#FBF9F4] px-4 py-3 rounded-xl border-2 border-slate-200 text-sm font-sans font-bold text-[#1a211e] focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-800 block">
                      Miasto / Gmina woj. śląskiego
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#FBF9F4] px-4 py-3 rounded-xl border-2 border-slate-200 text-sm font-sans font-bold text-[#1a211e] focus:outline-none focus:border-amber-600"
                    >
                      <option value="Sosnowiec">Sosnowiec</option>
                      <option value="Katowice">Katowice</option>
                      <option value="Dąbrowa Górnicza">Dąbrowa Górnicza</option>
                      <option value="Inne">Inne miasto / Inny region</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-800 block">
                      Telefon (Opcjonalnie - ukryty na serwerze)
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Wyłącznie do celów Twojego pliku/wydruku"
                      className="w-full bg-[#FBF9F4] px-4 py-3 rounded-xl border-2 border-slate-200 text-sm font-sans font-bold text-[#1a211e] focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-800 block">
                      Adres e-mail (Opcjonalnie)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Przydatne na karcie dla prawnika"
                      className="w-full bg-[#FBF9F4] px-4 py-3 rounded-xl border-2 border-slate-200 text-sm font-sans font-bold text-[#1a211e] focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-xl font-serif font-black text-[#0f1412] mb-2">Krok 2: Spakuj odpowiednie dokumenty (Twoja Teczka)</h2>
                  <p className="text-sm text-[#1a211e] font-bold">
                    Oznaczenie dokumentu jako "Spakowany" pomoże zachować pewność, że niczego nie ubyło przed wyjściem. Możesz dodawać własne pozycje.
                  </p>
                </div>

                <div className="space-y-3">
                  {evidence.map((ev) => (
                    <div 
                      key={ev.id}
                      className="p-4 bg-[#FBF9F4] border border-slate-250 rounded-2xl flex items-start gap-4 hover:border-slate-400 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={ev.checked}
                        onChange={() => toggleEvidenceCheck(ev.id)}
                        className="w-5 h-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 mt-1 cursor-pointer shrink-0"
                      />
                      <div className="flex-1 text-left space-y-2">
                        <span className={`text-xs font-black leading-tight block ${ev.checked ? 'text-black line-through font-bold opacity-60' : 'text-[#0f1412]'}`}>
                          {ev.name}
                        </span>
                        <input
                          type="text"
                          value={ev.notes || ''}
                          onChange={(e) => updateEvidenceNote(ev.id, e.target.value)}
                          placeholder="Twoja uwaga (np. szukać w szafce, oryginał w oprawce)"
                          className="w-full bg-white px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-sans font-semibold focus:outline-none focus:border-amber-600"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEvidence(ev.id)}
                        className="text-slate-500 hover:text-rose-600 transition-colors p-1"
                        title="Usuń dokument z listy"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Custom Evidence Form */}
                <div className="bg-slate-50 border border-slate-250 p-6 rounded-2xl space-y-4">
                  <h4 className="text-xs font-black uppercase text-slate-800 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Dodaj inny specyficzny dokument do spakowania
                  </h4>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={newEvName}
                      onChange={(e) => setNewEvName(e.target.value)}
                      placeholder="np. Kserokopia umowy najmu mieszkania od spółdzielni"
                      className="flex-1 bg-white px-4 py-3 rounded-xl border-2 border-slate-200 text-xs font-bold text-black"
                    />
                    <button
                      type="button"
                      onClick={addCustomEvidence}
                      className="px-6 py-3 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                    >
                      Dodaj do teczki
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-xl font-serif font-black text-[#0f1412] mb-2">Krok 3: Pytania, które na pewno chcesz zadać specjaliście</h2>
                  <p className="text-sm text-[#1a211e] font-bold">
                    Na spotkaniach urzędowych emocje biorą górę i zapominamy o zadaniu kluczowych pytań. Zaznacz te, które są dla Ciebie ważne i dopisz własne.
                  </p>
                </div>

                <div className="space-y-3">
                  {questions.map((q) => (
                    <div 
                      key={q.id}
                      className="p-4 bg-[#FBF9F4] border border-slate-250 rounded-2xl flex items-start gap-4 hover:border-slate-400 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={q.checked}
                        onChange={() => toggleQuestionCheck(q.id)}
                        className="w-5 h-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 mt-1 cursor-pointer shrink-0"
                      />
                      <div className="flex-1 text-left">
                        <span className={`text-xs font-black leading-tight block ${q.checked ? 'text-black opacity-50 font-bold line-through' : 'text-[#0f1412]'}`}>
                          {q.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQuestion(q.id)}
                        className="text-slate-500 hover:text-rose-600 transition-colors p-1"
                        title="Usuń to pytanie"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Custom Question form */}
                <div className="bg-slate-50 border border-slate-250 p-6 rounded-2xl space-y-4">
                  <h4 className="text-xs font-black uppercase text-slate-800 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Dodaj swoje własne, spersonalizowane pytanie do konsultanta
                  </h4>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={newQuesName}
                      onChange={(e) => setNewQuesName(e.target.value)}
                      placeholder="np. Czy darmowy radca przyjmuje w środy i czy muszę wcześniej dzwonić?"
                      className="flex-1 bg-white px-4 py-3 rounded-xl border-2 border-slate-200 text-xs font-bold text-black"
                    />
                    <button
                      type="button"
                      onClick={addCustomQuestion}
                      className="px-6 py-3 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                    >
                      Dopisz pytanie
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-xl font-serif font-black text-[#0f1412] mb-2">Krok 4: Zapisz swoją historię i główne cele</h2>
                  <p className="text-sm text-[#1a211e] font-bold">
                    Napisz krótkie tło w spokojnej atmosferze w domu. Podczas wywiadu lub u prawnika możesz po prostu wręczyć im tę kartę, by nie musieć opowiadać bolesnych faktów na głos.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-800 block">
                      Opis sytuacji tła sprawy (Co się wydarzyło w skrócie, bez owijania w bawełnę)
                    </label>
                    <textarea
                      rows={7}
                      value={narrative}
                      onChange={(e) => setNarrative(e.target.value)}
                      placeholder="Zapisz istotne fakty. np. Od marca ojciec nie pomaga w utrzymaniu. Trzykrotnie pisałam wiadomości z prośbą o pomoc finansową, ale mnie blokował. Dziecko choruje na asystę neurologiczną, koszt leków to około 300 zł miesięcznie..."
                      className="w-full bg-[#FCFCFA] p-4 rounded-xl border-2 border-slate-350 text-sm font-sans font-semibold text-slate-900 leading-relaxed focus:outline-none focus:border-amber-600 shadow-inner"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-800 block">
                      Czego dokładnie pragniesz ugodzić lub uzyskać jako wynik sprawy (Twoje cele)
                    </label>
                    <input
                      type="text"
                      value={caseGoals}
                      onChange={(e) => setCaseGoals(e.target.value)}
                      placeholder="np. Zabezpieczenie minimalnego spokoju dla dziecka, pozew o alimenty 800 zł, przydział asystenta rodziny na 3 miesiące."
                      className="w-full bg-[#FCFCFA] px-4 py-3 rounded-xl border-2 border-slate-350 text-sm font-sans font-semibold text-slate-900 focus:outline-none focus:border-amber-600 shadow-inner"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-xl font-serif font-black text-[#0f1412] mb-2">Krok 5: Przygotownik Wizyty Gotowy</h2>
                  <p className="text-sm text-[#1a211e] font-bold">
                    Wszystko zostało zorganizowawszy pomyślnie. Teraz możesz to bezpośrednio wydrukować jako czysty, czytelny dokument o wysokim kontraście lub zapisać na swoim komputerze.
                  </p>
                </div>

                {/* Live Preview Card */}
                <div className="bg-white border-2 border-slate-950 rounded-3xl p-6 md:p-10 text-left font-serif text-[#161a18] shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 py-2.5 px-6 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em]">
                    Podgląd karty przygotowawczej
                  </div>

                  <div className="space-y-6 pt-6">
                    <div className="border-b-2 border-slate-950 pb-6">
                      <span className="text-[10px] font-sans font-black uppercase tracking-widest text-[#8C6239]">SZABLON POUFNY • MOSTPOMOCY.PL</span>
                      <h3 className="text-2xl font-black text-[#0f1412] leading-tight mt-1">
                        Brief: {activeTemplate.label}
                      </h3>
                      <p className="text-xs text-slate-800 font-sans mt-1.5 font-bold">Inicjały: {initials || 'Anonimowy'} • Lokalizacja placówki: {city}</p>
                    </div>

                    <div className="space-y-2 border-b border-slate-200 pb-4">
                      <h4 className="text-xs font-sans font-black uppercase text-slate-800">Spakowane dokumenty do wzięcia:</h4>
                      <ul className="list-disc pl-5 font-sans text-xs text-slate-900 font-bold space-y-1">
                        {evidence.map((ev, i) => (
                          <li key={i} className={ev.checked ? 'text-emerald-700 font-black' : 'text-slate-900'}>
                            {ev.name} {ev.checked ? ' (✓ SPAKOWANY)' : ' [Do odnalezienia]'}
                            {ev.notes && <span className="block text-[10px] italic text-[#6B7280] font-normal">Uwaga: {ev.notes}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2 border-b border-slate-200 pb-4">
                      <h4 className="text-xs font-sans font-black uppercase text-slate-800">Pytania do zadania urzędnikowi:</h4>
                      <ul className="list-decimal pl-5 font-sans text-xs text-slate-900 font-bold space-y-1">
                        {questions.map((q, i) => (
                          <li key={i} className={q.checked ? 'opacity-50 text-slate-700' : 'text-slate-900'}>
                            {q.name}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2 border-b border-slate-200 pb-4">
                      <h4 className="text-xs font-sans font-black uppercase text-slate-900">Mój spis okoliczności (Opis do przekazania):</h4>
                      <p className="text-xs text-slate-900 font-sans leading-relaxed whitespace-pre-wrap font-semibold">
                        {narrative || 'Brak wpisanej historii.'}
                      </p>
                    </div>

                    <div className="space-y-2 pb-4">
                      <h4 className="text-xs font-sans font-black uppercase text-slate-800">Główny postulat / oczekiwany cel:</h4>
                      <p className="text-xs text-slate-900 font-sans leading-relaxed font-bold">
                        {caseGoals || 'Brak wpisanego celu.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Exporter actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={handlePrint}
                    className="flex items-center justify-center gap-3 py-4 bg-[#0f1412] hover:bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
                  >
                    <Printer className="w-5 h-5 text-amber-500" /> Drukuj lub zapisz PDF (Ctrl+P)
                  </button>
                  <button
                    onClick={handleDownloadTxt}
                    className="flex items-center justify-center gap-3 py-4 bg-white border-2 border-slate-400 hover:bg-slate-50 text-black rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
                  >
                    <Download className="w-5 h-5 text-slate-800" /> Pobierz plik tekstowy (.txt)
                  </button>
                </div>

                {/* Śląsk Match Info */}
                <div className="bg-amber-50/50 border-2 border-amber-200 p-6 rounded-[28px] text-left">
                  <span className="text-[10px] font-sans font-black uppercase tracking-wider text-amber-900 block mb-2">🚀 Twój punkt wsparcia</span>
                  <p className="text-sm font-serif text-[#0f1412] leading-relaxed mb-4 font-bold">
                    Na naszej mapie zgromadziliśmy i opisaliśmy darmowe placówki pomocy w miastach takich jak: <strong>Sosnowiec, Katowice, Dąbrowa Górnicza</strong>. Możesz sprawdzić mapę już teraz z zachowaniem Twojego szablonu.
                  </p>
                  <Link 
                    to="/mapa"
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-800 hover:text-amber-900 hover:underline"
                  >
                    Przejdź do mapy darmowych placówek <ArrowRight className="w-4 h-4 text-amber-600" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav buttons */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-200">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#1a211e] hover:text-black transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Wstecz
              </button>
            ) : (
              <button
                type="button"
                onClick={clearAllData}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-rose-800 hover:bg-rose-50 px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Wyczyść plik
              </button>
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => {
                  saveProgressDraft();
                  setStep(step + 1);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-700 transition-all shadow-sm cursor-pointer"
              >
                Dalej <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  saveProgressDraft();
                  alert('Przygotownik zapisany! Twoje dane pozostają bezpieczne lokalnie w Twojej przeglądarce.');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4 text-emerald-400" /> Zapisz w przeglądarce
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
