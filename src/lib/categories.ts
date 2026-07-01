export const CATEGORIES = [
  {
    name: 'Electronics & Gadgets',
    img: 'headphone',
    color: 'bg-[#E8F0FA]',
    subcategories: ['Smartphones', 'Laptops', 'Cameras', 'Headphones', 'Smartwatches', 'Accessories']
  },
  {
    name: 'Fashion & Clothing',
    img: 'tshirt',
    color: 'bg-[#FBEBEB]',
    subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Kid\'s Clothing', 'Shoes', 'Bags & Accessories', 'Jewelry']
  },
  {
    name: 'Beauty & Personal Care',
    img: 'cosmetic',
    color: 'bg-[#F4EAFC]',
    subcategories: ['Skincare Products', 'Makeup Products', 'Perfume', 'Hair Care Products', 'Grooming Products', 'Beauty Tools']
  },
  {
    name: 'Home & Living',
    img: 'sofa',
    color: 'bg-[#FCF5EA]',
    subcategories: ['Furniture', 'Bed & Mattress', 'Sofa', 'Table & Chair', 'Home Decor', 'Lighting', 'Kitchen Tools', 'Storage Items', 'Curtains', 'Carpets']
  },
  {
    name: 'Kitchen & Appliances',
    img: 'kitchen',
    color: 'bg-[#F5F5F5]',
    subcategories: ['Refrigerator', 'Microwave Oven', 'Blender', 'Rice Cooker', 'Electric Kettle', 'Coffee Maker', 'Cookware', 'Dinner Set']
  },
  {
    name: 'Books & Stationery',
    img: 'book',
    color: 'bg-[#EBF5EE]',
    subcategories: ['Books', 'Notebooks', 'Pens', 'Office Supplies', 'Educational Materials', 'Art Supplies']
  },
  {
    name: 'Sports & Fitness',
    img: 'shoe',
    color: 'bg-[#EAF6F5]',
    subcategories: ['Gym Equipment', 'Sports Shoes', 'Fitness Tracker', 'Yoga Mat', 'Sports Accessories', 'Bicycles']
  },
  {
    name: 'Kids & Baby Products',
    img: 'toy',
    color: 'bg-[#FFF0F5]',
    subcategories: ['Baby Clothes', 'Toys', 'School Bags', 'Baby Care Products', 'Kids Accessories']
  },
  {
    name: 'Automotive',
    img: 'car',
    color: 'bg-[#F0F5F9]',
    subcategories: ['Car Accessories', 'Bike Accessories', 'Helmet', 'Car Electronics', 'Cleaning Products']
  },
  {
    name: 'Pet Supplies',
    img: 'pet',
    color: 'bg-[#FDF4E5]',
    subcategories: ['Pet Food', 'Pet Toys', 'Pet Accessories', 'Pet Care Products']
  },
  {
    name: 'Grocery & Food',
    img: 'food',
    color: 'bg-[#F4F1EA]',
    subcategories: ['Snacks', 'Beverages', 'Dry Food', 'Fresh Food', 'Cooking Ingredients']
  },
  {
    name: 'Digital Products',
    img: 'laptop',
    color: 'bg-[#F4F4F8]',
    subcategories: ['Software', 'Online Courses', 'E-books', 'Subscriptions', 'Templates']
  },
  {
    name: 'Others',
    img: 'gift',
    color: 'bg-[#F9F9F9]',
    subcategories: ['Gifts', 'Jewelry', 'Watches', 'Handmade Products', 'Travel Accessories']
  }
];

export function generateCategorySlug(name: string) {
  return name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/'/g, '');
}

export function getCategoryNameFromSlug(slug: string) {
  const cat = CATEGORIES.find(c => generateCategorySlug(c.name) === slug);
  return cat ? cat.name : slug; // fallback to slug if not found
}
