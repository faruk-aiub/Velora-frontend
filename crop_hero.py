import sys
from PIL import Image

try:
    img_path = "/Users/md.omarfaruk/.gemini/antigravity-ide/brain/00facccb-7146-4107-a9f4-a1ffbf929430/media__1783100488325.png"
    img = Image.open(img_path)
    # The image size is usually large, let's get the dimensions
    width, height = img.size
    
    # We want to crop the right side hero section.
    # The navbar is at the top (maybe top 100px).
    # The features strip is at the bottom (maybe bottom 150px).
    # The right half is x from width/2 to width.
    
    # Let's crop a box: (left, top, right, bottom)
    # Top: rough guess 120px to avoid navbar
    # Bottom: height - 160px to avoid features
    # Left: width / 2 (or slightly more to the left to capture the whole scene)
    # Right: width - 40px (to avoid right padding/margins)
    
    box = (int(width * 0.45), 100, int(width * 0.95), int(height * 0.8))
    cropped = img.crop(box)
    
    # Save to public directory
    cropped.save("public/hero-products.png")
    print("Successfully cropped and saved to public/hero-products.png")
except Exception as e:
    print(f"Error: {e}")
