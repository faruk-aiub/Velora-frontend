import axios from './axios';

export interface CategoryTree {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  parent_id?: string | null;
  created_at?: string;
  children: CategoryTree[];
}

const API_BASE_URL = typeof window === 'undefined'
  ? (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000/api/v1')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1');

let memoryCachedTree: { data: CategoryTree[]; expiry: number } | null = null;
let memoryCachedCategories: { data: CategoryTree[]; expiry: number } | null = null;

export async function fetchCategoryTree(): Promise<CategoryTree[]> {
  const now = Date.now();
  if (memoryCachedTree && now < memoryCachedTree.expiry) {
    return memoryCachedTree.data;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/categories/tree`, {
      next: { revalidate: 300, tags: ['categories'] },
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const data = json.data || [];
    memoryCachedTree = { data, expiry: now + 300 * 1000 };
    return data;
  } catch (error) {
    if (memoryCachedTree) return memoryCachedTree.data;
    console.error('Failed to fetch category tree:', error);
    return [];
  }
}

export async function fetchCategories(): Promise<CategoryTree[]> {
  const now = Date.now();
  if (memoryCachedCategories && now < memoryCachedCategories.expiry) {
    return memoryCachedCategories.data;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      next: { revalidate: 300, tags: ['categories'] },
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const data = json.data || [];
    memoryCachedCategories = { data, expiry: now + 300 * 1000 };
    return data;
  } catch (error) {
    if (memoryCachedCategories) return memoryCachedCategories.data;
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export function generateCategorySlug(name: string) {
  return name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/'/g, '');
}

export async function getCategoryNameFromSlug(slug: string) {
  try {
    const categories = await fetchCategories();
    const cat = categories.find(c => c.slug === slug || generateCategorySlug(c.name) === slug);
    return cat ? cat.name : slug; // fallback to slug if not found
  } catch {
    return slug;
  }
}

export interface FlatCategory {
  id: string;
  name: string;
  displayName: string;
  slug: string;
  image_url: string | null;
  parent_id: string | null;
  created_at: string;
}

export function flattenCategoryTree(tree: CategoryTree[], prefix = ''): FlatCategory[] {
  let result: FlatCategory[] = [];
  for (const node of tree) {
    result.push({
      id: node.id,
      name: node.name,
      displayName: `${prefix}${node.name}`,
      slug: node.slug,
      image_url: node.image_url,
      parent_id: (node as any).parent_id || null,
      created_at: (node as any).created_at || new Date().toISOString(),
    });
    if (node.children && node.children.length > 0) {
      result = result.concat(flattenCategoryTree(node.children, prefix + '— '));
    }
  }
  return result;
}
