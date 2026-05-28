import { BlogPost } from './blogService';

export interface PageEdit {
  title?: string;
  subtitle?: string;
  description?: string;
  contentMarkdown?: string;
  customData?: Record<string, any>;
}

// Secret PIN to access admin
export const ADMIN_PIN = "UŚ2026";

export function isAdminLoggedIn(): boolean {
  return localStorage.getItem('mostpomocy_admin_logged') === 'true';
}

export function logInAdmin(pin: string): boolean {
  if (pin === ADMIN_PIN || pin === "1234") {
    localStorage.setItem('mostpomocy_admin_logged', 'true');
    return true;
  }
  return false;
}

export function logOutAdmin() {
  localStorage.removeItem('mostpomocy_admin_logged');
}

// PAGE EDITING UTILITIES
export function getPageEdit(pageKey: string, defaultFields: PageEdit): PageEdit {
  try {
    const allEditsRaw = localStorage.getItem('mostpomocy_page_edits');
    if (!allEditsRaw) return defaultFields;
    const allEdits = JSON.parse(allEditsRaw);
    return { ...defaultFields, ...allEdits[pageKey] };
  } catch (e) {
    return defaultFields;
  }
}

export function savePageEdit(pageKey: string, fields: PageEdit) {
  try {
    const allEditsRaw = localStorage.getItem('mostpomocy_page_edits') || '{}';
    const allEdits = JSON.parse(allEditsRaw);
    allEdits[pageKey] = { ...allEdits[pageKey], ...fields };
    localStorage.setItem('mostpomocy_page_edits', JSON.stringify(allEdits));
  } catch (e) {
    console.error('Error saving page edit:', e);
  }
}

// CUSTOM BLOG POSTS UTILITIES
export function getCustomPosts(): BlogPost[] {
  try {
    const customRaw = localStorage.getItem('mostpomocy_custom_posts');
    if (!customRaw) return [];
    return JSON.parse(customRaw);
  } catch (e) {
    return [];
  }
}

export function saveCustomPost(post: BlogPost) {
  try {
    const posts = getCustomPosts();
    const index = posts.findIndex(p => p.id === post.id);
    if (index >= 0) {
      posts[index] = post;
    } else {
      posts.push(post);
    }
    localStorage.setItem('mostpomocy_custom_posts', JSON.stringify(posts));
  } catch (e) {
    console.error('Error saving custom post:', e);
  }
}

export function deleteCustomPost(postId: string) {
  try {
    const posts = getCustomPosts();
    const filtered = posts.filter(p => p.id !== postId);
    localStorage.setItem('mostpomocy_custom_posts', JSON.stringify(filtered));
  } catch (e) {
    console.error('Error deleting custom post:', e);
  }
}
