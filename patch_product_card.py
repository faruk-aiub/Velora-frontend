import os

filepath = "src/components/shop/ProductCard.tsx"
with open(filepath, 'r') as f:
    content = f.read()

# Replace the outer structure to have a border and padding
content = content.replace(
    '<div className="group flex flex-col">',
    '<div className="group flex flex-col bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">'
)

# Update the image container
# We need to remove the hover button from inside the image.
content = content.replace(
    'aspect-[3/4]',
    'aspect-square'
)

# Remove the absolute positioned add to cart button inside the image
button_code = """
        <div className="absolute bottom-4 left-4 right-4 translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-white/95 text-gray-900 text-[13px] font-bold rounded-full py-3.5 hover:bg-gray-900 hover:text-white transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <ShoppingBag size={16} /> Add to Cart
          </button>
        </div>"""
content = content.replace(button_code, "")

# The text container below the image
text_section_old = """      <div className="flex flex-col px-1">
        {brand && (
          <span className="text-[11px] font-bold text-[#BC8477] uppercase mb-1 tracking-widest">{brand.name}</span>
        )}
        <Link href={`/product/${slug}`} className="font-bold text-[17px] text-gray-900 group-hover:text-[#BC8477] transition-colors line-clamp-1 mb-1.5">
          {title}
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900">
            ৳{Number(price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </span>
          {comparePrice && Number(comparePrice) > Number(price) && (
            <span className="font-medium text-sm text-gray-400 line-through">
              ৳{Number(comparePrice).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </span>
          )}
        </div>
      </div>"""

text_section_new = """      <div className="flex flex-col mt-2">
        {brand && (
          <span className="text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-widest">{brand.name}</span>
        )}
        <Link href={`/product/${slug}`} className="font-bold text-[15px] text-gray-900 hover:text-[#BC8477] transition-colors line-clamp-1 mb-1">
          {title}
        </Link>
        
        <div className="flex items-center gap-1 mb-2">
          <svg className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          <span className="text-xs font-bold text-gray-700">4.8</span>
          <span className="text-xs text-gray-400">(64)</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="font-bold text-[16px] text-gray-900">
            ৳{Number(price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </span>
          {comparePrice && Number(comparePrice) > Number(price) && (
            <span className="font-medium text-xs text-gray-400 line-through">
              ৳{Number(comparePrice).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </span>
          )}
        </div>

        <button 
          onClick={handleAddToCart}
          className="w-full bg-[#BC8477] text-white text-sm font-bold rounded-lg py-3 hover:bg-[#9A6B60] transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingBag size={16} /> Add to Cart
        </button>
      </div>"""
content = content.replace(text_section_old, text_section_new)

with open(filepath, 'w') as f:
    f.write(content)

