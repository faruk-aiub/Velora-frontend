import os

filepath = "src/components/shop/ShopSidebar.tsx"
with open(filepath, 'r') as f:
    content = f.read()

# Remove the CATEGORIES array
categories_start = content.find("const CATEGORIES = [")
categories_end = content.find("];\n\nexport function ShopSidebar")
if categories_start != -1 and categories_end != -1:
    content = content[:categories_start] + content[categories_end+4:]

# Add imports
imports = """import { CATEGORIES, generateCategorySlug } from "@/lib/categories";
export function ShopSidebar({ categoryOverride }: { categoryOverride?: string }) {"""

content = content.replace("export function ShopSidebar() {", imports)

# Update currentCategory
content = content.replace("const currentCategory = searchParams.get('category');", "const currentCategory = categoryOverride || searchParams.get('category');")

# Update toggleCategory
old_toggle = """  const toggleCategory = (name: string) => {
    setOpenCategory(openCategory === name ? null : name);
    
    // Update URL with category (clear subcategory)
    const params = new URLSearchParams(searchParams.toString());
    if (openCategory !== name) {
      params.set('category', name);
    } else {
      params.delete('category');
    }
    params.delete('subcategory');
    router.push(`${pathname}?${params.toString()}`);
  };"""

new_toggle = """  const toggleCategory = (name: string) => {
    setOpenCategory(openCategory === name ? null : name);
    if (openCategory !== name) {
      router.push(`/category/${generateCategorySlug(name)}`);
    } else {
      router.push('/shop');
    }
  };"""

content = content.replace(old_toggle, new_toggle)

with open(filepath, 'w') as f:
    f.write(content)
