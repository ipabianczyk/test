import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <nav className="max-w-7xl mx-auto px-4 sm:px-10 py-6 text-xs font-bold uppercase tracking-widest text-slate-400">
        <Link to="/" className="hover:text-amber-600 transition-colors">Start</Link>
        <span className="mx-2 opacity-30">›</span>
        <span className="text-slate-900">Polityka prywatności</span>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-10 py-12 md:py-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-16 rounded-[40px] shadow-2xl border-4 border-slate-50"
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-8 leading-none">
            Polityka prywatności
          </h1>
          
          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed font-medium">
            <p>
              Niniejsza polityka prywatności opisuje, jakie dane są przetwarzane przez serwis <strong>MostPomocy</strong> dostępny pod adresem <strong>mostpomocy.pl</strong>, w jakim celu oraz jakie prawa przysługują Ci jako użytkownikowi. Dokument jest zgodny z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. (RODO).
            </p>

            <p className="border-l-4 border-amber-500 pl-6 italic text-slate-400 text-sm">
              Data ostatniej aktualizacji: kwiecień 2026 r.
            </p>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Administrator danych osobowych</h2>
              <p>Administratorem danych osobowych jest:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Projekt społeczny MostPomocy</strong></li>
                <li>Prowadzony przez: Igor Pabiańczyk</li>
                <li>Kontakt: formularz dostępny w sekcji Kontakt</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Dane statystyczne (Google Analytics)</h2>
              <p>W celu analizy ruchu na stronie i poprawy jakości serwisu korzystamy z narzędzia <strong>Google Analytics 4</strong>.</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Liczba odwiedzin i czas spędzony na podstronach.</li>
                <li>Typ urządzenia, system operacyjny i przeglądarka.</li>
                <li>Przybliżona lokalizacja geograficzna (kraj, region).</li>
                <li>Źródło wejścia na stronę.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">3. Dane z formularza kontaktowego</h2>
              <p>Formularz kontaktowy służy wyłącznie do nawiązania komunikacji z zespołem projektu. Podając dane (email, treść wiadomości), wyrażasz zgodę na ich przetwarzanie w celu odpowiedzi na Twoje zapytanie.</p>
              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 text-amber-900 text-sm font-bold">
                Ważne: Prosimy nie podawać w formularzu danych wrażliwych (PESEL, diagnoz lekarskich). Formularz nie jest linią kryzysową.
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">4. Twoje prawa (RODO)</h2>
              <p>Na podstawie RODO przysługują Ci następujące prawa:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Prawo dostępu do informacji o przetwarzanych danych.</li>
                <li>Prawo do sprostowania i usunięcia danych.</li>
                <li>Prawo do ograniczenia przetwarzania.</li>
                <li>Prawo do wycofania zgody w dowolnym momencie.</li>
                <li>Prawo do złożenia skargi do UODO.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">5. Pliki cookie</h2>
              <p>Serwis korzysta z plików cookie w celu analityki (Google Analytics) oraz zapamiętywania Twoich preferencji dotyczących dostępności (kontrast, rozmiar czcionki). Te drugie są przechowywane lokalnie w Twojej przeglądarce.</p>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
