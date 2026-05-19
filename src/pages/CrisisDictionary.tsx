import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Download, ShieldCheck, Info, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CRISIS_KEYWORDS } from '../data/chatFlow';

export default function CrisisDictionary() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-32">
      <nav className="max-w-4xl mx-auto px-4 sm:px-10 py-8">
        <Link to="/" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Powrót
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-10">
        <div className="text-center mb-16">
          <div className="section-tag mb-4">Transparentność i Bezpieczeństwo</div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6">
            Słownik <span className="text-rose-500 italic">Kryzysowy.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Dla pełnej przejrzystości udostępniamy listę fraz i słów kluczowych, które nasz asystent monitoruje w celu wykrycia bezpośredniego zagrożenia życia.
          </p>
        </div>

        <div className="bg-white rounded-[40px] border-4 border-slate-50 shadow-2xl p-8 md:p-12 mb-12">
          <div className="flex items-start gap-6 mb-12 bg-rose-50 p-8 rounded-3xl border-2 border-rose-100">
            <AlertTriangle className="w-10 h-10 text-rose-500 shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-black text-rose-900 mb-2">Jak to działa?</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Nasz asystent nie jest sztuczną inteligencją (AI), która analizuje kontekst. Działa na zasadzie dopasowania wzorców. Jeśli w Twojej wiadomości pojawi się którykolwiek z poniższych zwrotów, system natychmiast przerwie rozmowę i wyświetli dane kontaktowe do służb ratunkowych oraz infolinii kryzysowych.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-12">
            {CRISIS_KEYWORDS.sort().map((word, i) => (
              <div key={i} className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 flex items-center justify-between group hover:border-rose-200 transition-colors">
                {word}
                <div className="w-1.5 h-1.5 bg-rose-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => window.print()}
              className="btn btn-outline border-2 flex-grow justify-center gap-3 py-6"
            >
              <Download className="w-5 h-5" /> Pobierz / Drukuj listę
            </button>
            <Link to="/kontakt" className="btn btn-primary flex-grow justify-center gap-3 py-6">
              Zaproponuj zmianę
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-emerald-50 p-8 rounded-[32px] border-2 border-emerald-100">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mb-4" />
            <h4 className="text-lg font-black text-emerald-900 mb-2">Prywatność przede wszystkim</h4>
            <p className="text-sm text-emerald-800 leading-relaxed">
              Logi rozmów nie są trwale przechowywane na serwerze w sposób umożliwiający identyfikację użytkownika. System służy wyłącznie do szybkiego skierowania Cię do profesjonalnej pomocy.
            </p>
          </div>
          <div className="bg-blue-50 p-8 rounded-[32px] border-2 border-blue-100">
            <Info className="w-8 h-8 text-blue-600 mb-4" />
            <h4 className="text-lg font-black text-blue-900 mb-2">Dla Specjalistów</h4>
            <p className="text-sm text-blue-800 leading-relaxed">
              Jeśli jesteś psychologiem lub pracownikiem socjalnym i uważasz, że lista powinna zostać rozszerzona o nowe sformułowania – skontaktuj się z nami. Twoja wiedza pomaga ratować życie.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
