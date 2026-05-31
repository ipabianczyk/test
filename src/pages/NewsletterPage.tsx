import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowRight, ShieldCheck, CheckCircle2, User, AlertTriangle } from 'lucide-react';
import { SITE_CONFIG } from '../data/siteConfig';

export default function NewsletterPage() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Dummy action since we can't truly hit the user's GAS directly in preview without their URL
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setStatus('loading');
    
    // Simulate network request to Google Apps Script webhook
    setTimeout(() => {
      // Logic for real implementation: 
      // fetch(process.env.GAS_WEBHOOK_URL, { method: 'POST', body: JSON.stringify(formData) })
      setStatus('success');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-900 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            <Mail className="w-4 h-4" /> Newsletter MostPomocy
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-[#0f1412] tracking-tighter leading-tight">
            Wiedza, która<br/><span className="italic font-normal text-slate-500">zmienia sytuację</span>
          </h1>
          <p className="max-w-xl mx-auto text-sm text-[#1a211e] font-sans font-medium leading-relaxed">
            Raz w miesiącu wysyłamy sprawdzony poradnik prawno-socjalny, zmiany w przepisach i rzetelne materiały. 
            Dołącz do powiadomień. Brak spamu, zero reklam.
          </p>
        </header>

        <section className="bg-white rounded-[40px] border border-slate-200 p-8 md:p-14 shadow-sm relative overflow-hidden">
          {/* Decorative Blur */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-50 z-0"></div>
          
          <div className="grid md:grid-cols-2 gap-12 relative z-10 items-center">
            
            {/* Formularz */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-serif font-black text-[#0f1412] mb-2">
                  Zapisz się do listy
                </h2>
                <p className="text-xs text-slate-500 font-medium">Standard Double Opt-In (pamiętaj, by potwierdzić e-mail).</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Jak mamy się do Ciebie zwracać?</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      disabled={status === 'loading' || status === 'success'}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Twoje imię"
                      className="w-full bg-slate-50 font-bold text-xs text-[#0f1412] pl-12 pr-4 py-4 rounded-2xl border border-slate-200 outline-none focus:border-slate-800 transition-colors disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Adres e-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      disabled={status === 'loading' || status === 'success'}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="twoj.adres@email.com"
                      className="w-full bg-slate-50 font-bold text-xs text-[#0f1412] pl-12 pr-4 py-4 rounded-2xl border border-slate-200 outline-none focus:border-slate-800 transition-colors disabled:opacity-50"
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {status === 'idle' || status === 'error' ? (
                    <motion.button 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      type="submit" 
                      className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-md group"
                    >
                      Potwierdzam zapis <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  ) : status === 'loading' ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full flex items-center justify-center py-4 bg-slate-100 rounded-2xl text-[#0f1412] text-[10px] font-black uppercase tracking-widest"
                    >
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-4 h-4 border-2 border-[#0f1412] border-t-transparent rounded-full mr-2"
                      />
                      Przetwarzanie...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full flex flex-col items-center justify-center py-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-900 space-y-2"
                    >
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Wiadomość weryfikacyjna wysłana!</span>
                      <p className="text-xs font-medium text-emerald-800 text-center max-w-xs">
                        Sprawdź skrzynkę odbiorczą (i SPAM), by potwierdzić zapis do newslettera.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-4 rounded-xl text-xs font-bold uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" /> Błąd serwera. Spróbuj powtórnie za chwilę.
                  </div>
                )}
              </form>

              <div className="flex items-start gap-3 mt-6 pt-6 border-t border-slate-100">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[10px] font-medium leading-relaxed text-slate-500">
                  Zapisując się akceptujesz <a href="/polityka-prywatnosci" className="text-[#0f1412] underline font-bold">Politykę Prywatności</a>. 
                  Twoje dane przetwarzane są wyłączenie w celu wysyłki newslettera edukacyjnego (Google Apps Script / Listmonk). Możesz wypisać się w każdym momencie jednym kliknięciem.
                </p>
              </div>
            </div>

            {/* Wizualizacja */}
            <div className="hidden md:flex justify-center">
              <div className="bg-slate-50 border border-slate-200 rounded-[32px] p-8 space-y-6 w-full max-w-sm shadow-inner relative transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-2 border-b border-slate-200 pb-4">
                  <div className="h-2 w-16 bg-emerald-200 rounded-full mb-4"></div>
                  <div className="h-4 w-3/4 bg-slate-300 rounded-full"></div>
                  <div className="h-4 w-1/2 bg-slate-200 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-slate-200 rounded-full"></div>
                  <div className="h-2 w-full bg-slate-200 rounded-full"></div>
                  <div className="h-2 w-5/6 bg-slate-200 rounded-full"></div>
                  <div className="h-2 w-4/6 bg-slate-200 rounded-full"></div>
                </div>
                <div className="pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-slate-300 rounded-full"></div>
                    <div className="h-2 w-16 bg-slate-300 rounded-full"></div>
                  </div>
                  <div className="w-12 h-6 bg-amber-100 rounded-full"></div>
                </div>
                
                {/* Wpinka Gwarancji */}
                <div className="absolute -bottom-6 -left-6 bg-[#0f1412] text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 w-48">
                  <Mail className="w-6 h-6 text-emerald-400" />
                  <div className="text-[9px] font-black uppercase tracking-widest leading-tight">
                    Bez<br/>Spamu
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
