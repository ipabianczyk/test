export interface ChatNode {
  id: string;
  messages: string[];
  choices: { label: string; nextId: string; link?: string }[];
  isCrisis?: boolean;
}

export const CRISIS_KEYWORDS = [
  // --- FRAZY PIERWOTNE ---
  'chcę się zabić', 
  'chce sie zabic', 
  'samobójstwo', 
  'samobojstwo', 
  'skoczyć', 
  'skoczyc', 
  'tabletki', 
  'koniec', 
  'nie chcę już żyć', 
  'nie chce juz zyc',
  'zabić się',
  'zabic sie',
  'pociąć się',
  'pociac sie',
  'podciąć żyły',
  'podciac zyly',
  'żyletka',
  'zyletka',
  'sznur',
  'powiesić się',
  'powiesic sie',
  'odebrać sobie życie',
  'odebrac sobie zycie',
  'nie mam po co żyć',
  'nie mam po co zyc',
  'żegnajcie',
  'zegnajcie',
  'lista pożegnalna',
  'list pożegnalny',
  'chcę umrzeć',
  'chce umrzec',
  'nadzieja umarła',
  'nie widzę sensu',
  'nie widze sensu',
  'wszystko mi jedno',
  'mam dość',
  'mam dosc',
  'nie wytrzymam',

  // --- ROZBUDOWA: SFORMUŁOWANIA DEPRESYJNE I REZYGNACYJNE ---
  'nie wytrzymam tego',
  'nie wytrzymuje',
  'nie wytrzymuję',
  'nie mam sil',
  'nie mam sił',
  'nie mam juz sil',
  'nie mam już sił',
  'chcę zniknąć',
  'chce zniknac',
  'chce zniknąć',
  'chcę zniknac',
  'zniknąć na zawsze',
  'zniknac na zawsze',
  'lepiej żeby mnie nie było',
  'lepiej zeby mnie nie bylo',
  'nie chcę się obudzić',
  'nie chce sie obudzic',
  'nie chce juz wstawac',
  'nie chcę już wstawać',
  'moje życie nie ma sensu',
  'moje zycie nie ma sensu',
  'wszystko sie skonczylo',
  'wszystko się skończyło',
  'nienawidzę swojego życia',
  'nienawidze swojego zycia',
  'jestem ciężarem',
  'jestem ciezarem',
  'dla wszystkich lepiej bezemnie',
  'lepiej bezemnie',
  'lepiej bez mnie',
  'nie ma dla mnie ratunku',
  'nie ma ratunku',
  'nikt mi nie pomoże',
  'nikt mi nie pomoze',
  'czarna dziura',
  'pustka w głowie',
  'pustka w glowie',

  // --- ROZBUDOWA: DRLASTYCZNE, METAFORYCZNE I SLANGOWE ---
  'skok z mostu',
  'skok pod pociag',
  'skok pod pociąg',
  'rzucic sie pod pociag',
  'rzucić się pod pociąg',
  'skoczyc pod auto',
  'skoczyć pod auto',
  'palnąć sobie w łeb',
  'palnac sobie w leb',
  'palnac w leb',
  'strzelic sobie w leb',
  'strzelić sobie w łeb',
  'zejsć z tego świata',
  'zejsc z tego swiata',
  'pętla na szyję',
  'petla na szyje',
  'podciac gardlo',
  'podciąć gardło',
  'wypic trucizne',
  'wypić truciznę',
  'trucizna',
  'lyknac wszystko',
  'łyknąć wszystko',
  'garść tabletek',
  'garsc tabletek',
  'przedawkować',
  'przedawkowac',
  'overdose',

  // --- ROZBUDOWA: POŻEGNANIA I LITERÓWKI W AMOKU ---
  'zegnaj',
  'żegnaj',
  'ostatni list',
  'moj ostatni dzien',
  'mój ostatni dzień',
  'ide sie zabic',
  'idę się zabić',
  'ide sie powiesic',
  'idę się powiesić',
  'chce umrzec szybko',
  'chcę umrzeć szybko',
  'jak sie zabic',
  'jak się zabić',
  'jak bezbolesnie umrzec',
  'jak bezboleśnie umrzeć',
  'skuteczne samobojstwo',
  'skuteczne samobójstwo',
  'chcesiezabic',
  'chcesiezabić',
  'niechcezyc',
  'niechcężyć',
  'niechce już żyć',
  'niechce juz zyc',
  'mamdosć',
  'mamdosc'
];

export const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/Ł/g, "l")
    .trim();
};

export const checkCrisis = (text: string) => {
  const normalizedInput = normalizeText(text);
  return CRISIS_KEYWORDS.some(keyword => {
    const normalizedKeyword = normalizeText(keyword);
    return normalizedInput.includes(normalizedKeyword);
  });
};

export const CHAT_FLOW: Record<string, ChatNode> = {
  start: {
    id: 'start',
    messages: [
      'Witaj. Jestem Twoim mobilnym asystentem wsparcia.',
      'Możemy porozmawiać o tym, co Cię trapi lub pomóc Ci znaleźć odpowiednią placówkę.',
      'W czym mogę Ci dzisiaj pomóc?'
    ],
    choices: [
      { label: 'Szukam konkretnej pomocy', nextId: 'needs' },
      { label: 'Chcę po prostu porozmawiać', nextId: 'talk' },
      { label: 'To sytuacja nagła', nextId: 'emergency' }
    ]
  },
  needs: {
    id: 'needs',
    messages: [
      'Jasne. Nasz Potrzebomat może pomóc Ci nazwać problem dokładniej.',
      'Możesz też wybrać kategorię tutaj, abym pokazał Ci najbliższe placówki.'
    ],
    choices: [
      { label: 'Otwórz Potrzebomat', nextId: 'start', link: '/znajdz-potrzebe' },
      { label: 'Pomoc materialna', nextId: 'start', link: '/mapa/sytuacja-materialna' },
      { label: 'Zdrowie psychiczne', nextId: 'start', link: '/mapa/zdrowie' }
    ]
  },
  talk: {
    id: 'talk',
    messages: [
      'Rozmowa to dobry pierwszy krok. Opowiedz mi trochę o tym, jak się czujesz.',
      'Pamiętaj, że jestem tylko asystentem, ale wysłucham Cię bez oceniania.'
    ],
    choices: [
      { label: 'Czuję lęk', nextId: 'anxiety' },
      { label: 'Czuję smutek', nextId: 'sadness' },
      { label: 'Chcę wrócić na start', nextId: 'start' }
    ]
  },
  anxiety: {
    id: 'anxiety',
    messages: [
      'Lęk bywa obezwładniający, ale istnieją techniki, które pomagają "uziemić" emocje.',
      'Spróbuj metody 5-4-3-2-1: wymień 5 rzeczy, które widzisz, 4 które słyszysz, 3 które czujesz dotykiem, 2 które czujesz węchem i 1 smak.',
      'Jeśli lęk jest stały, warto zajrzeć do specjalisty.'
    ],
    choices: [
      { label: 'Pokaż placówki', nextId: 'start', link: '/mapa/zdrowie' },
      { label: 'Porozmawiajmy o czymś innym', nextId: 'talk' }
    ]
  },
  sadness: {
    id: 'sadness',
    messages: [
      'Smutek to ważny sygnał od Twojego organizmu. Nie musisz go tłumić.',
      'Czasem wypisanie myśli na kartce lub krótki spacer pomagają nieco rozładować napięcie.',
      'Jeśli ten stan trwa dłużej niż 2 tygodnie, warto skonsultować się z psychologiem.'
    ],
    choices: [
      { label: 'Gdzie szukać pomocy?', nextId: 'start', link: '/mapa/zdrowie' },
      { label: 'Wróć do rozmowy', nextId: 'talk' }
    ]
  },
  emergency: {
    id: 'emergency',
    messages: [
      'Jeśli Ty lub ktoś bliski jesteście w niebezpieczeństwie, nie zwlekaj.',
      'Możesz zadzwonić pod numer alarmowy 112 lub skorzystać z bezpłatnych infolinii kryzysowych.'
    ],
    choices: [
      { label: 'Pokaż numery alarmowe', nextId: 'crisis_action' },
      { label: 'Wróć na start', nextId: 'start' }
    ]
  },
  crisis_action: {
    id: 'crisis_action',
    isCrisis: true,
    messages: [
      'SŁUCHAJ, TO WAŻNE. TWOJE ŻYCIE JEST CENNE.',
      'Proszę, skontaktuj się z profesjonalistami, którzy pomogą Ci przejść przez ten moment.',
      '116 123 - Kryzysowy telefon zaufania dla dorosłych',
      '116 111 - Telefon zaufania dla dzieci i młodzieży',
      'Obie infolinie są bezpłatne i anonimowe.'
    ],
    choices: [
      { label: 'Zrozumiałem', nextId: 'start' }
    ]
  }
};
