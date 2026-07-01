import os
import glob

def patch_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Apply patches
    content = content.replace(
        '<div className="bg-white border border-zinc-200 rounded-lg shadow-sm">',
        '<div>'
    )
    content = content.replace(
        '<Button onClick={handleCreateNew} className="bg-zinc-900 text-white hover:bg-zinc-800">',
        '<Button onClick={handleCreateNew} className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6 font-bold shadow-sm">'
    )
    content = content.replace(
        '<h1 className="text-3xl font-bold tracking-tight">',
        '<h1 className="text-2xl font-bold text-gray-900">'
    )
    content = content.replace(
        '<p className="text-muted-foreground mt-2">',
        '<p className="text-sm text-gray-500 mt-1">'
    )

    with open(filepath, 'w') as f:
        f.write(content)

# Patch specific files
files_to_patch = glob.glob("src/app/admin/**/page.tsx", recursive=True)
for filepath in files_to_patch:
    if "dashboard" not in filepath and "login" not in filepath:
        patch_file(filepath)
        print(f"Patched {filepath}")

