#!/usr/bin/env python3
"""
Resize all images in `images/` to a width of 400px (aspect-ratio preserved),
convert to JPEG, and save to `images_resized/` with quality=20.
"""
import os
from PIL import Image

# Configuration
INPUT_DIR = 'images (salin)'
OUTPUT_DIR = 'images'
TARGET_WIDTH = 500
JPEG_QUALITY = 30

# Create output folder if missing
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Supported input extensions
EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}

for fname in os.listdir(INPUT_DIR):
    base, ext = os.path.splitext(fname)
    if ext.lower() not in EXTENSIONS:
        continue

    in_path = os.path.join(INPUT_DIR, fname)
    out_fname = f"{base}.jpg"
    out_path = os.path.join(OUTPUT_DIR, out_fname)

    try:
        with Image.open(in_path) as img:
            # Compute new height to preserve aspect ratio
            w, h = img.size
            if w != TARGET_WIDTH:
                new_h = int(h * TARGET_WIDTH / w)
                img = img.resize((TARGET_WIDTH, new_h), Image.LANCZOS)

            # Ensure mode is RGB for JPEG
            if img.mode in ('RGBA', 'P', 'LA'):
                img = img.convert('RGB')

            # Save as JPEG with desired quality
            img.save(out_path, 'JPEG', quality=JPEG_QUALITY)
            print(f"[OK]  {out_fname} -> {TARGET_WIDTH}x{new_h} @ q{JPEG_QUALITY}")
    except Exception as e:
        print(f"[ERR] {fname}: {e}")
