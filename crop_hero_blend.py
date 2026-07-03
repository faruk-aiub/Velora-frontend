import sys
from PIL import Image

try:
    img_path = "/Users/md.omarfaruk/.gemini/antigravity-ide/brain/00facccb-7146-4107-a9f4-a1ffbf929430/media__1783100488325.png"
    img = Image.open(img_path)
    width, height = img.size
    
    # We want to crop from top of hero to bottom of hero
    # Navbar is ~100px. Features strip starts at ~80% height.
    top = int(100)
    bottom = int(height * 0.75)
    
    # Let's just crop the hero banner part entirely!
    # Left edge to right edge
    box = (int(width * 0.05), top, int(width * 0.95), bottom)
    cropped = img.crop(box)
    
    cropped.save("public/home-hero-cropped.png")
    print("Successfully cropped the full hero banner to public/home-hero-cropped.png")
except Exception as e:
    print(f"Error: {e}")
