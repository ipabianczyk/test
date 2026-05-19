import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, Search, ShieldAlert, 
  ArrowRight, Heart, Info, X, Zap, MessageCircle,
  Share2, ExternalLink, Bookmark, CheckCircle2
} from 'lucide-react';
import { SITE_CONFIG } from '../data/siteConfig';
import { getAllPosts } from '../services/blogService';

export default function QuickHelp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const blogPosts = useMemo(() => getAllPosts(), []);

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return blogPosts.slice(0, 4);
    return blogPosts.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 6);
  }, [searchQuery, blogPosts]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Panel Szybkiego Wsparcia - MostPomocy',
          text: 'Wszystkie ważne numery i poradniki w jednym miejscu.',
          url: window.location.href,
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const QUICK_LINKS = [
    { title: 'Telefony SOS', icon: Phone, color: 'rose', path: '/potrzebomat', desc: 'Połącz się z ekspertem 24/7' },
    { title: 'Baza Wiedzy', icon: Heart, color: 'amber', path: '/blog', desc: 'Poradniki i Twoje prawa' },
    { title: 'Mapa Miejsc', icon: MapPin, color: 'emerald', path: '/mapa', desc: 'Znajdź pomoc w regionie' },
    { title: 'Kreator', icon: Zap, color: 'blue', path: '/potrzebomat', desc: 'Napisz wiadomość e-mail' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 pb-20">
      {/* Header Dashboard Style */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg shadow-blue-200">
               MP
             </div>
             <div>
               <h1 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Panel Szybki</h1>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Wszystko w jednym miejscu</p>
             </div>
          </Link>
          
          <button 
            onClick={handleShare}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              copied ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            {copied ? 'Skopiowano!' : 'Udostępnij'}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 md:py-10 space-y-10 md:space-y-14">
        
        {/* Search Engine - Centered & Powerful */}
        <section className="text-center space-y-8">
           <div className="max-w-2xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-[32px] blur opacity-10 group-focus-within:opacity-30 transition-opacity" />
              <div className="relative bg-white rounded-[30px] shadow-2xl shadow-slate-200/50 border border-slate-100 flex items-center">
                <Search className="ml-6 w-5 h-5 text-slate-300 group-focus-within:text-blue-500" />
                <input 
                  type="text" 
                  placeholder="Problem? Np. 'alimenty', 'przemoc', 'nocleg'..."
                  className="w-full px-4 py-8 bg-transparent font-black text-lg text-slate-900 outline-none placeholder:text-slate-300 placeholder:font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="mr-6 p-2 bg-slate-50 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-all">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
           </div>
        </section>

        {/* SOS Alert Grid */}
        <section className="grid lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-8 bg-rose-600 rounded-[48px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-rose-200">
            <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <span className="font-black text-xs uppercase tracking-[0.3em] opacity-80">Natychmiastowe Wsparcie</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.85] mb-10 max-w-lg">To nie Twoja wina. <br/>Jesteśmy z Tobą.</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mt-auto">
                <a href={`tel:${SITE_CONFIG.contact.emergency_phone}`} className="flex flex-col justify-between bg-white text-slate-900 p-8 rounded-[36px] hover:bg-rose-50 transition-all group">
                   <p className="text-[10px] font-black uppercase text-rose-600 mb-2 tracking-widest">Dla Dorosłych (Kryzysowe)</p>
                   <div className="flex items-center justify-between">
                     <p className="text-3xl font-black tracking-tighter">{SITE_CONFIG.contact.emergency_phone}</p>
                     <Phone className="w-6 h-6 text-rose-500 group-hover:rotate-12 transition-transform" />
                   </div>
                </a>
                <a href={`tel:${SITE_CONFIG.contact.child_emergency_phone}`} className="flex flex-col justify-between bg-slate-900 text-white p-8 rounded-[36px] hover:bg-black transition-all group border border-slate-800">
                   <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Dzieci i Młodzież</p>
                   <div className="flex items-center justify-between">
                     <p className="text-3xl font-black tracking-tighter">{SITE_CONFIG.contact.child_emergency_phone}</p>
                     <Phone className="w-6 h-6 text-slate-400 group-hover:rotate-12 transition-transform" />
                   </div>
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-emerald-600 rounded-[48px] p-10 text-white flex flex-col justify-between relative overflow-hidden group shadow-2xl shadow-emerald-200">
             <div className="relative z-10">
               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                 <MapPin className="w-7 h-7" />
               </div>
               <h3 className="text-3xl font-black tracking-tighter leading-none mb-4">Gdzie uciec?</h3>
               <p className="text-white/70 font-medium text-sm leading-relaxed mb-10">Baza bezpiecznych schronisk, noclegowni i ośrodków interwencji kryzysowej dostępna tu i teraz.</p>
             </div>
             <Link to="/mapa" className="relative z-10 bg-white text-emerald-600 p-5 rounded-2xl font-black text-xs uppercase tracking-widest text-center hover:bg-emerald-50 transition-all shadow-xl">
               Otwórz Mapę Miejsc
             </Link>
             <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-[60px]" />
          </div>
        </section>

        {/* Categories / Links */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {QUICK_LINKS.map(link => {
              const Icon = link.icon;
              return (
                <Link 
                  key={link.title} 
                  to={link.path}
                  className="bg-white p-8 rounded-[40px] border-2 border-transparent hover:border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden"
                >
                  <div className={`w-14 h-14 mb-6 rounded-2xl flex items-center justify-center bg-${link.color}-50 text-${link.color}-500 group-hover:scale-110 transition-transform shadow-sm`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h4 className="font-black text-lg text-slate-900 mb-2 leading-none">{link.title}</h4>
                  <p className="text-xs font-medium text-slate-400 group-hover:text-slate-600 transition-colors">{link.desc}</p>
                  <ArrowRight className="absolute bottom-8 right-8 w-5 h-5 text-slate-200 group-hover:text-amber-500 group-hover:translate-x-2 transition-all opacity-20 group-hover:opacity-100" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Dynamic Knowledge Feed */}
        <section className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Baza Wiedzy SOS</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Najważniejsze artykuły dla Ciebie</p>
            </div>
            <Link to="/blog" className="flex items-center gap-2 text-xs font-black uppercase text-blue-600 hover:text-blue-700">
               Pełna baza <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link 
                    to={`/blog/${post.id}`}
                    className="flex flex-col bg-white p-8 rounded-[40px] border border-slate-100 hover:shadow-2xl hover:shadow-blue-200/20 transition-all group h-full"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <span className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-sm ${post.alert_level === 'urgent' ? 'bg-rose-100 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
                        {post.category}
                      </span>
                      {post.alert_level === 'urgent' && <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                    </div>
                    <h4 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-[1.1] mb-6 line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{post.readTime}</span>
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 group-hover:translate-x-2 transition-transform">
                         Czytaj <ArrowRight className="w-4 h-4" />
                       </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[48px] border-4 border-white shadow-xl">
              <Search className="w-16 h-16 text-slate-100 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">Brak wyników</h3>
              <p className="text-slate-400 font-medium">Spróbuj wpisać inaczej, np. "alimenty" lub "pomoc".</p>
            </div>
          )}
        </section>

        {/* Footer Support Hub */}
        <section className="bg-slate-900 rounded-[56px] p-12 md:p-20 text-center relative overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent opacity-50" />
           <div className="relative z-10">
             <MessageCircle className="w-16 h-16 text-blue-400 mx-auto mb-8" />
             <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-none">Chcesz napisać <br/>do specjalisty?</h3>
             <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 max-w-xl mx-auto leading-relaxed">Nasz Kreator Zgłoszeń (Potrzebomat) pomoże Ci sformułować opis problemu i wyśle go pod właściwy adres.</p>
             <Link 
               to="/potrzebomat" 
               className="inline-flex items-center gap-4 px-12 py-6 bg-blue-600 text-white rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-blue-500 transition-all shadow-2xl shadow-blue-900/40 hover:scale-105"
             >
               Start Kreator <Zap className="w-5 h-5 text-amber-400" />
             </Link>
           </div>
        </section>

      </main>
    </div>
  );
}
