import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Mail, Phone, AlertCircle, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-10 py-6 text-xs font-bold uppercase tracking-widest text-slate-400">
        <Link to="/" className="hover:text-amber-600 transition-colors">Start</Link>
        <span className="mx-2 opacity-30">›</span>
        <span className="text-slate-900">Kontakt</span>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-10 py-12 md:py-20 pb-32">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20">
          
          {/* Info Side */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <div className="section-tag mb-6">Kontakt</div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none text-slate-900 mb-8">
                Masz pytanie? <br/>
                <span className="text-amber-600 italic font-serif font-normal">Napisz do nas.</span>
              </h1>
              <p className="text-xl text-slate-500 leading-relaxed font-medium">
                Masz opinię, chcesz zgłosić instytucję lub nawiązać współpracę? Odpowiemy najszybciej, jak możemy.
              </p>
            </div>

            <div className="space-y-6">
              <a 
                href="mailto:Mostpomocy@gmail.com" 
                className="flex items-center gap-6 p-6 bg-white rounded-3xl shadow-sm border border-slate-100 hover:border-amber-500 hover:shadow-xl transition-all group"
              >
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Wyślij e-mail</div>
                  <div className="text-lg font-black text-slate-900">Mostpomocy@gmail.com</div>
                </div>
              </a>

              <div className="p-8 bg-slate-900 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <Phone className="w-5 h-5 text-amber-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pomoc natychmiastowa</span>
                  </div>
                  <h3 className="text-2xl font-black mb-6 leading-tight">To nie jest linia kryzysowa.</h3>
                  <p className="text-sm text-slate-400 mb-8 font-medium">Jeśli potrzebujesz pomocy teraz, zadzwoń pod numer alarmowy lub telefon zaufania.</p>
                  <div className="flex flex-wrap gap-4">
                    <a href="tel:112" className="px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-sm hover:bg-amber-400 transition-colors">112</a>
                    <a href="tel:116123" className="px-6 py-3 bg-white/10 text-white rounded-xl font-black text-sm hover:bg-white hover:text-slate-900 transition-colors">116 123</a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
              <div>
                <p className="text-sm font-black text-amber-900 mb-2">Informacja RODO</p>
                <p className="text-xs text-amber-800/80 leading-relaxed font-medium">
                  Wypełniając formularz, wyrażasz zgodę na przetwarzanie podanych danych osobowych wyłącznie w celu odpowiedzi na Twoje zapytanie. Więcej informacji znajdziesz w naszej <Link to="/polityka-prywatnosci" className="underline font-bold">polityce prywatności</Link>.
                </p>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-3">
            <div className="bg-white p-4 rounded-[48px] shadow-2xl border-8 border-slate-100 overflow-hidden relative min-h-[800px]">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSc2Uoxa0f2fYD-rHG6Ufi8ufqKHNrD88VoXlfyYb1ne6Gg6Iw/viewform?embedded=true"
                className="w-full h-full min-h-[760px] border-none"
                title="Formularz kontaktowy MostPomocy"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              >
                Ładowanie...
              </iframe>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
