import os
from PIL import Image

ASSETS_DIR = r"d:\MaatiKitchen\public\assets"
MAX_SIZE = (1200, 1200)

def optimize_images():
    total_before = 0
    total_after = 0
    optimized_count = 0

    for filename in os.listdir(ASSETS_DIR):
        filepath = os.path.join(ASSETS_DIR, filename)
        if not os.path.isfile(filepath):
            continue

        ext = os.path.splitext(filename)[1].lower()
        if ext not in ['.jpg', '.jpeg', '.png', '.webp']:
            continue

        size_before = os.path.getsize(filepath)
        total_before += size_before

        try:
            with Image.open(filepath) as img:
                # Convert RGBA to RGB for JPEG if needed
                has_alpha = img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info)
                
                # Check if resizing is needed
                w, h = img.size
                if w > MAX_SIZE[0] or h > MAX_SIZE[1]:
                    img.thumbnail(MAX_SIZE, Image.Resampling.LANCZOS)
                
                # Save optimized version to temp, then replace
                temp_path = filepath + ".tmp"
                if ext in ['.jpg', '.jpeg']:
                    if img.mode != 'RGB':
                        img = img.convert('RGB')
                    img.save(temp_path, format='JPEG', quality=84, optimize=True)
                elif ext == '.png':
                    if has_alpha:
                        img.save(temp_path, format='PNG', optimize=True)
                    else:
                        # If no alpha, optimize as PNG or standard RGB
                        img.save(temp_path, format='PNG', optimize=True)
                elif ext == '.webp':
                    img.save(temp_path, format='WEBP', quality=84, method=6)
                
                size_after = os.path.getsize(temp_path)
                
                # Only overwrite if size was actually reduced or improved
                if size_after <= size_before:
                    os.replace(temp_path, filepath)
                    total_after += size_after
                    optimized_count += 1
                    print(f"✓ {filename}: {size_before/1024:.1f} KB -> {size_after/1024:.1f} KB ({((size_before - size_after)/size_before)*100:.1f}% saved)")
                else:
                    os.remove(temp_path)
                    total_after += size_before
                    print(f"- {filename}: Kept original ({size_before/1024:.1f} KB)")
        except Exception as e:
            print(f"Error processing {filename}: {e}")
            total_after += size_before

    print(f"\nOptimization Finished!")
    print(f"Optimized {optimized_count} images.")
    print(f"Total Before: {total_before / (1024*1024):.2f} MB")
    print(f"Total After: {total_after / (1024*1024):.2f} MB")
    print(f"Saved: {(total_before - total_after) / (1024*1024):.2f} MB ({((total_before - total_after)/total_before)*100:.1f}%)")

if __name__ == "__main__":
    optimize_images()
