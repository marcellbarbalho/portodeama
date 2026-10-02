import sys
from PIL import Image

def remove_background(image_path, output_path):
    img = Image.open(image_path).convert("RGBA")
    pixels = img.load()
    width, height = img.size
    
    def is_bg(r, g, b, a):
        return r > 240 and g > 240 and b > 240
        
    q = [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]
    visited = set(q)
    
    while q:
        x, y = q.pop(0)
        pr, pg, pb, pa = pixels[x, y]
        if is_bg(pr, pg, pb, pa):
            pixels[x, y] = (255, 255, 255, 0)
            for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                    visited.add((nx, ny))
                    q.append((nx, ny))

    img.save(output_path, "PNG")
    print(f"Background removed successfully for {output_path}.")

if len(sys.argv) > 2:
    remove_background(sys.argv[1], sys.argv[2])
