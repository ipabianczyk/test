import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Grid, PhoneCall, AlertTriangle, BarChart3, HelpCircle, Lightbulb } from 'lucide-react';

interface ParsedBlock {
  type: 'markdown' | 'kafelka' | 'sos' | 'alert-warning' | 'wykres' | 'statystyka' | 'porada';
  content: string;
}

const parseCustomBlocks = (markdown: string): ParsedBlock[] => {
  const parts = markdown.split(':::');
  const blocks: ParsedBlock[] = [];

  parts.forEach((part, index) => {
    if (index % 2 === 0) {
      if (part) {
        blocks.push({ type: 'markdown', content: part });
      }
    } else {
      const trimmed = part.trim();
      const lines = trimmed.split('\n');
      const typeLabel = lines[0].trim().toLowerCase();
      const blockContent = lines.slice(1).join('\n');
      
      let type: ParsedBlock['type'] = 'kafelka';
      if (typeLabel.startsWith('sos')) {
        type = 'sos';
      } else if (typeLabel.startsWith('alert')) {
        type = 'alert-warning';
      } else if (typeLabel.startsWith('wykres')) {
        type = 'wykres';
      } else if (typeLabel.startsWith('stat') || typeLabel.startsWith('liczba')) {
        type = 'statystyka';
      } else if (typeLabel.startsWith('porada') || typeLabel.startsWith('wskazowka')) {
        type = 'porada';
      }
      
      blocks.push({ type, content: blockContent });
    }
  });

  return blocks;
};

export default function MarkdownRenderer({ content }: { content: string }) {
  const blocks = parseCustomBlocks(content);

  return (
    <div className="space-y-6 text-[#1a211e]">
      {blocks.map((block, idx) => {
        if (block.type === 'markdown') {
          return (
            <ReactMarkdown
              key={idx}
              components={{
                a: ({ href, children, ...props }) => {
                  const isInternal = href && href.startsWith('/') && !href.startsWith('//');
                  const targetHref = isInternal ? `#${href}` : href;
                  return (
                    <a href={targetHref} {...props} className="text-slate-900 underline hover:text-black font-semibold">
                      {children}
                    </a>
                  );
                }
              }}
            >
              {block.content}
            </ReactMarkdown>
          );
        }

        if (block.type === 'kafelka') {
          return (
            <div
              key={idx}
              className="bg-white border text-[#1a211e] border-slate-200 rounded-[28px] p-8 my-8 flex flex-col md:flex-row items-start gap-6 shadow-sm hover:border-slate-350 transition-all"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-800 shadow-sm border border-slate-200 flex-shrink-0">
                <Grid className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0 prose prose-slate max-w-none text-[#1a211e] prose-headings:text-[#0f1412] prose-strong:text-black">
                <ReactMarkdown
                  components={{
                    a: ({ href, children, ...props }) => {
                      const isInternal = href && href.startsWith('/') && !href.startsWith('//');
                      const targetHref = isInternal ? `#${href}` : href;
                      return (
                        <a href={targetHref} {...props} className="font-bold underline text-slate-900">
                          {children}
                        </a>
                      );
                    }
                  }}
                >
                  {block.content}
                </ReactMarkdown>
              </div>
            </div>
          );
        }

        if (block.type === 'sos') {
          return (
            <div
              key={idx}
              className="bg-slate-950 text-white rounded-[28px] p-8 md:p-10 my-10 relative overflow-hidden border-2 border-slate-800"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <PhoneCall className="w-32 h-32" />
              </div>
              <PhoneCall className="w-10 h-10 mb-6 relative z-10 text-rose-500" />
              <div className="relative z-10 prose prose-invert max-w-none prose-headings:font-serif prose-headings:text-white prose-p:text-slate-200">
                <ReactMarkdown
                  components={{
                    a: ({ href, children, ...props }) => {
                      const isInternal = href && href.startsWith('/') && !href.startsWith('//');
                      const targetHref = isInternal ? `#${href}` : href;
                      return (
                        <a href={targetHref} {...props} className="font-bold text-white underline decoration-rose-500">
                          {children}
                        </a>
                      );
                    }
                  }}
                >
                  {block.content}
                </ReactMarkdown>
              </div>
            </div>
          );
        }

        if (block.type === 'alert-warning') {
          return (
            <div
              key={idx}
              className="bg-[#FFFDF9] border-l-4 border-amber-600 rounded-r-2xl p-6 my-8 flex items-start gap-4 shadow-sm"
            >
              <AlertTriangle className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0 prose prose-slate max-w-none text-[#1a211e]">
                <ReactMarkdown
                  components={{
                    a: ({ href, children, ...props }) => {
                      const isInternal = href && href.startsWith('/') && !href.startsWith('//');
                      const targetHref = isInternal ? `#${href}` : href;
                      return (
                        <a href={targetHref} {...props} className="font-bold text-amber-900 underline">
                          {children}
                        </a>
                      );
                    }
                  }}
                >
                  {block.content}
                </ReactMarkdown>
              </div>
            </div>
          );
        }

        if (block.type === 'wykres') {
          const lines = block.content.split('\n').map(l => l.trim()).filter(Boolean);
          const bars = lines.map(line => {
            const parts = line.split('|').map(p => p.trim());
            return {
              label: parts[0] || '',
              value: parseFloat(parts[1]) || 0,
              detail: parts[2] || ''
            };
          }).filter(bar => bar.label);

          return (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-[24px] p-6 md:p-8 my-8 shadow-sm space-y-6 text-[#1a211e]"
            >
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-slate-800" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#6B7280]">
                  Zestawienie Danych i Statystyk
                </span>
              </div>
              <div className="space-y-4">
                {bars.map((bar, bIdx) => (
                  <div key={bIdx} className="space-y-1 text-left">
                    <div className="flex justify-between items-end text-xs">
                      <span className="font-extrabold text-[#0f1412]">{bar.label}</span>
                      <span className="font-sans font-black bg-slate-100 px-2 py-0.5 rounded text-slate-900 border border-slate-200">
                        {bar.value}%
                      </span>
                    </div>
                    <div className="w-full bg-[#FBF9F4] h-4.5 rounded-full overflow-hidden border border-slate-200 p-0.5">
                      <div 
                        className="bg-slate-900 h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${Math.min(100, Math.max(0, bar.value))}%` }}
                      />
                    </div>
                    {bar.detail && (
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic pl-1">
                        {bar.detail}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (block.type === 'statystyka') {
          const parts = block.content.split('\n').map(l => l.trim()).filter(Boolean);
          const value = parts[0] || '100';
          const desc = parts.slice(1).join(' ');

          return (
            <div
              key={idx}
              className="bg-[#FBF9F4] border border-slate-250 rounded-[28px] p-8 md:p-10 my-8 text-center text-[#1a211e] relative group shadow-sm flex flex-col items-center justify-center"
            >
              <span className="text-[40px] md:text-5xl font-serif font-black tracking-tight leading-none text-[#000000]">
                {value}
              </span>
              {desc && (
                <p className="text-xs uppercase font-black text-[#55605a] tracking-widest leading-relaxed mt-4 max-w-md">
                  {desc}
                </p>
              )}
            </div>
          );
        }

        if (block.type === 'porada') {
          return (
            <div
              key={idx}
              className="bg-[#FCFAF2] border-2 border-[#D4C3A3] rounded-[24px] p-6 md:p-8 my-8 flex gap-5 text-[#1a211e] relative shadow-sm"
            >
              <div className="w-10 h-10 bg-white rounded-xl border border-[#D4C3A3] flex items-center justify-center text-amber-700 shrink-0 shadow-sm mt-0.5">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <span className="text-[10px] font-black uppercase text-amber-800 tracking-[0.2em] block">
                  Porada Ekspercka / Wskazówka
                </span>
                <div className="text-sm font-semibold leading-relaxed text-[#1a211e]">
                  <ReactMarkdown
                    components={{
                      a: ({ href, children, ...props }) => {
                        const isInternal = href && href.startsWith('/') && !href.startsWith('//');
                        const targetHref = isInternal ? `#${href}` : href;
                        return (
                          <a href={targetHref} {...props} className="font-bold underline text-amber-950">
                            {children}
                          </a>
                        );
                      }
                    }}
                  >
                    {block.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
