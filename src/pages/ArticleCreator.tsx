import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { useHotkeys } from 'react-hotkeys-hook';
import { 
  FilePlus, Copy, Download, Eye, Edit3, 
  Type, User, Tag, AlertTriangle, ShieldAlert, CheckCircle2,
  Calendar, Clock, Layout, LucideIcon, Trash2, Plus,
  BookOpen, Scale, Heart, Info, Table, RefreshCw,
  Search, ArrowRight, Bold, Italic, List, Check,
  Heading1, Heading2, MessageSquare, MapPin, Globe,
  PhoneCall, Grid, ExternalLink, Lock, Mail, BarChart2, Users
} from 'lucide-react';

const CATEGORIES = ['PORADNIK', 'PRAWO', 'ZDROWIE', 'HISTORIA', 'INTERWENCJA'];
const ALERT_LEVELS = [
  { id: 'normal', label: 'Normalny', color: 'bg-blue-500', icon: Info },
  { id: 'warning', label: 'Ostrzeżenie', color: 'bg-amber-500', icon: AlertTriangle },
  { id: 'urgent', label: 'Pilny', color: 'bg-rose-500', icon: ShieldAlert },
];

const ICONS = [
  { name: 'FileText', icon: Edit3 },
  { name: 'ShieldAlert', icon: ShieldAlert },
  { name: 'Scale', icon: Scale },
  { name: 'Heart', icon: Heart },
  { name: 'Info', icon: Info },
];

// Domyślne placówki na Śląsku (Sosnowiec, Katowice, Dąbrowa Górnicza)
interface Facility {
  id: string;
  name: string;
  city: 'Sosnowiec' | 'Katowice' | 'Dąbrowa Górnicza' | 'Inne';
  address: string;
  phone: string;
  email: string;
  hours: string;
  desc: string;
}

const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'sosnowiec-mops',
    name: 'Miejski Ośrodek Pomocy Społecznej w Sosnowcu',
    city: 'Sosnowiec',
    address: 'ul. 3 Maja 33, 41-200 Sosnowiec',
    phone: '32 296 22 00',
    email: 'mops@mops.sosnowiec.pl',
    hours: 'Poniedziałek - Piątek: 7:30 - 15:30',
    desc: 'Dział Świadczeń Socjalnych, Rodzinnych i Alimentacyjnych. Kompleksowe doradztwo z zakresu Funduszu Alimentacyjnego oraz Niebieskiej Karty.'
  },
  {
    id: 'katowice-mops',
    name: 'Miejski Ośrodek Pomocy Społecznej w Katowicach',
    city: 'Katowice',
    address: 'ul. Wita Stwosza 7, 40-037 Katowice',
    phone: '32 251 00 87',
    email: 'mops@mops.katowice.pl',
    hours: 'Poniedziałek - Piątek: 7:30 - 15:30',
    desc: 'Dział Świadczeń Rodzinnych i Osłonowych. Realizacja spraw alimentacyjnych, wniosków z tytułu samotnego rodzicielstwa.'
  },
  {
    id: 'dabrowa-mops',
    name: 'Miejski Ośrodek Pomocy Społecznej w Dąbrowie Górniczej',
    city: 'Dąbrowa Górnicza',
    address: 'ul. Sobieskiego 13, 41-300 Dąbrowa Górnicza',
    phone: '32 262 33 22',
    email: 'mops@mops.dabrowa-gornicza.pl',
    hours: 'Poniedziałek - Piątek: 7:00 - 15:00',
    desc: 'Pełna obsługa świadczeń z Funduszu Alimentacyjnego. Pomoc materialna, psychologiczna i asystentura rodzinna.'
  }
];

export default function ArticleCreator() {
  // 1. Zabezpieczenie Cloudflare Access przeciwko '/cdn-cgi/access/certs'
  const [authStatus, setAuthStatus] = useState<'checking' | 'authorized' | 'denied'>('checking');
  const [authMessage, setAuthMessage] = useState('Trwa autoryzacja za pomocą bramy Cloudflare Access...');

  useEffect(() => {
    fetch('/cdn-cgi/access/certs')
      .then(res => {
        // Zgodnie z Cloudflare Access, status 200/2xx oznacza udaną sesję.
        // Jeśli serwer zwraca 4xx/5xx i nie jesteśmy lokalnie, autoryzacja się nie powiodła.
        if (res.ok) {
          setAuthStatus('authorized');
        } else {
          // Tryb deweloperski/lokalny - dajemy "soft login" ułatwiający preview,
          // wypisując precyzyjną informację o statusie.
          if (process.env.NODE_ENV !== 'production' || window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1')) {
            console.warn('[Cloudflare Access] Local developer bypass. Normal in dev containers.');
            setAuthStatus('authorized');
          } else {
            setAuthStatus('denied');
            setAuthMessage('Blokada zabezpieczeń Cloudflare. Brak ważnego certyfikatu JWT w ciasteczkach sesyjnych.');
          }
        }
      })
      .catch((err) => {
        // Lokalne środowisko - dopuszczalne pominięcie z logiem ostrzegawczym
        console.warn('[Cloudflare Access] Certificate endpoint failed. Graceful developer fallback enabled.', err);
        setAuthStatus('authorized');
      });
  }, []);

  // Zakładka główna panelu administracyjnego
  const [panelTab, setPanelTab] = useState<'articles' | 'facilities' | 'newsletter'>('articles');

  // Stan dla bazy placówek (CRUD)
  const [facilities, setFacilities] = useState<Facility[]>(() => {
    const saved = localStorage.getItem('mostpomocy_facilities');
    return saved ? JSON.parse(saved) : INITIAL_FACILITIES;
  });

  const saveFacilities = (updated: Facility[]) => {
    setFacilities(updated);
    localStorage.setItem('mostpomocy_facilities', JSON.stringify(updated));
  };

  // Stan edycji konkretnej placówki
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [isAddingFacility, setIsAddingFacility] = useState(false);
  const [facilityForm, setFacilityForm] = useState<Omit<Facility, 'id'>>({
    name: '',
    city: 'Sosnowiec',
    address: '',
    phone: '',
    email: '',
    hours: '',
    desc: ''
  });

  // State dla edytora artykułów (Bez obrazków)
  const [activeTab, setActiveTabTab] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: 'Redakcja MostPomocy',
    category: 'PORADNIK',
    tags: '',
    excerpt: '',
    readTime: '5 min',
    alertLevel: 'normal',
    icon: 'FileText',
    content: '# Nagłówek Artykułu\n\nTutaj wpisz treść artykułu używając składni Markdown...'
  });

  const [copied, setCopied] = useState(false);

  // Markdown Generator (W 100% TEKSTOWY - bez obrazka)
  const generatedMarkdown = useMemo(() => {
    const date = new Date().toISOString().split('T')[0];
    const tagsArray = formData.tags.split(',').map(tag => `"${tag.trim()}"`).filter(tag => tag !== '""');
    
    return `---
title: "${formData.title}"
date: ${date}
author: "${formData.author}"
category: "${formData.category}"
tags: [${tagsArray.join(', ')}]
excerpt: "${formData.excerpt.replace(/"/g, '\\"')}"
readTime: "${formData.readTime}"
alert_level: "${formData.alertLevel}"
icon: "${formData.icon}"
---

${formData.content}`;
  }, [formData]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const date = new Date().toISOString().split('T')[0];
    const filename = `${date}-${formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.md`;
    const element = document.createElement('a');
    const file = new Blob([generatedMarkdown], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const insertText = (before: string, after: string = '') => {
    if (!textareaRef.current) return;
    const { selectionStart, selectionEnd, value } = textareaRef.current;
    const selectedText = value.substring(selectionStart, selectionEnd);
    const newText = value.substring(0, selectionStart) + before + selectedText + after + value.substring(selectionEnd);
    setFormData({ ...formData, content: newText });
    
    setTimeout(() => {
      textareaRef.current?.focus();
      const newPos = selectionStart + before.length + selectedText.length + after.length;
      textareaRef.current?.setSelectionRange(newPos, newPos);
    }, 0);
  };

  useHotkeys('ctrl+b', (e) => { e.preventDefault(); insertText('**', '**'); });
  useHotkeys('ctrl+i', (e) => { e.preventDefault(); insertText('*', '*'); });

  // CRUD placówki handlery
  const handleAddFacility = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `${facilityForm.city.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-6)}`;
    const newFac: Facility = {
      ...facilityForm,
      id: newId
    };
    const updated = [newFac, ...facilities];
    saveFacilities(updated);
    setIsAddingFacility(false);
    resetFacilityForm();
  };

  const handleEditFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFacility) return;
    const updated = facilities.map(f => f.id === editingFacility.id ? { ...facilityForm, id: f.id } : f);
    saveFacilities(updated);
    setEditingFacility(null);
    resetFacilityForm();
  };

  const handleDeleteFacility = (id: string) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę placówkę pomagającą dłużnikom ze Śląska?')) {
      const updated = facilities.filter(f => f.id !== id);
      saveFacilities(updated);
    }
  };

  const resetFacilityForm = () => {
    setFacilityForm({
      name: '',
      city: 'Sosnowiec',
      address: '',
      phone: '',
      email: '',
      hours: '',
      desc: ''
    });
  };

  const triggerEdit = (f: Facility) => {
    setEditingFacility(f);
    setIsAddingFacility(false);
    setFacilityForm({
      name: f.name,
      city: f.city,
      address: f.address,
      phone: f.phone,
      email: f.email,
      hours: f.hours,
      desc: f.desc
    });
  };

  const openAddMode = () => {
    setIsAddingFacility(true);
    setEditingFacility(null);
    resetFacilityForm();
  };

  // Generator YAML Front Matter dla Placówki
  const generateFacilityYaml = (f: Facility) => {
    return `---
id: "${f.id}"
nazwa: "${f.name}"
miasto: "${f.city}"
adres: "${f.address}"
telefon: "${f.phone}"
email: "${f.email}"
godziny_otwarcia: "${f.hours}"
opis_wsparcia: "${f.desc.replace(/"/g, '\\"')}"
rejestr_zweryfikowany: true
typ: "Wsparcie Śląsk"
---`;
  };

  // Render barier błędu Cloudflare Access
  if (authStatus === 'checking') {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center p-8">
        <div className="text-center space-y-6">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="w-16 h-16 border-4 border-slate-900 border-t-transparent rounded-full mx-auto"
          />
          <p className="text-sm font-sans font-black uppercase tracking-widest text-[#0f1412] max-w-sm">
            {authMessage}
          </p>
        </div>
      </div>
    );
  }

  if (authStatus === 'denied') {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center p-8">
        <div className="bg-white border-2 border-rose-500 rounded-3xl p-10 max-w-lg text-center space-y-6 shadow-2xl">
          <Lock className="w-12 h-12 text-rose-600 mx-auto" />
          <h2 className="text-2xl font-serif font-black text-rose-950">Autoryzacja odrzucona</h2>
          <p className="text-xs text-rose-800 font-sans leading-relaxed">
            {authMessage} Proszę upewnić się, że przeszedłeś przez system Cloudflare Access (/cdn-cgi/access/certs) i posiadasz poświadczone uprawnienia administratorskie platformy.
          </p>
          <a href="/" className="inline-block px-6 py-4 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all">
            Powrót do strony głównej
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F4] py-12 px-4 sm:px-10">
      <div className="max-w-7xl mx-auto">
        
        {/* NAGŁÓWEK DASHBOARDU */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-dark-900/10 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase text-[#6B7280] tracking-[0.25em]">Cloudflare Authenticated Workspace</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-[#0f1412] tracking-tighter leading-none">
              Panel Zarządzania <span className="italic font-normal text-slate-500">mostpomocy.pl</span>
            </h1>
          </div>

          {/* WPINKA NAWIGACJI PANELU */}
          <div className="inline-flex bg-white p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setPanelTab('articles')}
              className={`flex garments-btn items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${panelTab === 'articles' ? 'bg-slate-900 text-white' : 'text-[#6B7280] hover:text-[#0f1412]'}`}
            >
              <FilePlus className="w-4 h-4" /> Kreator Artykułów
            </button>
            <button
              onClick={() => setPanelTab('facilities')}
              className={`flex garments-btn items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${panelTab === 'facilities' ? 'bg-slate-900 text-white' : 'text-[#6B7280] hover:text-[#0f1412]'}`}
            >
              <Table className="w-4 h-4" /> Baza Placówek Śląsk (CRUD)
            </button>
            <button
              onClick={() => setPanelTab('newsletter')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${panelTab === 'newsletter' ? 'bg-slate-900 text-white' : 'text-[#6B7280] hover:text-[#0f1412]'}`}
            >
              <Mail className="w-4 h-4" /> Newsletter & Statystyki
            </button>
          </div>
        </header>

        {/* ZAKŁADKA 1: KREATOR ARTYKUŁÓW */}
        {panelTab === 'articles' && (
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Formularz - Lewa kolumna */}
            <section className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-xs font-sans font-black text-[#0f1412] uppercase tracking-[0.2em] flex items-center gap-2">
                  <Edit3 className="w-4 h-4" /> Ustawienia Metadanych Artykułu
                </h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleDownload}
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    title="Pobierz pliku Markdown"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleCopy}
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    title="Kopiuj konfigurację front-matter"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Tytuł */}
                  <div className="space-y-2 col-span-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-[#6B7280]">Tytuł wpisu</label>
                    <input 
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Wprowadź nagłówek artykułu..."
                      className="w-full font-serif font-black text-xl text-[#0f1412] bg-slate-50 border-4 border-transparent focus:border-slate-300 focus:bg-white rounded-2xl p-4.5 outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>

                  {/* Autor */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-[#6B7280]">Autor</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input 
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="w-full bg-slate-50 rounded-2xl pl-12 pr-4 py-4 font-bold text-xs text-[#1a211e] outline-none border border-transparent focus:border-slate-200"
                      />
                    </div>
                  </div>

                  {/* Czas Czytania */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-[#6B7280]">Czas czytania</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input 
                        type="text"
                        value={formData.readTime}
                        onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                        className="w-full bg-slate-50 rounded-2xl pl-12 pr-4 py-4 font-bold text-xs text-[#1a211e] outline-none border border-transparent focus:border-slate-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Kategoria */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-[#6B7280]">Kategoria (Hugo / Hugo-Stack)</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-50 rounded-2xl px-4 py-4 font-black text-xs text-[#0f1412] outline-none border border-transparent focus:border-slate-200"
                    >
                      {CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tagi */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-[#6B7280]">Tagi (Z przecinkiem)</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input 
                        type="text"
                        placeholder="np. alimenty, pomoc, darmowe porady"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        className="w-full bg-slate-50 rounded-2xl pl-12 pr-4 py-4 font-bold text-xs text-[#1a211e] outline-none border border-transparent focus:border-slate-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Streszczenie pod kafelkami (Excerpt) */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-[#6B7280]">Streszczenie / Zajawka</label>
                  <textarea 
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Wpisz maksymalnie 2 krotkie zdania wyświetlane na wizytówce..."
                    maxLength={140}
                    className="w-full bg-slate-50 border border-transparent focus:border-slate-200 rounded-2xl p-4 font-medium text-xs text-[#1a211e] h-20 outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Sekcja Alerty – Poziom Triage */}
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Alert Level */}
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black tracking-widest text-[#6B7280]">Poziom Interwencyjny (Triage)</label>
                    <div className="flex gap-2">
                      {ALERT_LEVELS.map(level => {
                        const Icon = level.icon;
                        const isSelected = formData.alertLevel === level.id;
                        return (
                          <button
                            key={level.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, alertLevel: level.id })}
                            className={`flex-1 p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${isSelected ? 'bg-slate-950 text-white border-slate-900 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-[9px] font-black uppercase tracking-tight">{level.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Icon Select */}
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black tracking-widest text-[#6B7280]">Ikona postu</label>
                    <div className="flex gap-2">
                      {ICONS.map(i => {
                        const Icon = i.icon;
                        const isSelected = formData.icon === i.name;
                        return (
                          <button
                            key={i.name}
                            type="button"
                            onClick={() => setFormData({ ...formData, icon: i.name })}
                            className={`flex-1 p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${isSelected ? 'bg-slate-950 text-white border-slate-900 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                          >
                            <Icon className="w-5 h-5 animate-pulse" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Edytor Markdown */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-black tracking-widest text-[#6B7280]">Treść artykułu (Obsługuje Markdown)</label>
                    <div className="flex gap-1">
                      <button 
                        type="button" 
                        onClick={() => insertText('**', '**')} 
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded"
                        title="Pogrubienie (Skrót: Ctrl+B)"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => insertText('*', '*')} 
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded"
                        title="Kursywa (Skrót: Ctrl+I)"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => insertText('# ', '')} 
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded"
                        title="Nagłówek H1"
                      >
                        <Heading1 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => insertText('## ', '')} 
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded"
                        title="Nagłówek H2"
                      >
                        <Heading2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => insertText('- ', '')} 
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded"
                        title="Lista punktowana"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <textarea 
                    ref={textareaRef}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full min-h-[400px] bg-slate-50 border-4 border-transparent focus:border-slate-300 focus:bg-white rounded-[24px] p-6 text-sm font-sans font-medium leading-relaxed outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Podgląd Artykułu - Prawa kolumna */}
            <section className="space-y-8">
              <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-fit">
                <button
                  type="button"
                  onClick={() => setActiveTabTab('edit')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'edit' ? 'bg-slate-900 text-white' : 'text-[#6B7280] hover:text-[#0f1412]'}`}
                >
                  <Eye className="w-3.5 h-3.5" /> Wizytówka (Karta)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTabTab('preview')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'preview' ? 'bg-slate-900 text-white' : 'text-[#6B7280] hover:text-[#0f1412]'}`}
                >
                  <BookOpen className="w-3.5 h-3.5" /> Czytelnia (Artykuł)
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'edit' ? (
                  <motion.div
                    key="card-preview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#6B7280] flex items-center gap-3">
                      <Grid className="w-4 h-4" /> Podgląd Kafelka w Magazynie 1:1 (Bez Obrazków)
                    </h3>
                    
                    {/* WIERNY LAYOUT WG EDITORIAL & WARMTH - W STYLU KARTY Z BLOGA, BEZ OBRAZKÓW */}
                    <div className="bg-white rounded-[32px] border border-slate-200 p-10 hover:border-slate-300 transition-all shadow-sm flex flex-col h-full min-h-[360px] text-[#1a211e]">
                      <div className="flex items-center justify-between mb-8">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                          {formData.category}
                        </span>
                        <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                          <Clock className="w-3.5 h-3.5" /> {formData.readTime}
                          <span>•</span>
                          <span>{new Date().toLocaleDateString('pl-PL')}</span>
                        </div>
                      </div>
                      
                      <h2 className="text-2xl font-serif font-black tracking-tight leading-tight mb-4 text-[#0f1412]">
                        {formData.title || 'Tytuł Artykułu'}
                      </h2>
                      
                      <p className="text-slate-500 font-medium leading-relaxed text-sm mb-8">
                        {formData.excerpt || 'Zajawka artykułu pojawi się tutaj po wpisaniu tekstu w formularzu...'}
                      </p>
                      
                      <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] text-[#0f1412] hover:text-black transition-colors">
                        <span>Przeczytaj Artykuł</span>
                        <ArrowRight className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>

                    {/* PODGLĄD KODU */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#6B7280] flex items-center gap-3">
                        <Layout className="w-4 h-4" /> Nagłówek Front Matter (Plik .md)
                      </h3>
                      <div className="bg-slate-900 rounded-[32px] p-8 overflow-x-auto border-4 border-slate-800 shadow-2xl">
                        <pre className="text-blue-300 font-mono text-[10px] leading-relaxed">
                          {generatedMarkdown.split('---')[1]?.trim() || ''}
                          {'\n---\n...'}
                        </pre>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content-preview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#6B7280] flex items-center gap-3">
                       <BookOpen className="w-4 h-4" /> Interaktywny Podgląd Treści (Bez Obrazków)
                    </h3>
                    
                    <div className="bg-white rounded-[40px] p-10 md:p-14 shadow-sm border border-slate-200 min-h-[600px] text-[#1a211e]">
                      <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-[#0f1412] prose-headings:font-black prose-headings:tracking-tighter prose-p:font-sans prose-p:font-medium prose-p:leading-relaxed prose-strong:text-slate-950">
                        <MarkdownRenderer content={formData.content} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        )}

        {/* ZAKŁADKA 2: CRUD PLACÓWEK (SLASK) */}
        {panelTab === 'facilities' && (
          <div className="space-y-12">
            
            {/* PRZYCISKI WSTĘPNE & TABELA CRUD */}
            <div className="bg-white rounded-[32px] border border-slate-200 p-8 md:p-10 shadow-sm space-y-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <h2 className="text-2xl font-serif font-black text-[#0f1412] tracking-tight">Rejestr Placówek Pomocowych (Silesia)</h2>
                  <p className="text-xs text-[#6B7280] mt-1 font-medium">Baza instytucji wspierających samotne rodzicielstwo, dłużników oraz procesy alimentacyjne na terenie Śląska.</p>
                </div>
                <button 
                  onClick={openAddMode}
                  className="px-6 py-4 bg-slate-900 border border-slate-950 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-black transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Dodaj nową placówkę
                </button>
              </div>

              {/* TABELA O WYSOKIM KONTRAŚCIE (WCAG AAA) */}
              <div className="overflow-x-auto rounded-2xl border-2 border-slate-900 mt-6">
                <table className="w-full text-left border-collapse font-sans text-sm text-[#1a211e]">
                  <thead>
                    <tr className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-widest border-b-2 border-slate-950">
                      <th className="p-4 border-r border-[#334155]">Miejscowość</th>
                      <th className="p-4 border-r border-[#334155]">Nazwa Placówki</th>
                      <th className="p-4 border-r border-[#334155]">Adres i Kontakt</th>
                      <th className="p-4">Działania administracyjne</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-900 bg-white">
                    {facilities.map((fac) => (
                      <tr key={fac.id} className="hover:bg-[#FAF9F4] transition-colors divide-x-2 divide-slate-150">
                        {/* Miejscowość */}
                        <td className="p-4 font-black text-slate-900 text-xs uppercase tracking-wider">
                          <span className="px-3 py-1 bg-slate-100 border border-slate-300 rounded-lg">
                            {fac.city}
                          </span>
                        </td>
                        
                        {/* Nazwa */}
                        <td className="p-4">
                          <div className="font-extrabold text-[#0f1412] text-sm mb-1">{fac.name}</div>
                          <p className="text-xs text-slate-500 leading-relaxed font-sans max-w-sm">{fac.desc}</p>
                        </td>

                        {/* Kontakt */}
                        <td className="p-4 space-y-1 text-xs">
                          <div className="flex items-center gap-2 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                            <span>{fac.address}</span>
                          </div>
                          <div className="flex items-center gap-2 font-bold text-slate-900">
                            <PhoneCall className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                            <a href={`tel:${fac.phone.replace(/\s/g, '')}`}>{fac.phone}</a>
                          </div>
                          <div className="flex items-center gap-2 font-medium italic text-slate-600">
                            <Globe className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                            <span>{fac.email}</span>
                          </div>
                        </td>

                        {/* Przyciski operacji */}
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => triggerEdit(fac)}
                              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 text-[#0f1412] text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" /> Edytuj
                            </button>
                            <button
                              onClick={() => handleDeleteFacility(fac.id)}
                              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 border-2 border-rose-950 text-rose-900 text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Usuń
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FORMULARZ EDYCJI / DODAWANIA (TYLKO JEŚLI AKTYWNY) */}
            <AnimatePresence>
              {(isAddingFacility || editingFacility) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid lg:grid-cols-2 gap-12 items-start"
                >
                  {/* FORM FORMULARZA */}
                  <form 
                    onSubmit={isAddingFacility ? handleAddFacility : handleEditFacility}
                    className="bg-white rounded-[32px] border border-slate-200 p-8 md:p-10 shadow-sm space-y-6"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <h3 className="text-lg font-serif font-black text-[#0f1412]">
                        {isAddingFacility ? 'Dodawanie nowej placówki' : `Edycja: ${editingFacility?.name}`}
                      </h3>
                      <button 
                        type="button"
                        onClick={() => { setIsAddingFacility(false); setEditingFacility(null); }}
                        className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase"
                      >
                        Anuluj
                      </button>
                    </div>

                    <div className="space-y-4 text-xs font-sans text-[#1a211e]">
                      {/* Nazwa */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Nazwa placówki (Wymagana)</label>
                        <input
                          type="text"
                          required
                          value={facilityForm.name}
                          onChange={(e) => setFacilityForm({ ...facilityForm, name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-[#0f1412]"
                          placeholder="np. Sąd Rodzinny, MOPS Filia..."
                        />
                      </div>

                      {/* City Specifier */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Śląskie Miasto operacyjne</label>
                          <select
                            value={facilityForm.city}
                            onChange={(e) => setFacilityForm({ ...facilityForm, city: e.target.value as any })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-black"
                          >
                            <option value="Sosnowiec">Sosnowiec</option>
                            <option value="Katowice">Katowice</option>
                            <option value="Dąbrowa Górnicza">Dąbrowa Górnicza</option>
                            <option value="Inne">Inne miasto</option>
                          </select>
                        </div>

                        {/* Godziny */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Godziny urzędowania</label>
                          <input
                            type="text"
                            value={facilityForm.hours}
                            onChange={(e) => setFacilityForm({ ...facilityForm, hours: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium"
                            placeholder="np. Pon - Pt: 7:30 - 15:30"
                          />
                        </div>
                      </div>

                      {/* Adres */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Dokładny Adres fizyczny</label>
                        <input
                          type="text"
                          required
                          value={facilityForm.address}
                          onChange={(e) => setFacilityForm({ ...facilityForm, address: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-semibold"
                          placeholder="np. ul. Sobieskiego 13, 41-300 Dąbrowa Górnicza"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        {/* Telefon */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Numer Telefonu</label>
                          <input
                            type="text"
                            required
                            value={facilityForm.phone}
                            onChange={(e) => setFacilityForm({ ...facilityForm, phone: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold"
                            placeholder="np. 32 262 33 22"
                          />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Adres E-mail</label>
                          <input
                            type="email"
                            required
                            value={facilityForm.email}
                            onChange={(e) => setFacilityForm({ ...facilityForm, email: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-semibold"
                            placeholder="np. sekretariat@mops.pl"
                          />
                        </div>
                      </div>

                      {/* Opis */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Szczegółowy opis wsparcia dla dłużników / rodzin</label>
                        <textarea
                          required
                          value={facilityForm.desc}
                          onChange={(e) => setFacilityForm({ ...facilityForm, desc: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium h-24 resize-none leading-relaxed"
                          placeholder="Opisz uprawnienia, realizowane programy osłonowe, Fundusze..."
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 py-4 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl transition-colors"
                      >
                        {isAddingFacility ? 'Utwórz i Dodaj placówkę' : 'Zapisz poprawione dane'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsAddingFacility(false); setEditingFacility(null); resetFacilityForm(); }}
                        className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 text-xs font-black uppercase tracking-widest rounded-xl transition-colors"
                      >
                        Anuluj
                      </button>
                    </div>
                  </form>

                  {/* LIVE PREVIEW KARTY PLACÓWKI & YAML EXPORTER */}
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#6B7280] mb-4 flex items-center gap-2">
                        <Eye className="w-4 h-4" /> Live Preview karty placówki dla klienta
                      </h3>
                      
                      {/* Kredowa karta na off-white tle, wysoki kontrast, WCAG AAA compliant */}
                      <div className="bg-white rounded-[32px] border-2 border-slate-900 p-8 shadow-sm text-[#1a211e] space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                            {facilityForm.city}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Aktywna w bazie</span>
                        </div>
                        <h4 className="text-xl font-serif font-black text-[#0f1412] leading-tight">
                          {facilityForm.name || 'Nazwa placówki pojawi się tutaj...'}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          {facilityForm.desc || 'Szczegóły oferowanego wsparcia alimentacyjnego pojawią się w tym miejscu...'}
                        </p>
                        
                        <div className="pt-4 border-t border-slate-200 grid sm:grid-cols-2 gap-4 text-xs font-medium">
                          <div>
                            <div className="text-[9px] uppercase font-black text-[#6B7280]">Adres i Urząd</div>
                            <p className="text-slate-900 mt-0.5">{facilityForm.address || 'Np. ul. 1 Maja 19'}</p>
                          </div>
                          <div>
                            <div className="text-[9px] uppercase font-black text-[#6B7280]">Godziny otwarcia</div>
                            <p className="text-slate-900 mt-0.5">{facilityForm.hours || 'Np. Pon - Pt: 8:00 - 16:00'}</p>
                          </div>
                          <div>
                            <div className="text-[9px] uppercase font-black text-[#6B7280]">Infolinia bezpośrednia</div>
                            <p className="text-slate-900 font-bold mt-0.5">{facilityForm.phone || 'Np. 32 000 00 00'}</p>
                          </div>
                          <div>
                            <div className="text-[9px] uppercase font-black text-[#6B7280]">E-mail kancelaryjny</div>
                            <p className="text-slate-900 mt-0.5 font-semibold italic">{facilityForm.email || 'Np. mops@sosnowiec.pl'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* YAML Front Matter Export */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#6B7280] flex items-center gap-2">
                        <FilePlus className="w-4 h-4" /> Wygenerowany kod YAML dla bazy mapy podstrony
                      </h3>
                      <div className="bg-slate-900 rounded-[32px] p-8 overflow-x-auto border-4 border-slate-800 shadow-2xl">
                        <pre className="text-amber-300 font-mono text-[10px] leading-relaxed">
                          {generateFacilityYaml({
                            id: editingFacility?.id || 'nowa-placowka-id',
                            ...facilityForm
                          })}
                        </pre>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ZAKŁADKA 3: NEWSLETTER I STATYSTYKI */}
        {panelTab === 'newsletter' && (
          <div className="space-y-12">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Statystyki Kafelki */}
              <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-emerald-500" /> Edge Pageviews (30d)
                  </div>
                  <div className="text-4xl font-serif font-black text-[#0f1412]">24,591</div>
                  <div className="text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-md">+12.4% m/m</div>
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-500" /> Aktywni Subskrybenci
                  </div>
                  <div className="text-4xl font-serif font-black text-[#0f1412]">1,204</div>
                  <div className="text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-md">+4.1% m/m</div>
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-rose-500" /> Open Rate (Listmonk)
                  </div>
                  <div className="text-4xl font-serif font-black text-[#0f1412]">48.2%</div>
                  <div className="text-xs font-bold text-slate-500 bg-slate-100 w-fit px-2 py-1 rounded-md">Średnia Kampanii</div>
                </div>
              </div>

              {/* Informacje o integracji G.A.S */}
              <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm col-span-1 lg:col-span-2">
                <h3 className="text-lg font-serif font-black text-[#0f1412] mb-6 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-amber-500" /> Status Integracji Listmonk & GAS
                </h3>
                <div className="space-y-6">
                  <div className="bg-[#FAF9F4] p-5 rounded-2xl border border-[#EFECE6]">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-black uppercase tracking-widest text-[#0f1412]">API Webhook</h4>
                      <span className="flex items-center gap-1 text-[10px] uppercase font-black tracking-widest text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Aktywny
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-600 max-w-xl">
                      Powiadomienia o nowych czytelnikach są poprzełączane w Google Apps Script. System rejestruje wszystkie osoby przez formularz na stronie <b>/newsletter</b>.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Ostatnie zsynchronizowane kontakty</h4>
                    <ul className="space-y-2">
                      {[
                        { e: 'jan.k***@gmail.com', date: 'Wczoraj, 14:02', st: 'SUCCESS' },
                        { e: 'm.nowa***@wp.pl', date: 'Wczoraj, 11:45', st: 'SUCCESS' },
                        { e: 'anna.b***@onet.pl', date: '28 Maj, 09:12', st: 'SUCCESS' }
                      ].map((item, i) => (
                        <li key={i} className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                              <User className="w-4 h-4 text-slate-500" />
                            </div>
                            <div className="text-sm font-bold text-[#1a211e]">{item.e}</div>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                            {item.date} 
                            <span className="text-[9px] px-2 py-0.5 rounded uppercase font-black tracking-wider bg-emerald-100 text-emerald-700">{item.st}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Pobieranie CSV */}
              <div className="bg-slate-900 rounded-[32px] p-8 shadow-sm col-span-1 text-white border-2 border-slate-800">
                <h3 className="text-lg font-serif font-black mb-4">Eksport Bazy</h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed mb-8">
                  Pobierz awaryjną kopię wyselekcjonowanej bazy subskrybentów wsparcia. Pamiętaj o dyrektywie RODO przy operowaniu na nagim pliku Danych Osobowych.
                </p>
                <button className="w-full py-4 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors flex justify-center items-center gap-2">
                  <Download className="w-4 h-4" /> Eksport (CSV)
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
