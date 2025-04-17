#!/usr/bin/env python3
import os

# folder containing your images
IMAGE_DIR = 'images'

# include whatever extensions you need
EXTENSIONS = ('.jpg', '.jpeg', '.png', '.gif', '.webp')

def make_words_array(image_dir):
    files = sorted(
        f for f in os.listdir(image_dir)
        if f.lower().endswith(EXTENSIONS)
    )
    entries = []
    for fname in files:
        name, ext = os.path.splitext(fname)
        # skip anything without a dash
        if '-' not in name:
            continue

        # split into malay and english on the first '-'
        malay, english = name.split('-', 1)

        # replace underscores with spaces
        malay    = malay.replace('_', ' ')
        english  = english.replace('_', ' ')

        entries.append(
            f"  {{ word: '{malay}', image: '{image_dir}/{fname}', translation: '{english}' }}"
        )

    # build the JS array
    js = "const words = [\n" + ",\n".join(entries) + "\n];"
    return js

if __name__ == '__main__':
    print(make_words_array(IMAGE_DIR))
