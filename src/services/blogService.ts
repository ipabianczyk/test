/// <reference types="vite/client" />
import yaml from 'js-yaml';

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  excerpt: string;
  image: string;
  readTime?: string;
  alert_level?: 'normal' | 'warning' | 'urgent';
  icon?: string;
  content: string;
  resources?: { title: string; desc: string; url: string }[];
}

// Vite magic to load all markdown files in the folder
const postFiles = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const parsePost = (md: string) => {
  const parts = md.split('---');
  if (parts.length < 3) return { data: {} as any, body: md };

  try {
    const data = yaml.load(parts[1]) as any;
    const body = parts.slice(2).join('---').trim();
    return { data, body };
  } catch (e) {
    console.error('Error parsing markdown frontmatter:', e);
    return { data: {} as any, body: md };
  }
};

export const getAllPosts = (): BlogPost[] => {
  const posts = Object.entries(postFiles).map(([path, fileContent]) => {
    // Explicitly handle default export from glob
    const content = (typeof fileContent === 'string' ? fileContent : (fileContent as any)?.default) as string;
    
    if (!content) {
      console.warn(`Empty content for blog post at ${path}`);
      return null;
    }

    const id = path.split('/').pop()?.replace('.md', '') || '';
    const { data, body } = parsePost(content);
    
    const post: BlogPost = {
      id,
      content: body,
      title: data.title || 'Untitled',
      date: data.date instanceof Date ? data.date.toLocaleDateString('pl-PL') : (data.date || ''),
      author: data.author || 'Anonymous',
      category: data.category || 'General',
      tags: Array.isArray(data.tags) ? data.tags : [],
      excerpt: data.excerpt || '',
      image: data.image || '',
      readTime: data.readTime || '5 min',
      alert_level: data.alert_level || 'normal',
      icon: data.icon || 'FileText',
      resources: Array.isArray(data.resources) ? data.resources : [],
    };

    return post;
  }).filter((p): p is BlogPost => p !== null);

  // Sort by date descending
  return posts.sort((a, b) => {
    const dateA = new Date(a.date).getTime() || 0;
    const dateB = new Date(b.date).getTime() || 0;
    return dateB - dateA;
  });
};

export const getPostById = (id: string): BlogPost | undefined => {
  return getAllPosts().find(post => post.id === id);
};
