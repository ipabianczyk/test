import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Heart, FileText, BookOpen, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function BottomNav() {
  const location = useLocation();

  const navLinks = [
    { name: 'Start', href: '/', icon: Home },
    { name: 'Mapa', href: '/mapa', icon: Map },
    { name: 'Pomoc', href: '/potrzebomat', icon: Heart },
    { name: 'Wizyta', href: '/teczka-sprawy', icon: FileText },
    { name: 'Baza', href: '/blog', icon: BookOpen },
    { name: 'Kontakt', href: '/kontakt', icon: MessageCircle },
  ];

  const handleLinkClick = (href: string) => {
    if (location.pathname === href) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-slate-200 pb-safe shadow-[0_-1px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 px-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.href;

          return (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => handleLinkClick(link.href)}
              className="flex flex-col items-center justify-center flex-1 min-w-0 py-1 gap-1"
            >
              <div className="relative">
                <Icon 
                  className={`w-6 h-6 transition-all duration-300 ${
                    isActive ? 'text-amber-600 scale-110' : 'text-slate-400'
                  }`} 
                />
                {isActive && (
                  <motion.div 
                    layoutId="bottom-nav-dot"
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-600 rounded-full"
                  />
                )}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest truncate ${
                isActive ? 'text-amber-600' : 'text-slate-400'
              }`}>
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
