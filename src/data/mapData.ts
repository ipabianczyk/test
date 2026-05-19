export interface ResourceItem {
  id: string;
  title: string;
  url?: string;
  desc: string;
  icon?: string;
  phones?: string[];
}

export interface MapCategory {
  id: string;
  title: string;
  shortDesc: string;
  icon: string;
  emoji: string;
  heroText: string;
  heroHighlight: string;
  heroDesc: string;
  rjpsLink?: string;
  quote?: {
    emoji: string;
    text: string;
  };
  resources: ResourceItem[];
  rights?: {
    title: string;
    desc: string;
  }[];
}

export const mapCategories: MapCategory[] = [
  {
    id: 'emocje',
    title: 'Emocje i Kryzys',
    shortDesc: 'Nagłe wsparcie psychologiczne, telefony zaufania, interwencja.',
    icon: 'Heart',
    emoji: '🆘',
    heroText: 'Kiedy emocje ',
    heroHighlight: 'biorą górę.',
    heroDesc: 'W trudnych chwilach nie musisz być sam. Tutaj znajdziesz miejsca, które oferują natychmiastowe wysłuchanie i profesjonalne wsparcie w sytuacjach kryzysowych.',
    quote: {
      emoji: '🕯️',
      text: '„Ciemność nie trwa wiecznie. Zawsze jest ktoś, kto trzyma dla Ciebie latarnię.”'
    },
    resources: [
      {
        id: '116123',
        title: 'Kryzysowy Telefon 116 123',
        url: 'tel:116123',
        desc: 'Bezpłatny telefon dla osób dorosłych w kryzysie emocjonalnym. Czynny codziennie od 14:00 do 22:00.',
        icon: 'Phone'
      },
      {
        id: 'oik_main',
        title: 'Ośrodki Interwencji Kryzysowej',
        desc: 'Placówki świadczące natychmiastową pomoc psychologiczną, a często też prawną i socjalną, bez skierowania.',
        icon: 'MapPin'
      },
      {
        id: 'ipz',
        title: 'Instytut Psychologii Zdrowia',
        url: 'http://www.ipz.edu.pl/',
        desc: 'Poradnia telefoniczna dla osób przeżywających kryzys emocjonalny oraz ofiar przemocy.',
        icon: 'Heart'
      },
      {
        id: 'zapobiegajmy',
        title: 'Zapobiegajmy Samobójstwom',
        url: 'https://zapobiegajmysamobojstwom.pl/',
        desc: 'Portal z bazą wiedzy dla osób w kryzysie oraz ich bliskich o tym, jak rozpoznać sygnały ostrzegawcze.',
        icon: 'Shield'
      }
    ],
    rights: [
      {
        title: 'Prawo do anonimowości',
        desc: 'Dzwoniąc na telefony zaufania, nie musisz podawać swoich danych. Rozmowa jest poufna.'
      },
      {
        title: 'Bezpłatność wsparcia',
        desc: 'Pomoc w OIK i na infoliniach 116 jest całkowicie bezpłatna dla każdego mieszkańca Polski.'
      }
    ]
  },
  {
    id: 'onkologia',
    title: 'Onkologia',
    shortDesc: 'Wsparcie dla osób chorych onkologicznie – organizacje, prawa, pomoc.',
    icon: 'Ribbon',
    emoji: '🎗️',
    heroText: 'Onkologia – ',
    heroHighlight: 'nie jesteś sam.',
    heroDesc: 'Jeśli Ty lub ktoś bliski zmaga się z chorobą nowotworową, pamiętaj, że istnieje wiele organizacji i instytucji oferujących bezpłatne wsparcie psychologiczne, prawne i informacyjne.',
    rjpsLink: 'https://rjps.mrpips.gov.pl/RJPS/WJ/',
    quote: {
      emoji: '🎗️',
      text: '„Wiedza to pierwszy krok do oswojenia lęku. Jesteśmy tu, by Cię przez to przeprowadzić.”'
    },
    resources: [
      {
        id: 'npo',
        title: 'Narodowy Portal Onkologiczny',
        url: 'https://onkologia.pacjent.gov.pl/',
        desc: 'Oficjalny portal Ministerstwa Zdrowia. Znajdziesz tu listę akredytowanych ośrodków, informacje o leczeniu i prawach pacjenta.',
        icon: 'Stethoscope'
      },
      {
        id: 'wop',
        title: 'Wykaz Organizacji Pacjentów',
        url: 'https://www.gov.pl/web/rpp/wykaz-organizacji',
        desc: 'Znajdź stowarzyszenia onkologiczne zarejestrowane przy Rzeczniku Praw Pacjenta w swoim regionie.',
        icon: 'Bookmark'
      },
      {
        id: 'nfz',
        title: 'NFZ – dla pacjenta',
        url: 'https://www.nfz.gov.pl/dla-pacjenta/',
        desc: 'Informacje o szybkiej ścieżce onkologicznej (DiLO), lista poradni i prawach pacjenta finansowanych przez NFZ.',
        icon: 'ShieldCheck'
      },
      {
        id: 'puo',
        title: 'Polska Unia Onkologii (PUO)',
        url: 'https://puo.pl/dla-pacjentow/organizacje-pacjentow-w-polsce',
        desc: 'Baza organizacji pacjentów z podziałem na region i typ nowotworu. Edukacja i wsparcie rzecznicze.',
        icon: 'Heart'
      }
    ],
    rights: [
      {
        title: 'Szybka ścieżka (DiLO)',
        desc: 'Karta DiLO uprawnia do przyspieszonej diagnostyki i leczenia. Wystawia ją lekarz POZ lub specjalista przy podejrzeniu nowotworu.'
      },
      {
        title: 'Rzecznik Praw Pacjenta',
        desc: 'Jeśli Twoje prawa zostały naruszone (odmowa leczenia, brak informacji), zadzwoń na infolinię: 800 190 590.'
      },
      {
        title: 'Pomoc psychologiczna',
        desc: 'Masz prawo do bezpłatnego wsparcia psychoonkologa w ramach NFZ. Poproś swojego lekarza prowadzącego o skierowanie.'
      }
    ]
  },
  {
    id: 'seniorzy',
    title: 'Seniorzy',
    shortDesc: 'Pomoc dla osób starszych: opieka, świadczenia, domy dziennego pobytu.',
    icon: 'Users',
    emoji: '👴',
    heroText: 'Wsparcie ',
    heroHighlight: 'dla seniorów.',
    heroDesc: 'Jesień życia nie musi być trudna. Poniżej znajdziesz informacje o wsparciu dla osób starszych – opieka, świadczenia, domy i kluby seniora.',
    rjpsLink: 'https://rjps.mrpips.gov.pl/RJPS/WJ/',
    quote: {
      emoji: '👴',
      text: '„Szacunek i wsparcie dla tych, którzy przed nami wydeptali ścieżki.”'
    },
    resources: [
      {
        id: 'ops',
        title: 'Ośrodki Pomocy Społecznej (OPS/MOPS)',
        desc: 'Wsparcie z zakresu usług opiekuńczych, zasiłków i pomocy w formie posiłków dla osób starszych.',
        icon: 'MapPin'
      },
      {
        id: 'senior_portal',
        title: 'Portal Senior.pl',
        url: 'https://www.senior.pl/',
        desc: 'Informacje o zdrowiu, prawie i aktywnościach dla osób starszych. Największy polski portal dla seniorów.',
        icon: 'ExternalLink'
      },
      {
        id: 'kluby',
        title: 'Domy i Kluby Senior+',
        desc: 'Miejsca dziennego pobytu dla seniorów. Oferują terapię zajęciową, posiłki i integrację.',
        icon: 'Users'
      },
      {
        id: 'telefon_osob_starszych',
        title: 'Telefon Zaufania dla Seniorów',
        url: 'tel:226350954',
        desc: '22 635 09 54. Wsparcie emocjonalne dla osób starszych, które czują się samotne lub przeżywają kryzys.',
        icon: 'Phone'
      }
    ],
    rights: [
      {
        title: 'Zasiłek pielęgnacyjny',
        desc: 'Przysługuje osobie, która ukończyła 75. rok życia. Udzielany automatycznie, niezależnie od dochodów.'
      },
      {
        title: 'Darmowe Leki 65+',
        desc: 'Seniorzy mają prawo do darmowych leków z listy "S" po wystawieniu recepty przez lekarza uprawnionego.'
      },
      {
        title: 'Usługi opiekuńcze',
        desc: 'Pomoc w zaspokajaniu codziennych potrzeb życiowych, opieka higieniczna w miejscu zamieszkania - wnioskuj w MOPS.'
      }
    ]
  },
  {
    id: 'rodzina',
    title: 'Rodzina',
    shortDesc: 'Wsparcie dla rodzin w kryzysie, poradnie, świadczenia rodzinne.',
    icon: 'Heart',
    emoji: '👨‍👩‍👧‍👦',
    heroText: 'Rodzina w ',
    heroHighlight: 'centrum uwagi.',
    heroDesc: 'Więzi rodzinne bywają skomplikowane i czasem wymagają wsparcia z zewnątrz. Oto baza wsparcia z zakresu asystentury, poradnictwa i świadczeń.',
    quote: {
      emoji: '👨‍👩‍👧‍👦',
      text: '„Dom to nie budynek, to ludzie. Czasem potrzebujemy mapy, by do nich wrócić.”'
    },
    resources: [
      {
        id: 'asystent',
        title: 'Asystent Rodziny',
        desc: 'Pomaga w rozwiązywaniu problemów wychowawczych i zarządzaniu budżetem. Dostępny przez lokalny Ośrodek Pomocy Społecznej.',
        icon: 'Users'
      },
      {
        id: 'poradnia',
        title: 'Poradnie Psychologiczno-Pedagogiczne',
        desc: 'Bezpłatne diagnozy, terapia oraz poradnictwo dla dzieci i rodziców borykających się z trudnościami edukacyjnymi i wychowawczymi.',
        icon: 'Stethoscope'
      }
    ],
    rights: [
      {
        title: 'Karta Dużej Rodziny',
        desc: 'System zniżek dla rodzin z min. 3 dzieci. Pozwala na tańsze przejazdy, kulturę i zakupy.'
      },
      {
        title: 'Świadczenia opiekuńcze',
        desc: 'Zasiłki i świadczenia dla opiekunów osób wymagających stałego wsparcia - sprawdź progi w swojej gminie.'
      }
    ]
  },
  {
    id: 'niepelnosprawnosc',
    title: 'Osoby z niepełnosprawnością',
    shortDesc: 'Orzecznictwo, rehabilitacja, wsparcie społeczne i zawodowe.',
    icon: 'Accessibility',
    emoji: '♿',
    heroText: 'Niezależność i ',
    heroHighlight: 'wsparcie.',
    heroDesc: 'Znajdź informacje dotyczące równego dostępu, orzecznictwa, funduszy na rehabilitację i organizacji aktywnie wspierających osoby z niepełnosprawnościami.',
    quote: {
      emoji: '♿',
      text: '„Bariery są w infrastrukturze, nie w ludziach. Razem możemy je usuwać dzień po dniu.”'
    },
    resources: [
      {
        id: 'pfron',
        title: 'Państwowy Fundusz Rehabilitacji (PFRON)',
        url: 'https://www.pfron.org.pl/',
        desc: 'SOW – System Obsługi Wsparcia. Składaj wnioski o dofinansowania online (aparaty słuchowe, wózki, bariery).',
        icon: 'Accessibility'
      },
      {
        id: 'niepelnosprawni_info',
        title: 'Portal Niepelnosprawni.pl',
        url: 'http://www.niepelnosprawni.pl/',
        desc: 'Największa baza wiedzy o prawach, orzecznictwie i dostępności w Polsce.',
        icon: 'ExternalLink'
      },
      {
        id: 'orzecznictwo',
        title: 'Orzekanie o stopniu niepełnosprawności',
        desc: 'Znajdź powiatowy zespół ds. orzekania. Orzeczenie to klucz do ulg, świadczeń i rehabilitacji zawodowej.',
        icon: 'ClipboardList'
      }
    ],
    rights: [
      {
        title: 'Karta Parkingowa',
        desc: 'Pozwala na parkowanie na "kopertach" i wjazd do stref ograniczonego ruchu dla osób o znacznej niepełnosprawności.'
      },
      {
        title: 'Zasiłek pielęgnacyjny',
        desc: 'Pieniężne wsparcie na pokrycie wydatków wynikających z niepełnosprawności. Niezależne od dochodu.'
      }
    ]
  },
  {
    id: 'dzieci',
    title: 'Dzieci i młodzież',
    shortDesc: 'Ochrona praw dziecka, wsparcie psychologiczne, pieczy zastępcza.',
    icon: 'Baby',
    emoji: '🧒',
    heroText: 'Ochrona i ',
    heroHighlight: 'pomoc młodym.',
    heroDesc: 'Dzieciństwo powinno być bezpieczne. Jeśli dzieje się źle – w szkole, w domu czy w sieci – poniżej znajdziesz organizacje, które stają po stronie dzieci.',
    quote: {
      emoji: '🧒',
      text: '„Każde dziecko zasługuje na dzieciństwo bez strachu. Rozmowa to Twoja pierwsza tarcza.”'
    },
    resources: [
      {
        id: '116111',
        title: 'Telefon Zaufania dla Dzieci',
        url: 'https://116111.pl/',
        desc: '800 116 111. Bezpłatny anonimowy telefon prowadzony przez Fundację Dajemy Dzieciom Siłę. Czynny całą dobę.',
        icon: 'Phone'
      },
      {
        id: 'brpd',
        title: 'Dziecięcy Telefon Zaufania RPD',
        url: 'https://brpd.gov.pl/dzieciecy-telefon-zaufania-rzecznika-praw-dziecka/',
        desc: '800 12 12 12. Telefon Rzecznika Praw Dziecka, czynny całą dobę, bezpłatny. Czat online na stronie brpd.gov.pl.',
        icon: 'Accessibility'
      }
    ],
    rights: [
      {
        title: 'Prawo do ochrony przed przemocą',
        desc: 'W Polsce obowiązuje całkowity zakaz stosowania kar cielesnych. Nikt nie ma prawa Cię bić ani poniżać.'
      },
      {
        title: 'Samodzielne szukanie pomocy',
        desc: 'Możesz samodzielnie szukać pomocy u pedagoga szkolnego lub dzwoniąc na telefony zaufania bez zgody rodzica.'
      }
    ]
  },
  {
    id: 'uzaleznienia',
    title: 'Uzależnienia',
    shortDesc: 'Leczenie uzależnień, grupy wsparcia, poradnie terapeutyczne.',
    icon: 'Handshake',
    emoji: '🤝',
    heroText: 'Wyjdź z ',
    heroHighlight: 'nałogu.',
    heroDesc: 'Odzyskaj kontrolę nad własnym życiem. Sprawdź, gdzie zacząć leczenie, jak znaleźć grupę wsparcia oraz jak pomóc uzależnionym bliskim.',
    quote: {
      emoji: '🤝',
      text: '„Trzeźwość to nie jest brak nałogu, to obecność nowego życia. Zacznij dzisiaj, nie od jutra.”'
    },
    resources: [
      {
        id: 'aa',
        title: 'Anonimowi Alkoholicy (AA)',
        url: 'https://aa.org.pl/',
        desc: 'Spotkania grup samopomocowych dostępne w całej Polsce – darmowe i anonimowe.',
        icon: 'Users'
      },
      {
        id: 'parpa',
        title: 'Poradnie Terapii Uzależnień',
        desc: 'Leczenie uzależnienia od alkoholu i hazardu jest w Polsce bezpłatne, również dla osób nieubezpieczonych.',
        icon: 'Stethoscope'
      }
    ],
    rights: [
      {
        title: 'Leczenie dobrowolne',
        desc: 'Nikt nie może Cię zmusić do leczenia odwykowego (poza wyrokami sądu), ale terapia to Twoja szansa na wolność.'
      },
      {
        title: 'Terapia współuzależnienia',
        desc: 'Członkowie rodzin osób uzależnionych mają prawo do bezpłatnej terapii "współuzależnienia" w ramach NFZ.'
      }
    ]
  },
  {
    id: 'zdrowie',
    title: 'Zdrowie psychiczne',
    shortDesc: 'Opieka psychiatryczna, NFZ, centra zdrowia psychicznego.',
    icon: 'Activity',
    emoji: '🧠',
    heroText: 'Zdrowie głowy jest ',
    heroHighlight: 'równie ważne.',
    heroDesc: 'Przewodnik po bezpiecznym poruszaniu się po systemie opieki zdrowotnej. Jak korzystać z NFZ i gdzie szukać bezpłatnej opieki psychiatrycznej.',
    quote: {
      emoji: '🧠',
      text: '„Kryzys psychiczny to nie powód do wstydu, to stan, z którego można wyjść z profesjonalną pomocą.”'
    },
    resources: [
      {
        id: 'czp',
        title: 'Centra Zdrowia Psychicznego',
        url: 'https://czp.org.pl/',
        desc: 'Miejsca szybkiej pomocy bez skierowania. Znajdź najbliższy punkt koordynacyjno-zgłoszeniowy na mapie.',
        icon: 'MapPin'
      },
      {
        id: 'ikp',
        title: 'Internetowe Konto Pacjenta',
        url: 'https://pacjent.gov.pl/',
        desc: 'Sprawdź swoje e-recepty i skierowania. Zarządzaj swoim zdrowiem online.',
        icon: 'ShieldCheck'
      }
    ],
    rights: [
      {
        title: 'Pomoc bez skierowania',
        desc: 'Do psychiatry w ramach NFZ NIE potrzebujesz skierowania od lekarza rodzinnego.'
      },
      {
        title: 'Bezpłatna terapia',
        desc: 'Masz prawo do bezpłatnej psychoterapii pod warunkiem uzyskania skierowania od psychiatry NFZ.'
      }
    ]
  },
  {
    id: 'przemoc',
    title: 'Przemoc',
    shortDesc: 'Pomoc ofiarom przemocy domowej, procedura Niebieska Karta.',
    icon: 'Shield',
    emoji: '🛡️',
    heroText: 'Stop przemocy. ',
    heroHighlight: 'Odzyskaj wolność.',
    heroDesc: 'Nie musisz tego znosić. Przemoc można zatrzymać. Tutaj znajdziesz bezpieczne miejsca i telefony ratunkowe.',
    quote: {
      emoji: '🛡️',
      text: '„Nikt nie ma prawa Cię krzywdzić. Dom powinien być portem, a nie polem bitwy.”'
    },
    resources: [
      {
        id: 'niebieskalinia',
        title: 'Ogólnopolskie Pogotowie Niebieska Linia',
        url: 'https://www.niebieskalinia.pl/',
        desc: '800 120 002. Czynny całą dobę. Pomoc dla ofiar i świadków przemocy w rodzinie.',
        icon: 'Phone'
      },
      {
        id: 'osk',
        title: 'Ośrodki Interwencji Kryzysowej (OIK)',
        desc: 'Miejsca, gdzie możesz otrzymać schronienie (tzm. miejsca bezpiecznego pobytu) oraz pomoc psychologiczną i prawną.',
        icon: 'Hotel'
      }
    ],
    rights: [
      {
        title: 'Procedura Niebieska Karta',
        desc: 'Możesz poprosić Policję lub Ośrodek Pomocy Społecznej o założenie karty. Zapewnia ona monitoring policji i wsparcie zespołu specjalistów.'
      },
      {
        title: 'Zakaz zbliżania się',
        desc: 'W sytuacjach zagrożenia życia policja może wydać natychmiastowy nakaz opuszczenia lokalu przez sprawcę.'
      }
    ]
  },
  {
    id: 'sytuacja-materialna',
    title: 'Sytuacja materialna i prawo',
    shortDesc: 'Zasiłki, pomoc żywnościowa, dług publiczny, prawo.',
    icon: 'Scale',
    emoji: '⚖️',
    heroText: 'Odzyskaj stabilność ',
    heroHighlight: 'finansową.',
    heroDesc: 'Kiedy brakuje na podstawowe wydatki, system ma narzędzia do wsparcia. Sprawdź fundusze socjalne i pomoc dłużnikom.',
    quote: {
      emoji: '⚖️',
      text: '„Długi czy brak środków to sytuacja przejściowa. Prawo przewiduje mechanizmy, które pozwolą Ci odetchnąć.”'
    },
    resources: [
      {
        id: 'mops_money',
        title: 'Świadczenia Socjalne (MOPS)',
        desc: 'Skonstatuj się z pracownikiem socjalnym w sprawie zasiłków okresowych, celowych czy dodatków mieszkaniowych.',
        icon: 'Euro'
      },
      {
        id: 'porady_prawne',
        title: 'Nieodpłatna Pomoc Prawna',
        url: 'https://np.ms.gov.pl/',
        desc: 'Znajdź punkt darmowych porad prawnych i obywatelskich w swoim powiecie.',
        icon: 'Scale'
      }
    ],
    rights: [
      {
        title: 'Bezpłatne porady prawne',
        desc: 'Dla każdego, kto nie jest w stanie ponieść kosztów odpłatnej pomocy prawnej.'
      },
      {
        title: 'Pomoc żywnościowa',
        desc: 'Program FEAD zapewnia paczki żywnościowe dla osób o najniższych dochodach. Wymagane skierowanie z OPS.'
      }
    ]
  },
  {
    id: 'rejestry',
    title: 'Rejestry ustawowe',
    shortDesc: 'RJPS i inne rejestry instytucji i usług pomocowych w Polsce.',
    icon: 'ClipboardList',
    emoji: '📋',
    heroText: 'Bazy danych ',
    heroHighlight: 'i rejestry.',
    heroDesc: 'Oficjalne rejestry ministerialne, w których można znaleźć akredytowane organizacje pomocy społecznej wydawane przez rząd.',
    resources: [
      {
        id: 'rjps',
        title: 'Rejestr Jednostek Pomocy Społecznej',
        url: 'https://rjps.mrpips.gov.pl/RJPS/WJ/',
        desc: 'Największa oficjalna baza państwowa wszelkich podmiotów pomocy, dziennych domów, schronisk – aktualizowana przez wydziały Urzędów Wojewódzkich.',
        icon: 'ExternalLink'
      }
    ]
  }
];
