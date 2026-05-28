import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { useHotkeys } from 'react-hotkeys-hook';
import { 
  FilePlus, Copy, Download, Eye, Edit3, 
  Type, User, Tag, Image as ImageIcon, 
  AlertTriangle, ShieldAlert, CheckCircle2,
  Calendar, Clock, Layout, LucideIcon,
  BookOpen, Scale, Heart, Info,
  Search, ArrowRight, Bold, Italic, List,
  Heading1, Heading2, MessageSquare, 
  PhoneCall, Grid, ExternalLink
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

export default function ArticleCreator() {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: 'Redakcja MostPomocy',
    category: 'PORADNIK',
    tags: '',
    excerpt: '',
    image: 'https://images.unsplash.com/photo-1573497619124-5d9c7931379b?w=1200&auto=format&fit=crop',
    readTime: '5 min',
    alertLevel: 'normal',
    icon: 'FileText',
    content: '# Nagłówek Artykułu\n\nTutaj wpisz treść artykułu używając składni Markdown...'
  });

  const [copied, setCopied] = useState(false);

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
image: "${formData.image}"
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
    
    // Reset focus and selection
    setTimeout(() => {
      textareaRef.current?.focus();
      const newPos = selectionStart + before.length + selectedText.length + after.length;
      textareaRef.current?.setSelectionRange(newPos, newPos);
    }, 0);
  };

  useHotkeys('ctrl+b, meta+b', (e) => { e.preventDefault(); insertText('**', '**'); }, { enableOnFormTags: true });
  useHotkeys('ctrl+i, meta+i', (e) => { e.preventDefault(); insertText('_', '_'); }, { enableOnFormTags: true });
  useHotkeys('ctrl+1, meta+1', (e) => { e.preventDefault(); insertText('# ', ''); }, { enableOnFormTags: true });
  useHotkeys('ctrl+2, meta+2', (e) => { e.preventDefault(); insertText('## ', ''); }, { enableOnFormTags: true });
  useHotkeys('ctrl+l, meta+l', (e) => { e.preventDefault(); insertText('- ', ''); }, { enableOnFormTags: true });

  const TOOLBAR_ITEMS = [
    { label: 'B', icon: Bold, action: () => insertText('**', '**'), tooltip: 'Pogrubienie (Ctrl+B)' },
    { label: 'I', icon: Italic, action: () => insertText('_', '_'), tooltip: 'Kursywa (Ctrl+I)' },
    { label: 'H1', icon: Heading1, action: () => insertText('# ', ''), tooltip: 'Nagłówek 1 (Ctrl+1)' },
    { label: 'H2', icon: Heading2, action: () => insertText('## ', ''), tooltip: 'Nagłówek 2 (Ctrl+2)' },
    { label: 'List', icon: List, action: () => insertText('- ', ''), tooltip: 'Lista (Ctrl+L)' },
    { 
      label: 'Kafelka', 
      icon: Grid, 
      action: () => insertText('\n:::kafelka\n### Tytuł Zasobu\nKrótki opis tego, co użytkownik znajdzie w tym zasobie. Możesz dodać link poniżej.\n[Dowiedz się więcej →](https://example.com)\n:::\n'), 
      tooltip: 'Wstaw Kafelkę (Tile)' 
    },
    { 
      label: 'SOS', 
      icon: PhoneCall, 
      action: () => insertText('\n:::sos\n### Potrzebujesz pomocy teraz?\nZadzwoń pod bezpłatny numer **116 123**.\nSpecjaliści czekają na Twój telefon 24/7.\n:::\n'), 
      tooltip: 'Wstaw Box SOS' 
    },
    { 
      label: 'Alert', 
      icon: ShieldAlert, 
      action: () => insertText('\n:::alert-warning\n**Uwaga:** Ta procedura wymaga zgłoszenia do najbliższego komisariatu.\n:::\n'), 
      tooltip: 'Wstaw Alert' 
    },
    { 
      label: 'Cytat', 
      icon: MessageSquare, 
      action: () => insertText('> ', ''), 
      tooltip: 'Wstaw Cytat' 
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <header className="bg-white border-b border-slate-100 py-12 mb-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-100">
              <FilePlus className="w-3 h-3" /> Panel Redakcyjny
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
              Kreator <span className="text-blue-600 italic">Artykułów.</span>
            </h1>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleCopy}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                copied ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-blue-600 shadow-xl'
              }`}
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Skopiowano' : 'Kopiuj MD'}
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
            >
              <Download className="w-4 h-4" /> Pobierz .md
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* FORMULARZ EDYCJI */}
        <section className="space-y-8">
          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-slate-100 space-y-10">
            {/* TYTUŁ I METADANE */}
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">
                  <Type className="w-3 h-3" /> Tytuł Artykułu
                </label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="np. Jak poradzić sobie z kryzysem?"
                  className="w-full bg-slate-50 border-4 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl p-5 text-xl font-bold transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">
                    <Layout className="w-3 h-3" /> Kategoria
                  </label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-slate-50 border-4 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl p-5 font-bold transition-all outline-none appearance-none"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">
                    <User className="w-3 h-3" /> Autor
                  </label>
                  <input 
                    type="text" 
                    value={formData.author}
                    onChange={e => setFormData({...formData, author: e.target.value})}
                    className="w-full bg-slate-50 border-4 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl p-5 font-bold transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            {/* TAGI I ALERT LEVEL */}
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">
                  <Tag className="w-3 h-3" /> Tagi (po przecinku)
                </label>
                <input 
                  type="text" 
                  value={formData.tags}
                  onChange={e => setFormData({...formData, tags: e.target.value})}
                  placeholder="pomoc, zdrowie, procedura"
                  className="w-full bg-slate-50 border-4 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl p-5 font-bold transition-all outline-none"
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">
                  <AlertTriangle className="w-3 h-3" /> Poziom Alertu
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {ALERT_LEVELS.map(level => (
                    <button
                      key={level.id}
                      onClick={() => setFormData({...formData, alertLevel: level.id})}
                      className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${
                        formData.alertLevel === level.id 
                          ? `border-${level.id === 'normal' ? 'blue' : level.id === 'warning' ? 'amber' : 'rose'}-500 bg-${level.id === 'normal' ? 'blue' : level.id === 'warning' ? 'amber' : 'rose'}-50 text-${level.id === 'normal' ? 'blue' : level.id === 'warning' ? 'amber' : 'rose'}-600` 
                          : 'border-transparent bg-slate-50 text-slate-400'
                      }`}
                    >
                      <level.icon className="w-4 h-4" /> {level.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* IKONA I ZDJĘCIE */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">
                  Wygląd Ikony
                </label>
                <div className="flex gap-2">
                  {ICONS.map(item => (
                    <button
                      key={item.name}
                      onClick={() => setFormData({...formData, icon: item.name})}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.icon === item.name 
                          ? 'border-blue-500 bg-blue-50 text-blue-600' 
                          : 'border-transparent bg-slate-50 text-slate-400'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4 text-right">
                 <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 pr-2">
                  Czas Czytania
                </label>
                <input 
                  type="text" 
                  value={formData.readTime}
                  onChange={e => setFormData({...formData, readTime: e.target.value})}
                  className="w-full bg-slate-50 border-4 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl p-5 font-bold transition-all outline-none text-right"
                />
              </div>
            </div>

            {/* EXCERPT */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">
                Zajawka (Excerpt - widoczne na liście)
              </label>
              <textarea 
                value={formData.excerpt}
                onChange={e => setFormData({...formData, excerpt: e.target.value})}
                className="w-full bg-slate-50 border-4 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl p-5 font-medium transition-all outline-none min-h-[100px] resize-none"
              />
            </div>
          </div>

          <div className="bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl flex flex-col h-full border-4 border-slate-900">
            {/* TOOLBAR */}
            <div className="bg-slate-800 border-b border-slate-700 p-4 flex flex-wrap gap-2">
              {TOOLBAR_ITEMS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={item.action}
                  title={item.tooltip}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-700 text-slate-300 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                >
                  <item.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            
            <div className="p-8 space-y-6 flex-1 flex flex-col">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400">
                <Edit3 className="w-4 h-4" /> Treść Markdown (Edytor)
              </label>
              <textarea 
                ref={textareaRef}
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
                className="w-full bg-white/5 border-2 border-white/10 focus:border-blue-500 rounded-3xl p-8 text-white font-mono text-sm transition-all outline-none min-h-[600px] flex-1 resize-none"
                placeholder="Zacznij pisać tutaj..."
              />
            </div>
          </div>
        </section>

        {/* PODGLĄD KODU I KARTY */}
        <section className="space-y-12">
          {/* TABS FOR MOBILE/CONVENIENCE */}
          <div className="flex bg-white p-2 rounded-2xl border-2 border-slate-100 shadow-sm">
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                activeTab === 'edit' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Podgląd Karty
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                activeTab === 'preview' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Podgląd Treści
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'edit' ? (
              <motion.div
                key="card-preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
                  <Eye className="w-4 h-4" /> Podgląd Wizualny Karty
                </h3>
                
                <div className={`group flex bg-white rounded-[48px] overflow-hidden border-4 transition-all duration-500 relative max-w-md mx-auto ${
                  formData.alertLevel === 'urgent' ? 'border-rose-500 shadow-2xl shadow-rose-100' :
                  formData.alertLevel === 'warning' ? 'border-amber-400 shadow-xl shadow-amber-50' :
                  'border-white shadow-xl shadow-slate-200/50'
                }`}>
                  {/* Kolorowy boczny pasek */}
                  {(formData.alertLevel !== 'normal') && (
                    <div className={`absolute left-0 inset-y-0 w-3 ${formData.alertLevel === 'urgent' ? 'bg-rose-500' : 'bg-amber-400'}`} />
                  )}

                  <div className="p-10 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-8">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
                         formData.alertLevel === 'urgent' ? 'bg-rose-50 text-rose-600' : 
                         formData.alertLevel === 'warning' ? 'bg-amber-50 text-amber-600' : 
                         'bg-blue-50 text-blue-600'
                      }`}>
                        {(() => {
                          const Icon = ICONS.find(i => i.name === formData.icon)?.icon || Edit3;
                          return <Icon className="w-7 h-7" />;
                        })()}
                      </div>
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border ${
                        formData.alertLevel === 'urgent' ? 'bg-rose-500 text-white border-rose-500' :
                        formData.alertLevel === 'warning' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        'bg-slate-50 text-slate-400 border-slate-100'
                      }`}>
                        {formData.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                      <Clock className="w-3.5 h-3.5" /> {formData.readTime}
                      <span>•</span>
                      <span>{new Date().toLocaleDateString('pl-PL')}</span>
                    </div>
                    
                    <h2 className="text-2xl font-black tracking-tighter leading-none mb-6">
                      {formData.title || 'Tytuł Artykułu'}
                    </h2>
                    
                    <p className="text-slate-500 font-medium leading-relaxed line-clamp-3 text-sm mb-10">
                      {formData.excerpt || 'Zajawka artykułu pojawi się tutaj po wpisaniu tekstu w formularzu...'}
                    </p>
                    
                    <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
                      <span>Szczegóły Triage-u</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* PODGLĄD KODU */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
                    <Layout className="w-4 h-4" /> Nagłówek Front Matter (Plik .md)
                  </h3>
                  <div className="bg-slate-900 rounded-[32px] p-8 overflow-x-auto border-4 border-slate-800 shadow-2xl">
                    <pre className="text-blue-300 font-mono text-[10px] leading-relaxed">
                      {generatedMarkdown.split('---')[1].trim()}
                      {'\n---\n...'}
                    </pre>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content-preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
                   <BookOpen className="w-4 h-4" /> Interaktywny Podgląd Treści
                </h3>
                
                <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-slate-100 min-h-[600px]">
                  <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:font-medium prose-p:leading-relaxed prose-strong:text-blue-600 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline">
                    <MarkdownRenderer content={formData.content} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-8 bg-blue-50 rounded-[32px] border border-blue-100">
            <h4 className="font-black text-blue-900 text-sm mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" /> Jak dodać ten post?
            </h4>
            <ol className="text-xs text-blue-800 space-y-4 font-medium pl-4 list-decimal">
              <li>Uzupełnij wszystkie pola formularza po lewej stronie.</li>
              <li>Gdy artykuł będzie gotowy, skopiuj kod przyciskiem <strong>"Kopiuj MD"</strong> lub pobierz plik.</li>
              <li>Wklej treść do nowego pliku w folderze <code>src/content/posts/</code> (React) lub <code>_posts/</code> (Jekyll).</li>
              <li>Upewnij się, że nazwa pliku zaczyna się od daty, np. <code>2026-05-19-tytul.md</code>.</li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
}
