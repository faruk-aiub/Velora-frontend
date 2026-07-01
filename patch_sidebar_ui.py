import os

filepath = "src/components/shop/ShopSidebar.tsx"
with open(filepath, 'r') as f:
    content = f.read()

# First, let's revert the green back to copper for the sidebar
content = content.replace('[#7A915C]', '[#BC8477]')

# Second, let's fix the subcategory list item to use a dot
old_sub_ui = """                              <button 
                                onClick={() => selectSubcategory(category.name, sub)}
                                className={cn(
                                  "text-sm hover:text-[#BC8477] transition-colors flex items-center gap-2 group w-full text-left",
                                  currentSubcategory === sub ? "text-[#BC8477] font-medium" : "text-gray-500"
                                )}
                              >
                                <div className={cn(
                                  "w-1 h-1 rounded-full transition-colors",
                                  currentSubcategory === sub ? "bg-[#BC8477]" : "bg-gray-200 group-hover:bg-[#BC8477]"
                                )} />
                                {sub}
                              </button>"""

new_sub_ui = """                              <button 
                                onClick={() => selectSubcategory(category.name, sub)}
                                className={cn(
                                  "text-sm hover:text-[#BC8477] transition-colors flex items-center gap-2 w-full text-left",
                                  currentSubcategory === sub ? "text-[#BC8477] font-medium" : "text-gray-500"
                                )}
                              >
                                <span className="text-gray-400 text-xs mr-1">•</span>
                                {sub}
                              </button>"""

content = content.replace(old_sub_ui, new_sub_ui)

with open(filepath, 'w') as f:
    f.write(content)

