import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Grid, PhoneCall, AlertTriangle } from 'lucide-react';

interface ParsedBlock {
  type: 'markdown' | 'kafelka' | 'sos' | 'alert-warning';
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
      }
      
      blocks.push({ type, content: blockContent });
    }
  });

  return blocks;
};

export default function MarkdownRenderer({ content }: { content: string }) {
  const blocks = parseCustomBlocks(content);

  return (
    <div className="space-y-6">
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
                    <a href={targetHref} {...props}>
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
              className="bg-blue-50 border-2 border-blue-100 rounded-[32px] p-8 my-8 flex flex-col md:flex-row items-start gap-6 shadow-sm shadow-blue-50"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-md border border-blue-100 flex-shrink-0">
                <Grid className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0 prose prose-blue max-w-none">
                <ReactMarkdown
                  components={{
                    a: ({ href, children, ...props }) => {
                      const isInternal = href && href.startsWith('/') && !href.startsWith('//');
                      const targetHref = isInternal ? `#${href}` : href;
                      return (
                        <a href={targetHref} {...props}>
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
              className="bg-rose-600 text-white rounded-[32px] p-10 my-10 relative overflow-hidden shadow-xl shadow-rose-200"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <PhoneCall className="w-32 h-32" />
              </div>
              <PhoneCall className="w-12 h-12 mb-6 relative z-10 text-white" />
              <div className="relative z-10 prose prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    a: ({ href, children, ...props }) => {
                      const isInternal = href && href.startsWith('/') && !href.startsWith('//');
                      const targetHref = isInternal ? `#${href}` : href;
                      return (
                        <a href={targetHref} {...props}>
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
              className="bg-amber-50 border-l-8 border-amber-400 rounded-2xl p-6 my-8 flex items-start gap-4"
            >
              <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0 prose prose-amber max-w-none">
                <ReactMarkdown
                  components={{
                    a: ({ href, children, ...props }) => {
                      const isInternal = href && href.startsWith('/') && !href.startsWith('//');
                      const targetHref = isInternal ? `#${href}` : href;
                      return (
                        <a href={targetHref} {...props}>
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

        return null;
      })}
    </div>
  );
}
