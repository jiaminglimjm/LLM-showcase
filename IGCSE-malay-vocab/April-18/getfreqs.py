import re
import json

# === STEP 1: Paste your JavaScript-style word list here ===
js_data = """
const words = [
  { word: 'anjing', image: 'images/anjing-dog.jpg', translation: 'dog' },
  { word: 'bandar', image: 'images/bandar-city.jpg', translation: 'city' },
  { word: 'banjir', image: 'images/banjir-flood.jpg', translation: 'flood' },
  { word: 'bengkel', image: 'images/bengkel-workshop.jpg', translation: 'workshop' },
  { word: 'berenang', image: 'images/berenang-swimming.jpg', translation: 'swimming' },
  { word: 'berhenti', image: 'images/berhenti-stop.jpg', translation: 'stop' },
  { word: 'berkelah', image: 'images/berkelah-picnic.jpg', translation: 'picnic' },
  { word: 'berkhemah', image: 'images/berkhemah-camping.jpg', translation: 'camping' },
  { word: 'biawak', image: 'images/biawak-monitor lizard.jpg', translation: 'monitor lizard' },
  { word: 'bimbang', image: 'images/bimbang-worried.jpg', translation: 'worried' },
  { word: 'bosan', image: 'images/bosan-bored.jpg', translation: 'bored' },
  { word: 'buaya', image: 'images/buaya-crocodile.jpg', translation: 'crocodile' },
  { word: 'bunga mawar', image: 'images/bunga mawar-rose.jpg', translation: 'rose' },
  { word: 'epal', image: 'images/epal-apple.jpg', translation: 'apple' },
  { word: 'gajah', image: 'images/gajah-elephant.jpg', translation: 'elephant' },
  { word: 'gembira', image: 'images/gembira-happy.jpg', translation: 'happy' },
  { word: 'gerai', image: 'images/gerai-shop.jpg', translation: 'shop' },
  { word: 'hadiah', image: 'images/hadiah-present.jpg', translation: 'present' },
  { word: 'haiwan', image: 'images/haiwan-animals.jpg', translation: 'animals' },
  { word: 'jawapan', image: 'images/jawapan-answers.jpg', translation: 'answers' },
  { word: 'jurujual', image: 'images/jurujual-salesperson.jpg', translation: 'salesperson' },
  { word: 'jurulatih', image: 'images/jurulatih-trainer.jpg', translation: 'trainer' },
  { word: 'jururawat', image: 'images/jururawat-nurse.jpg', translation: 'nurse' },
  { word: 'kambing', image: 'images/kambing-goat.jpg', translation: 'goat' },
  { word: 'kapal', image: 'images/kapal-ship.jpg', translation: 'ship' },
  { word: 'kapal terbang', image: 'images/kapal_terbang-aeroplane.jpeg', translation: 'aeroplane' },
  { word: 'katak', image: 'images/katak-frog.jpg', translation: 'frog' },
  { word: 'kereta api', image: 'images/kereta_api-train.jpg', translation: 'train' },
  { word: 'kucing', image: 'images/kucing-cat.jpg', translation: 'cat' },
  { word: 'kuda', image: 'images/kuda-horse.jpg', translation: 'horse' },
  { word: 'laut', image: 'images/laut-sea.jpg', translation: 'sea' },
  { word: 'lembu', image: 'images/lembu-cow.jpg', translation: 'cow' },
  { word: 'majalah', image: 'images/majalah-magazine.jpg', translation: 'magazine' },
  { word: 'melihat', image: 'images/melihat-see.jpg', translation: 'see' },
  { word: 'melukis', image: 'images/melukis-drawing.jpg', translation: 'drawing' },
  { word: 'memancing', image: 'images/memancing-fishing.jpg', translation: 'fishing' },
  { word: 'memandu', image: 'images/memandu-driving.jpg', translation: 'driving' },
  { word: 'membaca', image: 'images/membaca-reading.jpg', translation: 'reading' },
  { word: 'mendaki', image: 'images/mendaki-hiking.jpg', translation: 'hiking' },
  { word: 'mendengar', image: 'images/mendengar-listening.jpg', translation: 'listening' },
  { word: 'menempah', image: 'images/menempah-booking.jpg', translation: 'booking' },
  { word: 'menulis', image: 'images/menulis-writing.jpg', translation: 'writing' },
  { word: 'menunggang', image: 'images/menunggang-riding.jpg', translation: 'riding' },
  { word: 'merancang', image: 'images/merancang-planning.jpg', translation: 'planning' },
  { word: 'penasihat', image: 'images/penasihat-adviser.jpg', translation: 'adviser' },
  { word: 'pengalaman', image: 'images/pengalaman-experience.jpg', translation: 'experience' },
  { word: 'perjalanan', image: 'images/perjalanan-journey.jpg', translation: 'journey' },
  { word: 'pertandingan', image: 'images/pertandingan-competition.jpg', translation: 'competition' },
  { word: 'pesta', image: 'images/pesta-festival.jpg', translation: 'festival' },
  { word: 'pulau', image: 'images/pulau-island.jpg', translation: 'island' },
  { word: 'selsema', image: 'images/selsema-common cold.jpg', translation: 'common cold' },
  { word: 'sukan', image: 'images/sukan-sports.jpg', translation: 'sports' },
  { word: 'sukarelawan', image: 'images/sukarelawan-volunteer.jpg', translation: 'volunteer' },
  { word: 'surat', image: 'images/surat-letter.jpg', translation: 'letter' },
  { word: 'tarian', image: 'images/tarian-dance.jpg', translation: 'dance' },
  { word: 'tasik', image: 'images/tasik-lake.jpg', translation: 'lake' },
];
"""

# === STEP 2: Load frequency data from word_counts.txt ===
frequency_dict = {}
with open("word_counts.txt", encoding="utf-8") as f:
    for line in f:
        if line.strip():
            word, freq = line.rsplit(" ", 1)
            frequency_dict[word.lower()] = int(freq)

# === STEP 3: Convert JS to Python list of dicts ===

# Remove JS declaration and semicolon
cleaned = re.sub(r'const \w+\s*=\s*\[', '[', js_data)
cleaned = re.sub(r'\];?', ']', cleaned)

# Quote object property names (word, image, translation)
cleaned = re.sub(r'(\bword|\bimage|\btranslation)\s*:', r'"\1":', cleaned)

# Replace single quotes with double quotes
cleaned = cleaned.replace("'", '"')

# Remove trailing commas
cleaned = re.sub(r',\s*}', '}', cleaned)
cleaned = re.sub(r',\s*]', ']', cleaned)

# Load as JSON
words_list = json.loads(cleaned)


# === STEP 4: Add frequencies and sort ===
for word in words_list:
    key = word['word'].lower()
    word['frequency'] = frequency_dict.get(key, 0)

sorted_words = sorted(words_list, key=lambda w: w['frequency'], reverse=True)

# === STEP 5: Output the result ===
# === STEP 6: Output in JavaScript-like format ===
for w in sorted_words:
    print(f"  {{ word: '{w['word']}', image: '{w['image']}', translation: '{w['translation']}' }},")
