/* ========================================
   DETEKTIF NUSANTARA - Game Logic (Revised v3 - Database)
   ======================================== */

const API_URL = window.location.origin;

const state = {
  currentPage: 'login',
  currentUser: null,
  currentMission: 0,
  currentQuestion: 0,
  score: 0,
  answers: [],
  soundOn: true,
  musicOn: true,
  missionsRevealed: false,
  missionProgress: {}
};

// ============ MISSION DATA ============
const missions = [
  {
    id: 0,
    title: 'Misi Banjir',
    emoji: '🌊',
    caption: 'Banjir di Kota',
    bgGradient: 'linear-gradient(135deg,#1a6b4a,#0d3d2a)',
    questions: [
      { text: 'Berdasarkan isi poster tersebut, yang merupakan pernyataan sebab-akibat yang benar adalah…', answers: ['Membuang sampah di sungai menyebabkan banjir.', 'Banjir menyebabkan orang membuang sampah di sungai.', 'Banjir membuat sungai menjadi bersih.', 'Sungai yang bersih menyebabkan banjir.'], correct: 0 },
      { text: 'Manakah kalimat yang menunjukkan hubungan sebab-akibat?', answers: ['Air sungai meluap karena hujan deras sepanjang malam.', 'Hujan deras turun dan air sungai berwarna cokelat.', 'Banjir terjadi di kota dan di desa.', 'Anak-anak bermain air saat banjir.'], correct: 0 },
      { text: 'Apa akibat dari menebang pohon secara liar di hulu sungai?', answers: ['Sungai menjadi lebih indah.', 'Air sungai menjadi jernih.', 'Banjir lebih mudah terjadi saat hujan deras.', 'Ikan-ikan menjadi lebih banyak.'], correct: 2 },
      { text: 'Pilih kalimat yang menggunakan kata hubung "sehingga" dengan benar!', answers: ['Hujan deras sehingga selokan penuh sampah.', 'Selokan tersumbat sehingga air tidak bisa mengalir dan terjadi banjir.', 'Banjir sehingga hujan deras turun.', 'Air mengalir sehingga hujan deras.'], correct: 1 },
      { text: 'Bacalah: "Karena gotong royong membersihkan selokan, lingkungan menjadi bebas banjir." Apa sebab dari kalimat tersebut?', answers: ['Lingkungan menjadi bebas banjir.', 'Gotong royong membersihkan selokan.', 'Selokan penuh dengan sampah.', 'Hujan deras tidak turun.'], correct: 1 }
    ]
  },
  {
    id: 1,
    title: 'Misi Hutan',
    emoji: '🌳',
    caption: 'Hutan Tropis',
    bgGradient: 'linear-gradient(135deg,#2d8a4e,#1a5c30)',
    questions: [
      { text: 'Berdasarkan gambar hutan tersebut, manakah hubungan sebab-akibat yang benar?', answers: ['Karena hutan ditebang, hewan kehilangan tempat tinggal.', 'Karena hewan kehilangan tempat tinggal, hutan ditebang.', 'Hutan yang lebat menyebabkan hewan pergi.', 'Hewan-hewan menebang pohon di hutan.'], correct: 0 },
      { text: 'Apa yang terjadi jika kita terus merusak hutan?', answers: ['Udara menjadi lebih segar.', 'Banjir dan tanah longsor lebih mudah terjadi.', 'Hewan-hewan menjadi lebih senang.', 'Pohon akan tumbuh lebih cepat.'], correct: 1 },
      { text: 'Manakah kalimat yang menggunakan kata "akibatnya" dengan tepat?', answers: ['Hutan gundul akibatnya pohon ditanam kembali.', 'Penebangan liar terjadi akibatnya hutan menjadi gundul.', 'Akibatnya hutan lebat pohon ditebang.', 'Hutan menjadi gundul akibatnya hujan deras.'], correct: 1 },
      { text: 'Pohon-pohon di hutan menyerap air hujan. Apa akibatnya jika pohon ditebang semua?', answers: ['Air hujan terserap sempurna.', 'Tidak ada air hujan yang turun.', 'Air hujan tidak terserap dan menyebabkan banjir.', 'Tanah menjadi lebih subur.'], correct: 2 },
      { text: 'Bacalah: "Hutan disebut paru-paru dunia karena menghasilkan oksigen." Apa akibat dari hutan menghasilkan oksigen?', answers: ['Hutan menjadi gundul.', 'Hewan-hewan kehilangan rumah.', 'Makhluk hidup bisa bernapas dengan baik.', 'Pohon-pohon menjadi mati.'], correct: 2 }
    ]
  },
  {
    id: 2,
    title: 'Misi Batu Menangis',
    emoji: '🪨',
    caption: 'Legenda Batu Menangis',
    bgGradient: 'linear-gradient(135deg,#4a6fa5,#2c4a6e)',
    questions: [
      { text: 'Dalam legenda Batu Menangis, mengapa gadis itu berubah menjadi batu?', answers: ['Karena ia rajin membantu ibunya.', 'Karena ia selalu merasa malu dengan ibunya yang miskin dan bersikap durhaka.', 'Karena ia berdoa di gunung.', 'Karena ia tersandung batu besar.'], correct: 1 },
      { text: 'Manakah kalimat sebab-akibat yang sesuai dengan legenda Batu Menangis?', answers: ['Gadis itu berubah menjadi batu karena sikap durhakanya.', 'Ibu itu menjadi miskin karena anaknya berubah jadi batu.', 'Batu menangis karena hujan deras.', 'Gadis itu senang karena berubah menjadi batu.'], correct: 0 },
      { text: 'Apa pesan moral dari legenda Batu Menangis?', answers: ['Kita harus selalu memakai baju bagus.', 'Kita harus hormat dan sayang kepada orang tua.', 'Kita tidak boleh pergi ke pasar.', 'Kita harus tinggal di desa.'], correct: 1 },
      { text: 'Bacalah: "Karena terus menolak mengakui ibunya, gadis itu dikutuk menjadi batu." Apa penyebab kutukan?', answers: ['Gadis itu pergi ke pasar.', 'Gadis itu tidak mau mengakui ibunya sendiri.', 'Gadis itu menangis tersedu-sedu.', 'Gadis itu membantu ibunya.'], correct: 1 },
      { text: 'Mengapa batu itu disebut "Batu Menangis"?', answers: ['Karena batu itu terkena hujan.', 'Karena dari batu itu mengalir air seperti air mata sebagai penyesalan.', 'Karena batu itu berbentuk wajah manusia.', 'Karena batu itu ada di dekat sungai.'], correct: 1 }
    ]
  },
  {
    id: 3,
    title: 'Misi Malin Kundang',
    emoji: '⛰️',
    caption: 'Legenda Malin Kundang',
    bgGradient: 'linear-gradient(135deg,#8b5e3c,#5c3d24)',
    questions: [
      { text: 'Mengapa Malin Kundang dikutuk menjadi batu oleh ibunya?', answers: ['Karena Malin Kundang tidak membawa oleh-oleh.', 'Karena Malin Kundang tidak mengakui ibunya dan bersikap sombong.', 'Karena Malin Kundang terlambat pulang ke rumah.', 'Karena Malin Kundang menikah dengan putri raja.'], correct: 1 },
      { text: 'Manakah kalimat yang menunjukkan hubungan sebab-akibat dari cerita Malin Kundang?', answers: ['Malin Kundang berlayar karena ingin menjadi orang kaya.', 'Ibu Malin Kundang tinggal di pantai.', 'Malin Kundang memiliki kapal yang besar.', 'Di pantai terdapat sebuah batu.'], correct: 0 },
      { text: 'Apa akibat dari sikap durhaka Malin Kundang terhadap ibunya?', answers: ['Malin Kundang menjadi raja.', 'Malin Kundang menjadi lebih kaya.', 'Malin Kundang dikutuk ibunya dan berubah menjadi batu.', 'Malin Kundang berlayar lagi ke negeri seberang.'], correct: 2 },
      { text: 'Bacalah: "Karena kesal dan sakit hati, ibu Malin Kundang mengutuk anaknya." Apa penyebab kutukan?', answers: ['Malin Kundang memberikan harta kepada ibunya.', 'Ibu Malin Kundang sedang marah besar.', 'Malin Kundang menolak mengakui ibunya di depan istrinya.', 'Kapal Malin Kundang rusak.'], correct: 2 },
      { text: 'Pilihlah kalimat yang benar menggunakan kata "karena"!', answers: ['Malin Kundang menjadi batu karena durhaka kepada ibunya.', 'Karena batu ada di pantai Malin Kundang.', 'Malin Kundang kaya karena batu di pantai.', 'Karena kapal besar ibu Malin Kundang sedih.'], correct: 0 }
    ]
  },
  {
    id: 4,
    title: 'Misi Kerak Telor',
    emoji: '🍚',
    caption: 'Asal-usul Kerak Telor',
    bgGradient: 'linear-gradient(135deg,#c47a2a,#8b5518)',
    questions: [
      { text: 'Menurut cerita, mengapa kerak telor menjadi makanan khas Betawi?', answers: ['Karena dibeli dari pedagang asing.', 'Karena tercipta secara tidak sengaja dari sisa nasi dan telur yang dimasak bersama.', 'Karena resep dari raja Mataram.', 'Karena ditemukan di dalam gua.'], correct: 1 },
      { text: 'Manakah hubungan sebab-akibat yang benar tentang kerak telor?', answers: ['Karena dimasak dengan kelapa parut, kerak telor menjadi gurih dan renyah.', 'Karena kerak telor enak, nasi menjadi sisa.', 'Telur pecah karena kerak telor.', 'Kelapa parut karena kerak telor.'], correct: 0 },
      { text: 'Apa akibat jika kerak telor dimasak dengan api yang terlalu besar?', answers: ['Kerak telor menjadi lebih empuk.', 'Kerak telor akan gosong dan terasa pahit.', 'Kerak telor menjadi lebih manis.', 'Kerak telor berubah warna menjadi hijau.'], correct: 1 },
      { text: 'Bacalah: "Karena bahan-bahannya sederhana, kerak telor bisa dibuat oleh semua orang." Apa sebabnya?', answers: ['Kerak telor enak rasanya.', 'Bahan-bahan kerak telor sederhana dan mudah didapat.', 'Semua orang suka kerak telor.', 'Kerak telor dijual di pasar.'], correct: 1 },
      { text: 'Pilihlah kalimat sebab-akibat yang tepat!', answers: ['Kerak telor dibalik karena sudah matang.', 'Karena sudah matang, kerak telor dibakar.', 'Kerak telor sudah matang karena dibalik.', 'Dibalik karena kerak telor enak.'], correct: 0 }
    ]
  }
];

// ============ DRAG & DROP DATA ============
const dragDropData = {
  items: [
    { id: 'dd1', text: 'Hujan deras turun terus-menerus', type: 'sebab' },
    { id: 'dd2', text: 'Banjir melanda permukiman warga', type: 'akibat' },
    { id: 'dd3', text: 'Warga menebang pohon di hutan', type: 'sebab' },
    { id: 'dd4', text: 'Tanah longsor terjadi di lereng', type: 'akibat' },
    { id: 'dd5', text: 'Selokan tersumbat sampah plastik', type: 'sebab' },
    { id: 'dd6', text: 'Air mengalir ke jalan dan rumah', type: 'akibat' },
    { id: 'dd7', text: 'Petani menanam pohon di lahan gundul', type: 'sebab' },
    { id: 'dd8', text: 'Tanah menjadi subur dan tidak longsor', type: 'akibat' }
  ]
};

// ============ DOM REFERENCES ============
const pages = {
  login: document.getElementById('page-login'),
  home: document.getElementById('page-home'),
  quiz: document.getElementById('page-quiz'),
  dragdrop: document.getElementById('page-dragdrop'),
  result: document.getElementById('page-result')
};

// ==========================================
// API FUNCTIONS
// ==========================================

async function apiLogin(name) {
  const res = await fetch(`${API_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login gagal.');
  return data;
}

async function apiGetUser(userId) {
  const res = await fetch(`${API_URL}/api/users/${userId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Gagal memuat data.');
  return data;
}

async function apiSaveProgress(userId, missionId, score, stars) {
  const res = await fetch(`${API_URL}/api/progress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, mission_id: missionId, score, stars })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Gagal menyimpan progress.');
  return data;
}

// ==========================================
// PAGE NAVIGATION
// ==========================================

function showPage(pageName) {
  Object.values(pages).forEach(p => p.classList.remove('active'));
  pages[pageName].classList.add('active');
  state.currentPage = pageName;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// LOGIN
// ==========================================

async function handleLogin(event) {
  event.preventDefault();

  const nameInput = document.getElementById('login-name');
  const errorDiv = document.getElementById('login-error');
  const submitBtn = document.getElementById('btn-login-submit');
  const textSpan = submitBtn.querySelector('.btn-login-text');
  const loadingDiv = submitBtn.querySelector('.btn-login-loading');

  errorDiv.classList.remove('show');
  errorDiv.textContent = '';

  const name = nameInput.value.trim();

  if (!name) {
    errorDiv.textContent = 'Nama harus diisi!';
    errorDiv.classList.add('show');
    return;
  }

  // Show loading
  textSpan.style.display = 'none';
  loadingDiv.style.display = 'flex';
  submitBtn.disabled = true;

  try {
    const data = await apiLogin(name);

    state.currentUser = data.user;
    state.missionProgress = {};

    // Load progress from server
    try {
      const userData = await apiGetUser(data.user.id);
      if (userData.progress) {
        userData.progress.forEach(p => {
          state.missionProgress[p.mission_id] = { score: p.score, stars: p.stars };
        });
      }
    } catch (e) {
      console.warn('Could not load progress:', e);
    }

    // Update UI
    updateUserDisplay();
    updateMissionStars();

    // Navigate to home
    showPage('home');

    if (data.isNew) {
      showToast(`Selamat datang, ${data.user.name}! 🎉`, 'success');
    } else {
      showToast(`Halo ${data.user.name}! Selamat bermain! 👋`, 'info');
    }

  } catch (error) {
    errorDiv.textContent = error.message;
    errorDiv.classList.add('show');
  } finally {
    textSpan.style.display = 'inline';
    loadingDiv.style.display = 'none';
    submitBtn.disabled = false;
  }
}

function handleLogout() {
  state.currentUser = null;
  state.missionProgress = {};
  state.missionsRevealed = false;

  // Reset missions section
  const missionsSection = document.getElementById('missions-section');
  missionsSection.classList.remove('visible');
  const heroArea = document.getElementById('hero-area');
  heroArea.classList.remove('hidden');

  // Clear form
  document.getElementById('login-name').value = '';

  showPage('login');
  showToast('Berhasil keluar. Sampai jumpa! 👋', 'info');
}

function updateUserDisplay() {
  if (!state.currentUser) return;

  const nameDisplay = document.getElementById('user-name-display');
  nameDisplay.textContent = state.currentUser.name;

  // Update profile popup
  document.getElementById('profile-name').textContent = state.currentUser.name;
  document.getElementById('profile-class').textContent = state.currentUser.class ? `Kelas ${state.currentUser.class}` : 'Detektif Nusantara';
  document.getElementById('stat-missions').textContent = state.currentUser.total_missions || 0;
  document.getElementById('stat-score').textContent = state.currentUser.total_score || 0;
  document.getElementById('stat-stars').textContent = state.currentUser.total_stars || 0;
}

function updateMissionStars() {
  for (let m = 0; m < missions.length; m++) {
    const progress = state.missionProgress[m];
    if (progress && progress.stars > 0) {
      for (let s = 0; s < progress.stars; s++) {
        const starEl = document.getElementById(`mc-s${m}-${s}`);
        if (starEl) {
          starEl.textContent = '★';
          starEl.classList.add('earned');
        }
      }
    }
  }
}

// ==========================================
// HOME / MISSIONS
// ==========================================

function startAdventure() {
  if (!state.missionsRevealed) {
    state.missionsRevealed = true;

    const heroArea = document.getElementById('hero-area');
    const missionsSection = document.getElementById('missions-section');

    heroArea.classList.add('hidden');
    missionsSection.classList.add('visible');
  }
}

function goHomeFromMissions() {
  state.missionsRevealed = false;

  const heroArea = document.getElementById('hero-area');
  const missionsSection = document.getElementById('missions-section');

  heroArea.classList.remove('hidden');
  missionsSection.classList.remove('visible');
}

function goHome() {
  resetQuiz();
  resetDragDrop();
  state.missionsRevealed = false;

  const heroArea = document.getElementById('hero-area');
  const missionsSection = document.getElementById('missions-section');

  heroArea.classList.remove('hidden');
  missionsSection.classList.remove('visible');

  updateUserDisplay();
  updateMissionStars();

  showPage('home');
}

// ==========================================
// SELECT MISSION
// ==========================================

function selectMission(missionIndex) {
  state.currentMission = missionIndex;
  state.currentQuestion = 0;
  state.score = 0;
  state.answers = [];
  loadQuiz();
  showPage('quiz');
}

// ==========================================
// QUIZ
// ==========================================

function loadQuiz() {
  const mission = missions[state.currentMission];

  document.getElementById('quiz-title').textContent = mission.title;
  document.getElementById('poster-emoji').textContent = mission.emoji;
  document.getElementById('poster-caption').textContent = mission.caption;
  document.getElementById('poster-frame').style.background = mission.bgGradient;
  document.getElementById('question-total').textContent = mission.questions.length;
  document.getElementById('score-value').textContent = '0';

  loadQuestion();
  updateProgress();
}

function loadQuestion() {
  const mission = missions[state.currentMission];
  const question = mission.questions[state.currentQuestion];

  document.getElementById('question-text').textContent = question.text;
  document.getElementById('question-current').textContent = state.currentQuestion + 1;

  const grid = document.getElementById('answers-grid');
  grid.innerHTML = '';

  const letters = ['A', 'B', 'C', 'D'];

  question.answers.forEach((answer, index) => {
    const card = document.createElement('div');
    card.className = 'answer-card slide-up';
    card.style.animationDelay = `${index * 0.1}s`;
    card.dataset.index = index;

    if (state.answers[state.currentQuestion] !== undefined) {
      const selectedAnswer = state.answers[state.currentQuestion];
      if (selectedAnswer === question.correct) {
        card.classList.add('correct');
      } else if (index === selectedAnswer) {
        card.classList.add('wrong');
      }
      card.classList.add('disabled');
    }

    card.innerHTML = `
      <span class="answer-letter">${letters[index]}</span>
      <span class="answer-text">${answer}</span>
    `;

    if (state.answers[state.currentQuestion] === undefined) {
      card.addEventListener('click', () => selectAnswer(index));
    }

    grid.appendChild(card);
  });

  document.getElementById('btn-prev').disabled = state.currentQuestion === 0;

  const isLast = state.currentQuestion === mission.questions.length - 1;
  document.getElementById('btn-next').textContent = isLast ? 'Selesai 🏆' : 'Selanjutnya →';

  updateProgress();
}

function selectAnswer(index) {
  const mission = missions[state.currentMission];
  const question = mission.questions[state.currentQuestion];

  if (state.answers[state.currentQuestion] !== undefined) return;

  state.answers[state.currentQuestion] = index;

  const cards = document.querySelectorAll('.answer-card');

  if (index === question.correct) {
    cards[index].classList.add('correct');
    state.score += 20;
    document.getElementById('score-value').textContent = state.score;
    showFeedback(true);
  } else {
    cards[index].classList.add('wrong');
    cards[question.correct].classList.add('correct');
    showFeedback(false);
  }

  cards.forEach(c => c.classList.add('disabled'));
}

function showFeedback(isCorrect) {
  const popup = document.getElementById('popup-feedback');
  const emoji = document.getElementById('feedback-emoji');
  const title = document.getElementById('feedback-title');
  const text = document.getElementById('feedback-text');

  if (isCorrect) {
    emoji.textContent = '🎉';
    title.textContent = 'Benar!';
    title.style.color = 'var(--green)';
    text.textContent = 'Jawaban kamu tepat sekali! +20 poin ⭐';
  } else {
    emoji.textContent = '😅';
    title.textContent = 'Oops, kurang tepat!';
    title.style.color = 'var(--red)';
    text.textContent = 'Jangan menyerah! Coba lagi di pertanyaan berikutnya.';
  }

  popup.classList.add('active');
}

function nextQuestion() {
  const mission = missions[state.currentMission];

  if (state.currentQuestion < mission.questions.length - 1) {
    state.currentQuestion++;
    loadQuestion();
  } else {
    finishMission();
  }
}

function prevQuestion() {
  if (state.currentQuestion > 0) {
    state.currentQuestion--;
    loadQuestion();
  }
}

function updateProgress() {
  const mission = missions[state.currentMission];
  const progress = ((state.currentQuestion + 1) / mission.questions.length) * 100;
  document.getElementById('progress-fill').style.width = `${progress}%`;
}

function resetQuiz() {
  state.currentQuestion = 0;
  state.answers = [];
  state.score = 0;
  document.getElementById('score-value').textContent = '0';
}

// ==========================================
// FINISH MISSION
// ==========================================

async function finishMission() {
  const maxScore = missions[state.currentMission].questions.length * 20;
  const percentage = (state.score / maxScore) * 100;

  let stars = 0;
  if (percentage >= 80) stars = 3;
  else if (percentage >= 50) stars = 2;
  else if (percentage >= 20) stars = 1;

  // Save to database
  if (state.currentUser) {
    try {
      const result = await apiSaveProgress(
        state.currentUser.id,
        state.currentMission,
        state.score,
        stars
      );

      // Update local state with server data
      if (result.user) {
        state.currentUser.total_missions = result.user.total_missions;
        state.currentUser.total_stars = result.user.total_stars;
        state.currentUser.total_score = result.user.total_score;
      }

      state.missionProgress[state.currentMission] = {
        score: state.score,
        stars: stars
      };

    } catch (error) {
      console.error('Failed to save progress:', error);
      showToast('Gagal menyimpan progress. Coba lagi nanti.', 'error');
    }
  }

  showResult(stars);
}

function showResult(stars) {
  document.getElementById('result-score').textContent = state.score;

  for (let i = 1; i <= 3; i++) {
    const star = document.getElementById(`rs${i}`);
    star.classList.remove('earned');
    if (i <= stars) {
      setTimeout(() => {
        star.classList.add('earned');
        star.querySelector('.star-inner').textContent = '★';
      }, i * 300);
    } else {
      star.querySelector('.star-inner').textContent = '☆';
    }
  }

  const msg = document.getElementById('result-message');
  if (stars === 3) {
    msg.textContent = '🌟 Sempurna! Kamu Detektif Handal!';
  } else if (stars === 2) {
    msg.textContent = '👏 Bagus! Hampir sempurna!';
  } else if (stars === 1) {
    msg.textContent = '💪 Lumayan! Terus berlatih!';
  } else {
    msg.textContent = '📖 Jangan menyerah! Coba lagi ya!';
  }

  showPage('result');
  startConfetti();
  startFloatingStars();
}

// ==========================================
// CONFETTI
// ==========================================

function startConfetti() {
  const container = document.getElementById('confetti-container');
  container.innerHTML = '';

  const colors = ['#f2994a', '#ff8c42', '#f1c40f', '#27ae60', '#e74c3c', '#3498db', '#9b59b6'];
  const shapes = ['square', 'circle'];

  for (let i = 0; i < 80; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.width = `${Math.random() * 10 + 5}px`;
    confetti.style.height = confetti.style.width;
    confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
    confetti.style.animationDelay = `${Math.random() * 2}s`;

    if (shapes[Math.floor(Math.random() * shapes.length)] === 'circle') {
      confetti.style.borderRadius = '50%';
    }

    container.appendChild(confetti);
  }

  setTimeout(() => { container.innerHTML = ''; }, 6000);
}

function startFloatingStars() {
  const container = document.getElementById('floating-stars');
  container.innerHTML = '';

  const starEmojis = ['⭐', '🌟', '✨', '💫'];

  for (let i = 0; i < 15; i++) {
    const star = document.createElement('div');
    star.className = 'floating-star-item';
    star.textContent = starEmojis[Math.floor(Math.random() * starEmojis.length)];
    star.style.left = `${Math.random() * 100}%`;
    star.style.animationDuration = `${Math.random() * 3 + 2}s`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    star.style.fontSize = `${Math.random() * 20 + 16}px`;

    container.appendChild(star);
  }

  setTimeout(() => { container.innerHTML = ''; }, 7000);
}

// ==========================================
// RETRY & REVIEW
// ==========================================

function retryMission() {
  state.score = 0;
  state.currentQuestion = 0;
  state.answers = [];
  document.getElementById('score-value').textContent = '0';
  loadQuiz();
  showPage('quiz');
}

function reviewMission() {
  state.currentQuestion = 0;
  loadQuiz();
  showPage('quiz');
}

// ==========================================
// DRAG & DROP
// ==========================================
let draggedElement = null;
let dragScore = 0;

function initDragDrop() {
  const source = document.getElementById('dd-source');
  source.innerHTML = '';

  const shuffled = [...dragDropData.items].sort(() => Math.random() - 0.5);

  shuffled.forEach(item => {
    const card = document.createElement('div');
    card.className = 'drag-card';
    card.draggable = true;
    card.dataset.id = item.id;
    card.dataset.type = item.type;
    card.textContent = item.text;

    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);

    card.addEventListener('touchstart', handleTouchStart, { passive: false });
    card.addEventListener('touchmove', handleTouchMove, { passive: false });
    card.addEventListener('touchend', handleTouchEnd, { passive: false });

    source.appendChild(card);
  });

  ['drop-sebab', 'drop-akibat'].forEach(zoneId => {
    const zone = document.getElementById(zoneId);
    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.parentElement.querySelector('.zone-drop-area')?.classList.add('drag-over');
      zone.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', () => { zone.classList.remove('drag-over'); });
    zone.addEventListener('drop', handleDrop);
  });
}

function handleDragStart(e) {
  draggedElement = e.target.closest('.drag-card');
  draggedElement.classList.add('dragging');
  e.dataTransfer.setData('text/plain', draggedElement.dataset.id);
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
  if (draggedElement) draggedElement.classList.remove('dragging');
  document.querySelectorAll('.zone-drop-area').forEach(z => z.classList.remove('drag-over'));
}

function handleDrop(e) {
  e.preventDefault();
  const zone = e.target.closest('.zone-drop-area');
  if (!zone) return;

  zone.classList.remove('drag-over');

  if (draggedElement) {
    if (draggedElement.classList.contains('placed')) {
      const prevParent = draggedElement.parentElement;
      if (prevParent.classList.contains('zone-drop-area')) checkPlaceholder(prevParent);
    }
    zone.appendChild(draggedElement);
    draggedElement.classList.add('placed');
    draggedElement.classList.remove('dragging');
    checkPlaceholder(zone);
    draggedElement = null;
  }
}

let touchClone = null;

function handleTouchStart(e) {
  e.preventDefault();
  draggedElement = e.target.closest('.drag-card');
  touchClone = draggedElement.cloneNode(true);
  touchClone.style.position = 'fixed';
  touchClone.style.zIndex = '9999';
  touchClone.style.pointerEvents = 'none';
  touchClone.style.opacity = '0.8';
  touchClone.style.transform = 'scale(1.05)';
  touchClone.style.width = draggedElement.offsetWidth + 'px';
  document.body.appendChild(touchClone);
  draggedElement.style.opacity = '0.3';
}

function handleTouchMove(e) {
  e.preventDefault();
  if (!touchClone) return;
  const touch = e.touches[0];
  touchClone.style.left = (touch.clientX - 100) + 'px';
  touchClone.style.top = (touch.clientY - 25) + 'px';

  document.querySelectorAll('.zone-drop-area').forEach(zone => {
    const rect = zone.getBoundingClientRect();
    if (touch.clientX >= rect.left && touch.clientX <= rect.right && touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
      zone.classList.add('drag-over');
    } else {
      zone.classList.remove('drag-over');
    }
  });
}

function handleTouchEnd(e) {
  e.preventDefault();
  if (!touchClone || !draggedElement) return;
  const touch = e.changedTouches[0];

  let dropped = false;
  document.querySelectorAll('.zone-drop-area').forEach(zone => {
    zone.classList.remove('drag-over');
    const rect = zone.getBoundingClientRect();
    if (touch.clientX >= rect.left && touch.clientX <= rect.right && touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
      if (draggedElement.classList.contains('placed')) {
        const prevParent = draggedElement.parentElement;
        if (prevParent.classList.contains('zone-drop-area')) checkPlaceholder(prevParent);
      }
      zone.appendChild(draggedElement);
      draggedElement.classList.add('placed');
      draggedElement.style.opacity = '1';
      checkPlaceholder(zone);
      dropped = true;
    }
  });

  if (!dropped) draggedElement.style.opacity = '1';
  document.body.removeChild(touchClone);
  touchClone = null;
  draggedElement = null;
}

function checkPlaceholder(zone) {
  const placeholder = zone.querySelector('.zone-placeholder');
  if (zone.querySelectorAll('.drag-card').length > 0 && placeholder) {
    placeholder.style.display = 'none';
  } else if (placeholder) {
    placeholder.style.display = 'block';
  }
}

function checkDragDrop() {
  const causeZone = document.getElementById('drop-sebab');
  const effectZone = document.getElementById('drop-akibat');

  const causeCards = causeZone.querySelectorAll('.drag-card');
  const effectCards = effectZone.querySelectorAll('.drag-card');

  let correct = 0;
  const total = dragDropData.items.length;

  causeCards.forEach(card => { if (card.dataset.type === 'sebab') correct++; });
  effectCards.forEach(card => { if (card.dataset.type === 'akibat') correct++; });

  const popup = document.getElementById('popup-dd-result');
  const emoji = document.getElementById('dd-feedback-emoji');
  const title = document.getElementById('dd-feedback-title');
  const text = document.getElementById('dd-feedback-text');

  if (correct === total) {
    emoji.textContent = '🎉';
    title.textContent = 'Hebat!';
    title.style.color = 'var(--green)';
    text.textContent = `Jawaban kamu benar semua! +${correct * 10} poin ⭐`;
    dragScore = correct * 10;
    state.score += dragScore;
    document.getElementById('dd-score').textContent = state.score;
  } else {
    emoji.textContent = '😅';
    title.textContent = 'Yuk coba lagi!';
    title.style.color = 'var(--orange)';
    text.textContent = `Kamu benar ${correct} dari ${total}. Tarik kartu ke kolom yang tepat!`;
  }

  popup.classList.add('active');
}

function resetDragDrop() {
  dragScore = 0;
  document.getElementById('dd-score').textContent = '0';
  initDragDrop();
}

// ==========================================
// POPUPS
// ==========================================

function showHelpPopup() {
  document.getElementById('popup-help').classList.add('active');
}

function showProfilePopup() {
  updateUserDisplay();
  document.getElementById('popup-profile').classList.add('active');
}

function closePopup(popupId) {
  document.getElementById(popupId).classList.remove('active');
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('popup-overlay')) {
    e.target.classList.remove('active');
  }
});

// ==========================================
// SOUND / MUSIC
// ==========================================

function toggleSound() {
  state.soundOn = !state.soundOn;
  document.getElementById('icon-sound-on').style.display = state.soundOn ? 'block' : 'none';
  document.getElementById('icon-sound-off').style.display = state.soundOn ? 'none' : 'block';
}

function toggleMusic() {
  state.musicOn = !state.musicOn;
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, 3000);
}

// ==========================================
// BACKGROUND EFFECTS
// ==========================================

function createStarField() {
  const starField = document.getElementById('star-field');
  if (!starField) return;
  starField.innerHTML = '';

  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    star.className = 'star-dot';

    const rand = Math.random();
    if (rand < 0.15) star.classList.add('large');
    else if (rand < 0.5) star.classList.add('small');

    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty('--dur', `${Math.random() * 3 + 2}s`);
    star.style.setProperty('--delay', `${Math.random() * 5}s`);

    starField.appendChild(star);
  }
}

function createFloatingParticles() {
  const container = document.getElementById('floating-particles');
  if (!container) return;
  container.innerHTML = '';

  const colors = ['orange', 'gold', 'white'];

  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div');
    particle.className = `particle ${colors[Math.floor(Math.random() * colors.length)]}`;

    const size = Math.random() * 6 + 3;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.setProperty('--dur', `${Math.random() * 10 + 8}s`);
    particle.style.setProperty('--delay', `${Math.random() * 8}s`);
    particle.style.setProperty('--max-opacity', `${Math.random() * 0.4 + 0.2}`);

    container.appendChild(particle);
  }
}

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  createStarField();
  createFloatingParticles();
  initDragDrop();

  document.querySelectorAll('button, .mission-card, .answer-card').forEach(el => {
    el.addEventListener('click', function() {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => { this.style.transform = ''; }, 150);
    });
  });
});
