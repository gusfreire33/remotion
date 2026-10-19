import sys, glob, os
from PIL import Image, ImageDraw
files = sys.argv[2:] if len(sys.argv) > 2 else sorted(glob.glob("out/wmvsl-stills/*.jpg"))
cols = 3
ims = [Image.open(f) for f in files]
w, h = ims[0].size
rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (cols * w, rows * h), "black")
d = ImageDraw.Draw(sheet)
for i, (f, im) in enumerate(zip(files, ims)):
    x, y = (i % cols) * w, (i // cols) * h
    sheet.paste(im, (x, y))
    fr = int(os.path.basename(f)[1:6])
    d.rectangle([x, y, x + 120, y + 24], fill="black")
    d.text((x + 6, y + 6), f"{fr/30:.2f}s", fill="yellow")
sheet.save(sys.argv[1], quality=82)
print(sys.argv[1], sheet.size)
