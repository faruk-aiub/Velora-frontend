import axios from './axios';

export interface CategoryTree {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  children: CategoryTree[];
}

export async function fetchCategoryTree(): Promise<CategoryTree[]> {
  try {
    const res = await axios.get('/categories/tree');
    return res.data.data;
  } catch (error) {
    console.error('Failed to fetch category tree:', error);
    return [];
  }
}

export async function fetchCategories(): Promise<CategoryTree[]> {
  try {
    const res = await axios.get('/categories');
    return res.data.data;
  } catch (error) {
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
