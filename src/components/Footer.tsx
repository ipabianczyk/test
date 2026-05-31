import React from 'react';
import { Phone, Mail, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 px-4 sm:px-10 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="text-xl font-black tracking-tighter text-slate-900 block">
              Mapa Pomocy
              <span className="block text-[10px] text-amber-600 uppercase tracking-[0.2em] mt-1">MostPomocy.pl</span>
            </Link>
            <p className="text-sm text-[#1a211e] leading-relaxed font-semibold">
              Projekt społeczny MostPomocy – tworzymy go jako wolontariusze z myślą o osobach szukających wsparcia w Polsce.
            </p>
          </div>
          
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6">Mapa Serwisu</h3>
            <ul className="space-y-4 text-sm font-bold text-[#1a211e]">
              <li><Link to="/" className="hover:text-amber-600 transition-colors">Strona główna</Link></li>
              <li><Link to="/mapa" className="hover:text-amber-600 transition-colors">Mapa pomocy</Link></li>
              <li><Link to="/znajdz-potrzebe" className="hover:text-amber-600 transition-colors">Rozeznanie potrzeb</Link></li>
              <li><Link to="/strefa-spokoju" className="hover:text-amber-600 transition-colors">Strefa spokoju (Nowość)</Link></li>
              <li><Link to="/slownik-kryzysowy" className="hover:text-amber-600 transition-colors">Słownik kryzysowy</Link></li>
              <li><Link to="/blog" className="hover:text-amber-600 transition-colors">Blog i poradniki</Link></li>
              <li><Link to="/bezpiecznik" className="hover:text-amber-600 transition-colors">Bezpiecznik (PDF)</Link></li>
              <li><Link to="/kontakt" className="hover:text-amber-600 transition-colors">Kontakt</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6">Pilna pomoc</h3>
            <ul className="space-y-4 text-sm font-bold text-[#1a211e]">
              <li><a href="tel:112" className="hover:text-rose-600 transition-colors">112 – Numer alarmowy</a></li>
              <li><a href="tel:116111" className="hover:text-amber-600 transition-colors">116 111 – Telefon dla dzieci</a></li>
              <li><a href="tel:116123" className="hover:text-blue-600 transition-colors">116 123 – Telefon dla dorosłych</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6">O autorze</h3>
            <p className="text-sm text-[#1a211e] leading-relaxed font-semibold mb-4">
              <strong>Autor:</strong> Igor Pabiańczyk – student pracy socjalnej na Uniwersytecie Śląskim.
            </p>
            <Link to="/kontakt" className="text-amber-600 text-xs font-black uppercase tracking-widest hover:gap-4 transition-all flex items-center gap-2">
              Napisz do mnie <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0f1412]">
            © 2025 MOSTPOMOCY.PL • TREŚCI INFORMACYJNE
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-[#1a211e]">
            <Link to="/polityka-prywatnosci" className="hover:text-slate-900 transition-colors">Polityka Prywatności</Link>
            <Link to="/kontakt" className="hover:text-slate-900 transition-colors">Kontakt</Link>
            <Link to="/bezpiecznik" className="hover:text-slate-900 transition-colors">Bezpiecznik</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
