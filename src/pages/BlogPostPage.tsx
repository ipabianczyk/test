import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { getPostById, getAllPosts } from '../services/blogService';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User, Share2, Tag, Volume2, Play, Pause, Square, Headphones, HelpCircle, ChevronLeft, ChevronRight, BookOpen, X, Sparkles, Mail, Link2 } from 'lucide-react';

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

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = id ? getPostById(id) : undefined;

  const [copied, setCopied] = React.useState(false);
  const [currentUrl, setCurrentUrl] = React.useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.origin + '/blog/' + (id || ''));
    }
  }, [id]);

  const copyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const allPosts = React.useMemo(() => getAllPosts(), []);
  const currentIndex = allPosts.findIndex(p => p.id === (post?.id || ''));
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const relatedPosts = React.useMemo(() => {
    if (!post) return [];
    const list = allPosts.filter(p => p.id !== post.id);
    const sameCat = list.filter(p => p.category === post.category);
    const chosen = sameCat.length >= 2 ? sameCat : list;
    return chosen.slice(0, 2);
  }, [allPosts, post]);

  // Speech synthesis is chunk-based for rock-solid stability on mobile and beautiful highlighting
  const [isReading, setIsReading] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [speechRate, setSpeechRate] = React.useState<number>(1.0);
  const [speechSupported, setSpeechSupported] = React.useState(false);
  
  // Tryb Czytania (Distraction-Free Comfort Reader) States
  const [readingModeActive, setReadingModeActive] = React.useState(false);
  const [readingModeTheme, setReadingModeTheme] = React.useState<'cream' | 'dark' | 'amber'>('cream');
  const [readingModeFontSize, setReadingModeFontSize] = React.useState<'base' | 'lg' | 'xl' | '2xl'>('lg');
  const [currentParagraphIndex, setCurrentParagraphIndex] = React.useState<number | null>(null);

  const synthRef = React.useRef<SpeechSynthesis | null>(null);
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
      setSpeechSupported(true);
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">Post nie znaleziony</h1>
          <Link to="/blog" className="btn btn-primary">Wróć do bloga</Link>
        </div>
      </div>
    );
  }

  const { title, date, author, category, tags, image, content, excerpt, resources = [] } = post;

  // Clean Markdown helper to make it sound pleasant under TTS
  const cleanMarkdownForVoice = (rawMarkdown: string): string => {
    return rawMarkdown
      // Strip blocks that look like custom wrappers (e.g. ::: wykres, :::, etc.)
      .replace(/:::[a-z-]*\n?/gi, '')
      .replace(/:::/g, '')
      // Remove URLs, links
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      // Remove headings markers
      .replace(/#+\s+/g, ' ')
      // Remove bold/italic formatters
      .replace(/[*_~`]/g, '')
      // Strip table blocks
      .replace(/\|/g, ' ')
      // Clean excessive spacing
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Split content by paragraphs or list blocks for focus highlighting
  const paragraphs = React.useMemo(() => {
    if (!content) return [];
    return content
      .split(/\n\n+/)
      .map(p => p.trim())
      .filter(p => p.length > 2);
  }, [content]);

  const speakParagraph = (index: number) => {
    if (!synthRef.current || index < 0 || index >= paragraphs.length) {
      handleStopSpeaking();
      return;
    }

    setCurrentParagraphIndex(index);
    setIsReading(true);
    setIsPaused(false);

    const txt = cleanMarkdownForVoice(paragraphs[index]);
    
    // If the clean paragraph was just metadata/empty, auto skip to next
    if (!txt || txt.length < 2) {
      const nextIdx = index + 1;
      if (nextIdx < paragraphs.length) {
        speakParagraph(nextIdx);
      } else {
        handleStopSpeaking();
      }
      return;
    }

    const utterance = new SpeechSynthesisUtterance(txt);
    utterance.lang = 'pl-PL';
    utterance.rate = speechRate;

    utterance.onend = () => {
      const nextIdx = index + 1;
      if (nextIdx < paragraphs.length) {
        speakParagraph(nextIdx);
      } else {
        handleStopSpeaking();
      }
    };

    utterance.onerror = (e) => {
      console.error('TTS execution error', e);
      if (e.error !== 'interrupted') {
        handleStopSpeaking();
      }
    };

    if (utteranceRef.current) {
      utteranceRef.current.onend = null;
      utteranceRef.current.onerror = null;
    }

    utteranceRef.current = utterance;
    synthRef.current.cancel(); // cancel current speech play
    synthRef.current.speak(utterance);

    // Anchor autoscroll into view
    setTimeout(() => {
      const el = document.getElementById(`reader-p-${index}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 120);
  };

  const handleTogglePlay = () => {
    if (!synthRef.current) return;

    if (isReading) {
      if (isPaused) {
        synthRef.current.resume();
        setIsPaused(false);
      } else {
        synthRef.current.pause();
        setIsPaused(true);
      }
    } else {
      // Begin with paragraph index 0, or continue at active index
      const startIdx = currentParagraphIndex !== null ? currentParagraphIndex : 0;
      speakParagraph(startIdx);
    }
  };

  const handleStopSpeaking = () => {
    if (utteranceRef.current) {
      utteranceRef.current.onend = null;
      utteranceRef.current.onerror = null;
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsReading(false);
    setIsPaused(false);
    setCurrentParagraphIndex(null);
  };

  const handlePrevParagraph = () => {
    const prevIdx = (currentParagraphIndex ?? 1) - 1;
    if (prevIdx >= 0) {
      speakParagraph(prevIdx);
    }
  };

  const handleNextParagraph = () => {
    const nextIdx = (currentParagraphIndex ?? -1) + 1;
    if (nextIdx < paragraphs.length) {
      speakParagraph(nextIdx);
    }
  };

  const handleRateChange = (newRate: number) => {
    setSpeechRate(newRate);
    if (isReading && currentParagraphIndex !== null) {
      // Re-trigger speaking active paragraph immediately with adjusted voice rate
      setTimeout(() => {
        speakParagraph(currentParagraphIndex);
      }, 100);
    }
  };

  if (readingModeActive) {
    const themeStyles = {
      cream: 'bg-[#FCFAF2] text-[#2C2317] selection:bg-amber-100 selection:text-black',
      dark: 'bg-[#0B0F19] text-[#E5E7EB] selection:bg-blue-600 selection:text-white',
      amber: 'bg-black text-[#FACC15] selection:bg-yellow-400 selection:text-black border-yellow-500',
    }[readingModeTheme];

    const fontStyles = {
      base: 'text-sm sm:text-base leading-relaxed',
      lg: 'text-base sm:text-lg md:text-xl leading-relaxed',
      xl: 'text-lg sm:text-xl md:text-2xl leading-relaxed',
      '2xl': 'text-xl sm:text-2xl md:text-3.5xl font-medium leading-loose md:leading-loose',
    }[readingModeFontSize];

    const settingsPanelStyles = {
      cream: 'bg-[#FAF6EC] border-amber-200/60 text-slate-800',
      dark: 'bg-[#121A2E] border-slate-800 text-slate-200',
      amber: 'bg-[#111] border-yellow-500/40 text-[#FACC15]',
    }[readingModeTheme];

    const buttonStyles = {
      cream: 'bg-[#2C2317] text-[#FCFAF2] hover:bg-[#3d3222]',
      dark: 'bg-[#E5E7EB] text-[#0B0F19] hover:bg-white',
      amber: 'bg-[#FACC15] text-black hover:bg-yellow-400 border border-yellow-500',
    }[readingModeTheme];

    const activeControlBtnStyles = {
      cream: 'bg-[#2C2317] text-[#FCFAF2]',
      dark: 'bg-[#E5E7EB] text-[#0B0F19]',
      amber: 'bg-[#FACC15] text-black border border-yellow-400',
    }[readingModeTheme];

    const inactiveControlBtnStyles = {
      cream: 'text-[#2C2317] hover:bg-[#2C2317]/10 bg-current/5 border border-current/10',
      dark: 'text-[#E5E7EB] hover:bg-[#E5E7EB]/10 bg-current/5 border border-current/10',
      amber: 'text-[#FACC15] hover:bg-[#FACC15]/20 bg-[#111] border border-yellow-500/30',
    }[readingModeTheme];

    return (
      <div className={`min-h-screen transition-colors duration-300 pb-32 text-left reading-mode-active ${themeStyles}`}>
        {/* Force color inherit rules for standard nested components to override general tailwind rules */}
        <style dangerouslySetInnerHTML={{ __html: `
          .reading-mode-active p, 
          .reading-mode-active h1, 
          .reading-mode-active h1 span,
          .reading-mode-active h2, 
          .reading-mode-active h3, 
          .reading-mode-active h4, 
          .reading-mode-active h5, 
          .reading-mode-active h6, 
          .reading-mode-active strong, 
          .reading-mode-active li, 
          .reading-mode-active ul, 
          .reading-mode-active ol,
          .reading-mode-active span,
          .reading-mode-active a {
            color: currentColor !important;
          }
        `}} />

        {/* Top bar with tools */}
        <div className="border-b border-current/10 py-3.5 px-4 sticky top-0 bg-inherit z-50 shadow-sm">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
            <button
              onClick={() => {
                handleStopSpeaking();
                setReadingModeActive(false);
              }}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-md ${buttonStyles}`}
            >
              <X className="w-3.5 h-3.5" />
              Wyjdź z trybu czytania
            </button>

            <div className="flex flex-wrap justify-center items-center gap-2.5">
              {/* Font Scale switcher */}
              <div className="flex items-center gap-1 bg-current/5 border border-current/10 p-1 rounded-lg">
                <span className="text-[9px] uppercase font-bold px-1.5 opacity-70">Czcionka:</span>
                {(['base', 'lg', 'xl', '2xl'] as const).map(sz => (
                  <button
                    key={sz}
                    onClick={() => setReadingModeFontSize(sz)}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider transition-all ${
                      readingModeFontSize === sz
                        ? activeControlBtnStyles
                        : inactiveControlBtnStyles
                    }`}
                  >
                    {sz === 'base' ? 'Duża A-' : sz === 'lg' ? 'Standard A' : sz === 'xl' ? 'Większa A+' : 'Maksymalna A++'}
                  </button>
                ))}
              </div>

              {/* Color Preset Switcher */}
              <div className="flex items-center gap-1 bg-current/5 border border-current/10 p-1 rounded-lg">
                {(['cream', 'dark', 'amber'] as const).map(thm => (
                  <button
                    key={thm}
                    onClick={() => setReadingModeTheme(thm)}
                    className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider transition-all ${
                      readingModeTheme === thm
                        ? activeControlBtnStyles
                        : inactiveControlBtnStyles
                    }`}
                  >
                    {thm === 'cream' ? 'Papierowy beż' : thm === 'dark' ? 'Tryb ciemny noc' : 'Wysoki żółty kontrast'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Voice Player Section */}
        <div className="max-w-3xl mx-auto px-4 mt-6">
          <div className={`p-4 sm:p-5 border duration-300 rounded-2xl ${settingsPanelStyles}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${buttonStyles}`}>
                  <Headphones className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-serif font-black text-xs leading-tight">Uproszczony odtwarzacz dźwięku</h4>
                  <p className="text-[10px] opacity-75 mt-0.5">
                    Klikaj na dowolne bloki tekstu na dole, by czytać i słuchać dokładnie od tamtego miejsca.
                  </p>
                </div>
              </div>

              {isReading && (
                <div className="px-2.5 py-1 rounded bg-[#FACC15] text-black text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 shadow animate-pulse">
                  <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                  <span>Tekst jest czytany</span>
                </div>
              )}
            </div>

            {speechSupported ? (
              <div className="flex flex-wrap items-center gap-3 pt-3 mt-3 border-t border-current/10">
                <div className="flex items-center gap-1.5 font-sans">
                  <button
                    onClick={handlePrevParagraph}
                    disabled={currentParagraphIndex === null || currentParagraphIndex === 0}
                    className={`p-1.5 rounded disabled:opacity-35 transition-all ${inactiveControlBtnStyles}`}
                    title="Poprzedni akapit"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleTogglePlay}
                    className={`px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all ${buttonStyles}`}
                  >
                    {isReading && !isPaused ? (
                      <>
                        <Pause className="w-3 h-3 fill-current" /> Pauza
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-current" /> Odtwórz
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleNextParagraph}
                    disabled={currentParagraphIndex === null || currentParagraphIndex >= paragraphs.length - 1}
                    className={`p-1.5 rounded disabled:opacity-35 transition-all ${inactiveControlBtnStyles}`}
                    title="Następny akapit"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {isReading && (
                    <button
                      onClick={handleStopSpeaking}
                      className="px-2.5 py-1.5 bg-rose-600/10 text-rose-500 hover:bg-rose-600/20 text-[9.5px] font-black uppercase tracking-wider rounded-lg border border-rose-500/30 flex items-center gap-1 transition-all"
                    >
                      <Square className="w-2.5 h-2.5 fill-current" /> Zatrzymaj
                    </button>
                  )}
                </div>

                {/* Speed Controls Component */}
                <div className="flex items-center gap-1.5 bg-current/5 border border-current/10 px-2.5 py-1 rounded-lg text-xs">
                  <span className="whitespace-nowrap text-[8.5px] font-extrabold uppercase tracking-wide opacity-80">Tempo lektora:</span>
                  <div className="flex gap-1">
                    {[0.8, 1.0, 1.25, 1.5].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => handleRateChange(rate)}
                        className={`px-1.5 py-0.5 text-[8.5px] uppercase font-black rounded ${
                          speechRate === rate 
                            ? activeControlBtnStyles 
                            : inactiveControlBtnStyles
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[10px] text-rose-500 italic mt-2">Brak wsparcia dla syntezy mowy w przeglądarce.</p>
            )}
          </div>
        </div>

        {/* Streamlined main content container */}
        <div className="max-w-3xl mx-auto px-4 mt-8 md:mt-12 space-y-6">
          <div className="space-y-3 mb-10 pb-8 border-b border-current/15">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">{category}</span>
            <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight leading-snug">{title}</h1>
            <p className="text-sm sm:text-lg italic opacity-85 leading-relaxed">{excerpt}</p>
          </div>

          <div className="space-y-4">
            {paragraphs.map((para, idx) => {
              const isActive = idx === currentParagraphIndex;
              const activeBg = {
                cream: 'bg-[#FCF4D7] border-l-4 border-amber-500 text-slate-950 shadow-md ring-1 ring-amber-300/35',
                dark: 'bg-[#1E293B] border-l-4 border-blue-500 text-white shadow-lg',
                amber: 'bg-[#111] border-l-4 border-yellow-400 text-yellow-300 shadow-md ring-1 ring-yellow-400/25',
              }[readingModeTheme];

              const inactiveStyle = currentParagraphIndex !== null ? 'opacity-35 hover:opacity-100' : 'opacity-100';

              return (
                <div
                  key={idx}
                  id={`reader-p-${idx}`}
                  onClick={() => speakParagraph(idx)}
                  className={`p-4 rounded-xl cursor-pointer border border-transparent transition-all duration-300 hover:bg-current/5 ${
                    isActive ? activeBg : inactiveStyle
                  }`}
                >
                  <div className={`prose max-w-none text-current ${fontStyles}`}>
                    <MarkdownRenderer content={para} isReadingMode={true} />
                  </div>
                  {isActive && (
                    <div className="mt-2 text-[9px] font-black uppercase tracking-wider text-current/80 flex items-center gap-1 bg-[#1a202c]/5 py-1 px-2.5 rounded w-max">
                      <Volume2 className="w-3.5 h-3.5 text-amber-500 animate-bounce shrink-0" />
                      Lektor odtwarza ten akapit
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-12 mt-12 border-t border-current/15 text-center">
            <button
              onClick={() => {
                handleStopSpeaking();
                setReadingModeActive(false);
              }}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md inline-block ${buttonStyles}`}
            >
              Wyjdź z trybu czytania
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="bg-[#FAF8F3] min-h-screen text-[#1a211e]">
      {/* Editorial Journal Header - Now much more compact & elegant */}
      <header className="relative py-6 md:py-8 bg-[#FBF9F4] border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
          <Link to="/blog" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#6B7280] hover:text-[#0f1412] transition-colors mb-4 md:mb-5 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Powrót do czytelni
          </Link>
          
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6B7280]">
                {category}
              </span>
              {post.alert_level === 'warning' && (
                <span className="ml-3 px-2 py-0.5 border border-rose-500 text-rose-600 text-[9px] font-black uppercase tracking-widest rounded">
                   Ważny komunikat
                </span>
              )}
            </div>
            
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-black tracking-tight leading-snug text-[#0f1412] max-w-4xl">
              {title}
            </h1>
            
            <p className="text-[#1a211e] font-sans text-xs sm:text-sm md:text-base leading-relaxed max-w-3xl italic">
              {excerpt}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 md:gap-8 text-[10px] font-black uppercase tracking-[0.25em] text-[#6B7280] pt-3 border-t border-slate-200/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-800" />
                {date}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-emerald-800" />
                Napisane przez: {author}
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Container - Optimized Responsive Grid Layout */}
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-10 relative z-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Article Content - 8 Column Layout on Desktop */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white px-4 py-6 sm:px-8 sm:py-8 rounded-[28px] border border-slate-200/90 shadow-sm">
              
              {/* COMPACT AUDIO PLAYER - Streamlined Horizontal Interface */}
              <div className="mb-6 p-4 bg-[#FDFBF7] border border-[#F1E4CE]/70 rounded-2xl text-left">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0f1412] text-white flex items-center justify-center shrink-0">
                      <Headphones className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-serif font-black text-xs text-[#0f1412] leading-tight">
                        Odtwarzacz Audio (Lektor)
                      </h4>
                      <p className="text-[9px] text-[#1a211e]/75 font-sans mt-0.5">
                        System przeczyta tekst. Klikaj na dowolne akapity poniżej, by odtworzyć dźwięk.
                      </p>
                    </div>
                  </div>

                  {isReading && (
                    <div className="flex items-center gap-1.2 px-2.5 py-0.5 bg-[#0f1412] text-amber-300 text-[8.5px] font-black uppercase tracking-widest rounded animate-pulse w-max">
                      <Volume2 className="w-3.5 h-3.5 animate-bounce text-amber-400 mr-1 shrink-0" />
                      <span>Czytam...</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-slate-200/70">
                  {speechSupported ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={handleTogglePlay}
                          className="px-3.5 py-1.5 bg-[#0f1412] hover:bg-emerald-800 text-white text-[9px] font-extrabold uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          {isReading && !isPaused ? (
                            <>
                              <Pause className="w-2.5 h-2.5 fill-current" /> Pauza
                            </>
                          ) : (
                            <>
                              <Play className="w-2.5 h-2.5 fill-current text-white" /> Odtwórz
                            </>
                          )}
                        </button>

                        {isReading && (
                          <button
                            onClick={handleStopSpeaking}
                            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1 border border-rose-200"
                          >
                            <Square className="w-2 h-2 fill-current" /> Stop
                          </button>
                        )}
                      </div>

                      {/* Speed Control Indicator */}
                      <div className="flex items-center gap-1 bg-white border border-slate-205 px-2 py-1 rounded-lg text-[9.5px]">
                        <span className="text-[8px] font-black text-slate-500 uppercase mr-0.5">Tempo:</span>
                        <div className="flex gap-0.5">
                          {[0.8, 1.0, 1.25, 1.5].map((rate) => (
                            <button
                              key={rate}
                              onClick={() => handleRateChange(rate)}
                              className={`px-1 rounded text-[8px] font-black uppercase tracking-widest transition-all ${
                                speechRate === rate 
                                  ? 'bg-[#0f1412] text-white' 
                                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                              }`}
                            >
                              {rate}x
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[9px] text-rose-600 font-sans italic">Synthesizer mowy niedostępny w systemie.</p>
                  )}

                  <button
                    onClick={() => setReadingModeActive(true)}
                    className="px-3 py-1.5 bg-[#FAF3E4] hover:bg-[#FAF3E4]/80 text-[#8C6239] border border-[#F1E4CE] text-[9px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1 shadow-sm"
                  >
                    <BookOpen className="w-3 h-3 text-[#8C6239]" />
                    Modyfikuj Typografię (Tryb Czytania)
                  </button>
                </div>
              </div>

              {/* Verified Badge Header Line */}
              <div className="mb-6 flex items-center justify-between pb-4 border-b border-slate-100 text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-800" />
                  Merytoryczność weryfikowana przez zespół MostPomocy
                </span>
                <span className="hidden sm:inline italic text-[10px]">Wskazówka: Kliknij dowolny akapit, by odsłuchać lektora</span>
              </div>

              {/* Tighter Interactive Text flow - reducing vertical scrolling spaces */}
              <div className="prose prose-slate prose-base max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-[#0f1412] prose-p:text-[#1a211e] prose-p:leading-[1.65] prose-p:font-normal prose-strong:text-[#0f1412] prose-strong:font-black prose-img:rounded-[24px] prose-a:text-emerald-800 prose-a:font-black hover:prose-a:underline space-y-1.5">
                {paragraphs.map((para, idx) => {
                  const isActive = idx === currentParagraphIndex;
                  
                  // Significantly tighter default paddings to prevent endless scrolling
                  const activeStyle = isActive
                    ? 'bg-amber-50 border-l-4 border-amber-600 text-slate-950 px-4 py-4 sm:px-5 sm:py-5 rounded-r-2xl shadow-sm ring-1 ring-amber-200/50 my-3'
                    : 'border-l-4 border-transparent px-3 py-2 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-slate-300/40 transition-all duration-150';

                  return (
                    <div
                      key={idx}
                      id={`reader-p-${idx}`}
                      onClick={() => speakParagraph(idx)}
                      className={`transition-all duration-200 relative ${activeStyle}`}
                    >
                      <MarkdownRenderer content={para} isReadingMode={false} />
                      {isActive && (
                        <div className="mt-2 text-[8px] font-black uppercase tracking-wider text-[#8C6239] flex items-center gap-1 bg-[#FAF3E4] py-0.5 px-2 rounded-lg w-max select-none">
                          <Volume2 className="w-3 h-3 text-[#8C6239] animate-bounce shrink-0" />
                          Głos lektora odtwarza ten akapit
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Sticky Sidebar - Moves extra widgets horizontally out of the main scrolling path */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            
            {/* Author details & Direct FAQ button */}
            <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm text-left">
              <h5 className="text-[9px] font-black uppercase tracking-[0.25em] text-[#6B7280] mb-3">
                Autor publikacji
              </h5>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#0f1412] rounded-full flex items-center justify-center text-white tracking-widest font-serif italic text-base font-bold select-none">
                  {author.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-serif font-black text-sm text-[#0f1412] leading-tight">
                    {author}
                  </h4>
                  <p className="text-[10px] text-stone-500 mt-0.5">Weryfikowane przez MostPomocy</p>
                </div>
              </div>
              <Link 
                to="/kontakt" 
                className="w-full text-center block px-4 py-2.5 bg-[#0f1412] hover:bg-emerald-800 text-white rounded-xl font-black text-[9.5px] uppercase tracking-widest transition-all shadow-sm"
              >
                Zadaj pytanie autorowi
              </Link>
            </div>

            {/* Quick Share Widget inside Sidebar */}
            <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm text-left">
              <h5 className="text-[9px] font-black uppercase tracking-[0.25em] text-[#6B7280] mb-3">
                Udostępnij artykuł
              </h5>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {[
                  {
                    title: 'Udostępnij na Facebooku',
                    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
                    icon: (
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                      </svg>
                    ),
                  },
                  {
                    title: 'Udostępnij na LinkedIn',
                    url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
                    icon: (
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    ),
                  },
                  {
                    title: 'Udostępnij na Twitterze (X)',
                    url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title || '')}`,
                    icon: (
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    ),
                  },
                  {
                    title: 'Wyślij e-mailem',
                    url: `mailto:?subject=${encodeURIComponent(title || '')}&body=${encodeURIComponent(currentUrl)}`,
                    icon: <Mail className="w-3.5 h-3.5" />,
                  },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.title}
                    className="w-9 h-9 rounded-xl bg-[#FBF9F4] hover:bg-emerald-50 border border-slate-250 text-slate-700 hover:text-emerald-950 hover:border-emerald-700 flex items-center justify-center transition-all shadow-sm"
                  >
                    {s.icon}
                  </a>
                ))}
                
                <button
                  onClick={copyLink}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all shadow-sm ${
                    copied
                      ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                      : 'bg-[#FBF9F4] hover:bg-emerald-50 border-slate-250 text-slate-700 hover:text-emerald-950'
                  }`}
                  title="Skopiuj link do schowka"
                >
                  {copied ? <span className="text-[8px] font-black uppercase">OK</span> : <Link2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Universal Recommended Tool on Every Subpage */}
            <div className="bg-emerald-900 p-5 rounded-[24px] border border-emerald-800 shadow-md text-left text-white relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-800 rounded-full blur-2xl opacity-50 group-hover:bg-amber-500 group-hover:opacity-30 transition-all duration-500"></div>
              <h5 className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-400 mb-2 relative z-10">
                Polecane Narzędzie
              </h5>
              <div className="relative z-10">
                <h4 className="font-serif font-black text-lg text-white leading-tight mb-2">
                  Potrzebomat
                </h4>
                <p className="text-[10px] text-emerald-100 font-sans leading-snug mb-4">
                  Interaktywny asystent, który w 3 minuty przeanalizuje Twoją sytuację i podpowie ścieżki wsparcia.
                </p>
                <Link
                  to="/potrzebomat"
                  className="inline-flex w-full items-center justify-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-xl font-black text-[9.5px] uppercase tracking-widest transition-all shadow-sm"
                >
                  Uruchom analizę za darmo
                </Link>
              </div>
            </div>

            {/* Resources / External Tools associated with content  */}
            {resources.length > 0 && (
              <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm text-left">
                <h5 className="text-[9px] font-black uppercase tracking-[0.25em] text-[#6B7280] mb-3.5">
                  Narzędzia i linki
                </h5>
                <div className="space-y-3">
                  {resources.map((res: any, idx: number) => (
                    <a 
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-3 bg-stone-50 border border-slate-200/80 rounded-xl hover:border-emerald-700 hover:bg-emerald-50/20 transition-all text-left"
                    >
                      <h4 className="text-xs font-serif font-black text-[#0f1412] group-hover:text-emerald-950 transition-colors leading-tight">
                        {res.title}
                      </h4>
                      <p className="text-[10px] text-stone-600 font-sans leading-snug mt-1 line-clamp-2">
                        {res.desc}
                      </p>
                      <div className="mt-2 text-[8px] font-black uppercase tracking-widest text-[#6B7280] group-hover:text-emerald-800 flex items-center justify-between">
                        <span>Otwórz</span>
                        <ArrowLeft className="w-3 w-3 rotate-180 transform group-hover:translate-x-1.5 transition-transform" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Previous and Next Navigation Buttons */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 border border-slate-200 rounded-[20px] bg-white overflow-hidden shadow-sm">
          {prevPost ? (
            <Link
              to={`/blog/${prevPost.id}`}
              className="p-5 flex items-start gap-3 hover:bg-slate-50 transition-all text-left group"
            >
              <ChevronLeft className="w-4 h-4 mt-1 text-emerald-800 group-hover:-translate-x-1 transition-transform shrink-0" />
              <div className="space-y-0.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#6B7280]">
                  POPRZEDNI
                </span>
                <h4 className="font-serif font-black text-xs sm:text-sm text-[#0f1412] line-clamp-1 leading-snug">
                  {prevPost.title}
                </h4>
              </div>
            </Link>
          ) : (
            <div className="p-5 flex items-start gap-3 opacity-40 bg-slate-50/20 text-left">
              <ChevronLeft className="w-4 h-4 mt-1 shrink-0" />
              <div className="space-y-0.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#6B7280]">
                  POPRZEDNI
                </span>
                <h4 className="font-serif font-black text-xs sm:text-sm text-[#0f1412] italic">
                  To jest najnowszy wpis
                </h4>
              </div>
            </div>
          )}

          {nextPost ? (
            <Link
              to={`/blog/${nextPost.id}`}
              className="p-5 flex items-start justify-between gap-3 hover:bg-slate-50 transition-all text-left md:text-right group"
            >
              <div className="space-y-0.5 order-1 md:order-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#6B7280] block">
                  NASTĘPNY
                </span>
                <h4 className="font-serif font-black text-xs sm:text-sm text-[#0f1412] line-clamp-1 leading-snug">
                  {nextPost.title}
                </h4>
              </div>
              <ChevronRight className="w-4 h-4 mt-1 text-emerald-800 group-hover:translate-x-1 transition-transform shrink-0 order-2 md:order-1" />
            </Link>
          ) : (
            <div className="p-5 flex items-start justify-between gap-3 opacity-40 bg-slate-50/20 text-left md:text-right">
              <div className="space-y-0.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#6B7280]">
                  NASTĘPNY
                </span>
                <h4 className="font-serif font-black text-xs sm:text-sm text-[#0f1412] italic">
                  To jest najstarszy wpis
                </h4>
              </div>
              <ChevronRight className="w-4 h-4 mt-1 shrink-0" />
            </div>
          )}
        </div>

        {/* Related Posts Section (Magazine-style Editorial Cards, now taking clean visual form) */}
        {relatedPosts.length > 0 && (
          <div className="mt-12 text-left">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-4.5 h-4.5 text-emerald-800" />
              <h3 className="text-xl md:text-2xl font-serif font-black tracking-tight text-[#0f1412]">
                Inne polecane artykuły
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPostItem) => {
                const itemStyles = getCategoryStyles(relatedPostItem.category);
                return (
                  <Link
                    key={relatedPostItem.id}
                    to={`/blog/${relatedPostItem.id}`}
                    className="group flex flex-col bg-white border border-slate-200/80 rounded-[24px] overflow-hidden hover:shadow-md hover:border-slate-300 transition-all p-3 text-[#1a211e]"
                  >
                    {/* Related Post Image Accent */}
                    <div className="relative aspect-[16/10] w-full rounded-[18px] overflow-hidden bg-slate-100">
                      {relatedPostItem.image ? (
                        <img
                          src={relatedPostItem.image}
                          alt={relatedPostItem.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-50 flex items-center justify-center p-6 text-slate-300">
                          <BookOpen className="w-10 h-10" />
                        </div>
                      )}
                      
                      {/* Category Tag Overlay */}
                      <span className={`absolute top-3 left-3 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded shadow-sm ${itemStyles.badgeBg}`}>
                        {relatedPostItem.category}
                      </span>
                    </div>

                    <div className="p-3 flex flex-col flex-1">
                      <h4 className="font-serif font-black text-base text-[#0f1412] tracking-tight leading-snug group-hover:text-black transition-colors mb-2 line-clamp-2 min-h-[40px]">
                        {relatedPostItem.title}
                      </h4>
                      <p className="text-[#374151] font-sans font-medium text-xs leading-relaxed line-clamp-2 mb-3">
                        {relatedPostItem.excerpt}
                      </p>
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-auto">
                        <span className="text-[8px] uppercase font-black tracking-widest text-[#6B7280] flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {relatedPostItem.date}
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-800 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                          Czytaj <ArrowLeft className="w-3 h-3 rotate-180" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </article>
  );
}
