import json
from PIL import Image

def get_centered_coords(image_path, step=2):
    img = Image.open(image_path).convert('RGBA')
    
    max_dim = 600
    scale = max_dim / max(img.width, img.height)
    new_w = int(img.width * scale)
    new_h = int(img.height * scale)
    
    img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    cx = new_w / 2
    cy = new_h / 2
    maxD = max(new_w, new_h)
    
    coords = []
    
    for y in range(0, new_h, step):
        for x in range(0, new_w, step):
            r, g, b, a = img.getpixel((x, y))
            luminance = 0.299 * r + 0.587 * g + 0.114 * b
            
            # Considering Moinho_Componente.png might be slightly different,
            # we use the same threshold.
            if luminance < 240 and a > 50:
                nx = (x - cx) / maxD
                ny = (y - cy) / maxD
                coords.append([round(nx, 4), round(ny, 4)])
                
    return coords

c1 = get_centered_coords('/Users/marcellbarbalho/Downloads/Sites/Porto de Ama/Porto de Ama - Site/assets/images/montanhas-sal-esboco-volumoso.png', step=2)
c2 = get_centered_coords('/Users/marcellbarbalho/Downloads/Sites/Porto de Ama/Porto de Ama - Site/assets/images/Moinho_Componente.png', step=2)

print(f"Img1 points: {len(c1)}")
print(f"Img2 points: {len(c2)}")

with open('particle-data.js', 'w') as f:
    f.write('const animData1 = ' + json.dumps(c1) + ';\n')
    f.write('const animData2 = ' + json.dumps(c2) + ';\n')

