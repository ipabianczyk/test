import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { 
  Search, X, Clock, Calendar, FileText, ChevronRight, BookOpen, Tag, ArrowRight, CornerDownRight
} from 'lucide-react';
import { getAllPosts, BlogPost } from '../services/blogService';
import { SITE_CONFIG } from '../data/siteConfig';

const IconRenderer = ({ iconName, className }: { iconName?: string, className?: string }) => {
  const Icon = (LucideIcons as any)[iconName || 'FileText'] || FileText;
  return <Icon className={className} />;
};

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const blogPosts = useMemo(() => getAllPosts(), []);

  // Update query state if search param updates (e.g. from right-sidebar search)
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

  // Handle immediate search query clear
  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  // Filter posts based on query and selected category
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        post.title.toLowerCase().includes(q) || 
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some(t => t.toLowerCase().includes(q));

      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [blogPosts, searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      
      {/* Blog Top Header */}
      <div className="pb-5 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tighter flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" /> Baza Wiedzy & Artykuły
          </h2>
          <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest mt-1">
            Materiały Triage i Edukacja Pokryzysowa
          </p>
        </div>
        
        {/* Active Search Term Indicator */}
        {searchQuery && (
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl border border-blue-100 text-xs font-bold">
            <span>Szuksz: "{searchQuery}"</span>
            <button onClick={clearSearch} className="hover:text-blue-900">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Category Pills Slider */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
            !selectedCategory 
              ? 'bg-neutral-900 border-neutral-900 text-white' 
              : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
          }`}
        >
          Wszystkie ({blogPosts.length})
        </button>
        {categoriesWithCounts.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
              selectedCategory === cat.name 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
            }`}
          >
            {cat.name} ({cat.count})
          </button>
        ))}
      </div>

      {/* Blog Post Feed Grid (Stack Card layout) */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, idx) => {
              const isUrgent = post.alert_level === 'urgent';
              const isWarning = post.alert_level === 'warning';
              
              return (
                <motion.article
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: Math.min(idx * 0.04, 0.2) }}
                  className={`bg-white rounded-2xl border transition-all duration-300 ${
                    isUrgent 
                      ? 'border-l-4 border-l-rose-500 border-neutral-200/60' 
                      : isWarning 
                      ? 'border-l-4 border-l-amber-500 border-neutral-200/60'
                      : 'border-neutral-200/60 hover:border-blue-300'
                  }`}
                >
                  <Link to={`/blog/${post.id}`} className="block p-5 sm:p-6 group">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      
                      {/* Left icon badge */}
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all ${
                        isUrgent ? 'bg-rose-50 border-rose-100 text-rose-600' : 
                        isWarning ? 'bg-amber-50 border-amber-100 text-amber-600' :
                        'bg-neutral-50 border-neutral-100 text-neutral-500 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100'
                      }`}>
                        <IconRenderer iconName={post.icon} className="w-5 h-5 animate-pulse-subtle" />
                      </div>

                      {/* Post body */}
                      <div className="flex-grow space-y-2 text-left">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                            {post.category}
                          </span>
                          <span className="text-neutral-300">•</span>
                          <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-bold">
                            <Clock className="w-3 h-3 text-neutral-300" />
                            <span>{post.readTime}</span>
                          </div>
                      
                          {isUrgent && (
                            <span className="bg-rose-100 text-rose-800 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase">
                              Pilne
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg sm:text-xl font-black text-neutral-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-neutral-500 font-medium leading-relaxed line-clamp-2">
                          {post.excerpt}
                        </p>

                        {/* Tag badges */}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {post.tags.slice(0, 4).map(t => (
                              <span 
                                key={t} 
                                className="bg-neutral-50 border border-neutral-100 text-neutral-500 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-0.5"
                              >
                                # {t}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Inline Read more indicator */}
                        <div className="pt-2 flex items-center gap-1.5 text-xs font-black text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Przejdź do artykułu</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>

                    </div>
                  </Link>
                </motion.article>
              );
            })
          ) : (
            <div className="py-16 text-center bg-neutral-50 rounded-2xl border border-neutral-200/50">
              <CornerDownRight className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <h3 className="text-lg font-black text-neutral-900 tracking-tight">Nie znaleziono publikacji</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1 font-semibold">
                Spróbuj zmienić słowo kluczowe w wyszukiwarce lub wybrać inną kategorię artykułów z menu głównego.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick SOS warning bottom panel inside feed */}
      <div className="bg-neutral-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden mt-8">
        <div className="absolute top-0 right-0 w-32 h-full bg-blue-600/10 skew-x-12 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left">
          <div className="space-y-2 max-w-md">
            <span className="bg-rose-500 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
              POMOC SOS
            </span>
            <h4 className="text-xl font-black tracking-tight leading-none italic">
              Doświadczasz kryzysu psychicznego?
            </h4>
            <p className="text-xs text-neutral-400 font-medium leading-relaxed">
              Artykuły i baza wiedzy nie zastąpią wsparcia czynnego specjalisty. Zadzwoń pod bezpłatny numer i porozmawiaj bez oceniania.
            </p>
          </div>
          <a
            href={`tel:${SITE_CONFIG.contact.emergency_phone}`}
            className="w-full md:w-auto px-6 py-4 bg-white text-neutral-950 hover:bg-neutral-100 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 group transition-all shrink-0"
          >
            <span>Rozmawiaj: 116 123</span>
            <ArrowRight className="w-4 h-4 text-rose-500 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

    </div>
  );
}
