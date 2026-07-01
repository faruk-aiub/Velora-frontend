import os

filepath = "src/app/(store)/shop/page.tsx"
with open(filepath, 'r') as f:
    content = f.read()

# Typography and Colors
content = content.replace(
    'bg-[#FAF8F5]',
    'bg-white'
)
content = content.replace(
    'bg-[#E8E1DE]',
    'bg-[#F9FAFB] rounded-b-[40px]'
)
content = content.replace(
    'text-[#3A3331]',
    'text-gray-900'
)
content = content.replace(
    'text-[#7A7371]',
    'text-gray-500'
)
content = content.replace(
    'font-bold text-5xl text-gray-900 font-light',
    'font-bold text-5xl text-gray-900 tracking-tight'
)
content = content.replace(
    'text-sm tracking-wide',
    'text-sm font-medium'
)
content = content.replace(
    'hover:text-[#BC8477]',
    'hover:text-[#BC8477]'
)

with open(filepath, 'w') as f:
    f.write(content)

