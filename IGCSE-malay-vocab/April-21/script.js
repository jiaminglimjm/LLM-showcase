// script.js
// ---- your word list here ----
// Replace with your own data or fetch from backend
const words = [
    { word: 'haiwan', image: '../images/haiwan-animals.jpg', translation: 'animals' },
    { word: 'jawapan', image: '../images/jawapan-answers.jpg', translation: 'answers' },
    { word: 'kucing', image: '../images/kucing-cat.jpg', translation: 'cat' },
    { word: 'bandar', image: '../images/bandar-city.jpg', translation: 'city' },
    { word: 'hadiah', image: '../images/hadiah-present.jpg', translation: 'present' },
    { word: 'pengalaman', image: '../images/pengalaman-experience.jpg', translation: 'experience' },
    { word: 'pertandingan', image: '../images/pertandingan-competition.jpg', translation: 'competition' },
    { word: 'gembira', image: '../images/gembira-happy.jpg', translation: 'happy' },
    { word: 'perjalanan', image: '../images/perjalanan-journey.jpg', translation: 'journey' },
    { word: 'laut', image: '../images/laut-sea.jpg', translation: 'sea' },
    { word: 'majalah', image: '../images/majalah-magazine.jpg', translation: 'magazine' },
    { word: 'memancing', image: '../images/memancing-fishing.jpg', translation: 'fishing' },
    { word: 'bengkel', image: '../images/bengkel-workshop.jpg', translation: 'workshop' },
    { word: 'pesta', image: '../images/pesta-party.jpg', translation: 'party' },
    { word: 'pulau', image: '../images/pulau-island.jpg', translation: 'island' },
    { word: 'gerai', image: '../images/gerai-stall.jpg', translation: 'stall' },
    { word: 'berenang', image: '../images/berenang-swimming.jpg', translation: 'swimming' },
    { word: 'merancang', image: '../images/merancang-planning.jpg', translation: 'planning' },

    { word: 'cadangan', image: '../images/cadangan-suggestion.jpg', translation: 'suggestion' },
    { word: 'jika', image: '../images/jika-if.jpg', translation: 'if' },
    { word: 'syarikat', image: '../images/syarikat-company.jpg', translation: 'company' },
    { word: 'kenderaan', image: '../images/kenderaan-vehicles.jpg', translation: 'vehicles' },

    { word: 'pelbagai', image: '../images/pelbagai-various.jpg', translation: 'various' },
    { word: 'mengenai', image: '../images/mengenai-about.jpg', translation: 'about' },
    { word: 'harap', image: '../images/harap-hope.jpg', translation: 'hope' },
    { word: 'jenis', image: '../images/jenis-type.jpg', translation: 'type' },
    { word: 'cara', image: '../images/cara-method.jpg', translation: 'method' },
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

function renderHistory() {
  const raw = localStorage.getItem('vocabStats');
  const history = raw ? JSON.parse(raw) : [];

  // sort most‑recent first
  history.sort((a, b) =>
    new Date(b.completedAt) - new Date(a.completedAt)
  );

  const tbody = document.querySelector('#history-table tbody');
  tbody.innerHTML = '';  // clear old rows

  history.forEach(run => {
    const tr = document.createElement('tr');
    const dt = new Date(run.completedAt);
    // format in local Malay locale
    const when = dt.toLocaleString('ms-MY', {
      dateStyle: 'short',
      timeStyle: 'short'
    });

    tr.innerHTML = `
      <td>${when}</td>
      <td>${run.correct}/${run.total}</td>
      <td>${run.timeSeconds}</td>
    `;
    tbody.appendChild(tr);
  });

  // show the history container
  document.getElementById('history-container')
          .classList.remove('hidden');
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
  renderHistory();
}

// … rest of your code, listener on retry-btn, load/startQuiz …


document.getElementById('retry-btn').addEventListener('click', startQuiz);
window.addEventListener('load', startQuiz);
