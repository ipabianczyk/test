import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, CheckCircle2, Bookmark, ExternalLink, 
  Phone, ShieldCheck, Stethoscope, Users, MapPin, ClipboardList,
  Accessibility, Euro, Ribbon, Zap, Sparkles
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { mapCategories } from '../data/mapData';

// Helper to render icon by name
function IconByName({ name, className = "" }: { name: string, className?: string }) {
  switch (name) {
    case 'Stethoscope': return <Stethoscope className={className} />;
    case 'Bookmark': return <Bookmark className={className} />;
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    case 'Heart': return <Heart className={className} />;
    case 'Users': return <Users className={className} />;
    case 'MapPin': return <MapPin className={className} />;
    case 'Phone': return <Phone className={className} />;
    case 'ClipboardList': return <ClipboardList className={className} />;
    case 'Accessibility': return <Accessibility className={className} />;
    case 'Euro': return <Euro className={className} />;
    case 'Ribbon': return <Ribbon className={className} />;
    case 'ExternalLink': return <ExternalLink className={className} />;
    default: return <Zap className={className} />;
  }
}

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  
  const category = useMemo(() => {
    return mapCategories.find(c => c.id === id);
  }, [id]);

  if (!category) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-6xl mb-6">🤷‍♂️</div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Kategoria nie znaleziona</h2>
          <Link to="/mapa" className="btn btn-primary">Wróć do mapy pomocy</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-10 py-6 text-xs font-bold uppercase tracking-widest text-slate-400">
        <Link to="/" className="hover:text-blue-600">Start</Link>
        <span className="mx-2 opacity-30">›</span>
        <Link to="/mapa" className="hover:text-blue-600">Mapa pomocy</Link>
        <span className="mx-2 opacity-30">›</span>
        <span className="text-slate-900">{category.title}</span>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-10 py-12 md:py-20 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <div className="section-tag mb-6">{category.title} - Wsparcie Specjalistyczne</div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none text-slate-900 mb-8">
            {category.heroText} <br/>
            <span className="text-blue-600 italic font-serif font-normal">{category.heroHighlight}</span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed max-w-xl mb-10">
            {category.heroDesc}
          </p>
          <div className="flex flex-wrap gap-4">
             {category.rjpsLink && (
               <a href={category.rjpsLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                 Przejdź do RJPS <ExternalLink className="ml-2 w-4 h-4" />
               </a>
             )}
          </div>
        </motion.div>
        
        <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="hidden lg:block relative"
        >
           <div className="aspect-[4/5] bg-blue-600 rounded-[40px] shadow-2xl shadow-blue-600/20 p-12 flex flex-col justify-end text-white relative overflow-hidden">
             <div className="absolute top-10 right-10 text-white/10 text-9xl font-black italic">
               {category.quote?.emoji || category.emoji}
             </div>
             {category.quote ? (
               <>
                 <div className="text-5xl mb-6 opacity-30"><Heart /></div>
                 <p className="text-3xl font-black tracking-tighter leading-tight">
                   {category.quote.text}
                 </p>
               </>
             ) : (
               <>
                 <div className="text-6xl mb-6">🤝</div>
                 <p className="text-3xl font-black tracking-tighter leading-tight">
                   Jesteśmy po to, by pomóc Ci znaleźć właściwe wsparcie w Twojej okolicy.
                 </p>
               </>
             )}
           </div>
        </motion.div>
      </section>

      {/* Resources Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-10 py-24 bg-white border-y border-slate-100">
        <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Gdzie szukać pomocy? Kafelki wsparcia</h2>
          <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest">
            <Sparkles className="w-4 h-4" /> Aktualizowane na bieżąco
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.resources.map((res, i) => {
            const Wrapper = res.url ? 'a' : 'div';
            const wrapperProps = res.url ? { href: res.url, target: '_blank', rel: 'noopener noreferrer' } : {};
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={res.id}
              >
                <Wrapper 
                  {...wrapperProps}
                  className={`group p-8 bg-slate-50 rounded-[32px] border-2 border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all flex flex-col gap-6 h-full ${res.url ? 'cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1' : ''}`}
                >
                  <div className="flex-shrink-0 w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconByName name={res.icon || 'Heart'} className="text-blue-600 w-6 h-6" />
                  </div>
                  <div className="flex-grow flex flex-col">
                    <h3 className="text-xl font-black tracking-tighter text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                      {res.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-6">
                      {res.desc}
                    </p>
                    {res.url && (
                      <div className="text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center mt-auto">
                        Sprawdź szczegóły <ExternalLink className="ml-2 w-3 h-3" />
                      </div>
                    )}
                  </div>
                </Wrapper>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Interactive Step-by-Step */}
      <section className="bg-slate-900 py-32 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="text-blue-400 font-black uppercase text-xs tracking-widest mb-6">Praktyczny poradnik</div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-12">
                Jak postępować <br/>
                <span className="text-blue-400 italic">krok po kroku?</span>
              </h2>
              
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Nazwij sytuację', desc: 'Nie bój się używać trudnych słów. Nazwanie problemu to pierwszy krok do jego rozwiązania.' },
                  { step: '02', title: 'Wybierz placówkę', desc: 'Skorzystaj z powyższych kafelków lub rejestru RJPS, aby znaleźć najbliższe miejsce pomocy.' },
                  { step: '03', title: 'Przygotuj dokumenty', desc: 'Jeśli idziesz do MOPS lub sądu, zbierz bilingi, orzeczenia lub zaświadczenia o dochodach.' },
                  { step: '04', title: 'Wykonaj ten jeden telefon', desc: 'Często jedna rozmowa z konsultantem infolinii wystarczy, by poczuć ulgę i nakreślić plan.' }
                ].map((s, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-8 group"
                  >
                    <div className="text-3xl font-black text-white/10 group-hover:text-blue-500/50 transition-colors uppercase tracking-[0.2em] pt-1">
                      {s.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{s.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-3xl rounded-[60px] p-12 border border-white/10 relative">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
               <h3 className="text-2xl font-black text-white mb-8 tracking-tight">Twoja osobista checklista</h3>
               <div className="space-y-4">
                 {[
                   'Zapisałem/am numer alarmowy',
                   'Wiem, gdzie jest najbliższy Ośrodek',
                   'Porozmawiałem/am z kimś zaufanym',
                   'Daję sobie prawo do bycia słabym/ą'
                 ].map((item, i) => (
                   <label key={i} className="flex items-center gap-6 p-6 bg-white/5 rounded-[24px] cursor-pointer hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
                     <div className="relative">
                       <input type="checkbox" className="peer hidden" />
                       <div className="w-8 h-8 rounded-xl border-2 border-slate-600 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                         <CheckCircle2 className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                       </div>
                     </div>
                     <span className="font-bold text-slate-300 peer-checked:text-white transition-colors">{item}</span>
                   </label>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Rights / Additional info (if any) */}
      {category.rights && category.rights.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-10 py-24">
          <h2 className="text-3xl font-black tracking-tighter mb-12">Ważne uprawnienia – co musisz wiedzieć</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {category.rights.map((right, i) => (
               <RightsCard key={i} title={right.title} desc={right.desc} />
            ))}
          </div>

          <div className="mt-16 bg-rose-50 border-l-4 border-rose-500 p-8 rounded-r-2xl flex flex-wrap md:flex-nowrap items-center justify-between gap-8">
             <div>
               <h4 className="text-lg font-black text-rose-900 tracking-tight leading-none mb-1">Potrzebujesz natychmiastowej rozmowy?</h4>
               <p className="text-rose-700 text-sm font-medium">Bezpłatny Telefon Zaufania dla Dorosłych:</p>
             </div>
             <a href="tel:116123" className="text-rose-600 font-extrabold text-4xl tracking-tighter">116 123</a>
          </div>
        </section>
      )}
    </div>
  );
}

function RightsCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
      <CheckCircle2 className="w-8 h-8 text-green-500 mb-6" />
      <h3 className="text-xl font-bold tracking-tight mb-4">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
