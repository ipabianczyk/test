/**
 * Lista słów kluczowych wysokiego ryzyka (SOS).
 * Zawiera odmiany, błędy ortograficzne i wersje bez polskich znaków.
 * Wykrycie tych fraz powoduje natychmiastowe wyświetlenie ekranu blokady SOS.
 */
export const CRISIS_KEYWORDS = [
  // Samobójstwo / Chęć odebrania sobie życia
  'chce sie zabic', 'chcę się zabić', 'chce ze soba skonczyc', 'chcę ze sobą skończyć',
  'nie chce juz zyc', 'nie chcę już żyć', 'samobojstwo', 'samobójstwo', 'odebrac sobie zycie', 'odebrać sobie życie',
  'skoczyc z mostu', 'skoczyć z mostu', 'podciac zyly', 'podciąć żyły', 'przedawkowac', 'przedawkować',
  'powiesic sie', 'powiesić się', 'sznur', 'tabletki na smierc', 'tabletki na śmierć',
  'koniec ze mna', 'koniec ze mną', 'zegnajcie', 'żegnajcie', 'list pozegnalny', 'list pożegnalny',
  
  // Skrajna rozpacz / Beznadzieja
  'nie mam po co zyc', 'nie mam po co żyć', 'wszystko mi jedno', 'nie widze sensu', 'nie widzę sensu',
  'nic mnie juz nie czeka', 'nic mnie już nie czeka', 'chcialbym sie nie obudzic', 'chciałbym się nie obudzić',
  'lepiej by bylo beze mnie', 'lepiej by było beze mnie', 'nie dam rady dluzej', 'nie dam rady dłużej',
  
  // Przemoc fizyczna / Zagrożenie życia (bezpieczeństwo)
  'on mnie zabije', 'ona mnie zabije', 'mnie zabije', 'chce mnie zabic', 'chce mnie zabić',
  'boje sie o swoje zycie', 'boję się o swoje życie'
];
