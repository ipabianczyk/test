import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { X } from 'lucide-react';
import { getAllPosts } from '../services/blogService';
import { SITE_CONFIG } from '../data/siteConfig';

const getCategoryStyles = (category: string) => {
  const norm = (category || '').toUpperCase();
  switch(norm) {
    case 'PRAWO':
      return {
        cardBg: 'bg-[#FDFBF7] hover:bg-[#FCF9F2]',
        border: 'border-[#F1E4CE] hover:border-[#DFCBB1]',
        badgeBg: 'bg-[#FAF3E4] text-[#8C6239]',
        accentBar: 'border-l-[#8C6239]'
      };
    case 'ZDROWIE':
      return {
        cardBg: 'bg-[#F7FAF8] hover:bg-[#F2F7F4]',
        border: 'border-[#DFEAE4] hover:border-[#CCDED4]',
        badgeBg: 'bg-[#EBF3EF] text-[#2C6B4E]',
        accentBar: 'border-l-[#2C6B4E]'
      };
    case 'HISTORIA':
      return {
        cardBg: 'bg-[#FAF7FC] hover:bg-[#F5EFF9]',
        border: 'border-[#EBE2F5] hover:border-[#CDAFEE]',
        badgeBg: 'bg-[#F2EBF7] text-[#6A3D9A]',
        accentBar: 'border-l-[#6A3D9A]'
      };
    case 'INTERWENCJA':
      return {
        cardBg: 'bg-[#FFF8F8] hover:bg-[#FFF2F2]',
        border: 'border-[#FCDADA] hover:border-[#FAC8C8]',
        badgeBg: 'bg-[#FCE8E8] text-[#B83232]',
        accentBar: 'border-l-[#B83232]'
      };
    case 'PORADNIK':
    default:
      return {
        cardBg: 'bg-[#F7FAFC] hover:bg-[#F2F6FA]',
        border: 'border-[#DFE7EE] hover:border-[#BBCDE1]',
        badgeBg: 'bg-[#EBF1F6] text-[#2F6087]',
        accentBar: 'border-l-[#2F6087]'
      };
  }
};

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const blogPosts = useMemo(() => getAllPosts(), []);
  
  const { categories, tags } = useMemo(() => {
    const cats = new Set<string>();
    const tgs = new Set<string>();
    blogPosts.forEach(p => {
      cats.add(p.category);
      p.tags?.forEach(t => tgs.add(t));
    });
    return { 
      categories: Array.from(cats),
      tags: Array.from(tgs)
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

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 pb-20">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* KOLUMNA LEWA: Hugo Stack Sidebar */}
                <aside className="lg:col-span-3 bg-white p-6 lg:p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8 lg:sticky top-24 z-10 w-full overflow-hidden">
                    {/* Szukaj Widget */}
                    <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-inner relative group text-left">
                        <LucideIcons.Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            placeholder="Szukaj artykułów..." 
                            className="w-full bg-transparent py-2 pl-10 pr-4 rounded-xl font-bold text-slate-900 focus:outline-none transition-all text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Profil */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
                        <div className="avatar placeholder">
                            <div className="bg-blue-600 text-white rounded-full w-24 h-24 shadow-lg ring-4 ring-blue-50 flex items-center justify-center">
                                <span className="text-3xl font-black">MP</span>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-black tracking-tight text-slate-900">MostPomocy.pl</h2>
                            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-1">Sieć Wsparcia</p>
                            <p className="text-xs text-slate-500 font-medium mt-3 leading-relaxed">
                                Baza wiedzy eksperckiej, wsparcia psychologicznego i interwencyjnego.
                            </p>
                        </div>
                    </div>

                    <hr className="border-slate-100" />
                    
                    <nav aria-label="Nawigacja bloga" className="flex flex-col w-full space-y-1 font-bold text-slate-700">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 px-3">NAWIGACJA</p>
                        <Link to="/" className="flex items-center gap-4 py-3 px-3 hover:bg-slate-50 hover:text-blue-600 rounded-2xl transition duration-200">
                            <LucideIcons.Home className="w-5 h-5 text-slate-400" /> Strona Główna
                        </Link>
                        <Link to="/mapa" className="flex items-center gap-4 py-3 px-3 hover:bg-slate-50 hover:text-blue-600 rounded-2xl transition duration-200">
                            <LucideIcons.Map className="w-5 h-5 text-slate-400" /> Mapa Pomocy
                        </Link>
                        <Link to="/potrzebomat" className="flex items-center gap-4 py-3 px-3 hover:bg-slate-50 hover:text-blue-600 rounded-2xl transition duration-200">
                            <LucideIcons.Search className="w-5 h-5 text-slate-400" /> Potrzebomat
                        </Link>
                    </nav>

                    <hr className="border-slate-100" />
                    
                    <div className="bg-red-50 border border-red-200 p-5 rounded-3xl">
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest block mb-1">BEZPIECZEŃSTWO SOS</span>
                        <p className="text-xs text-red-800 leading-relaxed font-semibold mb-4 text-left">Musisz natychmiast opuścić stronę?</p>
                        <a href="https://google.com" className="flex items-center justify-center py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors shadow-sm" aria-label="Szybkie wyjście, przekierowuje do Google">Szybkie Wyjście</a>
                    </div>
                </aside>

                {/* KOLUMNA ŚRODKOWA: Główny Grid Wpisów */}
                <main className="lg:col-span-9 space-y-6 w-full max-w-full min-w-0">
                    
                    {/* Wyszukiwarka - przeniesiona nad wpisy by była zawsze widoczna na mobilkach jako pierwsza opcja */}
                    <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-inner relative group text-left mb-4">
                        <LucideIcons.Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            placeholder="Szukaj artykułów..." 
                            className="w-full bg-transparent py-2 pl-10 pr-4 rounded-xl font-bold text-slate-900 focus:outline-none transition-all text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Kategorie - Poziomy scroll */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
                        <button 
                            onClick={() => setSelectedCategory(null)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                selectedCategory === null 
                                ? 'bg-slate-900 text-white shadow-md' 
                                : 'bg-white text-slate-500 border border-slate-200 hover:text-slate-900 hover:border-slate-300'
                            }`}
                        >
                            Wszystkie
                        </button>
                        {categories.map((cat) => (
                            <button 
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                    selectedCategory === cat 
                                    ? 'bg-slate-900 text-white shadow-md' 
                                    : 'bg-white text-slate-500 border border-slate-200 hover:text-slate-900 hover:border-slate-300'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Opcjonalny nagłówek listingu */}
                    {(selectedCategory || searchQuery) && (
                        <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden text-left mb-6">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-50"></div>
                            <div className="relative z-10">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] block mb-2">
                                    {selectedCategory ? `Kategoria` : `Wyniki wyszukiwania`}
                                </span>
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-3">
                                    {selectedCategory || searchQuery}
                                </h1>
                                <button 
                                    onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
                                    className="mt-2 text-[10px] items-center inline-flex gap-2 font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-4 py-2 rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    <LucideIcons.X className="w-4 h-4" /> Resetuj
                                </button>
                            </div>
                        </div>
                    )}

                    <AnimatePresence mode="popLayout">
                        {filteredPosts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                                {filteredPosts.map((post, idx) => {
                                    const colStyles = getCategoryStyles(post.category);
                                    return (
                                        <motion.article
                                            key={post.id}
                                            layout
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className={`${colStyles.cardBg} ${colStyles.border} border-2 border-l-8 ${colStyles.accentBar} rounded-[24px] overflow-hidden group flex flex-col transition-all p-6 md:p-8 min-h-[320px] text-[#1a211e] hover:-translate-y-0.5 hover:shadow-xs`}
                                        >
                                            <div className="text-left flex flex-col flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                                    <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg ${colStyles.badgeBg}`}>
                                                        {post.category}
                                                    </span>
                                                </div>

                                                <h2 className="text-xl font-serif font-black text-[#0f1412] tracking-tight leading-snug mb-4 group-hover:text-black transition-colors">
                                                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                                                </h2>

                                                <p className="text-[#374151] font-sans font-medium text-xs md:text-sm leading-relaxed mb-6 line-clamp-4">
                                                    {post.excerpt}
                                                </p>
                                                
                                                <div className="flex items-center justify-between border-t border-slate-150 pt-5 mt-auto">
                                                    <span className="text-[9px] uppercase font-black tracking-widest text-[#6B7280] flex items-center gap-1.5">
                                                        <LucideIcons.Calendar className="w-3.5 h-3.5" />
                                                        {post.date}
                                                    </span>
                                                    <Link to={`/blog/${post.id}`} className="text-[10px] font-black uppercase tracking-widest text-[#0f1412] hover:translate-x-1 transition-transform flex items-center gap-1.5">
                                                        Czytaj <LucideIcons.ArrowRight className="w-4 h-4 text-slate-400" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.article>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-24 text-center bg-white rounded-[32px] border border-slate-200 shadow-sm">
                                <LucideIcons.FileQuestion className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-4">Pusto tutaj.</h3>
                                <p className="text-slate-500 font-medium max-w-sm mx-auto">Nic nie znaleźliśmy. Spróbuj zmienić filtry lub wyszukaną frazę.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    </div>
  );
}
