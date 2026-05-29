import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Printer, Download, Trash2, Save, Plus, CheckCircle2, 
  Calculator, ShieldCheck, AlertCircle, ArrowRight, ArrowLeft, 
  Building, Phone, ClipboardList, Info, FileText, Search
} from 'lucide-react';

interface ExpenseItem {
  id: string;
  category: string;
  description: string;
  amount: number;
}

interface EvidenceItem {
  id: string;
  name: string;
  checked: boolean;
  notes?: string;
}

const CATEGORIES = [
  { 
    id: 'alimenty', 
    label: 'Samodzielne Rodzicielstwo i Alimenty', 
    emoji: '👶',
    group: 'rodzina',
    groupLabel: 'Rodzina i Bezpieczeństwo',
    description: 'Chcę zabezpieczyć finansowo dziecko. Wygeneruje koszty szkoły, jedzenia, ubrań oraz dokumenty do pozwu.',
    defaultExpenses: [
      { category: 'Wyżywienie i higiena dziecka', description: 'Miesięczne zakupy spożywcze i środki higieny' },
      { category: 'Edukacja i szkoła', description: 'Podręczniki, przybory, ubezpieczenie, komitet rodzicielski' },
      { category: 'Odzież i obuwie', description: 'Ubrania sezonowe, obuwie codzienne i sportowe' },
      { category: 'Zdrowie i leki', description: 'Wizyty u lekarza pediatry, profilaktyka, leki i witaminy' },
      { category: 'Utrzymanie mieszkania (część dziecka)', description: 'Udział w opłatach za prąd, wodę, czynsz (np. 50%)' }
    ], defaultEvidence: [
      { name: 'Odpis skrócony aktu urodzenia dziecka' },
      { name: 'Zaświadczenie o zarobkach i dochodach rodzica (PIT, umowa)' },
      { name: 'Faktury imienne i rachunki za naukę/przedszkole' },
      { name: 'Zaświadczenie lekarskie w przypadku problemów zdrowotnych dziecka' },
      { name: 'Wyciąg z konta dokumentujący brak wpłat od drugiego rodzica' }
    ]
  },
  { 
    id: 'niepelnosprawnosc', 
    label: 'Osoby z niepełnosprawnością', 
    emoji: '♿',
    group: 'zdrowie',
    groupLabel: 'Zdrowie i Opieka',
    description: 'Dla osób niepełnosprawnych lub ich opiekunów. Generuje wydatki na rehabilitację, asystenturę i wnioski PFRON/ZUS.',
    defaultExpenses: [
      { category: 'Rehabilitacja i fizjoterapia', description: 'Turnusy rehabilitacyjne lub prywatne zajęcia ruchowe' },
      { category: 'Medycyna, leki i środki pomocnicze', description: 'Leki stałe, pieluchomajtki, cewniki, opaski uciskowe' },
      { category: 'Serwis i zakup sprzętu ortopedycznego', description: 'Serwis wózka, aparaty słuchowe, protezy, podkłady, materace przeciwodleżynowe' },
      { category: 'Dostosowanie otoczenia i barier', description: 'Amortyzacja barier architektonicznych, dostosowanie łazienki, asysta osobista' },
      { category: 'Dojazdy na zabiegi i wizyty', description: 'Transport medyczny lub dojazdy własne na regularną rehabilitację' }
    ], defaultEvidence: [
      { name: 'Orzeczenie o stopniu niepełnosprawności (Krajowy lub Powiatowy Zespół)' },
      { name: 'Karty informacyjne leczenia szpitalnego oraz opinie lekarskie (historia choroby)' },
      { name: 'Faktury imienne i rachunki za zakup / serwis sprzętu rehabilitacyjnego' },
      { name: 'Zaświadczenie o pobieraniu/odmowie zasiłku pielęgnacyjnego lub świadczenia' },
      { name: 'Zalecenie lekarskie od specjalisty (np. ortopedy, neurologa) wskazujące konieczność rehabilitacji' }
    ]
  },
  { 
    id: 'sytuacja-materialna', 
    label: 'Sytuacja materialna i Zasiłki (MOPS)', 
    emoji: '🍲',
    group: 'byt',
    groupLabel: 'Pieniądze i Byt',
    description: 'Niski dochód, nagłe pogorszenie bytu. Przygotuje kalkulator przeżycia oraz dokumenty o dochodach dla opieki społecznej.',
    defaultExpenses: [
      { category: 'Podstawowe wyżywienie i higiena', description: 'Minimum egzystencjalne żywnościowe oraz podstawowe środki czyszczące' },
      { category: 'Czynsz i podstawowe media', description: 'Opłaty eksploatacyjne, prąd, woda, odpływ ścieków, śmieci' },
      { category: 'Opał i ogrzewanie', description: 'Opał na zimę (węgiel, drewno), gaz, ogrzewanie centralne' },
      { category: 'Podstawowa odzież i leki', description: 'Sezonowe ubrania pierwszej potrzeby oraz podstawowe leki' }
    ], defaultEvidence: [
      { name: 'Decyzje o przyznaniu lub odmowie zasiłków celowych/okresowych z MOPS / OPS' },
      { name: 'Zaświadczenie o statusie osoby bezrobotnej z Urzędu Pracy (PUP)' },
      { name: 'Zestawienie roczne PIT lub zaświadczenie o dochodach / braku obrotów z Urzędu Skarbowego' },
      { name: 'Kopia umowy najmu lokalu / przydziału socjalnego wraz z ostatnimi rachunkami' },
      { name: 'Zaświadczenie o korzystaniu z darmowego programu wsparcia żywnościowego (FEAD)' }
    ]
  },
  { 
    id: 'zadluzenie', 
    label: 'Zadłużenie i restrukturyzacja', 
    emoji: '📉',
    group: 'byt',
    groupLabel: 'Pieniądze i Byt',
    description: 'Naciski komornika, pętle zadłużenia. Wykaz wezwań do zapłaty, ugod ratalnych oraz potrąceń egzekucyjnych.',
    defaultExpenses: [
      { category: 'Spłaty rat ugodowych (wierzyciele)', description: 'Minimalne regularne miesięczne kwoty rat ustalonych w ugodach' },
      { category: 'Koszty egzekucji i opłaty komornicze', description: 'Potrącenia z emerytury, renty lub wynagrodzenia na rzecz komorników' },
      { category: 'Koszty pomocy prawnej / upadłościowej', description: 'Koszty doradcy restrukturyzacyjnego lub prawnika prowadzącego sprawę' },
      { category: 'Zaległości mieszkaniowe (ochrona przed eksmisją)', description: 'Minimalne spłaty zaległości czynszowych zapobiegające eksmisji' }
    ], defaultEvidence: [
      { name: 'Kopie nakazów zapłaty, wezwań do zapłaty i ostatecznych wezwań przedsądowych' },
      { name: 'Pisma od Komorników Sądowych (zawiadomienia o wszczęciu egzekucji)' },
      { name: 'Umowy kredytowe, pożyczkowe i chwilówki (wraz z regulaminami opłat)' },
      { name: 'Raport z Biura Informacji Kredytowej (BIK) określający stan faktyczny długu' },
      { name: 'Wyciągi z kont wskazujące zajęcia rachunków bankowych' }
    ]
  },
  { 
    id: 'uzaleznienia', 
    label: 'Uzależnienia i Terapie', 
    emoji: '🌱',
    group: 'terapie',
    groupLabel: 'Terapie',
    description: 'Terapia we własnym zakresie lub kogoś bliskiego. Wyliczy koszty sesji, wizyt u psychiatry i dokumenty dla GKRPA.',
    defaultExpenses: [
      { category: 'Prywatne sesje terapii uzależnień', description: 'Regularna opieka terapeutyczna u certyfikowanego specjalisty psychologii uzależnień' },
      { category: 'Farmakoterapia i wsparcie lekarskie', description: 'Leki ułatwiające utrzymanie abstynencji, wizyty u psychiatry' },
      { category: 'Dojazdy i pobyt w ośrodkach lub mityngach', description: 'Koszty paliwa / biletów na mityngi AA, Al-Anon lub stacjonarne ośrodki terapeutyczne' }
    ], defaultEvidence: [
      { name: 'Zaświadczenie o udziale w regularnej terapii (dziennej lub ambulatoryjnej)' },
      { name: 'Opinia terapeutyczna lub lekarska dotycząca rokowań i postępów w leczeniu' },
      { name: 'Kopia wniosku złożonego do Gminnej Komisji Rozwiązywania Problemów Alkoholowych (GKRPA)' },
      { name: 'Zaświadczenie o odbyciu detoksykacji szpitalnej lub terapii stacjonarnej' }
    ]
  },
  { 
    id: 'przemoc', 
    label: 'Przemoc domowa i Bezpieczeństwo', 
    emoji: '🛡️',
    group: 'rodzina',
    groupLabel: 'Rodzina i Bezpieczeństwo',
    description: 'Procedury chroniące: Niebieska Karta, bezpieczne schronienie, relokacja, obdukcje medyczne.',
    defaultExpenses: [
      { category: 'Terapia traumy i psycholog', description: 'Wsparcie psychoterapeutyczne dedykowane dla ofiar przemocy' },
      { category: 'Awaryjne lokum i relokacja', description: 'Koszty wynajmu awaryjnego, kaucje lub koszty przeprowadzki' },
      { category: 'Konsultacje prawne (zakazy zbliżania)', description: 'Doradztwo prawne przy procedurze eksmisji sprawcy oraz zakazach zbliżania' }
    ], defaultEvidence: [
      { name: 'Kopia Niebieskiej Karty (Część A) lub zaświadczenie o wszczętej procedurze ochrony rodzin' },
      { name: 'Obdukcje lekarskie wykazujące widoczne i udokumentowane ślady przemocy' },
      { name: 'Notatki urzędowe Policji z interwencji domowych' },
      { name: 'Dowody w postaci SMS-ów, nagrań telefonicznych, e-maili (groźby karalne)' },
      { name: 'Zawiadomienie o wszczęciu dochodzenia / oskarżenia prokuratorskiego' }
    ]
  },
  { 
    id: 'zdrowie', 
    label: 'Kryzys Zdrowia Psychicznego', 
    emoji: '🧠',
    group: 'zdrowie',
    groupLabel: 'Zdrowie i Opieka',
    description: 'Depresja, stany lękowe, bipolarność. Prywatne wizyty, leki stałe, zaświadczenia o niezdolności lub wypisy ze szpitali.',
    defaultExpenses: [
      { category: 'Wizyty psychiatryczne (prywatne)', description: 'Konsultacje lekarskie u psychiatry pozwalające ominąć kolejki NFZ' },
      { category: 'Leki stabilizujące i psychotropy', description: 'Koszty miesięczne leków przepisanych na stałe przez lekarza' },
      { category: 'Regularna psychoterapia indywidualna', description: 'Comiesięczny pakiet sesji u certyfikowanego psychoterapeuty' }
    ], defaultEvidence: [
      { name: 'Karty informacyjne leczenia szpitalnego (wypisy z oddziałów psychiatrycznych)' },
      { name: 'Kopia historii recept lub wygenerowany wykaz leków z IKP' },
      { name: 'Pisemna opinia lekarza psychiatry lub psychologa klinicznego o stanie zdrowia' },
      { name: 'Skierowanie na psychoterapię NFZ wraz z potwierdzeniem czasu oczekiwania na miejsce w kolejce' }
    ]
  },
  { 
    id: 'onkologia', 
    label: 'Choroby Onkologiczne (Nowotwór)', 
    emoji: '🎗️',
    group: 'zdrowie',
    groupLabel: 'Zdrowie i Opieka',
    description: 'Wsparcie onkologiczne: dieta osłonowa (Nutridrinki), częste dojazdy do Gliwic/Katowic i karta DiLO.',
    defaultExpenses: [
      { category: 'Nierefundowane leki onkologiczne i suplementy', description: 'Środki wzmacniające, leki celowane, preparaty osłonowe' },
      { category: 'Kliniczna dieta wysokobiałkowa', description: 'Nutridrinki, specjalistyczne odżywki medyczne zalecane przy chemioterapii' },
      { category: 'Dojazdy do centrów onkologicznych', description: 'Koszty częstego dojazdu do wyspecjalizowanych szpitali (np. Gliwice, Katowice)' },
      { category: 'Zajęcia / Konsultacje z psychoonkologiem', description: 'Regularne wsparcie emocjonalne ułatwiające przejście procesu walki z nowotworem' }
    ], defaultEvidence: [
      { name: 'Karta Diagnostyki i Leczenia Onkologicznego (Karta DiLO)' },
      { name: 'Wyniki badań histopatologicznych oraz opisy badań obrazowych (TK, MRI, PET)' },
      { name: 'Karty wypisowe ze szpitala / Oddziałów Chirurgii Onkologicznej i Chemioterapii' },
      { name: 'Zaświadczenie lekarza onkologa potwierdzające trwający program lekowy' }
    ]
  },
  { 
    id: 'seniorzy', 
    label: 'Seniorzy i usługi opiekuńcze', 
    emoji: '👵',
    group: 'zdrowie',
    groupLabel: 'Zdrowie i Opieka',
    description: 'Choroby wieku podeszłego, odpłatność za usługi opiekuńcze MOPS i środki higieny geriatrycznej.',
    defaultExpenses: [
      { category: 'Usługi opiekuńcze MOPS lub prywatne', description: 'Miesięczny koszt odpłatności za asystenta seniora / usługi opiekuńcze' },
      { category: 'Preparaty geriatryczne i leki stałe', description: 'Niezbędne lekarstwa na nadciśnienie, cukrzycę, stawy, suplementy' },
      { category: 'Podkłady i środki higieny geriatrycznej', description: 'Rachunki za pieluchomajtki, podkłady medyczne, maści przeciwodleżynowe' },
      { category: 'Dzienny Dom Opieki / Klub Seniora', description: 'Drobne opłaty pobytowe i obiady w aktywizujących seniora placówkach' }
    ], defaultEvidence: [
      { name: 'Decyzja MOPS / OPS o przyznaniu i wysokości odpłatności za usługi opiekuńcze' },
      { name: 'Zaświadczenie lekarza rodzinnego o konieczności stałej opieki osób trzecich' },
      { name: 'Orzeczenie o niezdolności do samodzielnej egzystencji, stopniu niepełnosprawności (ZUS)' },
      { name: 'Decyzja emerytalna / rentowa z uwzględnieniem dodatku pielęgnacyjnego' }
    ]
  },
  { 
    id: 'inne', 
    label: 'Nagłe losowe kryzysy życiowe', 
    emoji: '🔥',
    group: 'byt',
    groupLabel: 'Pieniądze i Byt',
    description: 'Zdarzenia gwałtowne (pożar, zalanie mieszkania, nawałnica). Protokół zniszczeń, zdjęcia strat, odmowa pracy.',
    defaultExpenses: [
      { category: 'Czynsz i opłaty bieżące całego domu', description: 'Opłaty za wynajem lub czynsz spółdzielczy' },
      { category: 'Wyżywienie całego gospodarstwa domowego', description: 'Suma zakupów spożywczych na miesiąc' },
      { category: 'Wydatki na nagłe awarie losowe', description: 'Koszty napraw rur, pieca grzewczego, przeciekającego dachu itp.' }
    ], defaultEvidence: [
      { name: 'Zgłoszenie strat / protokół opisujący zdarzenie losowe (Policja, Straż Pożarna)' },
      { name: 'Fotografie szkód bytowych uniemożliwiających prawidłowe funkcjonowanie rodziny' },
      { name: 'Zaświadczenie lekarskie o nagłym zachorowaniu uniemożliwiającym podjęcie pracy' },
      { name: 'Wniosek o pomoc celową zarejestrowany w lokalnym Ośrodku Pomocy Społecznej' }
    ]
  }
];

export default function TeczkaSprawy() {
  const [step, setStep] = useState(1);
  const [formCategory, setFormCategory] = useState('alimenty');

  // Client info state to preserve privacy - emphasize Initials in placeholder
  const [initials, setInitials] = useState('');
  const [city, setCity] = useState('Sosnowiec');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [narrative, setNarrative] = useState('');
  const [caseGoals, setCaseGoals] = useState('');

  // Table items states
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);

  // Category filtering and search state for Step 1
  const [categorySearch, setCategorySearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');

  const filteredCategories = useMemo(() => {
    return CATEGORIES.filter(cat => {
      const matchesGroup = selectedGroup === 'all' || cat.group === selectedGroup;
      const matchesSearch = categorySearch === '' || 
        cat.label.toLowerCase().includes(categorySearch.toLowerCase()) ||
        cat.description.toLowerCase().includes(categorySearch.toLowerCase()) ||
        cat.groupLabel.toLowerCase().includes(categorySearch.toLowerCase());
      return matchesGroup && matchesSearch;
    });
  }, [categorySearch, selectedGroup]);

  // Helpers for adding dynamic entries
  const [newExpCategory, setNewExpCategory] = useState('');
  const [newExpDesc, setNewExpDesc] = useState('');
  const [newExpAmount, setNewExpAmount] = useState('');
  const [newEvName, setNewEvName] = useState('');

  // Load from localStorage or defaults
  useEffect(() => {
    const saved = localStorage.getItem('mostpomocy_teczka_draft');
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
        if (parsed.expenses) setExpenses(parsed.expenses);
        if (parsed.evidence) setEvidence(parsed.evidence);
      } catch (e) {
        console.error('Error loading draft', e);
      }
    } else {
      // Load default template according to selected category
      loadCategoryDefaults(formCategory);
    }
  }, []);

  const loadCategoryDefaults = (catId: string) => {
    const matched = CATEGORIES.find(c => c.id === catId);
    if (matched) {
      const defaultExps: ExpenseItem[] = matched.defaultExpenses.map((e, index) => ({
        id: `def-exp-${index}-${catId}`,
        category: e.category,
        description: e.description,
        amount: 0
      }));
      const defaultEv: EvidenceItem[] = matched.defaultEvidence.map((e, index) => ({
        id: `def-ev-${index}-${catId}`,
        name: e.name,
        checked: false,
        notes: ''
      }));
      setExpenses(defaultExps);
      setEvidence(defaultEv);
    }
  };

  // Save progress draft
  const saveProgressDraft = () => {
    const cargo = {
      formCategory,
      initials,
      city,
      phone,
      email,
      narrative,
      caseGoals,
      expenses,
      evidence
    };
    localStorage.setItem('mostpomocy_teczka_draft', JSON.stringify(cargo));
  };

  const clearAllData = () => {
    if (window.confirm('Czy na pewno chcesz usunąć wszystkie wprowadzone dane z tej przeglądarki? Ta operacja jest nieodwracalna.')) {
      localStorage.removeItem('mostpomocy_teczka_draft');
      setInitials('');
      setPhone('');
      setEmail('');
      setNarrative('');
      setCaseGoals('');
      setStep(1);
      loadCategoryDefaults(formCategory);
    }
  };

  const totalExpenses = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }, [expenses]);

  const addCustomExpense = () => {
    if (!newExpCategory) return;
    const item: ExpenseItem = {
      id: `custom-exp-${Date.now()}`,
      category: newExpCategory,
      description: newExpDesc,
      amount: Number(newExpAmount) || 0
    };
    setExpenses([...expenses, item]);
    setNewExpCategory('');
    setNewExpDesc('');
    setNewExpAmount('');
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const updateExpenseAmount = (id: string, val: number) => {
    setExpenses(expenses.map(e => e.id === id ? { ...e, amount: isNaN(val) ? 0 : val } : e));
  };

  const addCustomEvidence = () => {
    if (!newEvName) return;
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

  const toggleEvidenceCheck = (id: string) => {
    setEvidence(evidence.map(e => e.id === id ? { ...e, checked: !e.checked } : e));
  };

  const updateEvidenceNote = (id: string, notes: string) => {
    setEvidence(evidence.map(e => e.id === id ? { ...e, notes } : e));
  };

  const handleDownloadTxt = () => {
    const matchedCategory = CATEGORIES.find(c => c.id === formCategory)?.label || formCategory;
    const dateStr = new Date().toLocaleDateString('pl-PL');
    
    let text = `==================================================\n`;
    text += `             TECZKA SPRAWY - BRIEF KONSULTACYJNY\n`;
    text += `             MostPomocy.pl - Portal Wsparcia\n`;
    text += `             Wygenerowano dnia: ${dateStr}\n`;
    text += `==================================================\n\n`;
    
    text += `I. PODSTAWOWE INFORMACJE O SPRAWIE\n`;
    text += `----------------------------------\n`;
    text += `Rodzaj Sprawy: ${matchedCategory}\n`;
    text += `Inicjały wnioskodawcy / Sygnatura: ${initials || 'Anonimowy'}\n`;
    text += `Miejscowość: ${city}\n`;
    if (phone) text += `Telefon kontaktowy: ${phone}\n`;
    if (email) text += `E-mail kontaktowy: ${email}\n`;
    text += `\n`;
    
    text += `II. KOSZTORYS UTALENTOWANY I WYDATKI (Suma: ${totalExpenses.toFixed(2)} PLN/mies)\n`;
    text += `---------------------------------------------------------\n`;
    expenses.forEach((e, i) => {
      text += `${i+1}. ${e.category} [${e.description || 'brak opisu'}]: ${e.amount} PLN\n`;
    });
    text += `ŁĄCZNE MIESIĘCZNE ZOBOWIĄZANIE: ${totalExpenses.toFixed(2)} PLN\n\n`;
    
    text += `III. OPIS SYTUACJI I TŁO FAKTYCZNE\n`;
    text += `----------------------------------\n`;
    text += `${narrative || 'Nie podano opisu sytuacji.'}\n\n`;
    
    text += `IV. WYSUWANE ŻĄDANIA I CELE\n`;
    text += `---------------------------\n`;
    text += `${caseGoals || 'Nie podano żądań i oczekiwań.'}\n\n`;
    
    text += `V. SPOKÓJ I DOKUMENTY (ZEBRANE DOWODY / CHECKLISTA)\n`;
    text += `-----------------------------------------------------\n`;
    const checkedEvList = evidence.filter(e => e.checked);
    if (checkedEvList.length > 0) {
      checkedEvList.forEach((e, i) => {
        text += `[X] Oznaczony: ${e.name} ${e.notes ? `(${e.notes})` : ''}\n`;
      });
    } else {
      text += `Nie oznaczono żadnych gotowych dowodów.\n`;
    }
    
    text += `\n==================================================\n`;
    text += `Wszystkie powyższe dane zostały sporządzone wyłącznie w celach\n`;
    text += `organizacyjnych przed profesjonalną poradą u adwokata / w MOPS.\n`;
    text += `Zgromadzone dane zapisywane są tylko w pamięci podręcznej przeglądarki.\n`;
    text += `==================================================\n`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Teczka_Sprawy_${initials || 'Anonim'}_${city}.txt`;
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
      <nav className="max-w-7xl mx-auto px-4 sm:px-10 py-6 text-xs font-black uppercase tracking-widest text-[#6B7280] print:hidden">
        <Link to="/" className="hover:text-black transition-colors">Start</Link>
        <span className="mx-2 opacity-30">›</span>
        <span className="text-[#0f1412]">Teczka Sprawy</span>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-10">
        {/* Editorially Designed Header */}
        <header className="py-8 text-left border-b border-slate-200 mb-12 print:hidden">
          <span className="text-[#6B7280] font-black text-[10px] uppercase tracking-[0.25em] block mb-3">Narzędzie Przygotowawcze Pomocy Społecznej</span>
          <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-[#0f1412] leading-none mb-6">
            Teczka Sprawy & Kosztorys
          </h1>
          <p className="text-[#1a211e] text-base leading-relaxed max-w-2xl font-serif">
            Przed wizytą u prawnika, w MOPS lub złożeniem pozwu o alimenty warto usystematyzować fakty i wyliczenia. 
            Wygeneruj bezpieczny brief konsultacyjny. Całość danych jest przechowywana lokalnie u Ciebie.
          </p>

          {/* Privacy Alert */}
          <div className="mt-8 bg-[#FFFDF9] border-l-4 border-slate-900 rounded-r-2xl p-5 flex items-start gap-4 shadow-sm">
            <ShieldCheck className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-[#1a211e] font-medium leading-relaxed">
              <strong className="text-black font-extrabold uppercase tracking-wide block mb-1">Gwarancja Pełnej Anonimowości</strong>
              Dane są zapisywane wyłącznie w pamięci lokalnej tego komputera. Nie wysyłamy niczego na serwery – możesz posługiwać się samymi inicjałami w celu zachowania absolutnej dyskrecji.
            </div>
          </div>
        </header>

        {/* Printable View (Hidden in Screen, Visible in Print) */}
        <div className="hidden print:block text-left font-serif text-black p-4 space-y-8 bg-white">
          <div className="text-center border-b-2 border-black pb-6">
            <h1 className="text-2xl font-bold uppercase tracking-wide">Brief Przygotowawczy sprawy Konsultacji</h1>
            <p className="text-sm italic">Wygenerowany automatycznie za pośrednictwem mostpomocy.pl</p>
            <p className="text-xs">Data sporządzenia: {new Date().toLocaleDateString('pl-PL')}</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold border-b border-black pb-1 uppercase">I. Dane Identyfikacyjne i Kontekst</h2>
            <div className="grid grid-cols-2 gap-4 text-sm font-sans">
              <div><strong>Kategoria Sprawy:</strong> {CATEGORIES.find(c => c.id === formCategory)?.label || formCategory}</div>
              <div><strong>Sygnatura / Inicjały:</strong> {initials || 'Anonimowy'}</div>
              <div><strong>Gmina / Miasto:</strong> {city}</div>
              {phone && <div><strong>Telefon:</strong> {phone}</div>}
              {email && <div><strong>E-mail:</strong> {email}</div>}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold border-b border-black pb-1 uppercase">II. Kosztorys Miesięcznego Utrzymania ({totalExpenses.toFixed(2)} PLN)</h2>
            <table className="w-full text-left text-sm border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-150">
                  <th className="border border-gray-300 p-2">Kategoria Wydatków</th>
                  <th className="border border-gray-300 p-2">Opis / Komentarz</th>
                  <th className="border border-gray-300 p-2 text-right">Kwota (PLN)</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((e, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2 font-bold">{e.category}</td>
                    <td className="border border-gray-300 p-2 text-gray-700">{e.description}</td>
                    <td className="border border-gray-300 p-2 text-right font-bold">{e.amount.toFixed(2)} PLN</td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td colSpan={2} className="border border-gray-300 p-2 font-bold text-right uppercase">Łączna kwota miesięcznie:</td>
                  <td className="border border-gray-300 p-2 text-right font-black text-base">{totalExpenses.toFixed(2)} PLN</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold border-b border-black pb-1 uppercase">III. Stan Faktyczny & Opis Sytuacji</h2>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{narrative || 'Nie podano opisu sytuacji.'}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold border-b border-black pb-1 uppercase">IV. Wysuwane Żądania</h2>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{caseGoals || 'Nie podano oczekiwanych żądań powództwa.'}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold border-b border-black pb-1 uppercase">V. Wykaz Dokumentów i Dowodów</h2>
            <div className="text-sm space-y-1">
              {evidence.filter(e => e.checked).map((ev, i) => (
                <div key={i} className="flex gap-2">
                  <span>[X]</span>
                  <span><strong>{ev.name}</strong> {ev.notes ? `— Uwagi: ${ev.notes}` : ''}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="pt-12 text-xs text-center border-t border-gray-200 font-sans">
            Wydruk przygotowano samodzielnie na podstawie zintegrowanego asystenta prawnego i bazy wiedzy mostpomocy.pl.
          </div>
        </div>

        {/* Screen Interactive Assistant UI (Hidden in Print) */}
        <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm p-6 md:p-10 text-left print:hidden">
          {/* Progress Indicators */}
          <div className="flex justify-between items-center mb-10 overflow-x-auto pb-4 gap-4 border-b border-slate-100">
            {[
              { num: 1, label: 'Kategoria i Dane' },
              { num: 2, label: 'Kosztorys Wydatków' },
              { num: 3, label: 'Stan Faktyczny' },
              { num: 4, label: 'Wykaz Dowodów' },
              { num: 5, label: 'Podsumowanie i Druk' }
            ].map(s => (
              <button
                key={s.num}
                onClick={() => s.num <= step ? setStep(s.num) : null}
                className="flex items-center gap-2.5 shrink-0 focus:outline-none"
                disabled={s.num > step}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-sans text-xs font-black transition-all ${
                  step === s.num 
                    ? 'bg-black text-white' 
                    : step > s.num 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-[#FBF9F4] text-slate-400'
                }`}>
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${step === s.num ? 'text-black' : 'text-slate-400'}`}>
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
                  <h2 className="text-xl font-serif font-black text-[#0f1412] mb-1">Krok 1: Wybór zagadnienia, w którym potrzebujesz pomocy</h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Każdy temat automatycznie przygotuje dla Ciebie kalkulator miesięcznych kosztów oraz listę kluczowych dokumentów urzędowych. Wybierz ten, który najlepiej odzwierciedla Twoją sytuację:
                  </p>
                </div>

                {/* Szybka Wyszukiwarka i Sektor Filtrowania */}
                <div className="space-y-4">
                  {/* Search Input */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Search className="w-5 h-5" />
                    </span>
                    <input
                      type="text"
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      placeholder="Co chcesz załatwić? Wpisz np. alimenty, MOPS, niepełnosprawność, komornik, depresja, onkologia..."
                      className="w-full bg-[#FBF9F4] pl-12 pr-12 py-3.5 rounded-2xl border border-slate-200 focus:border-black focus:ring-1 focus:ring-black/5 text-sm font-sans font-medium text-black placeholder-slate-400 transition-all shadow-xs"
                    />
                    {categorySearch && (
                      <button
                        type="button"
                        onClick={() => setCategorySearch('')}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-slate-400 hover:text-black transition-colors"
                      >
                        Wyczyść
                      </button>
                    )}
                  </div>

                  {/* Horizontal Category Group pills */}
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-2 px-2 scroll-smooth">
                    {[
                      { id: 'all', label: '🗂️ Wszystkie', count: CATEGORIES.length },
                      { id: 'rodzina', label: '👨‍👩‍👧‍👦 Rodzina i Bezpieczeństwo', count: CATEGORIES.filter(c => c.group === 'rodzina').length },
                      { id: 'zdrowie', label: '🏥 Zdrowie i Opieka', count: CATEGORIES.filter(c => c.group === 'zdrowie').length },
                      { id: 'byt', label: '💸 Pieniądze i Byt', count: CATEGORIES.filter(c => c.group === 'byt').length },
                      { id: 'terapie', label: '🌱 Terapie', count: CATEGORIES.filter(c => c.group === 'terapie').length }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setSelectedGroup(tab.id)}
                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap shrink-0 border ${
                          selectedGroup === tab.id
                            ? 'bg-black text-white border-black shadow-xs'
                            : 'bg-[#FBF9F4] text-slate-600 border-slate-200 hover:border-slate-450 hover:bg-[#FAF7F0]'
                        }`}
                      >
                        {tab.label} ({tab.count})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtered grid output */}
                {filteredCategories.length === 0 ? (
                  <div className="text-center py-10 bg-[#FBF9F4] rounded-2xl border border-dashed border-slate-200 p-6 space-y-3">
                    <span className="text-3xl filter drop-shadow-xs select-none">🧐</span>
                    <p className="font-serif font-black text-slate-700 text-base">Nie znaleźliśmy dokładnego dopasowania</p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      Wpisz krótsze słowo kluczowe (np. "mops" albo "rak") lub zresetuj filtry, aby zobaczyć pełną listę zagadnień.
                    </p>
                    <button
                      type="button"
                      onClick={() => { setCategorySearch(''); setSelectedGroup('all'); }}
                      className="px-5 py-2.5 bg-black text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-900 transition-colors"
                    >
                      Pokaż wszystkie zagadnienia
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCategories.map(cat => {
                      const isSelected = formCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setFormCategory(cat.id);
                            loadCategoryDefaults(cat.id);
                          }}
                          className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[220px] focus:outline-none relative group ${
                            isSelected 
                              ? 'border-black bg-[#FBF9F4] ring-1 ring-black/10 shadow-xs' 
                              : 'border-slate-200 hover:border-slate-350 bg-white hover:shadow-xs'
                          }`}
                        >
                          <div className="space-y-3.5 w-full">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl shrink-0 filter drop-shadow-xs select-none" role="img" aria-label={cat.label}>
                                  {cat.emoji}
                                </span>
                                <div>
                                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">
                                    {cat.groupLabel}
                                  </span>
                                  <h3 className="font-serif font-black text-sm text-[#0f1412] leading-tight">
                                    {cat.label}
                                  </h3>
                                </div>
                              </div>
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                                isSelected 
                                  ? 'border-emerald-600 bg-emerald-100 text-emerald-800' 
                                  : 'border-slate-200 group-hover:border-slate-400 text-transparent'
                              }`}>
                                <CheckCircle2 className={`w-3 h-3 transition-transform ${isSelected ? 'scale-100' : 'scale-0'}`} />
                              </div>
                            </div>

                            <p className="text-xs text-slate-500 font-sans leading-relaxed">
                              {cat.description}
                            </p>

                            <div className="pt-3 border-t border-slate-100 space-y-1.5">
                              <div className="flex items-start gap-1.5 text-[11px] text-slate-600 leading-tight">
                                <span className="font-extrabold shrink-0 text-amber-700">📊 Gotowy kosztorys:</span>
                                <span className="font-sans line-clamp-1 italic text-slate-500">
                                  {cat.defaultExpenses.map(e => e.category).join(', ')}
                                </span>
                              </div>
                              <div className="flex items-start gap-1.5 text-[11px] text-slate-600 leading-tight">
                                <span className="font-extrabold shrink-0 text-emerald-700">📂 Wykaz dowodów:</span>
                                <span className="font-sans line-clamp-1 italic text-slate-500">
                                  {cat.defaultEvidence.map(e => e.name).join(', ')}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 flex justify-between items-center w-full text-[9px] uppercase font-black tracking-widest border-t border-slate-100">
                            <span className={isSelected ? 'text-black' : 'text-slate-400'}>
                              {isSelected ? 'Wybrano tę sprawę' : 'Wybierz ten temat'}
                            </span>
                            <span className={`transition-transform duration-300 ${isSelected ? 'translate-x-0 font-extrabold text-emerald-800' : 'group-hover:translate-x-1 text-slate-400'}`}>
                              {isSelected ? 'Wybrane i załadowane ✓' : 'Kliknij, aby wybrać →'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Basic client info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-[#6B7280]">
                      Inicjały lub Pseudonim (Bezpieczeństwo)
                    </label>
                    <input
                      type="text"
                      value={initials}
                      onChange={(e) => setInitials(e.target.value)}
                      placeholder="np. K.K. (zalecane ze względów prywatności)"
                      className="w-full bg-[#FBF9F4] px-4 py-3 rounded-xl border border-slate-200 text-sm font-sans font-medium text-[#1a211e]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-[#6B7280]">
                      Twoja Gmina / Najbliższe Miasto
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#FBF9F4] px-4 py-3 rounded-xl border border-slate-200 text-sm font-sans font-medium text-[#1a211e]"
                    >
                      <option value="Sosnowiec">Sosnowiec</option>
                      <option value="Katowice">Katowice</option>
                      <option value="Dąbrowa Górnicza">Dąbrowa Górnicza</option>
                      <option value="Inne">Inne / Poza Śląskiem</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-[#6B7280]">
                      Telefon do kontaktu (Opcjonalnie)
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Tylko jeśli chcesz wydrukować dla prawnika"
                      className="w-full bg-[#FBF9F4] px-4 py-3 rounded-xl border border-slate-200 text-sm font-sans font-medium text-[#1a211e]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-[#6B7280]">
                      E-mail (Opcjonalnie)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Tylko na potrzeby Twojego wydruku"
                      className="w-full bg-[#FBF9F4] px-4 py-3 rounded-xl border border-slate-200 text-sm font-sans font-medium text-[#1a211e]"
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
                  <h2 className="text-xl font-serif font-black text-[#0f1412] mb-2">Krok 2: Kalkulator Miesięcznych Kosztów Utrzymania</h2>
                  <p className="text-sm text-slate-500">
                    Sądy Rodzinne i pracownicy socjalni szacują realną kwotę wsparcia na podstawie rzeczywistych wydatków. Wpisz średnie koszty miesięczne w złotych.
                  </p>
                </div>

                {/* Expenses spreadsheet style */}
                <div className="space-y-4">
                  {expenses.map((e) => (
                    <div 
                      key={e.id}
                      className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-[#FBF9F4] border border-slate-200/60 p-4 rounded-2xl"
                    >
                      <div className="flex-1 text-left">
                        <span className="text-[10px] font-black uppercase text-[#6B7280]">{e.category}</span>
                        <p className="text-xs text-slate-500 italic mt-0.5">{e.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="relative w-36">
                          <input
                            type="number"
                            value={e.amount || ''}
                            onChange={(evt) => updateExpenseAmount(e.id, parseFloat(evt.target.value) || 0)}
                            placeholder="0.00"
                            className="w-full bg-white pr-12 pl-4 py-2.5 rounded-xl border border-slate-200 text-sm font-sans font-black text-right text-[#1a211e]"
                          />
                          <span className="absolute inset-y-0 right-4 flex items-center text-xs font-black text-slate-400">PLN</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExpense(e.id)}
                          className="p-2 bg-white hover:bg-slate-100 rounded-lg text-slate-400 hover:text-rose-600 transition-colors border border-slate-200"
                          title="Usuń pozycję"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Adding dynamic record */}
                <div className="bg-slate-50 border border-slate-250 rounded-2xl p-6 space-y-4">
                  <h3 className="text-xs font-black uppercase text-black flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Dodaj Własny Koszt / Wydatek
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Porcja (np. Rehabilitacja)"
                      value={newExpCategory}
                      onChange={(e) => setNewExpCategory(e.target.value)}
                      className="bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-[#1a211e]"
                    />
                    <input
                      type="text"
                      placeholder="Szczegóły (np. dojazdy do Sosnowca)"
                      value={newExpDesc}
                      onChange={(e) => setNewExpDesc(e.target.value)}
                      className="bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-[#1a211e]"
                    />
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Kwota"
                        value={newExpAmount}
                        onChange={(e) => setNewExpAmount(e.target.value)}
                        className="w-full bg-white pr-12 pl-4 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-right text-[#1a211e]"
                      />
                      <span className="absolute inset-y-0 right-4 flex items-center text-xs font-black text-slate-400">PLN</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addCustomExpense}
                    className="w-full py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all"
                  >
                    Dodaj do kosztorysu
                  </button>
                </div>

                {/* Summary footer */}
                <div className="flex justify-between items-center bg-black text-white p-6 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Calculator className="w-6 h-6 text-emerald-400" />
                    <span className="text-xs font-black uppercase tracking-wider">Szacowana suma miesięczna:</span>
                  </div>
                  <span className="text-2xl font-serif font-black tracking-tight">{totalExpenses.toFixed(2)} PLN</span>
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
                  <h2 className="text-xl font-serif font-black text-[#0f1412] mb-2">Krok 3: Stan Faktyczny & Opis Sytuacji</h2>
                  <p className="text-sm text-slate-500">
                    Sądy i MOPS opierają się na kronice wydarzeń. Opisz w kilku zdaniach swoją aktualną sytuację bytowo-finansową oraz to, do czego dążysz.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-[#6B7280] block">
                      Tło Sprawy i Fakty
                    </label>
                    <textarea
                      rows={6}
                      value={narrative}
                      onChange={(e) => setNarrative(e.target.value)}
                      placeholder="np. Od sierpnia 2025 roku ojciec/matka dziecka nie przyczynia się do opłat i utrzymania gospodarstwa. Dziecko wymaga stałego leczenia stomatologicznego oraz korepetycji. Dotychczasowe próby polubownego załatwienia sprawy na drodze mediacji w Katowicach zakończyły się fiaskiem..."
                      className="w-full bg-[#FBF9F4] p-4 rounded-xl border border-slate-200 text-sm font-sans font-medium text-[#1a211e] leading-relaxed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-[#6B7280] block">
                      Oczekiwania i cele (Czego potrzebujesz / żądasz)
                    </label>
                    <input
                      type="text"
                      value={caseGoals}
                      onChange={(e) => setCaseGoals(e.target.value)}
                      placeholder="np. Żądam zabezpieczenia i zasądzenia alimentów w kwocie 900 PLN miesięcznie na rzecz małoletniego..."
                      className="w-full bg-[#FBF9F4] px-4 py-3 rounded-xl border border-slate-200 text-sm font-sans font-medium text-[#1a211e]"
                    />
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
                  <h2 className="text-xl font-serif font-black text-[#0f1412] mb-2">Krok 4: Wykaz Dokumentów i Dowodów</h2>
                  <p className="text-sm text-slate-500">
                    W każdym procesie dowody decydują o werdykcie. Zaznacz, które dokumenty już masz przygotowane, a które musisz zdobyć przed wizytą u prawnika.
                  </p>
                </div>

                {/* Evidence checklist list */}
                <div className="space-y-4">
                  {evidence.map((ev) => (
                    <div 
                      key={ev.id}
                      className="p-5 bg-[#FBF9F4] border border-slate-200/60 rounded-2xl flex items-start gap-4"
                    >
                      <input
                        type="checkbox"
                        checked={ev.checked}
                        onChange={() => toggleEvidenceCheck(ev.id)}
                        className="w-5 h-5 rounded-md border-slate-300 text-black focus:ring-black mt-0.5 cursor-pointer"
                      />
                      <div className="flex-1 text-left space-y-3">
                        <span className={`text-xs font-bold leading-tight ${ev.checked ? 'text-black font-extrabold line-through opacity-70' : 'text-[#1a211e]'}`}>
                          {ev.name}
                        </span>
                        <input
                          type="text"
                          value={ev.notes || ''}
                          onChange={(e) => updateEvidenceNote(ev.id, e.target.value)}
                          placeholder="Dodatkowa notatka (np. faktury z apteki w Sosnowcu)"
                          className="w-full bg-white px-3 py-2 rounded-xl border border-slate-150 text-[11px] font-sans font-medium mt-1 focus:outline-none focus:border-slate-400"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEvidence(ev.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Usuń pozycję"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Custom evidence input */}
                <div className="bg-slate-50 border border-slate-250 p-6 rounded-2xl space-y-4">
                  <h3 className="text-xs font-black uppercase text-black flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Dodaj Własny Dokument / Dowód
                  </h3>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={newEvName}
                      onChange={(e) => setNewEvName(e.target.value)}
                      placeholder="np. Rachunki imienne i ordynacja lekarska z kardiologii..."
                      className="flex-1 bg-white px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium text-[#1a211e]"
                    />
                    <button
                      type="button"
                      onClick={addCustomEvidence}
                      className="px-6 py-3 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all"
                    >
                      Dodaj
                    </button>
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
                  <h2 className="text-xl font-serif font-black text-[#0f1412] mb-2">Krok 5: Teczka Sprawy Gotowa</h2>
                  <p className="text-sm text-slate-500">
                    Twój brief konsultacyjny został pomyślnie wygenerowany. Możesz go teraz bezpośrednio wydrukować jako schludny dokument w wysokim kontraście lub zapisać na komputerze.
                  </p>
                </div>

                {/* Screen Preview of generated brief - Editorial styling */}
                <div className="bg-[#FFFDF9] border border-[#DFCBB1] rounded-3xl p-6 md:p-10 text-left font-serif text-[#161a18] shadow-xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 py-6 px-10 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-bl-2xl">
                    Podgląd Briefu
                  </div>

                  <div className="space-y-6 pt-6">
                    <div className="border-b border-slate-200 pb-6">
                      <span className="text-[10px] font-sans font-black uppercase tracking-widest text-[#6B7280]">Sprawa / Obszar</span>
                      <h3 className="text-2xl font-black text-black leading-tight mt-1">
                        {CATEGORIES.find(c => c.id === formCategory)?.label}
                      </h3>
                      <p className="text-xs text-slate-400 font-sans mt-1">Status lokalizacji pracownika pomocowego: {city}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-sans text-slate-600 border-b border-slate-100 pb-6">
                      <div><strong>Identyfikator:</strong> {initials || 'Anonimowy'}</div>
                      <div><strong>Śląsk/Gmina:</strong> {city}</div>
                      {phone && <div><strong>Telefon:</strong> {phone}</div>}
                      {email && <div><strong>E-mail:</strong> {email}</div>}
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-base font-bold text-[#0f1412] uppercase tracking-wide">Miesięczny kosztorys kosztów:</h4>
                      <div className="space-y-2 font-sans text-xs">
                        {expenses.filter(e => e.amount > 0).map((e, idx) => (
                          <div key={idx} className="flex justify-between border-b border-dashed border-slate-200 pb-1.5 text-slate-700">
                            <span>{e.category} {e.description ? `(${e.description})` : ''}</span>
                            <span className="font-extrabold text-[#0f1412]">{e.amount} PLN</span>
                          </div>
                        ))}
                        <div className="flex justify-between pt-3 text-sm font-extrabold text-black">
                          <span>Suma wykazanych potrzeb:</span>
                          <span className="text-base text-amber-800">{totalExpenses.toFixed(2)} PLN</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <h4 className="text-base font-bold text-[#0f1412] uppercase tracking-wide">Opis stanu faktycznego:</h4>
                      <p className="text-xs md:text-sm font-sans text-[#374151] leading-relaxed whitespace-pre-wrap">{narrative || 'Nie podano ustrukturyzowanego opisu sytuacji.'}</p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-[#DFCBB1]">
                      <h4 className="text-base font-bold text-[#0f1412] uppercase tracking-wide">Wybrane Dowody / Załączniki:</h4>
                      <ul className="list-disc pl-5 font-sans text-xs text-slate-600 space-y-1">
                        {evidence.filter(e => e.checked).map((ev, i) => (
                          <li key={i}>
                            <strong>{ev.name}</strong> {ev.notes ? `(${ev.notes})` : ''}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Exporter Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={handlePrint}
                    className="flex items-center justify-center gap-3 py-4 bg-black hover:bg-slate-900 text-white rounded-[24px] text-xs font-black uppercase tracking-widest transition-all"
                  >
                    <Printer className="w-5 h-5" /> Drukuj / Zapisz PDF (Ctrl+P)
                  </button>
                  <button
                    onClick={handleDownloadTxt}
                    className="flex items-center justify-center gap-3 py-4 bg-white border-2 border-slate-350 hover:bg-slate-50 text-black rounded-[24px] text-xs font-black uppercase tracking-widest transition-all"
                  >
                    <Download className="w-5 h-5 text-slate-400" /> Pobierz jako Plik Tekstowy
                  </button>
                </div>

                {/* Location match assistant based on city */}
                <div className="bg-[#FAF3E4] border border-[#DFCBB1] p-6 rounded-[28px] text-left">
                  <span className="text-[10px] font-sans font-black uppercase tracking-wider text-[#8C6239] block mb-2">Związek Lokalny</span>
                  <p className="text-sm font-serif text-[#8C6239] leading-relaxed mb-4">
                    Twoja teczka ze sprawą w miejscowości <strong className="font-extrabold">{city}</strong> może być bezpośrednio skonsultowana z lokalnym ośrodkiem:
                  </p>
                  <Link 
                    to="/mapa"
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black hover:underline"
                  >
                    Przejdź do rejestru placówek w {city} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#6B7280] hover:text-black transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Wstecz
              </button>
            ) : (
              <button
                type="button"
                onClick={clearAllData}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#B83232] hover:bg-rose-50 px-4 py-2 rounded-xl transition-all"
              >
                <Trash2 className="w-4 h-4" /> Wyczyść dane
              </button>
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => {
                  saveProgressDraft();
                  setStep(step + 1);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-sm"
              >
                Dalej <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  saveProgressDraft();
                  alert('Dane zostały pomyślnie zarchiwizowane lokalnie w Twojej przeglądarce.');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-sm"
              >
                <Save className="w-4 h-4" /> Zapisz Draft
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
