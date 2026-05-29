import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { getPostById } from '../services/blogService';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User, Share2, Tag, Volume2, Play, Pause, Square, Headphones, HelpCircle, ChevronLeft, ChevronRight, BookOpen, X, Sparkles } from 'lucide-react';

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = id ? getPostById(id) : undefined;

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

  // SEO Update
  React.useEffect(() => {
    document.title = `${title} | MostPomocy.pl`;
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', excerpt);

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', tags.join(', '));
  }, [title, excerpt, tags]);

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

    return (
      <div className={`min-h-screen transition-colors duration-300 pb-32 text-left ${themeStyles}`}>
        {/* Top bar with tools */}
        <div className="border-b border-current/10 py-3.5 px-4 sticky top-0 bg-inherit z-50 shadow-sm">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
            <button
              onClick={() => {
                handleStopSpeaking();
                setReadingModeActive(false);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-slate-800 transition-all shadow-md"
            >
              <X className="w-3.5 h-3.5" />
              Wyjdź z trybu czytania
            </button>

            <div className="flex flex-wrap justify-center items-center gap-2.5">
              {/* Font Scale switcher */}
              <div className="flex items-center gap-1 bg-current/5 border border-current/10 p-1 rounded-lg">
                <span className="text-[9px] uppercase font-bold px-1 opacity-70">Wielkość czcionki:</span>
                {(['base', 'lg', 'xl', '2xl'] as const).map(sz => (
                  <button
                    key={sz}
                    onClick={() => setReadingModeFontSize(sz)}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider transition-all ${
                      readingModeFontSize === sz
                        ? 'bg-slate-800 text-white'
                        : 'hover:bg-current/10 text-current'
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
                        ? 'bg-amber-400 text-slate-900 border border-amber-600'
                        : 'hover:bg-current/10 text-current'
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
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <Headphones className="w-4 h-4 text-emerald-400 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-serif font-black text-xs leading-tight">Uproszczony odtwarzacz dźwięku</h4>
                  <p className="text-[10px] opacity-75 mt-0.5">
                    Klikaj na dowolne bloki tekstu na dole, by czytać i słuchać dokładnie od tamtego miejsca.
                  </p>
                </div>
              </div>

              {isReading && (
                <div className="px-2.5 py-1 rounded bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 shadow animate-pulse">
                  <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                  <span>Tekst jest czytany</span>
                </div>
              )}
            </div>

            {speechSupported ? (
              <div className="flex flex-wrap items-center gap-3 pt-3 mt-3 border-t border-current/10">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrevParagraph}
                    disabled={currentParagraphIndex === null || currentParagraphIndex === 0}
                    className="p-1.5 bg-current/5 hover:bg-current/10 rounded disabled:opacity-30 transition-all border border-current/5"
                    title="Poprzedni akapit"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleTogglePlay}
                    className="px-4 py-1.5 bg-slate-950 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all hover:bg-slate-800"
                  >
                    {isReading && !isPaused ? (
                      <>
                        <Pause className="w-3 h-3 fill-current" /> Pauza
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-current text-amber-300" /> Odtwórz
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleNextParagraph}
                    disabled={currentParagraphIndex === null || currentParagraphIndex >= paragraphs.length - 1}
                    className="p-1.5 bg-current/5 hover:bg-current/10 rounded disabled:opacity-30 transition-all border border-current/5"
                    title="Następny akapit"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {isReading && (
                    <button
                      onClick={handleStopSpeaking}
                      className="px-2.5 py-1.5 bg-rose-500/10 text-rose-600 hover:bg-rose-550/25 text-[9.5px] font-black uppercase tracking-wider rounded-lg border border-rose-500/20 flex items-center gap-1 transition-all"
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
                            ? 'bg-slate-950 text-white' 
                            : 'hover:bg-current/10 text-current'
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
                  <div className={`prose max-w-none text-inherit ${fontStyles}`}>
                    <MarkdownRenderer content={para} />
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
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md inline-block"
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
      {/* Editorial Journal Header (No Imagery) */}
      <header className="relative py-10 md:py-16 bg-[#FBF9F4] border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 md:px-10 w-full">
          <Link to="/blog" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#6B7280] hover:text-[#0f1412] transition-colors mb-8 md:mb-12 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Powrót do czytelni
          </Link>
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 md:space-y-8"
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
            
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-serif font-black tracking-tight leading-snug md:leading-none text-[#1F2937] max-w-4xl">
              {title}
            </h1>
            
            <p className="text-[#374151] font-sans text-sm md:text-lg leading-relaxed max-w-3xl italic">
              {excerpt}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 md:gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-[#6B7280] pt-4 md:pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                {date}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                Napisane przez: {author}
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-1 sm:px-4 md:px-10 py-6 md:py-16 relative z-20 pb-32">
        <div className="bg-white px-3 py-6 sm:px-8 md:px-16 rounded-[20px] sm:rounded-[48px] border border-slate-200">
          
          {/* FREE HTML5 Speech Player Section */}
          <div className="mb-8 p-4 sm:p-5 bg-slate-50 border border-slate-250 rounded-2xl text-left space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <Headphones className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-serif font-black text-xs text-slate-900 leading-tight">
                    Odtwarzacz Audio (Lektor)
                  </h4>
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                    Twój system przeczyta ten tekst czystym głosem na głos.
                  </p>
                </div>
              </div>

              {/* Status display or simple indicator */}
              {isReading && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800 text-amber-300 text-[9px] font-black uppercase tracking-widest rounded animate-pulse">
                  <Volume2 className="w-3 h-3 animate-bounce" />
                  <span>Słuchasz...</span>
                </div>
              )}
            </div>

            {/* CTA to open Comfort Reader mode */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 py-2 border-t border-dashed border-slate-200/80">
              <span className="text-[11px] text-slate-600 font-medium">
                📱 Tekst jest zbyt mały lub nieczytelny na telefonie?
              </span>
              <button
                onClick={() => setReadingModeActive(true)}
                className="px-4 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                Włącz Ułatwiony Tryb Czytania
              </button>
            </div>

            {speechSupported ? (
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200">
                {/* Control Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTogglePlay}
                    className="px-4 py-1.5 bg-black hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5"
                  >
                    {isReading && !isPaused ? (
                      <>
                        <Pause className="w-3 h-3 fill-current" /> Pauza
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-current text-emerald-400" /> Odtwórz
                      </>
                    )}
                  </button>

                  {isReading && (
                    <button
                      onClick={handleStopSpeaking}
                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1 border border-rose-200"
                    >
                      <Square className="w-2.5 h-2.5 fill-current" /> Stop
                    </button>
                  )}
                </div>

                {/* Speed Slider Control */}
                <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1 rounded-lg text-xs font-semibold text-slate-600">
                  <span className="whitespace-nowrap text-[9.5px] font-bold">Tempo lektora:</span>
                  <div className="flex gap-1">
                    {[0.8, 1.0, 1.25, 1.5].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => handleRateChange(rate)}
                        className={`px-1.5 py-0.5 text-[9px] uppercase font-black tracking-widest rounded ${
                          speechRate === rate 
                            ? 'bg-slate-900 text-white' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[10px] text-rose-600 font-sans italic">
                Brak obsługi lektora głosowego w Twojej przeglądarce.
              </p>
            )}
          </div>

          {/* Article Meta */}
          <div className="mb-8 md:mb-12 pb-6 md:pb-8 border-b border-slate-50 italic text-slate-400 text-sm md:text-base font-medium leading-relaxed flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              Artykuł weryfikowany przez zespół <strong>MostPomocy</strong>.
            </div>
            <div className="text-[10.5px] text-slate-500 flex items-center gap-1 font-sans">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              Lektor nie zużywa Twojego transferu danych.
            </div>
          </div>

          {/* Typography Overhaul */}
          <div className="prose prose-slate prose-base sm:prose-lg md:prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-[1.7] prose-p:font-medium prose-strong:text-slate-900 prose-img:rounded-[24px] md:prose-img:rounded-[40px] prose-img:shadow-xl prose-a:text-amber-600 prose-a:font-black prose-a:no-underline hover:prose-a:underline">
            <MarkdownRenderer content={content} />
          </div>
          
          {/* Dynamic Resources Section */}
          {resources.length > 0 && (
            <div className="mt-12 md:mt-24 pt-10 md:pt-16 border-t-4 border-slate-50">
              <div className="flex items-center gap-3 mb-8 md:mb-12">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shadow-md shadow-amber-200/50">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">Przydatne kafelki</h3>
                  <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest mt-0.5">Narzędzia powiązane z tematem</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                {resources.map((res: any, idx: number) => (
                  <a 
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col p-6 sm:p-8 bg-white border-2 border-slate-100 rounded-[24px] md:rounded-[40px] hover:border-amber-500 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex-1 space-y-3">
                      <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </div>
                      <h4 className="text-lg sm:text-2.5xl font-black text-slate-900 group-hover:text-amber-600 transition-colors leading-tight">
                        {res.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                        {res.desc}
                      </p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-amber-600 transition-colors">
                      <span>Otwórz narzędzie</span>
                      <ArrowLeft className="w-3.5 h-3.5 rotate-180 transform group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 md:mt-24 pt-10 md:pt-16 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-10">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white tracking-widest font-serif italic text-lg font-bold">IP</div>
               <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Autor publikacji</p>
                  <p className="text-base font-black text-slate-900">{author}</p>
               </div>
            </div>
            <Link to="/kontakt" className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-amber-600 text-white text-center rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg">
              Zadaj pytanie autorowi
            </Link>
          </div>
        </div>
      </main>
    </article>
  );
}
