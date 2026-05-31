/**
 * Globalna konfiguracja serwisu (odpowiednik _config.yml).
 * Wszystkie teksty i ustawienia SEO powinny być edytowane tutaj.
 */
export const SITE_CONFIG = {
  name: "MostPomocy.pl",
  tagline: "Mapa Pomocy – kompas szukania wsparcia | Igor Pabiańczyk",
  description: "MostPomocy – Igor Pabiańczyk. Bezpłatny przewodnik po systemie wsparcia społecznego w Polsce: seniorzy, onkologia, rodzina, dzieci, przemoc i więcej. Znajdź pomoc – krok po kroku.",
  url: "https://mostpomocy.pl",
  author: "Igor Pabiańczyk",
  analytics: {
    ga4_id: "G-YD2QTX4YNR" // Wdrożony identyfikator Google Analytics z załączonego pliku
  },
  seo: {
    keywords: "pomoc społeczna, kryzys emocjonalny, wsparcie prawne, mops pomoc, pomoc psychologiczna sosnowiec, katowice, dąbrowa górnicza, 116 111, potrzebomat, onkologia, seniorzy, przemoc, rodzina, bezpiecznik",
    og_image: "/og-image.jpg"
  },
  contact: {
    central_email: "pracownik.socjalny@centrumwsparcia.pl",
    psychological_email: "psycholog@centrumwsparcia.pl",
    financial_email: "finanse@centrumwsparcia.pl",
    addiction_email: "terapia@centrumwsparcia.pl",
    violence_email: "interwencja@centrumwsparcia.pl",
    disability_email: "pfron@centrumwsparcia.pl",
    emergency_phone: "116 123",
    child_emergency_phone: "116 111"
  }
};
