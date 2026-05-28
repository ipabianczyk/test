import React, { createContext, useContext, useState, useEffect } from 'react';

interface A11yContextType {
  fontSize: number;
  highContrast: boolean;
  underlineLinks: boolean;
  dyslexicFont: boolean;
  grayscaleMode: boolean;
  readingRuler: boolean;
  largeSpacing: boolean;
  highlightLinks: boolean;
  setFontSize: (size: number) => void;
  toggleHighContrast: () => void;
  toggleUnderlineLinks: () => void;
  toggleDyslexicFont: () => void;
  toggleGrayscaleMode: () => void;
  toggleReadingRuler: () => void;
  toggleLargeSpacing: () => void;
  toggleHighlightLinks: () => void;
  reset: () => void;
}

const A11yContext = createContext<A11yContextType | undefined>(undefined);

export function A11yProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState(0); // -1, 0, 1
  const [highContrast, setHighContrast] = useState(false);
  const [underlineLinks, setUnderlineLinks] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [grayscaleMode, setGrayscaleMode] = useState(false);
  const [readingRuler, setReadingRuler] = useState(false);
  const [largeSpacing, setLargeSpacing] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);

  const [mouseY, setMouseY] = useState(0);

  const toggleHighContrast = () => setHighContrast(!highContrast);
  const toggleUnderlineLinks = () => setUnderlineLinks(!underlineLinks);
  const toggleDyslexicFont = () => setDyslexicFont(!dyslexicFont);
  const toggleGrayscaleMode = () => setGrayscaleMode(!grayscaleMode);
  const toggleReadingRuler = () => setReadingRuler(!readingRuler);
  const toggleLargeSpacing = () => setLargeSpacing(!largeSpacing);
  const toggleHighlightLinks = () => setHighlightLinks(!highlightLinks);

  const reset = () => {
    setFontSize(0);
    setHighContrast(false);
    setUnderlineLinks(false);
    setDyslexicFont(false);
    setGrayscaleMode(false);
    setReadingRuler(false);
    setLargeSpacing(false);
    setHighlightLinks(false);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('high-contrast', highContrast);
    root.classList.toggle('underline-links', underlineLinks);
    root.classList.toggle('dyslexic-font', dyslexicFont);
    root.classList.toggle('grayscale-mode', grayscaleMode);
    root.classList.toggle('large-spacing', largeSpacing);
    root.classList.toggle('highlight-links', highlightLinks);
    
    root.classList.remove('font-size-dec', 'font-size-inc');
    if (fontSize === -1) root.classList.add('font-size-dec');
    if (fontSize === 1) root.classList.add('font-size-inc');
  }, [fontSize, highContrast, underlineLinks, dyslexicFont, grayscaleMode, largeSpacing, highlightLinks]);

  // Track cursor position for the Reading Ruler
  useEffect(() => {
    if (!readingRuler) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [readingRuler]);

  return (
    <A11yContext.Provider value={{
      fontSize,
      highContrast,
      underlineLinks,
      dyslexicFont,
      grayscaleMode,
      readingRuler,
      largeSpacing,
      highlightLinks,
      setFontSize,
      toggleHighContrast,
      toggleUnderlineLinks,
      toggleDyslexicFont,
      toggleGrayscaleMode,
      toggleReadingRuler,
      toggleLargeSpacing,
      toggleHighlightLinks,
      reset
    }}>
      {children}

      {/* Reading Ruler DOM Overlay */}
      {readingRuler && (
        <div 
          className="fixed left-0 right-0 h-7 pointer-events-none z-[9999] transition-all duration-75 mix-blend-difference bg-yellow-400/25 border-y-2 border-yellow-400"
          style={{ 
            top: `${mouseY - 14}px`,
            boxShadow: '0 0 10px rgba(250, 204, 21, 0.4)'
          }}
        />
      )}
    </A11yContext.Provider>
  );
}

export const useA11y = () => {
  const context = useContext(A11yContext);
  if (!context) throw new Error('useA11y must be used within A11yProvider');
  return context;
};
