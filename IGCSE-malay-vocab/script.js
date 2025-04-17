// script.js
// ---- your word list here ----
// Replace with your own data or fetch from backend
const words = [
  { word: 'anjing', image: 'images/anjing-dog.jpg', translation: 'dog' },
  { word: 'berkelah', image: 'images/berkelah-picnic.jpg', translation: 'picnic' },
  { word: 'berkhemah', image: 'images/berkhemah-camping.jpg', translation: 'camping' },
  { word: 'bimbang', image: 'images/bimbang-worried.jpg', translation: 'worried' },
  { word: 'epal', image: 'images/epal-apple.jpg', translation: 'apple' },
  { word: 'gajah', image: 'images/gajah-elephant.jpg', translation: 'elephant' },
  { word: 'gembira', image: 'images/gembira-happy.jpg', translation: 'happy' },
  { word: 'jurujual', image: 'images/jurujual-promoter.jpg', translation: 'promoter' },
  { word: 'jurulatih', image: 'images/jurulatih-trainer.jpg', translation: 'trainer' },
  { word: 'jururawat', image: 'images/jururawat-nurse.jpg', translation: 'nurse' },
  { word: 'kapal', image: 'images/kapal-ship.jpg', translation: 'ship' },
  { word: 'kapal terbang', image: 'images/kapal_terbang-aeroplane.jpeg', translation: 'aeroplane' },
  { word: 'kereta api', image: 'images/kereta_api-train.jpg', translation: 'train' },
  { word: 'kucing', image: 'images/kucing-cat.jpg', translation: 'cat' },
  { word: 'laut', image: 'images/laut-sea.jpg', translation: 'sea' },
  { word: 'lembu', image: 'images/lembu-cow.jpg', translation: 'cow' },
  { word: 'memandu', image: 'images/memandu-driving.jpg', translation: 'driving' },
  { word: 'menempah', image: 'images/menempah-booking.jpg', translation: 'booking' },
  { word: 'menunggang', image: 'images/menunggang-riding.jpg', translation: 'riding' },
  { word: 'merancang', image: 'images/merancang-planning.jpg', translation: 'planning' },
  { word: 'penasihat', image: 'images/penasihat-adviser.jpg', translation: 'adviser' },
  { word: 'pengalaman', image: 'images/pengalaman-experience.jpg', translation: 'experience' },
  { word: 'perjalanan', image: 'images/perjalanan-journey.jpg', translation: 'journey' },
  { word: 'pertandingan', image: 'images/pertandingan-competition.jpg', translation: 'competition' },
  { word: 'pesta', image: 'images/pesta-festival.jpg', translation: 'festival' }
];



let quizOrder = [];
let current = 0;
let correctCount = 0;
let startTime;

// Fisher–Yates shuffle
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startQuiz() {
  // pick 20 random words (or fewer if words.length < 20)
  quizOrder = shuffle(words).slice(0, 20);
  current = 0;
  correctCount = 0;
  startTime = Date.now();

  document.getElementById('result-container').classList.add('hidden');
  document.getElementById('quiz-container').classList.remove('hidden');
  showQuestion();
}

function showQuestion() {
  const entry = quizOrder[current];
  document.getElementById('word-display').textContent = entry.word;

  // pick 4 random choices including the right one
  const distractors = shuffle(words.filter(w => w !== entry)).slice(0, 3);
  const choices = shuffle([entry, ...distractors]);

  const grid = document.getElementById('image-grid');
  grid.innerHTML = '';

  choices.forEach((choice, idx) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'image-wrapper';

    const img = document.createElement('img');
    img.src = choice.image;
    img.alt = choice.translation;
    wrapper.appendChild(img);

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    wrapper.appendChild(overlay);

    const icon = document.createElement('div');
    icon.className = 'icon';
    wrapper.appendChild(icon);

    const trans = document.createElement('div');
    trans.className = 'translation';
    wrapper.appendChild(trans);

    wrapper.addEventListener('click', () => handleAnswer(idx, choices, wrapper));
    grid.appendChild(wrapper);
  });
}

function handleAnswer(selectedIdx, choices, wrapper) {
  // disable further clicks
  document.querySelectorAll('.image-wrapper').forEach(w => w.style.pointerEvents = 'none');
  // gray out all
  document.querySelectorAll('.overlay').forEach(o => o.style.display = 'flex');

  const correctIdx = choices.findIndex(c => c === quizOrder[current]);
  const wasRight = selectedIdx === correctIdx;
  const correctTrans = quizOrder[current].translation;

  // tapped image
  const tapped = document.querySelectorAll('.image-wrapper')[selectedIdx];
  tapped.querySelector('.icon').textContent = wasRight ? '✅' : '❌';
  tapped.querySelector('.icon').style.color = wasRight ? 'green' : 'red';

  // show the correct translation for wrong, or own for right


  if (!wasRight) {
    // reveal correct image (no gray overlay)
    const correctWrap = document.querySelectorAll('.image-wrapper')[correctIdx];
    correctWrap.querySelector('.overlay').style.display = 'none';

    correctWrap.querySelector('.translation').textContent = wasRight
    ? correctTrans
    : correctTrans;
    correctWrap.querySelector('.translation').style.display = 'block';
  } else {
    correctCount++;

    tapped.querySelector('.translation').textContent = wasRight
    ? correctTrans
    : correctTrans;
  tapped.querySelector('.translation').style.display = 'block';
  }

  // move on after delay
  const delay = wasRight ? 500 : 1500;
  setTimeout(() => {
    current++;
    if (current < quizOrder.length) {
      showQuestion();
    } else {
      endQuiz();
    }
  }, delay);
}

// script.js
// … your words array, shuffle, showQuestion etc. …

// ===== helper for stats history =====
function saveStats(run) {
  // raw could be null, an object, or an array
  const raw = localStorage.getItem('vocabStats');
  let history;

  if (!raw) {
    history = [];
  } else {
    try {
      const parsed = JSON.parse(raw);
      // if it was already an array, keep it; if it was a single object, wrap it
      history = Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      // on any parse error, reset
      history = [];
    }
  }

  history.push(run);
  localStorage.setItem('vocabStats', JSON.stringify(history));
}


function endQuiz() {
  const elapsed = Math.round((Date.now() - startTime) / 1000);
  // build run object with score, total, elapsed seconds, and timestamp
  const runStats = {
    correct: correctCount,
    total: quizOrder.length,
    timeSeconds: elapsed,
    completedAt: new Date().toISOString()  // e.g. "2025-04-17T15:26:43.511Z"
  };

  // append to history array in localStorage
  saveStats(runStats);

  // swap screens
  document.getElementById('quiz-container').classList.add('hidden');
  const rc = document.getElementById('result-container');
  rc.classList.remove('hidden');

  // show score and keep the “Cuba Lagi” label
  document.getElementById('score').textContent =
    `Anda jawab ${correctCount} daripada ${quizOrder.length} betul dalam ${elapsed} saat.`;
  // (retry button already says “Cuba Lagi”)
}

// … rest of your code, listener on retry-btn, load/startQuiz …


document.getElementById('retry-btn').addEventListener('click', startQuiz);
window.addEventListener('load', startQuiz);
