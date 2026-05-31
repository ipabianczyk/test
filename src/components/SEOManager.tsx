import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { SITE_CONFIG } from '../data/siteConfig';
import { getPostById } from '../services/blogService';

/**
 * SEO & Analytics Tracking Manager.
 * Handles dynamic Title, Meta Tags, OpenGraph, Canonical URLs, 
 * JSON-LD structured schema creation, and Google Tag Manager (G-YD2QTX4YNR) virtual pageviews
 * including 'admin_conversion_mode' and Google Ads custom triggers.
 */
export default function SEOManager() {
  const location = useLocation();
  const params = useParams<{ id?: string }>();

  useEffect(() => {
    const pathname = location.pathname;
    const currentUrl = `https://mostpomocy.pl${pathname}${location.search}`;

    let pageTitle = `${SITE_CONFIG.name} – ${SITE_CONFIG.tagline}`;
    let pageDesc = SITE_CONFIG.description;
    let pageKeywords = SITE_CONFIG.seo.keywords;
    let ogType = "website";
    let jsonLdData: any = null;

    // Detect routes and define specific metadata parameters
    if (pathname === '/') {
      pageTitle = `Mapa Pomocy – kompas szukania wsparcia | Igor Pabiańczyk | ${SITE_CONFIG.name}`;
      pageDesc = SITE_CONFIG.description;
      
      // Default JSON-LD for Organization and Website
      jsonLdData = [
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "MostPomocy",
          "url": "https://mostpomocy.pl/",
          "description": "Projekt społeczny łączący ludzi ze wsparciem – bezpłatny przewodnik po systemie pomocy w Polsce.",
          "inLanguage": "pl",
          "founder": {
            "@type": "Person",
            "name": "Igor Pabiańczyk"
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "MostPomocy",
          "url": "https://mostpomocy.pl/",
          "inLanguage": "pl"
        }
      ];
    } else if (pathname === '/blog') {
      pageTitle = `Czytelnia i Poradniki Metodyczne – Baza Wiedzy | ${SITE_CONFIG.name}`;
      pageDesc = `Przeczytaj bezpłatne poradniki i rzetelne artykuły o systemie pomocy społecznej, alimentach, PFRON i interwencji w kryzysie. Pisze Igor Pabiańczyk.`;
      pageKeywords = `poradniki pomoc społeczna, blog o mops, jak dostać alimenty, prawa pacjenta onkologicznego, opieka wytchnieniowa`;
    } else if (pathname.startsWith('/blog/') && params.id) {
      const post = getPostById(params.id);
      if (post) {
        pageTitle = `${post.title} | Igor Pabiańczyk – Blog ${SITE_CONFIG.name}`;
        pageDesc = post.excerpt || `Artykuł o tematyce pomocowej z kategorii: ${post.category}. Przeczytaj rzetelny artykuł na MostPomocy.pl`;
        pageKeywords = `${post.tags.join(', ')}, ${post.category}, mops pomoc, ${SITE_CONFIG.seo.keywords}`;
        ogType = "article";

        // Advanced JSON-LD for Blog / Article Schema
        jsonLdData = {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt,
          "datePublished": post.date,
          "author": {
            "@type": "Person",
            "name": post.author || "Igor Pabiańczyk"
          },
          "publisher": {
            "@type": "Organization",
            "name": "MostPomocy",
            "url": "https://mostpomocy.pl"
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": currentUrl
          }
        };
      }
    } else if (pathname === '/potrzebomat') {
      pageTitle = `Potrzebomat – Kreator Samodzielnego Rodzicielstwa i Alimentów | ${SITE_CONFIG.name}`;
      pageDesc = `Interaktywny kreator potrzeb dedykowany dla ścieżek "Samodzielne Rodzicielstwo / Brak Alimentów". Zobacz co przysługuje Tobie i Twojemu dziecku.`;
      pageKeywords = `biel alimentacyjny, samotna matka pomoc, brak alimentów kreator, potrzebomat, pomoc społeczna`;
    } else if (pathname === '/mapa') {
      pageTitle = `Baza i Interaktywna Mapa Placówek Pomocowych | ${SITE_CONFIG.name}`;
      pageDesc = `Precyzyjny spis i interaktywna mapa placówek w Sosnowcu, Katowicach i Dąbrowie Górniczej umożliwiająca wyszukanie OPS, PCPR, interwencji kryzysowej.`;
    } else if (pathname.startsWith('/mapa/')) {
      const categoryId = pathname.split('/').pop() || '';
      const formattedCat = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
      pageTitle = `Baza Placówek: ${formattedCat} i Centra Wsparcia | ${SITE_CONFIG.name}`;
      pageDesc = `Spis zweryfikowanych ośrodków wsparcia dla kategorii ${formattedCat}. Sosnowiec, Katowice, Dąbrowa Górnicza, interwencja kryzysowa.`;
    } else if (pathname === '/kontakt') {
      pageTitle = `Zapytaj Autora – Kontakt z Redakcją i Wsparcie | ${SITE_CONFIG.name}`;
      pageDesc = `Masz pytanie dotyczące pomocy socjalnej? Napisz do Igora Pabiańczyka. Pomagamy odnaleźć właściwe instancje merytoryczne.`;
    } else if (pathname === '/bezpiecznik') {
      pageTitle = `Bezpiecznik – Interaktywny i Bezpłatny Poradnik PDF | ${SITE_CONFIG.name}`;
      pageDesc = `Pobierz i wydrukuj profesjonalnie zaprojektowany przewodnik z numerami telefonów alarmowych oraz praktyczną instrukcją "krok po kroku" na kryzysowe sytuacje.`;
    } else if (pathname === '/strefa-spokoju') {
      pageTitle = `Strefa Ciszy – Trener Oddechowy 4-7-8 (Framer Motion) | ${SITE_CONFIG.name}`;
      pageDesc = `Wycisz swój układ nerwowy. Interaktywne ćwiczenie oddechowe z asystentem wizualnym ułatwiające samoregulację i relaksację w stresie.`;
    } else if (pathname === '/teczka-sprawy') {
      pageTitle = `Teczka Sprawy – Bezpieczne Porządkowanie Wniosków | ${SITE_CONFIG.name}`;
      pageDesc = `Zaplanuj, uporządkuj i zapisz bezpiecznie dane do celów sprawozdań socjalnych i alimentacyjnych w swojej pamięci przeglądarki.`;
    } else if (pathname === '/sosnowiec-bez-stygmy') {
      pageTitle = `Sosnowiec Bez Stygmy – Przeciw Wykluczeniu i Ocenianiu | ${SITE_CONFIG.name}`;
      pageDesc = `Przełam bariery wstydu i uprzedzeń związanych z proszeniem o wsparcie w pracy socjalnej. Poznaj fakty i mity.`;
    } else if (pathname === '/admin' || pathname === '/kreator-artykulow') {
      pageTitle = `Zarządzanie i Kreator Artykułów Hugo Stack (CRUD) | ${SITE_CONFIG.name}`;
      pageDesc = `Bezpieczny panel wydawniczy zabezpieczony przez Cloudflare Access do edycji baza placówek i generowania Hugo YAML Front Matter.`;
    } else if (pathname === '/slownik-kryzysowy') {
      pageTitle = `Słownik Pojęć Socjalnych i Interwencji Kryzysowej | ${SITE_CONFIG.name}`;
      pageDesc = `Dowiedz się co oznaczają skróty: GKRPA, OPS, PFRON, asystent rodziny, alimentacyjny fundusz i wiele innych bez zbędnych mitów.`;
    } else {
      // Fallback fallback default
      const part = pathname.replace('/', '').replace(/-/g, ' ');
      if (part) {
        const titlePart = part.charAt(0).toUpperCase() + part.slice(1);
        pageTitle = `${titlePart} | ${SITE_CONFIG.name}`;
      }
    }

    // 1. Update <title> element
    document.title = pageTitle;

    // 2. Helper to set meta tags inside head smoothly
    const updateMetaTag = (attributeName: string, attributeValue: string, contentValue: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue);
    };

    // 3. Update generic & specific SEO Meta Tags
    updateMetaTag('name', 'description', pageDesc);
    updateMetaTag('name', 'keywords', pageKeywords);
    updateMetaTag('name', 'author', SITE_CONFIG.author);
    updateMetaTag('name', 'robots', 'index, follow');

    // 4. Update OpenGraph Tags
    updateMetaTag('property', 'og:title', pageTitle);
    updateMetaTag('property', 'og:description', pageDesc);
    updateMetaTag('property', 'og:url', currentUrl);
    updateMetaTag('property', 'og:type', ogType);
    updateMetaTag('property', 'og:locale', 'pl_PL');
    updateMetaTag('property', 'og:site_name', SITE_CONFIG.name);
    updateMetaTag('property', 'og:image', `https://mostpomocy.pl${SITE_CONFIG.seo.og_image}`);

    // 5. Update Twitter Cards
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', pageTitle);
    updateMetaTag('name', 'twitter:description', pageDesc);
    updateMetaTag('name', 'twitter:image', `https://mostpomocy.pl${SITE_CONFIG.seo.og_image}`);

    // 6. Update Canonical URL Link Tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    // 7. Inject JSON-LD Schema
    const oldScripts = document.querySelectorAll('script[type="application/ld+json"]#dynamic-seo-schema');
    oldScripts.forEach(s => s.remove());

    if (jsonLdData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'dynamic-seo-schema';
      script.innerHTML = JSON.stringify(jsonLdData);
      document.head.appendChild(script);
    }

    // 8. Track Virtual Page View and trigger Google Consent Mode v2 events
    window.dataLayer = window.dataLayer || [];
    
    // Feed data to GTM and trigger custom event
    const pageviewPayload = {
      event: 'page_view_custom',
      page_path: pathname,
      page_title: pageTitle,
      page_location: currentUrl,
      author: SITE_CONFIG.author,
    };
    window.dataLayer.push(pageviewPayload);

    // Call standard global tracking system `gtag` if initialized
    const gAny = window as any;
    if (typeof gAny.gtag === 'function') {
      gAny.gtag('config', SITE_CONFIG.analytics.ga4_id, {
        page_path: pathname,
        page_title: pageTitle,
        page_location: currentUrl
      });

      // Special conversion trigger for administrative panels (admin_conversion) e.g., for Google Ads tracking
      if (pathname === '/admin' || pathname === '/kreator-artykulow' || pathname === '/teczka-sprawy') {
        gAny.gtag('event', 'admin_conversion', {
          event_category: 'admin',
          event_label: 'Uzytkownik wszedl do bezpiecznego panelu administrative',
          value: 1.0,
          currency: 'PLN'
        });
        console.log('[Analytics] Triggered Ads & GTM Conversion event: admin_conversion on URL:', pathname);
      }
    }

    console.log(`[SEO-SEOManager] Synchronized tags & routed page view on path ${pathname} (${pageTitle})`);

  }, [location.pathname, location.search, params.id]);

  return null;
}
