import os

filepath = "src/components/cart/CartDrawer.tsx"
with open(filepath, 'r') as f:
    content = f.read()

# Header
content = content.replace(
    'text-[#3A3331]',
    'text-gray-900'
)
content = content.replace(
    'text-[#7A7371]',
    'text-gray-500'
)
content = content.replace(
    'border-[#E8E1DE]',
    'border-gray-100'
)
content = content.replace(
    'hover:bg-[#F5F2F0]',
    'hover:bg-gray-100'
)
content = content.replace(
    'bg-[#F5F2F0]',
    'bg-gray-50'
)

# Empty Cart button
content = content.replace(
    'bg-[#BC8477] text-white px-8 py-3 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#9A6B60]',
    'bg-gray-900 text-white px-8 py-3 text-sm font-bold rounded-full hover:bg-gray-800'
)

# Cart Items
content = content.replace(
    'w-24 h-32 bg-gray-50 shrink-0',
    'w-24 h-32 bg-gray-50 shrink-0 rounded-2xl overflow-hidden'
)
content = content.replace(
    'flex items-center border border-gray-100 h-8',
    'flex items-center border border-gray-200 h-9 rounded-full overflow-hidden bg-white'
)
content = content.replace(
    'text-[10px] text-gray-500 mt-1',
    'text-xs font-medium text-gray-500 mt-1'
)
content = content.replace(
    'font-sans text-sm font-medium text-gray-900',
    'font-bold text-sm text-gray-900'
)

# Footer
content = content.replace(
    'bg-[#FAFAFA]',
    'bg-white'
)
content = content.replace(
    'bg-white border border-gray-100 text-xs focus:outline-none focus:border-[#BC8477]',
    'bg-gray-50 border border-gray-100 text-sm font-medium focus:outline-none focus:border-[#BC8477] rounded-xl'
)
content = content.replace(
    'h-10 px-4 bg-gray-900 text-white text-[10px] font-bold tracking-widest uppercase hover:bg-[#BC8477]',
    'h-10 px-6 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-gray-800 shadow-sm'
)
content = content.replace(
    'text-xs font-bold tracking-widest uppercase text-gray-500',
    'text-sm font-bold text-gray-500'
)
content = content.replace(
    'text-sm font-bold tracking-widest uppercase text-gray-900',
    'text-lg font-bold text-gray-900'
)
content = content.replace(
    'font-sans text-2xl text-gray-900',
    'font-bold text-2xl text-gray-900'
)
content = content.replace(
    'w-full h-14 bg-gray-900 text-white text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#BC8477]',
    'w-full h-14 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-gray-800 shadow-md'
)
content = content.replace(
    'text-sm font-medium text-gray-900',
    'text-sm font-bold text-gray-900'
)

with open(filepath, 'w') as f:
    f.write(content)

