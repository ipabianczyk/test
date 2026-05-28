import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { 
  Search, X, Clock, Calendar, FileText, ChevronRight, BookOpen, Tag, ArrowRight, CornerDownRight,
  Filter, HelpCircle, User, Info, AlertTriangle, RefreshCw
} from 'lucide-react';
import { getAllPosts, BlogPost } from '../services/blogService';
import { useEditable } from '../hooks/useEditable';

const IconRenderer = ({ iconName, className }: { iconName?: string, className?: string }) => {
  const Icon = (LucideIcons as any)[iconName || 'FileText'] || FileText;
  return <Icon className={className} />;
};

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Editable page headers for standard administrative customization
  const editableHeader = useEditable('/blog', {
    title: "Baza Wiedzy & Poradniki",
    subtitle: "Materiały Triage i Edukacja Pokryzysowa",
    description: "Czyste, merytoryczne i zweryfikowane materiały edukacyjne z zakresu pracy socjalnej, praw konsumenckich, procedur Niebieskiej Karty oraz interwencji kryzysowej."
  });

  const blogPosts = useMemo(() => getAllPosts(), []);

  // Update query state if search param updates (e.g. from global search)
  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  // Aggregate category list and count posts per category
  const categoriesWithCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    blogPosts.forEach(post => {
      counts[post.category] = (counts[post.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [blogPosts]);

  // Aggregate all tags for clean tag cloud
  const allTagsWithCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    blogPosts.forEach(post => {
      if (Array.isArray(post.tags)) {
        post.tags.forEach(t => {
          if (t.trim()) counts[t.trim()] = (counts[t.trim()] || 0) + 1;
        });
      }
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count);
  }, [blogPosts]);

  // Handle immediate search query clear
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedTag(null);
    setSearchParams({});
  };

  // Filter posts based on query, selected category, and selected tag
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        post.title.toLowerCase().includes(q) || 
        post.excerpt.toLowerCase().includes(q) ||
        (Array.isArray(post.tags) && post.tags.some(t => t.toLowerCase().includes(q)));

      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      const matchesTag = !selectedTag || (Array.isArray(post.tags) && post.tags.includes(selectedTag));
      
      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [blogPosts, searchQuery, selectedCategory, selectedTag]);

  return (
    <div className="max-w-7xl mx-auto px-1 sm:px-4 py-6 space-y-10">
      
      {/* Blog Top Header - Minimalist Hugo style */}
      <div className="border-b border-neutral-200/65 pb-6 text-left space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-neutral-900 tracking-tight leading-none italic">
              {editableHeader.title}
            </h1>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-blue-600">
              {editableHeader.subtitle}
            </p>
          </div>
          
          {/* Active Search/Filters Pills */}
          {(searchQuery || selectedCategory || selectedTag) && (
            <button
              onClick={clearFilters}
              className="px-3.5 py-1.5 bg-neutral-900 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 hover:bg-neutral-800 transition-all shadow-md active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-subtle" /> Resetuj filtry
            </button>
          )}
        </div>

        <p className="text-sm text-neutral-500 font-medium max-w-3xl leading-relaxed">
          {editableHeader.description}
        </p>
      </div>

      {/* Main Double-Column Layout (Hugo Stack Signature) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: Feed lists of posts (col-span 8) */}
        <div className="col-span-1 lg:col-span-8 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100">
            <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-neutral-400" /> Publikacje ({filteredPosts.length})
            </h2>
            
            <div className="flex flex-wrap items-center gap-2">
              {selectedCategory && (
                <span className="bg-blue-50 text-blue-800 text-[10px] font-mono px-2.5 py-1 rounded-lg border border-blue-100 uppercase font-black flex items-center gap-1">
                  Kat: {selectedCategory}
                  <button onClick={() => setSelectedCategory(null)} className="hover:text-blue-900">×</button>
                </span>
              )}
              {selectedTag && (
                <span className="bg-amber-50 text-amber-800 text-[10px] font-mono px-2.5 py-1 rounded-lg border border-amber-100 uppercase font-black flex items-center gap-1">
                  Tag: #{selectedTag}
                  <button onClick={() => setSelectedTag(null)} className="hover:text-amber-900">×</button>
                </span>
              )}
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredPosts.length > 0 ? (
              <div className="space-y-6">
                {filteredPosts.map((post, idx) => {
                  const isUrgent = post.alert_level === 'urgent';
                  const isWarning = post.alert_level === 'warning';
                  
                  return (
                    <motion.article
                      key={post.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2, delay: Math.min(idx * 0.04, 0.2) }}
                      className={`group bg-white rounded-3xl border text-left transition-all duration-300 relative overflow-hidden ${
                        isUrgent 
                          ? 'border-l-4 border-l-rose-500 border-neutral-200/50 hover:border-l-rose-600 shadow-md shadow-neutral-100' 
                          : isWarning 
                          ? 'border-l-4 border-l-amber-500 border-neutral-200/50 hover:border-l-amber-600 shadow-md shadow-neutral-100'
                          : 'border-neutral-200/50 hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-100'
                      }`}
                    >
                      <Link to={`/blog/${post.id}`} className="block p-5 sm:p-7">
                        <div className="space-y-4">
                          {/* Card top row */}
                          <div className="flex flex-wrap items-center justify-between gap-2.5">
                            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-neutral-400">
                              <span className="font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                {post.category}
                              </span>
                              <span className="text-neutral-300">•</span>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-neutral-300" />
                                <span>{post.date}</span>
                              </div>
                              <span className="text-neutral-300">•</span>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-neutral-300" />
                                <span>{post.readTime}</span>
                              </div>
                            </div>
                            
                            {isUrgent && (
                              <span className="bg-rose-100 text-rose-800 text-[10px] font-mono px-2 py-0.5 rounded uppercase font-black">
                                Pilne
                              </span>
                            )}
                          </div>

                          {/* Post title & excerpt */}
                          <div className="space-y-2">
                            <h3 className="text-xl sm:text-2xl font-serif font-black text-neutral-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-neutral-500 font-medium leading-relaxed line-clamp-2">
                              {post.excerpt}
                            </p>
                          </div>

                          {/* Cover / thumbnail if present */}
                          {post.image && (
                            <div className="aspect-[21/9] w-full bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-200/40 mt-3 relative select-none">
                              <img 
                                src={post.image} 
                                alt={post.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}

                          {/* Footer row: Tags & Action */}
                          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-100">
                            {/* Tags list */}
                            <div className="flex flex-wrap gap-1.5 max-w-[70%]">
                              {Array.isArray(post.tags) && post.tags.slice(0, 3).map(tag => (
                                <span 
                                  key={tag}
                                  className="bg-neutral-50 border border-neutral-200/60 rounded-lg px-2 py-0.5 text-[10px] font-mono font-bold text-neutral-500"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>

                            {/* Anchor read state indicator */}
                            <div className="inline-flex items-center gap-1 text-xs font-mono uppercase font-black text-blue-600 group-hover:text-blue-700">
                              <span>Procedury</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  );
                })}
              </div>
            ) : (
              <div className="py-20 text-center bg-white rounded-3xl border border-neutral-200/60 shadow-inner">
                <CornerDownRight className="w-12 h-12 text-neutral-300 mx-auto mb-3 animate-bounce" />
                <h3 className="text-lg font-serif font-black text-neutral-900 tracking-tight">Brak znalezionych artykułów</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-2 font-semibold">
                  Spróbuj zmienić hasło wyszukiwania lub zresetuj filtre za pomocą powyższego przycisku.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: Minimalist Side-panel widgets (col-span 4) */}
        <div className="col-span-1 lg:col-span-4 space-y-6 text-left lg:sticky lg:top-24">
          
          {/* Tag Cloud & Searching Widget */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/50 shadow-sm space-y-5">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 font-extrabold flex items-center gap-1.5 mb-1">
                <Search className="w-4 h-4 text-blue-500" /> Szybkie przeszukiwanie
              </h3>
              <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed">
                Wyszukaj procedury prawne lub socjalne.
              </p>
            </div>

            <div className="relative">
              <input 
                type="text"
                placeholder="Wpisz np. alimenty..."
                className="w-full pl-4 pr-10 py-3 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-neutral-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery ? (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 select-none">
                  <Search className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>

          {/* Categories list widget */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/50 shadow-sm space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 font-extrabold">
              Kategorie Tematyczne
            </h3>
            
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                  !selectedCategory 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'hover:bg-neutral-50 text-neutral-600'
                }`}
              >
                <span className="flex items-center gap-2">🔍 Wszystkie artykuły</span>
                <span className="bg-neutral-100 text-neutral-500 text-[10px] font-mono px-2 py-0.5 rounded-md font-black">
                  {blogPosts.length}
                </span>
              </button>

              {categoriesWithCounts.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                    selectedCategory === cat.name 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'hover:bg-neutral-50 text-neutral-600'
                  }`}
                >
                  <span className="truncate">📁 {cat.name}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-black ${
                     selectedCategory === cat.name ? 'bg-blue-100 text-blue-700' : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Hugo Stack Signature Tag Cloud widget */}
          {allTagsWithCounts.length > 0 && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/50 shadow-sm space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 font-extrabold flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-amber-500" /> Chmura Tagów (Słowa Klucze)
              </h3>
              
              <div className="flex flex-wrap gap-1.5">
                {allTagsWithCounts.map(tag => (
                  <button
                    key={tag.name}
                    onClick={() => setSelectedTag(selectedTag === tag.name ? null : tag.name)}
                    className={`px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold transition-all border ${
                      selectedTag === tag.name
                        ? 'bg-amber-500 border-amber-500 text-slate-950 px-3'
                        : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200/60 text-neutral-500'
                    }`}
                  >
                    #{tag.name} ({tag.count})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Destigmatizing Safe Helpline Callout */}
          <div className="bg-neutral-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-24 h-full bg-blue-600/10 skew-x-12 translate-x-12" />
            <div className="relative z-10 space-y-3">
              <span className="bg-rose-500 text-[8px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded">
                SOS 24/7
              </span>
              <h4 className="text-lg font-serif italic tracking-tight leading-snug">
                Rozmowa może dać kluczowe rozwiązanie.
              </h4>
              <p className="text-[11px] text-neutral-400 font-medium leading-relaxed">
                Jeśli przeżywasz lęk, bezradność lub zagrożenie bezpieczeństwa, nie czekaj. Infolinie wsparcia czekają anonimowo.
              </p>
              <div className="pt-2">
                <a
                  href="tel:116123"
                  className="w-full py-2.5 bg-white text-slate-950 hover:bg-neutral-100 active:scale-95 rounded-xl font-mono text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                >
                  Zadzwoń: 116 123
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
