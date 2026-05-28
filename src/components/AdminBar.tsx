import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, Check, Edit3, LogOut, Settings, X, Save, 
  Trash2, HelpCircle, FileText, AlertCircle, Plus, BookOpen 
} from 'lucide-react';
import { 
  isAdminLoggedIn, logInAdmin, logOutAdmin, getPageEdit, savePageEdit, ADMIN_PIN 
} from '../services/adminService';

// We can define a default metadata registry to make editing incredibly easy
const DEFAULT_PAGE_DATA: Record<string, { title: string; subtitle: string; description: string }> = {
  '/': {
    title: "Znajdź pomoc",
    subtitle: "bez oceniania i strachu.",
    description: "MostPomocy to Twój wirtualny przewodnik po systemie wsparcia społecznego w Polsce. Pomożemy Ci postawić pierwszy krok, otrzymać wsparcie finansowe, prawne i psychiczne bez zbędnych barier."
  },
  '/znajdz-potrzebe': {
    title: "Rozeznaj swoje potrzeby",
    subtitle: "Krok po kroku",
    description: "Wybierz obszar, który najbardziej odpowiada Twojej obecnej sytuacji życiowej, aby dopasować odpowiednie kroki prawne i wsparcie socjalne."
  },
  '/potrzebomat': {
    title: "Potrzebomat SOS",
    subtitle: "Twoje Prawa i Pomoc Socjalna",
    description: "Odpowiedz na kilka prostych pytań, aby dowiedzieć się, jakie świadczenia pieniężne, pomoc mieszkaniowa lub wsparcie prawne i psychologiczne przysługuje Ci w obecnej sytuacji."
  },
  '/strefa-spokoju': {
    title: "Strefa Spokoju",
    subtitle: "Zatrzymaj się i Odetchnij",
    description: "Przeżywasz silny stres, lęk lub kryzys emocjonalny? Ta przestrzeń powstała, aby pomóc Ci odzyskać stabilność i spokój w bezpiecznym tempie."
  },
  '/slownik-kryzysowy': {
    title: "Słownik Kryzysowy",
    subtitle: "Urzędowe pojęcia prostym językiem",
    description: "Wyjaśniamy skomplikowany żargon urzędowy, prawny i socjalny. Dowiedz się, co oznaczają poszczególne procedury i dokumenty."
  },
  '/autodiagnoza': {
    title: "Szybki Test Przesiewowy",
    subtitle: "Sprawdź swoje samopoczucie",
    description: "Poniższy anonimowy kwestionariusz pomoże Ci ocenić poziom przeżywanego stresu i kryzysu emocjonalnego, sugerując odpowiednie ścieżki pomocy."
  },
  '/kontakt': {
    title: "Kontakt ze Specjalistami",
    subtitle: "Zawsze gotowi do rozmowy",
    description: "Skorzystaj z bezpośrednich form kontaktu lub napisz bezpośrednio do koordynatorów. Twoja wiadomość jest w pełni poufna."
  },
  '/bezpiecznik': {
    title: "Bezpiecznik Kryzysowy",
    subtitle: "Wydrukuj i miej przy sobie",
    description: "Niezbędne procedury, numery alarmowe i wsparcie spisane w zwięzłej formie gotowej do wydrukowania jako jedna bezpieczna karta (PDF)."
  }
};

export default function AdminBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAdminLoggedIn());
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // Track editable page values
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  useEffect(() => {
    // Sync with state periodically or on storage event
    const handleStorage = () => {
      setIsLoggedIn(isAdminLoggedIn());
    };
    window.addEventListener('storage', handleStorage);
    
    // Check path for secret entry
    if (currentPath === '/panel-admina' && !isAdminLoggedIn()) {
      setShowLoginModal(true);
    }

    return () => window.removeEventListener('storage', handleStorage);
  }, [currentPath]);

  // Handle custom listener for double-click or footer actions
  useEffect(() => {
    const handleTriggerAdmin = (e: CustomEvent) => {
      if (isAdminLoggedIn()) {
        setIsLoggedIn(true);
        // Alert briefly
      } else {
        setShowLoginModal(true);
      }
    };

    window.addEventListener('trigger-admin-login', handleTriggerAdmin as EventListener);
    return () => window.removeEventListener('trigger-admin-login', handleTriggerAdmin as EventListener);
  }, []);

  // Load current page edits when modal opens
  const openEdit = () => {
    const defaultData = DEFAULT_PAGE_DATA[currentPath] || { title: document.title, subtitle: '', description: '' };
    const saved = getPageEdit(currentPath, defaultData);
    setEditTitle(saved.title || '');
    setEditSubtitle(saved.subtitle || '');
    setEditDesc(saved.description || '');
    setShowEditModal(true);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (logInAdmin(pinInput)) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setPinInput('');
      setPinError('');
      // Trigger update
      window.dispatchEvent(new Event('storage'));
      if (currentPath === '/panel-admina') {
        navigate('/');
      }
    } else {
      setPinError('Niepoprawny kod PIN administratowa.');
    }
  };

  const handleSaveEdits = () => {
    savePageEdit(currentPath, {
      title: editTitle,
      subtitle: editSubtitle,
      description: editDesc
    });
    setShowEditModal(false);
    // Reload components depending on metadata
    window.dispatchEvent(new CustomEvent('page-contents-edited', { detail: currentPath }));
  };

  const handleLogout = () => {
    logOutAdmin();
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  return (
    <>
      {/* 1. Transparent Global Floating Admin Indicator & Ribbon */}
      {isLoggedIn && (
        <div className="bg-slate-900 border-b border-amber-500 py-2.5 px-4 sm:px-10 flex flex-wrap justify-between items-center gap-3 text-white sticky top-0 z-[60] shadow-md ignore-contrast">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 bg-amber-500 text-slate-900 rounded-lg flex items-center justify-center font-black text-xs animate-pulse">
              🛡️
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
              Tryb Administratora Aktywny
            </span>
            <span className="text-[10px] text-slate-400 font-bold max-sm:hidden">
              (Edycja Strony: {currentPath})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {DEFAULT_PAGE_DATA[currentPath] ? (
              <button
                onClick={openEdit}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edytuj Tę Stronę
              </button>
            ) : (
              <span className="text-[10px] text-slate-500 font-bold mr-2 max-sm:hidden">
                (Aby edytować posty przejdź do Kreatora)
              </span>
            )}
            
            <button
              onClick={() => navigate('/kreator-artykulow')}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Kreator Artykułów
            </button>

            <button
              onClick={handleLogout}
              className="p-1 px-2.5 bg-red-600/25 hover:bg-red-600 text-red-100 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-colors"
              title="Wyloguj ze statutu admina"
            >
              <LogOut className="w-3 h-3" /> Wyloguj
            </button>
          </div>
        </div>
      )}

      {/* 2. Admin Pin Code Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 ignore-contrast">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 border-2 border-neutral-200/50 shadow-2xl relative overflow-hidden">
            <button
              onClick={() => {
                setShowLoginModal(false);
                if (currentPath === '/panel-admina') navigate('/');
              }}
              className="absolute top-4 right-4 p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-4 text-center">
              <div className="w-12 h-12 bg-amber-500/15 text-amber-600 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-inner">
                🔐
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Panel Administratora</h3>
                <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mt-1">
                  Autoryzacja Mostu Pomocy
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
                <div>
                  <input
                    type="password"
                    placeholder="Wpisz tajny kod PIN..."
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl text-center text-md font-bold focus:outline-none focus:border-amber-500 tracking-widest"
                    autoFocus
                  />
                  {pinError && (
                    <p className="text-[11px] text-red-500 font-bold mt-1.5 flex items-center justify-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" /> {pinError}
                    </p>
                  )}
                </div>

                <div className="bg-slate-55 bg-neutral-50 px-3 py-2.5 rounded-xl border border-neutral-200/50">
                  <p className="text-[10px] text-neutral-500 font-medium leading-relaxed">
                    Domyślny PIN studenta UŚ: <strong>UŚ2026</strong> lub <strong>1234</strong>
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md shadow-slate-900/10"
                >
                  Odblokuj Edytor
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 3. Page Content Visual Editor Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 ignore-contrast">
          <div className="bg-white rounded-[40px] max-w-lg w-full p-8 border border-neutral-200/60 shadow-2xl space-y-6 relative overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-500" />
                <h3 className="text-md sm:text-lg font-black text-slate-900 tracking-tight">Edytor Treści Strony</h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 hover:bg-neutral-50 rounded-lg text-neutral-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-400 font-semibold leading-relaxed">
              Wprowadzone zmiany są natychmiastowo zapisywane w Twojej przeglądarce i załadowane na portal.
            </p>

            <div className="space-y-5 text-left">
              {/* Field 1: Title */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-400">
                  Nagłówek Główny (Title)
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-amber-500 rounded-xl text-sm font-bold focus:bg-white transition-all outline-none"
                />
              </div>

              {/* Field 2: Subtitle */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-400">
                  Podtytuł / Slogan (Subtitle)
                </label>
                <input
                  type="text"
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-amber-500 rounded-xl text-sm font-bold focus:bg-white transition-all outline-none"
                />
              </div>

              {/* Field 3: Long Description */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-400">
                  Opis / Wstęp (Description)
                </label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-amber-500 rounded-xl text-xs font-semibold focus:bg-white transition-all outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-neutral-100">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={handleSaveEdits}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/10"
              >
                <Save className="w-4 h-4" /> Zapisz Edycje
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
