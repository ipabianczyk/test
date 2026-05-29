import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [consentOptions, setConsentOptions] = useState({
    ad_storage: false,
    ad_user_data: false,
    ad_personalization: false,
    analytics_storage: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const savedConsent = localStorage.getItem('mostpomocy_consent_v2');
    if (!savedConsent) {
      // Set default consent state for Google Consent Mode v2
      updateConsentMode({
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
      });
      setIsVisible(true);
    } else {
      try {
        const parsed = JSON.parse(savedConsent);
        updateConsentMode({
          ad_storage: parsed.ad_storage ? 'granted' : 'denied',
          ad_user_data: parsed.ad_user_data ? 'granted' : 'denied',
          ad_personalization: parsed.ad_personalization ? 'granted' : 'denied',
          analytics_storage: parsed.analytics_storage ? 'granted' : 'denied',
        });
      } catch (e) {
        setIsVisible(true);
      }
    }
  }, []);

  const updateConsentMode = (consentSettings: { [key: string]: 'granted' | 'denied' }) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'consent_update',
      ...consentSettings
    });
    
    // Call gtag function if defined
    const gtag = (window as any).gtag || function() {
      window.dataLayer.push(arguments);
    };
    gtag('consent', 'update', consentSettings);
    
    console.log('[MostPomocy Consent Mode V2 Update]:', consentSettings);
  };

  const handleAcceptAll = () => {
    const freshConsent = {
      ad_storage: true,
      ad_user_data: true,
      ad_personalization: true,
      analytics_storage: true,
    };
    localStorage.setItem('mostpomocy_consent_v2', JSON.stringify(freshConsent));
    updateConsentMode({
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
    });
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    const freshConsent = {
      ad_storage: false,
      ad_user_data: false,
      ad_personalization: false,
      analytics_storage: false,
    };
    localStorage.setItem('mostpomocy_consent_v2', JSON.stringify(freshConsent));
    updateConsentMode({
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    });
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem('mostpomocy_consent_v2', JSON.stringify(consentOptions));
    updateConsentMode({
      ad_storage: consentOptions.ad_storage ? 'granted' : 'denied',
      ad_user_data: consentOptions.ad_user_data ? 'granted' : 'denied',
      ad_personalization: consentOptions.ad_personalization ? 'granted' : 'denied',
      analytics_storage: consentOptions.analytics_storage ? 'granted' : 'denied',
    });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md bg-white border border-slate-200 p-6 md:p-8 rounded-3xl shadow-xl z-50 transition-all font-sans">
      <div className="space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <span className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase block mb-1">Prywatność i zgody</span>
          <h4 className="font-serif text-lg font-black text-slate-900 leading-none">Ciasteczka i Google Consent Mode V2</h4>
        </div>
        
        {!isCustomizing ? (
          <>
            <p className="text-xs text-slate-600 leading-relaxed">
              Szanujemy Twoją prywatność. Serwis mostpomocy.pl nie korzysta z zewnętrznych platform zgody. Używamy wyłącznie lokalnej pamięci Twojej przeglądarki i przekazujemy parametry prywatności bezpośrednio do Google Consent Mode v2.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button 
                onClick={handleAcceptAll}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-sans text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
              >
                Akceptuję wszystkie
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={handleAcceptNecessary}
                  className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                >
                  Tylko niezbędne
                </button>
                <button 
                  onClick={() => setIsCustomizing(true)}
                  className="py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 font-sans text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                >
                  Dostosuj
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              Zaznacz odpowiednie zgody przed ich zatwierdzeniem. Statystyki pomagają nam ulepszać platformę pomocową.
            </p>
            
            <div className="space-y-2.5 max-h-[150px] overflow-y-auto pr-1">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                <span className="text-[10px] font-black uppercase text-slate-700 tracking-wider">Statystyki (Google Analytics)</span>
                <input 
                  type="checkbox" 
                  checked={consentOptions.analytics_storage}
                  onChange={(e) => setConsentOptions({ ...consentOptions, analytics_storage: e.target.checked })}
                  className="checkbox checkbox-sm checkbox-primary"
                />
              </label>
              
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                <span className="text-[10px] font-black uppercase text-slate-700 tracking-wider">Reklamy i remarketing (Google Ads)</span>
                <input 
                  type="checkbox" 
                  checked={consentOptions.ad_storage}
                  onChange={(e) => setConsentOptions({ 
                    ...consentOptions, 
                    ad_storage: e.target.checked,
                    ad_user_data: e.target.checked,
                    ad_personalization: e.target.checked,
                  })}
                  className="checkbox checkbox-sm checkbox-primary"
                />
              </label>
            </div>
            
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button 
                onClick={() => setIsCustomizing(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-sans text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
              >
                Cofnij
              </button>
              <button 
                onClick={handleSaveCustom}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-sans text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
              >
                Zapisz wybrane
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
