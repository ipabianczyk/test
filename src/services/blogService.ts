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

const getCustomPostsLocally = (): BlogPost[] => {
  try {
    const customRaw = localStorage.getItem('mostpomocy_custom_posts');
    if (!customRaw) return [];
    return JSON.parse(customRaw);
  } catch (e) {
    return [];
  }
};

export const getAllPosts = (): BlogPost[] => {
  const staticPosts = Object.entries(postFiles).map(([path, fileContent]) => {
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

  const customPosts = getCustomPostsLocally();

  // Combine lists, preferring custom/edited articles over static ones if IDs match
  const mergedMap = new Map<string, BlogPost>();
  staticPosts.forEach(p => mergedMap.set(p.id, p));
  customPosts.forEach(p => mergedMap.set(p.id, p));

  const sorted = Array.from(mergedMap.values()).sort((a, b) => {
    const parseDate = (dStr: string) => {
      if (!dStr) return 0;
      // Handle pl-PL format "DD.MM.YYYY" or standard Date formats
      if (dStr.includes('.')) {
        const parts = dStr.split('.');
        if (parts.length === 3) {
          return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime() || 0;
        }
      }
      return new Date(dStr).getTime() || 0;
    };
    return parseDate(b.date) - parseDate(a.date);
  });

  return sorted;
};

export const getPostById = (id: string): BlogPost | undefined => {
  return getAllPosts().find(post => post.id === id);
};
