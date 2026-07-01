import os

filepath = "src/app/(store)/checkout/page.tsx"
with open(filepath, 'r') as f:
    content = f.read()

# General colors
content = content.replace('bg-[#FAF8F5]', 'bg-gray-50')
content = content.replace('text-[#3A3331]', 'text-gray-900')
content = content.replace('text-[#7A7371]', 'text-gray-500')
content = content.replace('border-[#E8E1DE]', 'border-gray-100')
content = content.replace('bg-[#F5F2F0]', 'bg-gray-50')
content = content.replace('bg-[#3A3331]', 'bg-gray-900')

# Headings
content = content.replace(
    'font-bold text-4xl text-gray-900 font-light',
    'font-bold text-4xl text-gray-900 tracking-tight'
)
content = content.replace(
    'text-sm font-bold tracking-widest uppercase text-gray-900',
    'text-lg font-bold text-gray-900 tracking-tight'
)

# Containers
content = content.replace(
    'bg-white p-8 border border-gray-100',
    'bg-white p-8 border border-gray-100 rounded-[32px] shadow-sm'
)

# Buttons
content = content.replace(
    'flex-1 h-12 bg-gray-900 text-white text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#BC8477]',
    'flex-1 h-12 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-gray-800 shadow-sm'
)
content = content.replace(
    'flex-1 h-12 border border-gray-100 text-gray-900 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-gray-50',
    'flex-1 h-12 border border-gray-200 text-gray-900 text-sm font-bold rounded-full hover:bg-gray-50'
)
content = content.replace(
    'w-full h-14 bg-[#BC8477] text-white text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#9A6B60]',
    'w-full h-14 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-gray-800 shadow-md'
)

# Inputs
content = content.replace(
    'col-span-2 w-full h-12 bg-gray-50 px-4 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#BC8477]',
    'col-span-2 w-full h-12 bg-gray-50 rounded-xl px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] border border-gray-200'
)
content = content.replace(
    'w-full h-12 bg-gray-50 px-4 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#BC8477]',
    'w-full h-12 bg-gray-50 rounded-xl px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] border border-gray-200'
)

# Address Card (selected/unselected)
content = content.replace(
    'border-gray-100 hover:border-[#D5CFCD]',
    'border-gray-100 hover:border-gray-300 rounded-2xl'
)
content = content.replace(
    'border-[#BC8477] bg-gray-50',
    'border-[#BC8477] bg-[#BC8477]/5 rounded-2xl ring-1 ring-[#BC8477]'
)

# Product list items
content = content.replace(
    'relative w-16 h-20 bg-gray-50 shrink-0',
    'relative w-16 h-20 bg-gray-50 shrink-0 rounded-xl overflow-hidden'
)

with open(filepath, 'w') as f:
    f.write(content)

