import os

filepath = "src/components/shop/ProductCard.tsx"
with open(filepath, 'r') as f:
    content = f.read()

# Replace the previous '#BC8477' instances
content = content.replace('bg-[#BC8477]', 'bg-[#7A915C]')
content = content.replace('hover:bg-[#9A6B60]', 'hover:bg-[#687C4D]')
content = content.replace('hover:text-[#BC8477]', 'hover:text-[#7A915C]')

with open(filepath, 'w') as f:
    f.write(content)

