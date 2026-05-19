import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { FileDown, Download, AlertCircle, Phone, BookOpen, Printer, Mail, MapPin, Check } from 'lucide-react';

export default function Bezpiecznik() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-10 py-6 text-xs font-bold uppercase tracking-widest text-slate-400">
        <Link to="/" className="hover:text-amber-600 transition-colors">Start</Link>
        <span className="mx-2 opacity-30">›</span>
        <span className="text-slate-900">Bezpiecznik</span>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-4 sm:px-10 pt-12 md:pt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="section-tag mb-8 mx-auto">Poradnik PDF</div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-slate-900 mb-8">
            Bezpiecznik – Twój <br/>
            <span className="text-amber-600 italic font-serif font-normal">poradnik pomocy.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 leading-relaxed font-medium">
            Bezpłatny przewodnik, który możesz pobrać, wydrukować i mieć zawsze pod ręką. Na wypadek, gdybyś potrzebował/a pomocy – Ty lub ktoś bliski.
          </p>
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-10 py-16 md:py-24 pb-32 space-y-24">
        
        {/* Download Block */}
        <section className="bg-white rounded-[48px] shadow-2xl border-4 border-slate-50 p-8 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-amber-200/50">
                <FileDown className="w-10 h-10" />
              </div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-6">Bezpiecznik – Poradnik Pomocy <br/> (Wersja 1.0)</h2>
              <p className="text-lg text-slate-500 mb-8 font-medium leading-relaxed">
                Plik PDF przygotowany do druku (A5) oraz w wersji dostępnej cyfrowo. Zawiera numery telefonów zaufania, adresy instytucji i proste instrukcje krok po kroku.
              </p>
              
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-10">
                <p className="text-sm text-slate-600 italic font-medium">
                  Uwaga: Plik PDF jest w trakcie przygotowania. Wróć wkrótce lub zostaw nam swój e-mail w sekcji Kontakt – poinformujemy Cię, gdy będzie gotowy.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/kontakt" className="btn bg-slate-900 text-white hover:bg-slate-800 py-6 px-10 text-lg flex items-center gap-3">
                  <Mail className="w-6 h-6" /> Powiadom mnie o gotowości
                </Link>
                <button disabled className="btn btn-outline border-slate-200 text-slate-300 py-6 px-10 text-lg cursor-not-allowed">
                  <Download className="w-6 h-6" /> Pobierz PDF (Wkrótce)
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: <Phone />, label: 'Numery alarmowe' },
                { icon: <MapPin />, label: 'Lokalne wsparcie' },
                { icon: <BookOpen />, label: 'Instrukcje krok po kroku' },
                { icon: <Printer />, label: 'Wersja do druku' },
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 flex flex-col items-center text-center group hover:bg-white hover:border-amber-200 hover:shadow-xl transition-all">
                  <div className="w-12 h-12 bg-white text-amber-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-900">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Content Preview */}
        <section className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-10 leading-none">Co znajdziesz <br/><span className="text-amber-600 font-serif italic font-normal underline decoration-amber-200">w środku?</span></h2>
            <ul className="space-y-6">
              {[
                "Numery telefonów zaufania i linii kryzysowych (bezpłatne, 24/7)",
                "Jak znaleźć Ośrodek Pomocy Społecznej w swojej gminie",
                "Co zrobić w sytuacji przemocy domowej – krok po kroku",
                "Jak ubiegać się o bezpłatną pomoc prawną",
                "Gdzie szukać wsparcia psychologicznego bez kolejek",
                "Lista organizacji pozarządowych w Polsce i ich specjalizacje"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-slate-600 font-medium leading-relaxed group">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mt-0.5 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-amber-600 p-10 md:p-14 rounded-[48px] text-white shadow-2xl relative overflow-hidden h-full flex flex-col justify-center">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mb-32"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-10">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black mb-8 leading-tight">Bezpłatny i bezpieczny.</h3>
              <p className="text-lg text-amber-100 mb-10 font-medium leading-relaxed">
                Bezpiecznik jest i zawsze będzie bezpłatny. Możesz go drukować i rozdawać bez ograniczeń. Naszym celem jest, aby wiedza o pomocy dotarła do każdego, kto jej potrzebuje.
              </p>
              <div className="text-xs font-black uppercase tracking-[0.2em] text-amber-200">
                #WsparcieBezBarier #LudzieDlaLudzi
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Mini Section */}
        <section className="py-20 border-t border-slate-100 text-center space-y-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-slate-900 mb-6">Nie czekaj na PDF – pomoc jest dostępna teraz.</h2>
            <p className="text-slate-500 font-medium">Jeśli potrzebujesz wsparcia natychmiast, skontaktuj się z jedną z poniższych linii. To Twoje prawo.</p>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-8 bg-rose-50 rounded-3xl border border-rose-100 flex flex-col items-center">
              <div className="text-4xl mb-4 font-black text-rose-600">112</div>
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-800">Alarmowy</span>
            </div>
            <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100 flex flex-col items-center">
              <div className="text-4xl mb-4 font-black text-blue-600">116 123</div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-800">Dla dorosłych</span>
            </div>
            <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100 flex flex-col items-center">
              <div className="text-4xl mb-4 font-black text-amber-600">116 111</div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-800">Dla dzieci</span>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
