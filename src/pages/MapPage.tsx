import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, Heart, Accessibility, Baby, 
  Handshake, Hotel, Shield, Euro, ClipboardList, Ribbon, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { mapCategories, MapCategory } from '../data/mapData';

function IconByName({ name, className = "" }: { name: string, className?: string }) {
  switch (name) {
    case 'Users': return <Users className={className} />;
    case 'Heart': return <Heart className={className} />;
    case 'Accessibility': return <Accessibility className={className} />;
    case 'Baby': return <Baby className={className} />;
    case 'Handshake': return <Handshake className={className} />;
    case 'Hotel': return <Hotel className={className} />;
    case 'Shield': return <Shield className={className} />;
    case 'Euro': return <Euro className={className} />;
    case 'ClipboardList': return <ClipboardList className={className} />;
    case 'Ribbon': return <Ribbon className={className} />;
    default: return <Zap className={className} />;
  }
}

export default function MapPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-10 py-6 text-xs font-bold uppercase tracking-widest text-slate-400">
        <Link to="/" className="hover:text-blue-600">Start</Link>
        <span className="mx-2 opacity-30">›</span>
        <span className="text-slate-900">Mapa pomocy</span>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-10 py-12 md:py-20">
        <div className="section-tag mb-6">Mapa Pomocy</div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none text-slate-900 mb-8">
          Kategorie <span className="text-blue-600 italic font-serif font-normal">wsparcia.</span>
        </h1>
        <p className="text-xl text-slate-500 leading-relaxed max-w-2xl">
          Wybierz kategorię, która odpowiada Twojej sytuacji. Znajdziesz tam informacje, gdzie szukać pomocy oraz artykuły z praktycznymi wskazówkami.
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-10 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mapCategories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/mapa/${cat.id}`} className="card group flex flex-col h-full hover:border-blue-300 transition-all">
                <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">
                  {cat.emoji}
                </div>
                <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-3 leading-none group-hover:text-blue-600 transition-colors">
                  {cat.title}
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed flex-grow">
                  {cat.shortDesc}
                </p>
                <div className="mt-8 flex items-center text-blue-600 text-xs font-black uppercase tracking-widest">
                  Szczegóły <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Emergency Box */}
        <div className="mt-16 bg-blue-600 rounded-[40px] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-blue-600/30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl font-black tracking-tighter mb-4">Potrzebujesz pomocy teraz?</h2>
            <p className="text-lg text-blue-100 mb-8 font-medium">
              Zadzwoń na bezpłatny numer zaufania dla dorosłych w kryzysie emocjonalnym. Jesteśmy tu, aby Cię wysłuchać.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <a href="tel:116123" className="text-5xl font-black tracking-tighter hover:scale-105 transition-transform">116 123</a>
              <div className="h-10 w-[2px] bg-white/20 hidden sm:block" />
              <p className="text-xs uppercase font-black tracking-[0.3em] opacity-50">Bezpłatnie • Anonimowo • 24/7</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
