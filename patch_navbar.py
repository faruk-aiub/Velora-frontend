import os

filepath = "src/components/layout/Navbar.tsx"
with open(filepath, 'r') as f:
    content = f.read()

# Update background to match the reference image (white or very light gray)
content = content.replace(
    'isTransparent ? "absolute top-0 text-white" : "sticky top-0 bg-[#FAF8F5] text-[#3A3331] border-b border-[#E8E1DE]"',
    'isTransparent ? "absolute top-0 text-white" : "sticky top-0 bg-white text-gray-900 border-b border-gray-100"'
)

# Update logo
content = content.replace(
    'border-[#3A3331] group-hover:bg-[#3A3331]',
    'border-gray-900 group-hover:bg-gray-900'
)
content = content.replace(
    'text-[#3A3331]',
    'text-gray-900'
)
content = content.replace(
    'font-sans tracking-[0.2em] text-sm uppercase font-bold hidden sm:block',
    'font-sans text-xl font-bold tracking-wide hidden sm:block'
)

# Update Nav Links
content = content.replace(
    'text-[11px] font-bold tracking-[0.2em] uppercase transition-colors", isTransparent ? "text-white/90 hover:text-white" : "text-[#7A7371] hover:text-[#BC8477]',
    'text-sm font-bold transition-colors", isTransparent ? "text-white/90 hover:text-white" : "text-gray-600 hover:text-[#BC8477]'
)

# Update Icons
content = content.replace(
    'hover:text-[#BC8477] transition-colors hidden sm:block", isTransparent ? "text-white" : "text-[#3A3331]',
    'hover:text-[#BC8477] transition-colors hidden sm:block", isTransparent ? "text-white" : "text-gray-900'
)
content = content.replace(
    'hover:text-[#BC8477] transition-colors", isTransparent ? "text-white" : "text-[#3A3331]',
    'hover:text-[#BC8477] transition-colors", isTransparent ? "text-white" : "text-gray-900'
)

# Search Dropdown
content = content.replace(
    'border-[#E8E1DE]',
    'border-gray-100'
)
content = content.replace(
    'text-[#B5AFAD]',
    'text-gray-400'
)
content = content.replace(
    'text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7371] hover:text-[#3A3331]',
    'text-sm font-bold text-gray-500 hover:text-gray-900'
)

with open(filepath, 'w') as f:
    f.write(content)

