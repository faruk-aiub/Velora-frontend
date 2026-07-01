import os

filepath = "src/components/shop/ProductGrid.tsx"
with open(filepath, 'r') as f:
    content = f.read()

# Headers
content = content.replace(
    'font-bold text-4xl text-[#3A3331] font-light',
    'font-bold text-4xl text-gray-900 tracking-tight'
)

# Text Colors
content = content.replace('text-[#3A3331]', 'text-gray-900')
content = content.replace('text-[#7A7371]', 'text-gray-500')

# Sort By container
content = content.replace(
    '<span className="text-[10px] uppercase tracking-widest text-[#7A7371] font-bold">Sort By</span>',
    '<span className="text-xs uppercase tracking-widest text-gray-500 font-bold mr-2">Sort By</span>'
)
content = content.replace(
    'className="bg-transparent border-b border-[#E8E1DE] text-sm text-[#3A3331] pb-1 focus:outline-none focus:border-[#BC8477]"',
    'className="bg-gray-50 border border-gray-200 text-sm text-gray-900 px-4 py-2 rounded-full focus:outline-none focus:border-[#BC8477] transition-colors appearance-none cursor-pointer pr-10 hover:bg-gray-100"'
)

# Load More Button
content = content.replace(
    'className="h-12 px-8 border border-[#BC8477] text-[#BC8477] text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#BC8477] hover:text-white transition-colors"',
    'className="h-12 px-8 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-colors shadow-sm"'
)

with open(filepath, 'w') as f:
    f.write(content)

