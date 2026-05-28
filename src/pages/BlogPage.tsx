import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { 
  ArrowRight, Search, X, Clock, ChevronRight,
  ShieldAlert, Phone, Heart, Info, Scale, 
  HandHelping, AlertTriangle, FileText
} from 'lucide-react';
import { getAllPosts, BlogPost } from '../services/blogService';
import { SITE_CONFIG } from '../data/siteConfig';

const IconRenderer = ({ iconName, className }: { iconName?: string, className?: string }) => {
  const Icon = (LucideIcons as any)[iconName || 'FileText'] || FileText;
  return <Icon className={className} />;
};

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const blogPosts = useMemo(() => getAllPosts(), []);
  
  const { categories } = useMemo(() => {
    const cats = new Set<string>();
    blogPosts.forEach(p => {
      cats.add(p.category);
    });
    return { 
      categories: Array.from(cats)
    };
  }, [blogPosts]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        post.title.toLowerCase().includes(query) || 
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(t => t.toLowerCase().includes(query));

      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [blogPosts, searchQuery, selectedCategory]);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return blogPosts
      .filter(p => p.title.toLowerCase().includes(query))
      .slice(0, 5)
      .map(p => ({ title: p.title, id: p.id }));
  }, [searchQuery, blogPosts]);

  return (
    <div className="bg-slate-50 min-h-screen pb-40">
      {/* Help Center Hero */}
      <section className="bg-white border-b border-slate-200 pt-10 md:pt-20 pb-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-blue-50 to-transparent" />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors mb-8">
            <ArrowRight className="w-4 h-4 rotate-180" /> Powrót do portalu
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6">
            Jak możemy Ci pomóc?
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-10 font-medium">
            Przeszukaj naszą bazę wiedzy, aby znaleźć porady prawne, psychologiczne i życiowe.
          </p>

          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-2 bg-blue-500/10 rounded-[32px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 flex items-center p-2">
              <div className="pl-4 pr-2">
                <Search className="w-6 h-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Np. alimenty, przemoc, nocleg..."
                className="w-full px-2 py-4 bg-transparent font-bold text-lg outline-none placeholder:text-slate-300"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              )}
            </div>

            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 text-left"
                >
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sugestie</span>
                  </div>
                  {suggestions.map((s) => (
                    <Link 
                      key={s.id} 
                      to={`/blog/${s.id}`} 
                      className="flex items-center gap-4 px-6 py-4 hover:bg-blue-50 transition-colors border-b border-slate-50 last:border-0 w-full"
                      onClick={() => setShowSuggestions(false)}
                    >
                        <FileText className="w-5 h-5 text-blue-400" />
                        <span className="text-base font-bold text-slate-700">{s.title}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-10 py-12 md:py-16 space-y-12">
        {/* Categories Toolbar */}
        <section className="flex flex-col items-center space-y-6">
          <div className="flex gap-3 overflow-x-auto no-scrollbar w-full justify-start md:justify-center px-4 py-2">
            {['Wszystkie', ...categories].map(cat => {
              const isAll = cat === 'Wszystkie';
              const isActive = isAll ? !selectedCategory : selectedCategory === cat;
              return (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(isAll ? null : cat)} 
                  className={`whitespace-nowrap px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' 
                      : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          {(searchQuery || selectedCategory) && (
             <div className="mb-12 flex items-center justify-between">
                <div>
                   <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 italic">
                     {searchQuery ? `Dla frazy: "${searchQuery}"` : selectedCategory}
                   </h2>
                   <p className="text-slate-400 font-bold mt-2 uppercase tracking-[0.2em] text-[10px]">Znaleziono {filteredPosts.length} rekordów w bazie wiedzy</p>
                </div>
                {(searchQuery || selectedCategory) && (
                   <button 
                     onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                     className="text-[10px] font-black uppercase tracking-widest text-white bg-slate-900 px-6 py-3 rounded-full hover:bg-blue-600 transition-colors shadow-lg"
                   >
                     Resetuj filtry
                   </button>
                )}
             </div>
          )}
          
          <AnimatePresence mode="popLayout">
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                {filteredPosts.map((post, idx) => {
                  const isWarning = post.alert_level === 'warning';
                  const isUrgent = post.alert_level === 'urgent';
                  
                  return (
                    <motion.div
                      key={post.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group flex h-full"
                    >
                      <Link 
                        to={`/blog/${post.id}`}
                        className={`flex flex-col flex-1 bg-white rounded-[48px] overflow-hidden border-4 transition-all duration-500 relative ${
                          isUrgent ? 'border-rose-500 shadow-2xl shadow-rose-100' :
                          isWarning ? 'border-amber-400 shadow-xl shadow-amber-50' :
                          'border-white shadow-xl shadow-slate-200/50 hover:border-blue-500 hover:shadow-blue-100 hover:-translate-y-2'
                        }`}
                      >
                         {/* Kolorowy boczny pasek dla alertów */}
                         {(isUrgent || isWarning) && (
                           <div className={`absolute left-0 inset-y-0 w-3 ${isUrgent ? 'bg-rose-500' : 'bg-amber-400'}`} />
                         )}

                         <div className="p-8 md:p-12 flex flex-col flex-1">
                            {/* Kategoria i ikona */}
                            <div className="flex items-center justify-between mb-8">
                               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-inner ${
                                 isUrgent ? 'bg-rose-50 text-rose-600' : 
                                 isWarning ? 'bg-amber-50 text-amber-600' : 
                                 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                               }`}>
                                  <IconRenderer iconName={post.icon} className="w-7 h-7" />
                               </div>
                               <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border ${
                                 isUrgent ? 'bg-rose-500 text-white border-rose-500' :
                                 isWarning ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                 'bg-slate-50 text-slate-400 border-slate-100'
                               }`}>
                                 {post.category}
                               </span>
                            </div>

                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                               <Clock className="w-3.5 h-3.5" /> {post.readTime}
                               <span>•</span>
                               <span>{post.date}</span>
                            </div>
                            
                            <h2 className="text-2xl md:text-3xl font-black tracking-tighter leading-none mb-6 group-hover:text-blue-600 transition-colors">
                              {post.title}
                            </h2>
                            
                            <p className="text-slate-500 font-medium leading-relaxed line-clamp-3 text-sm md:text-base mb-10 overflow-hidden">
                              {post.excerpt}
                            </p>
                            
                            <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
                               <span className="group-hover:translate-x-2 transition-transform">Szczegóły Triage-u</span>
                               <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
                            </div>
                         </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="py-20 text-center bg-white rounded-[40px] border border-slate-100 shadow-md">
                 <Search className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                 <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-4">Nic tu nie ma.</h3>
                 <p className="text-slate-500 font-medium max-w-md mx-auto">Nasze poradniki jeszcze powstają na ten temat. Spróbuj powrócić do widoku głównego.</p>
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* Global Crisis Banner */}
        <section className="bg-slate-900 rounded-[56px] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 translate-x-1/2" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
             <div className="space-y-8">
                <div className="w-14 h-14 bg-white text-slate-900 rounded-2xl flex items-center justify-center">
                   <ShieldAlert className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none italic">
                  Szukasz pomocy <br/>w tej sekundzie?
                </h3>
                <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-md">
                   Nie czekaj. W Bazie Wiedzy są poradniki, ale w kryzysie liczy się głos drugiego człowieka.
                </p>
             </div>
             <div className="flex flex-col gap-4">
                <a href={`tel:${SITE_CONFIG.contact.emergency_phone}`} className="flex items-center justify-between bg-white text-slate-900 p-8 rounded-[36px] hover:bg-amber-50 transition-all group">
                   <div className="flex items-center gap-6">
                     <div className="w-12 h-12 bg-slate-50 flex items-center justify-center rounded-2xl font-black text-2xl group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">116</div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Dorośli</p>
                        <p className="text-2xl font-black tracking-tighter">116 123</p>
                     </div>
                   </div>
                   <Phone className="w-6 h-6 text-amber-500 group-hover:rotate-12 transition-transform" />
                </a>
                <a href={`tel:${SITE_CONFIG.contact.child_emergency_phone}`} className="flex items-center justify-between bg-slate-800 text-white p-8 rounded-[36px] hover:bg-slate-700 transition-all group border border-slate-700">
                   <div className="flex items-center gap-6">
                     <div className="w-12 h-12 bg-slate-900 flex items-center justify-center rounded-2xl font-black text-2xl group-hover:bg-blue-600 transition-colors">111</div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Dzieci i Młodzież</p>
                        <p className="text-2xl font-black tracking-tighter">116 111</p>
                     </div>
                   </div>
                   <Phone className="w-6 h-6 text-slate-500 group-hover:rotate-12 transition-transform" />
                </a>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
