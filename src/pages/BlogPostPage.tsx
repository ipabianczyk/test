import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { getPostById, BlogPost } from '../services/blogService';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Calendar, User, Share2, Tag, BookOpen, Clock, AlertCircle,
  Play, Pause, Square, Volume2, HelpCircle, ChevronRight, CornerDownRight, ExternalLink
} from 'lucide-react';

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = id ? getPostById(id) : undefined;

  // Text-To-Speech (TTS) Reader State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0); // 1x, 1.25x, 1.5x
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // SEO Update
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | MostPomocy.pl`;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', post.excerpt);

      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', post.tags.join(', '));
    }
  }, [post]);

  // Handle TTS setup
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      // Stop speech if we navigate away
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  if (!post) {
    return (
      <div className="py-12 text-center bg-neutral-50 rounded-2xl border border-neutral-200/60">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3 animate-bounce" />
        <h1 className="text-xl font-black text-neutral-950 mb-4">Nie odnaleziono artykułu</h1>
        <Link to="/blog" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Baza wiedzy
        </Link>
      </div>
    );
  }

  const { title, date, author, category, tags, image, content, excerpt, resources = [] } = post;
  const isUrgent = post.alert_level === 'urgent';
  const isWarning = post.alert_level === 'warning';

  // Toggle synthesiser reading of article text
  const handleStartSpeech = () => {
    if (!synthRef.current) return;

    if (isPaused) {
      synthRef.current.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    // Stop former triggers
    synthRef.current.cancel();

    // Clean text from Markdown syntax for optimal screen-reading
    const textToRead = `Artykuł pod tytułem: ${title}. Opracowany przez: ${author}. Kategoria: ${category}. Skrót procedury: ${excerpt}. Treść merytoryczna: ${content.replace(/[#*`_\[\]()\-]/g, ' ')}`;
    
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'pl-PL';
    utterance.rate = speechRate;
    
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePauseSpeech = () => {
    if (!synthRef.current) return;
    synthRef.current.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleStopSpeech = () => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleRateChange = (rate: number) => {
    setSpeechRate(rate);
    if (isPlaying && synthRef.current) {
      // Restart with new rate to reflect change instantly
      synthRef.current.cancel();
      const textToRead = `${title}. Opracowany przez: ${author}. Treść: ${content.replace(/[#*`_\[\]()\-]/g, ' ')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'pl-PL';
      utterance.rate = rate;
      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-1 sm:px-4 py-6 space-y-8">
      
      {/* Back to Blog Navigation with robust scale flex */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-200/60 text-left">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest font-extrabold text-neutral-400 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" /> 
          Powrót do bazy wiedzy
        </Link>
        <div className="flex flex-wrap gap-2">
          <span className="bg-blue-50 text-blue-800 text-[10px] font-mono px-3 py-1 rounded-xl border border-blue-100 uppercase font-black">
            {category}
          </span>
          {isUrgent && (
            <span className="bg-rose-500 text-white text-[10px] font-mono px-3 py-1 rounded-xl uppercase font-black tracking-wider animate-pulse">
              Pilna procedura
            </span>
          )}
        </div>
      </div>

      {/* Hero Header Section */}
      <header className="space-y-4 text-left">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] sm:text-[11px] font-mono text-neutral-400 uppercase tracking-wider font-semibold">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-neutral-300" />
            <span>Opublikowano: {date}</span>
          </div>
          <span className="text-neutral-300 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-neutral-300" />
            <span>Opracował: {author}</span>
          </div>
          {post.readTime && (
            <>
              <span className="text-neutral-300 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-300" />
                <span>Przeczytasz w: {post.readTime}</span>
              </div>
            </>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-neutral-900 tracking-tight leading-tight italic">
          {title}
        </h1>
      </header>

      {/* Accessible TTS audio panel (Audio Reader) */}
      <div className="bg-neutral-50 rounded-3xl p-4 sm:p-5 border border-neutral-200/50 text-left space-y-3 shadow-inner">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-extrabold uppercase tracking-wide text-neutral-800">
                Wirtualny Syntezator Mowy (WCAG)
              </h4>
              <p className="text-[10px] text-neutral-400 font-semibold">
                Słuchaj zweryfikowanego tekstu procedury bez czytania.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Speed Adjuster */}
            <div className="flex bg-white rounded-xl border border-neutral-200/60 p-1 text-[10px] font-mono font-black h-fit">
              <button 
                onClick={() => handleRateChange(0.85)}
                className={`px-2 py-1 rounded-lg ${speechRate === 0.85 ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-800'}`}
                title="Wolne tempo"
              >
                0.85x
              </button>
              <button 
                onClick={() => handleRateChange(1.0)}
                className={`px-2 py-1 rounded-lg ${speechRate === 1.0 ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-800'}`}
                title="Normalne tempo"
              >
                1.0x
              </button>
              <button 
                onClick={() => handleRateChange(1.3)}
                className={`px-2 py-1 rounded-lg ${speechRate === 1.3 ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-800'}`}
                title="Szybkie tempo"
              >
                1.3x
              </button>
            </div>

            {/* Speach Controls */}
            <div className="flex items-center gap-1.5">
              {!isPlaying ? (
                <button
                  onClick={handleStartSpeech}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Odtwórz
                </button>
              ) : (
                <button
                  onClick={handlePauseSpeech}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" /> Pauza
                </button>
              )}

              {(isPlaying || isPaused) && (
                <button
                  onClick={handleStopSpeech}
                  className="p-2 bg-neutral-200 hover:bg-neutral-350 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                  title="Zatrzymaj"
                >
                  <Square className="w-4 h-4 fill-current" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image Block */}
      {image && (
        <div className="relative aspect-[21/9] rounded-3xl overflow-hidden border border-neutral-200/50 shadow-sm select-none">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Elegant Summary Block */}
      <div className="p-5 sm:p-7 bg-blue-50/50 rounded-3xl border-l-4 border-l-blue-500 border-neutral-150 text-left space-y-1">
        <p className="text-[10px] font-mono uppercase tracking-widest font-black text-blue-600">
          Podsumowanie Triage (Szybki skrót merytoryczny):
        </p>
        <p className="text-xs sm:text-sm text-neutral-600 font-semibold leading-relaxed">
          {excerpt}
        </p>
      </div>

      {/* Main Markdown Article Content - Hugo Stack Typographical Treatment */}
      <div className="border-t border-b border-neutral-200/50 py-10 text-left">
        <div className="prose prose-neutral max-w-none pt-2 prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-neutral-900 prose-p:text-neutral-600 prose-p:leading-[1.8] prose-p:font-medium prose-p:text-sm sm:prose-p:text-base prose-strong:text-neutral-950 prose-strong:font-extrabold prose-a:text-blue-600 prose-a:font-black hover:prose-a:underline prose-ul:list-disc prose-ol:list-decimal prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-neutral-50 prose-blockquote:p-4 prose-blockquote:rounded-r-2xl">
          <MarkdownRenderer content={content} />
        </div>
      </div>

      {/* Dynamic Embedded Resources (Action Card Blocks) */}
      {resources.length > 0 && (
        <div className="pt-2 border-b border-neutral-200/50 pb-8 text-left space-y-5">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-500" />
            <h3 className="text-md sm:text-lg font-serif font-black text-neutral-900 tracking-tight leading-none italic">
              Zasoby powiązane i procedury prawne:
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resources.map((res: any, index: number) => (
              <a 
                key={index}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between p-5 bg-white border border-neutral-200 hover:border-blue-500 rounded-3xl hover:shadow-lg hover:shadow-neutral-50 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="w-8 h-8 bg-neutral-50 border border-neutral-200/60 rounded-xl flex items-center justify-center text-neutral-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-black text-neutral-900 leading-snug group-hover:text-blue-600 transition-colors">
                    {res.title}
                  </h4>
                  <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                    {res.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 mt-4 flex items-center justify-between text-[10px] font-mono font-black uppercase tracking-wider text-neutral-400 group-hover:text-blue-600">
                  <span>Pobierz Procedurę</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Author Footer Card with high contrast wrapping buttons */}
      <footer className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6 bg-neutral-50 rounded-3xl p-6 border border-neutral-200/50">
        <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
          <div className="w-12 h-12 bg-neutral-900 text-white rounded-full flex items-center justify-center font-bold font-serif italic text-md shrink-0">
            {author.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-[9px] font-mono font-black uppercase tracking-wider text-neutral-400">Koordynator merytoryczny:</p>
            <p className="text-sm font-black text-neutral-800">{author}</p>
          </div>
        </div>

        <Link 
          to="/kontakt" 
          className="w-full sm:w-auto px-5 py-3.5 bg-neutral-900 hover:bg-blue-600 hover:text-white text-white rounded-2xl font-black text-xs uppercase tracking-widest text-center transition-all active:scale-95 shadow-md shadow-neutral-900/10"
        >
          Masz wątpliwości? Napisz do autora
        </Link>
      </footer>

    </div>
  );
}
