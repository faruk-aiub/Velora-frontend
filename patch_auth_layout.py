import os

filepath = "src/app/(store)/(auth)/layout.tsx"
with open(filepath, 'r') as f:
    content = f.read()

content = content.replace(
    'bg-background',
    'bg-white'
)
content = content.replace(
    'bg-muted',
    'bg-gray-900'
)
content = content.replace(
    'border-white/80',
    'border-white/20'
)
content = content.replace(
    'font-bold text-5xl md:text-6xl text-white mb-6 font-light leading-[1.1]',
    'font-bold text-5xl md:text-6xl text-white mb-6 tracking-tight leading-[1.1]'
)
content = content.replace(
    'text-white/80 text-sm md:text-base font-sans font-light tracking-wide max-w-md mb-12 leading-relaxed',
    'text-white/80 text-sm md:text-base font-medium max-w-md mb-12 leading-relaxed'
)

with open(filepath, 'w') as f:
    f.write(content)

