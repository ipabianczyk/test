import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag, Search, BookOpen, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { getAllPosts } from '../services/blogService';

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Wszystkie');

  // Pobieramy prawdziwe posty z bazy danych serwisu
  const blogPosts = useMemo(() => getAllPosts(), []);

  // Filtrowanie wpisów na żywo
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'Wszystkie' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [blogPosts, searchTerm, selectedCategory]);

  // Wyciągamy unikalne kategorie do filtrów
  const categories = useMemo(() => {
    return ['Wszystkie', ...Array.from(new Set(blogPosts.map(p => p.category)))];
  }, [blogPosts]);

  return (
    <div className="min-h-screen bg-[#FBF9F4] py-8 md:py-16 px-4 md:px-8 selection:bg-[#C97A63]/10 selection:text-[#C97A63]">
      <div className="max-w-5xl mx-auto space-y-10 pb-24">
        
        {/* Przycisk powrotu do portalu */}
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#4A5D4E] hover:text-[#C97A63] transition-colors duration-300"
          >
            <ArrowLeft size={14} />
            <span>Powrót do portalu</span>
          </Link>
          <div className="text-[10px] font-mono text-[#4A5D4E]/60 uppercase tracking-wider">
            Baza Wiedzy v2.0
          </div>
        </div>

        {/* Nagłówek sekcji w stylu Editorial */}
        <div className="space-y-4 border-b border-[#4A5D4E]/10 pb-8">
          <div className="flex items-center gap-2 text-[#C97A63] font-semibold text-xs uppercase tracking-widest">
            <BookOpen size={16} />
            <span>Zaufana Baza Wiedzy i Poradniki</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-[#2F3E33] tracking-tight leading-tight">
            Czytelny przewodnik po systemie wsparcia
          </h1>
          <p className="text-[#2C3531]/80 max-w-2xl text-sm md:text-base leading-relaxed font-sans">
            Tłumaczymy skomplikowane przepisy prawne, procedury urzędowe oraz kroki interwencyjne na prosty, ludzki i pozbawiony stygmatyzacji język. Wszystkie artykuły są stale aktualizowane.
          </p>
        </div>

        {/* Pasek wyszukiwania i filtrów kategorycznych */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-2xl border border-[#4A5D4E]/10 shadow-sm">
          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="Szukaj artykułu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#FBF9F4] border border-[#4A5D4E]/20 text-[#2C3531] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#C97A63] focus:ring-1 focus:ring-[#C97A63] placeholder:text-[#2C3531]/40"
            />
            <Search className="absolute left-3 top-3.5 text-[#4A5D4E]/50" size={16} />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-[#4A5D4E] text-[#FBF9F4] shadow-sm' 
                    : 'bg-[#FBF9F4] text-[#2C3531] border border-[#4A5D4E]/10 hover:border-[#C97A63]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Statystyka wyszukiwania */}
        {(searchTerm || selectedCategory !== 'Wszystkie') && (
          <div className="flex justify-between items-center text-xs text-[#4A5D4E]/80 px-2">
            <span>
              Znaleziono: <strong className="text-[#2F3E33]">{filteredPosts.length}</strong> {filteredPosts.length === 1 ? 'artykuł' : filteredPosts.length % 10 >= 2 && filteredPosts.length % 10 <= 4 && (filteredPosts.length % 100 < 10 || filteredPosts.length % 100 >= 20) ? 'artykuły' : 'artykułów'}
            </span>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('Wszystkie'); }}
              className="text-[#C97A63] hover:underline font-semibold"
            >
              Wyczyść filtry
            </button>
          </div>
        )}

        {/* Siatka wpisów (Grid) idealnie odwzorowująca karty motywu Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, i) => (
              <article 
                key={post.id} 
                className="bg-white border border-[#4A5D4E]/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 hover:border-[#C97A63] hover:shadow-md transition-all duration-300 group"
              >
                <div className="space-y-4">
                  {/* Meta Tagi u góry karty */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                    <span className="bg-[#4A5D4E] text-[#FBF9F4] px-2.5 py-1 rounded-md">
                      {post.category}
                    </span>
                    {post.tags && post.tags.length > 0 ? (
                      post.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="bg-[#F7EDE9] text-[#C97A63] px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                          <Tag size={10} />
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="bg-[#F7EDE9] text-[#C97A63] px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                        <Tag size={10} />
                        Poradnik
                      </span>
                    )}
                  </div>

                  {/* Tytuł i opis - ogromny kontrast, zero zlewających się kolorów */}
                  <Link to={`/blog/${post.id}`} className="block group-hover:text-[#C97A63] transition-colors duration-300">
                    <h2 className="text-xl md:text-2xl font-serif font-bold text-[#1E2522] leading-snug tracking-tight">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-[#2C3531]/90 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                {/* Dolna belka z informacją o dacie i czasie czytania */}
                <div className="flex items-center justify-between gap-2 text-xs text-[#2C3531]/60 pt-4 border-t border-[#FBF9F4]">
                  <div className="flex items-center gap-1">
                    <Calendar size={13} />
                    <span>{post.date}</span>
                  </div>
                  {post.readTime && (
                    <div className="flex items-center gap-1">
                      <Clock size={13} />
                      <span>{post.readTime}</span>
                    </div>
                  )}
                  <Link 
                    to={`/blog/${post.id}`} 
                    className="inline-flex items-center gap-1 text-[#C97A63] font-semibold text-xs border-b border-transparent group-hover:border-[#C97A63] pb-0.5 transition-colors"
                  >
                    <span>Czytaj</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-[#4A5D4E]/10 px-4">
              <BookOpen className="w-12 h-12 text-[#4A5D4E]/30 mx-auto mb-4" />
              <h3 className="text-lg font-serif font-bold text-[#2F3E33]">Brak artykułów</h3>
              <p className="text-[#2C3531]/60 text-sm mt-1 max-w-sm mx-auto">
                Nie znaleziono w bazie wiedzy żadnych materiałów odpowiadających wpisanej frazie lub wybranej kategorii.
              </p>
              <button 
                onClick={() => { setSearchTerm(''); setSelectedCategory('Wszystkie'); }}
                className="mt-4 px-4 py-2 text-xs font-semibold bg-[#4A5D4E] text-[#FBF9F4] rounded-xl hover:bg-[#2F3E33] transition-colors duration-300"
              >
                Pokaż wszystkie artykuły
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
