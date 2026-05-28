import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { getPostById } from '../services/blogService';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User, Share2, Tag, BookOpen, Clock, AlertCircle } from 'lucide-react';

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = id ? getPostById(id) : undefined;

  // SEO Update
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | MostPomocy.pl`;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', post.excerpt);

      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', post.tags.join(', '));
    }
  }, [post]);

  if (!post) {
    return (
      <div className="py-12 text-center bg-neutral-50 rounded-2xl border border-neutral-200/60">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3 animate-bounce" />
        <h1 className="text-xl font-black text-neutral-950 mb-4">Nie odnaleziono artykułu</h1>
        <Link to="/blog" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Baza wiedzy
        </Link>
      </div>
    );
  }

  const { title, date, author, category, tags, image, content, excerpt, resources = [] } = post;
  const isUrgent = post.alert_level === 'urgent';
  const isWarning = post.alert_level === 'warning';

  return (
    <div className="space-y-6 text-left">
      
      {/* Back to Blog Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-neutral-400 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Powrót do bazy wiedzy
        </Link>
        <div className="flex gap-2">
          <span className="bg-blue-50 text-blue-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-blue-100">
            {category}
          </span>
          {isUrgent && (
            <span className="bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
              Ważna procedura
            </span>
          )}
        </div>
      </div>

      {/* Cover Image Block */}
      {image && (
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-neutral-200/50 shadow-sm">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover select-none"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      {/* Article Meta / Profile Header */}
      <div className="space-y-3.5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-neutral-300" />
            <span>Post: {date}</span>
          </div>
          <span className="text-neutral-300 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-neutral-300" />
            <span>Opracowanie: {author}</span>
          </div>
          {post.readTime && (
            <>
              <span className="text-neutral-300 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-300" />
                <span>{post.readTime} czytania</span>
              </div>
            </>
          )}
        </div>

        <h1 className="text-2xl sm:text-3.5xl font-black text-neutral-900 tracking-tighter leading-tight italic">
          {title}
        </h1>

        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/40 text-xs sm:text-sm font-semibold text-neutral-500 italic leading-relaxed">
          Streszczenie triage: {excerpt}
        </div>
      </div>

      {/* Main Markdown Article Content */}
      <div className="prose prose-neutral max-w-none pt-2 prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-neutral-900 prose-p:text-neutral-600 prose-p:leading-[1.75] prose-p:font-medium prose-strong:text-neutral-900 prose-strong:font-black prose-a:text-blue-600 prose-a:font-black hover:prose-a:underline prose-ul:list-disc prose-ol:list-decimal">
        <MarkdownRenderer content={content} />
      </div>

      {/* Dynamic Embedded Resources (Action Card Blocks) */}
      {resources.length > 0 && (
        <div className="pt-8 border-t border-neutral-100 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-black text-neutral-900 tracking-tight">
              Powiązane instrukcje & dokumenty:
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resources.map((res, index) => (
              <a 
                key={index}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between p-4 bg-neutral-50/70 border border-neutral-200 hover:border-blue-300 rounded-2xl hover:bg-white transition-all duration-300 text-left"
              >
                <div>
                  <div className="w-8 h-8 bg-white border border-neutral-200/50 rounded-lg flex items-center justify-center text-neutral-400 group-hover:text-blue-600 transition-colors mb-3">
                    <Share2 className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-sm font-black text-neutral-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {res.title}
                  </h4>
                  <p className="text-xs text-neutral-500 font-medium leading-relaxed mt-1">
                    {res.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-150/50 mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-neutral-400 group-hover:text-blue-600 transition-colors">
                  <span>Przejdź do procedury</span>
                  <ArrowLeft className="w-3.5 h-3.5 rotate-180 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Author Footer Card */}
      <div className="pt-8 border-t border-neutral-150 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold font-serif italic text-md">
            IP
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Autor</p>
            <p className="text-sm font-black text-neutral-800">{author}</p>
          </div>
        </div>

        <Link 
          to="/kontakt" 
          className="px-5 py-3 bg-neutral-900 hover:bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-colors inline-block"
        >
          Masz wątpliwości? Napisz do autora
        </Link>
      </div>

    </div>
  );
}
