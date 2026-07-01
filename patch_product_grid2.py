import os

filepath = "src/components/shop/ProductGrid.tsx"
with open(filepath, 'r') as f:
    content = f.read()

# Loading spinner color
content = content.replace('text-[#BC8477]', 'text-[#7A915C]')
content = content.replace('border-t-[#BC8477]', 'border-t-[#7A915C]')
content = content.replace('border-r-[#BC8477]', 'border-r-[#7A915C]')
content = content.replace('focus:border-[#BC8477]', 'focus:border-[#7A915C]')

# We can remove the title because the Shop page has it already, OR just make it hidden
content = content.replace(
    '<h1 className="font-bold text-4xl text-gray-900 tracking-tight">',
    '<h1 className="hidden font-bold text-4xl text-gray-900 tracking-tight">'
)

with open(filepath, 'w') as f:
    f.write(content)

