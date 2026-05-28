import React, { createContext, useContext, useState, useEffect } from 'react';

interface A11yContextType {
  fontSize: number;
  highContrast: boolean;
  underlineLinks: boolean;
  dyslexicFont: boolean;
  setFontSize: (size: number) => void;
  toggleHighContrast: () => void;
  toggleUnderlineLinks: () => void;
  toggleDyslexicFont: () => void;
  reset: () => void;
}

const A11yContext = createContext<A11yContextType | undefined>(undefined);

export function A11yProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState(0); // -1, 0, 1
  const [highContrast, setHighContrast] = useState(false);
  const [underlineLinks, setUnderlineLinks] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);

  const toggleHighContrast = () => setHighContrast(!highContrast);
  const toggleUnderlineLinks = () => setUnderlineLinks(!underlineLinks);
  const toggleDyslexicFont = () => setDyslexicFont(!dyslexicFont);
  const reset = () => {
    setFontSize(0);
    setHighContrast(false);
    setUnderlineLinks(false);
    setDyslexicFont(false);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('high-contrast', highContrast);
    root.classList.toggle('underline-links', underlineLinks);
    root.classList.toggle('dyslexic-font', dyslexicFont);
    
    root.classList.remove('font-size-dec', 'font-size-inc');
    if (fontSize === -1) root.classList.add('font-size-dec');
    if (fontSize === 1) root.classList.add('font-size-inc');
  }, [fontSize, highContrast, underlineLinks, dyslexicFont]);

  return (
    <A11yContext.Provider value={{
      fontSize,
      highContrast,
      underlineLinks,
      dyslexicFont,
      setFontSize,
      toggleHighContrast,
      toggleUnderlineLinks,
      toggleDyslexicFont,
      reset
    }}>
      {children}
    </A11yContext.Provider>
  );
}

export const useA11y = () => {
  const context = useContext(A11yContext);
  if (!context) throw new Error('useA11y must be used within A11yProvider');
  return context;
};
