import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { getPostById } from '../services/blogService';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User, Share2, Tag } from 'lucide-react';

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = id ? getPostById(id) : undefined;

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

  return (
    <article className="bg-[#FCFCFC] min-h-screen">
      {/* Dynamic Header */}
      <header className="relative min-h-[400px] md:min-h-[500px] flex items-end overflow-hidden bg-slate-900 border-b-8 border-amber-500">
        <div className="absolute inset-0 z-0">
           <img 
             src={image} 
             alt="" 
             className="w-full h-full object-cover blur-[0.5px] opacity-30 scale-105"
             referrerPolicy="no-referrer"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-10 relative z-10 w-full pb-12 md:pb-20">
          <Link to="/blog" className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-amber-500 hover:text-white transition-all mb-8 md:mb-12 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Powrót do wiedzy
          </Link>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 md:space-y-8"
          >
            <div className="flex flex-wrap gap-2 md:gap-3">
              <span className="px-3 py-1 bg-amber-500 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-full">
                {category}
              </span>
              {post.alert_level === 'warning' && (
                <span className="px-3 py-1 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-rose-900/40">
                   Ważne
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-7xl font-black tracking-tighter leading-[0.95] text-white max-w-4xl italic">
              {title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 md:gap-10 text-[9px] font-black uppercase tracking-widest text-white/50 pt-4 md:pt-6">
              <div className="flex items-center gap-2 md:gap-3">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                {date}
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <User className="w-3.5 h-3.5 text-amber-500" />
                {author}
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 md:px-10 -mt-8 md:-mt-12 relative z-20 pb-32">
        <div className="bg-white p-6 md:p-16 rounded-[40px] md:rounded-[64px] shadow-2xl border-b border-slate-100">
          
          {/* Article Meta */}
          <div className="mb-10 md:mb-16 pb-8 md:pb-12 border-b border-slate-50 italic text-slate-400 text-base md:text-lg font-medium leading-relaxed">
            Artykuł weryfikowany przez zespół <strong>MostPomocy</strong>.
          </div>

          {/* Typography Overhaul */}
          <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-[1.8] prose-p:font-medium prose-strong:text-slate-900 prose-img:rounded-[40px] prose-img:shadow-2xl prose-a:text-amber-600 prose-a:font-black prose-a:no-underline hover:prose-a:underline">
            <MarkdownRenderer content={content} />
          </div>
          
          {/* Dynamic Resources Section */}
          {resources.length > 0 && (
            <div className="mt-24 pt-20 border-t-4 border-slate-50">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-[20px] flex items-center justify-center shadow-lg shadow-amber-200/50">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Przydatne kafelki</h3>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Narzędzia powiązane z tematem</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {resources.map((res: any, idx: number) => (
                  <a 
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col p-8 bg-white border-4 border-slate-50 rounded-[40px] hover:border-amber-500 hover:shadow-2xl transition-all duration-500"
                  >
                    <div className="flex-1 space-y-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 group-hover:text-amber-600 transition-colors leading-tight">
                        {res.title}
                      </h4>
                      <p className="text-slate-500 font-medium leading-relaxed">
                        {res.desc}
                      </p>
                    </div>
                    <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-amber-600 transition-colors">
                      <span>Otwórz narzędzie</span>
                      <ArrowLeft className="w-4 h-4 rotate-180 transform group-hover:translate-x-2 transition-transform" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-24 pt-16 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-white tracking-widest font-serif italic text-2xl font-bold">IP</div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Autor publikacji</p>
                  <p className="text-lg font-black text-slate-900">{author}</p>
               </div>
            </div>
            <Link to="/kontakt" className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl shadow-slate-900/10">
              Zadaj pytanie autorowi
            </Link>
          </div>
        </div>
      </main>
    </article>
  );
}
