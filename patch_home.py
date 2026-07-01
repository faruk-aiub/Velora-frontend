import os

filepath = "src/app/(store)/page.tsx"
with open(filepath, 'r') as f:
    content = f.read()

# Replace the categories href in the loop
old_code = "href={`/shop?category=${cat.name.toLowerCase()}`}"
new_code = "href={`/category/${cat.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/'/g, '')}`}"

content = content.replace(old_code, new_code)

with open(filepath, 'w') as f:
    f.write(content)
