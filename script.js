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
  musicOn: false,
  missionsRevealed: false,
  missionProgress: {},
  startingMission: null,
  missionsCompleted: new Set()
};

// ============ MISSION DATA ============
const missions = [
  {
    id: 0,
    title: 'Misi Banjir',
    image: 'sebab_akibat_banjir.jpeg',
    caption: 'Banjir di Kota',
    bgGradient: 'linear-gradient(135deg,#1a6b4a,#0d3d2a)',
    questions: [
      { text: 'Berdasarkan isi poster tersebut, yang merupakan pernyataan sebab-akibat yang benar adalah...', answers: ['Karena curah hujan yang tinggi, rumah dan bangunan menjadi rusak terendam air', 'Lokasi dataran rendah mengakibatkan timbul penyakit', 'Transportasi macet karena sampah', 'Gangguan transportasi dikarenakan timbulnya penyakit'], correct: 0 }
    ]
  },
  {
    id: 1,
    title: 'Misi Hutan',
    image: 'hutan-kebakaran.jpeg',
    caption: 'Hutan Tropis',
    bgGradient: 'linear-gradient(135deg,#2d8a4e,#1a5c30)',
    questions: [
      { text: 'Perhatikan pernyataan-pernyataan berikut!<br>1. Hutan ditebangi secara liar dan tidak terkendali.<br>2. Banyak hewan kehilangan habitat alaminya.<br>3. Tanah menjadi mudah longsor.<br>4. Pelestarian hutan adalah tanggung jawab bersama.<br>Kalimat yang merupakan sebab ditunjukkan oleh nomor ....', answers: ['1 dan 3', '2 dan 3', '1', '4'], correct: 2 }
    ]
  },
  {
    id: 2,
    title: 'Misi Batu Menangis',
    image: 'batu_menangis.png',
    caption: 'Legenda Batu Menangis',
    bgGradient: 'linear-gradient(135deg,#4a6fa5,#2c4a6e)',
    questions: [
      { text: 'Seorang gadis cantik bernama Darmi yang durhaka terhadap ibunya. Darmi sombong, manja, dan enggan membantu ibunya yang bekerja keras. Karena sakit hati, ibunya berdoa kepada Tuhan, dan Darmi berubah menjadi batu sambil terus menangis. Batu itu dikenal sebagai Batu Menangis.<br><br>Dari cerita tersebut, pernyataan kalimat sebab-akibat yang benar ialah...', answers: ['Darmi sombong, manja, dan enggan membantu ibunya yang bekerja keras.', 'Karena sakit hati, ibunya berdoa kepada Tuhan', 'Seorang gadis cantik bernama Darmi yang durhaka terhadap ibunya.', 'Karena sakit hati, ibunya berdoa kepada Tuhan, dan Darmi berubah menjadi batu sambil terus menangis.'], correct: 3 }
    ]
  },
  {
    id: 3,
    title: 'Misi Malin Kundang',
    image: 'malin_kundang.png',
    caption: 'Legenda Malin Kundang',
    bgGradient: 'linear-gradient(135deg,#8b5e3c,#5c3d24)',
    questions: [
      { text: '(1) Setelah bertahun-tahun, Malin Kundang kembali ke kampung halamannya dengan kapal megah.<br>(2) Ibunya yang sudah tua berlari untuk menyambutnya.<br>(3) Malin tidak mau mengakuinya dan mengusirnya karena merasa malu memiliki ibu yang miskin.<br>(4) Ibunya sangat sedih dan kecewa, sehingga ia berdoa kepada Tuhan agar Malin Kundang mendapat balasan atas perbuatannya.<br>Kalimat yang mengandung sebab akibat adalah nomor ....', answers: ['1 dan 2', '2 dan 3', '3 dan 4', '1 dan 4'], correct: 2 }
    ]
  },
  {
    id: 4,
    title: 'Misi Kerak Telor',
    image: 'kerak_telur.png',
    caption: 'Kerak Telor, Kuliner Khas Betawi',
    bgGradient: 'linear-gradient(135deg,#c47a2a,#8b5518)',
    questions: [
      { text: '(1) Kerak telor adalah makanan tradisional Betawi yang terbuat dari beras ketan, telur, dan serundeng.<br>(2) Proses memasaknya yang masih menggunakan arang, sehingga kerak telor memiliki cita rasa yang khas dan unik.<br>(3) Selain itu, banyak orang yang menantikannya setiap tahun karena kuliner ini mudah ditemukan saat acara besar seperti Pekan Raya Jakarta.<br>Kalimat yang mengandung sebab - akibat adalah nomor ....', answers: ['1 dan 2', '2 saja', '2 dan 3', '1 saja'], correct: 2 }
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

async function apiLogin(name, userClass) {
  const res = await fetch(`${API_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, class: userClass })
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
  const classInput = document.getElementById('login-class');
  const errorDiv = document.getElementById('login-error');
  const submitBtn = document.getElementById('btn-login-submit');
  const textSpan = submitBtn.querySelector('.btn-login-text');
  const loadingDiv = submitBtn.querySelector('.btn-login-loading');

  errorDiv.classList.remove('show');
  errorDiv.textContent = '';

  const name = nameInput.value.trim();
  const userClass = classInput.value.trim();

  if (!name) {
    errorDiv.textContent = 'Nama lengkap harus diisi!';
    errorDiv.classList.add('show');
    return;
  }

  if (!userClass) {
    errorDiv.textContent = 'Kelas harus diisi!';
    errorDiv.classList.add('show');
    return;
  }

  // Show loading
  textSpan.style.display = 'none';
  loadingDiv.style.display = 'flex';
  submitBtn.disabled = true;

  try {
    const data = await apiLogin(name, userClass);

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

    // Start background music
    startBackgroundMusic();

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
  const audio = document.getElementById('bg-music');
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  state.musicOn = false;
  document.getElementById('btn-music').classList.remove('active');

  state.currentUser = null;
  state.missionProgress = {};
  state.missionsRevealed = false;
  state.startingMission = null;
  state.missionsCompleted = new Set();

  const missionsSection = document.getElementById('missions-section');
  missionsSection.classList.remove('visible');
  const heroArea = document.getElementById('hero-area');
  heroArea.classList.remove('hidden');

  document.getElementById('login-name').value = '';
  document.getElementById('login-class').value = '';

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

function toggleSidebar(show) {
  const sidebar = document.getElementById('sidebar-menu');
  if (sidebar) {
    if (show) {
      sidebar.classList.remove('hidden');
    } else {
      sidebar.classList.add('hidden');
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
    toggleSidebar(false);
  }
}

function goHomeFromMissions() {
  state.missionsRevealed = false;
  state.startingMission = null;
  state.missionsCompleted = new Set();

  const heroArea = document.getElementById('hero-area');
  const missionsSection = document.getElementById('missions-section');

  heroArea.classList.remove('hidden');
  missionsSection.classList.remove('visible');
  toggleSidebar(true);
}

function goHome() {
  resetQuiz();
  resetDragDrop();
  hideFinalScore();
  state.missionsRevealed = false;
  state.startingMission = null;
  state.missionsCompleted = new Set();

  const heroArea = document.getElementById('hero-area');
  const missionsSection = document.getElementById('missions-section');

  heroArea.classList.remove('hidden');
  missionsSection.classList.remove('visible');
  toggleSidebar(true);

  updateUserDisplay();
  updateMissionStars();

  showPage('home');
}

// ==========================================
// SELECT MISSION
// ==========================================

function selectMission(missionIndex) {
  if (state.startingMission === null) {
    state.startingMission = missionIndex;
  }
  state.missionsCompleted.add(missionIndex);
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
  document.getElementById('poster-image').src = mission.image;
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
  hideFinalScore();
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

  const nextMissionIndex = (state.currentMission + 1) % missions.length;
  const isLastInCycle = (nextMissionIndex === state.startingMission);
  document.getElementById('btn-next-mission').style.display = isLastInCycle ? 'none' : 'inline-block';

  toggleSidebar(false);
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

function nextMission() {
  const nextIndex = (state.currentMission + 1) % missions.length;
  if (nextIndex === state.startingMission) {
    showFinalScore();
  } else {
    state.currentMission = nextIndex;
    state.currentQuestion = 0;
    state.score = 0;
    state.answers = [];
    document.getElementById('score-value').textContent = '0';
    hideFinalScore();
    loadQuiz();
    showPage('quiz');
  }
}

function showFinalScore() {
  let totalScore = 0;
  let totalMissions = 0;
  let totalStars = 0;

  for (let m = 0; m < missions.length; m++) {
    const progress = state.missionProgress[m];
    if (progress) {
      totalScore += progress.score;
      totalMissions++;
      totalStars += progress.stars;
    }
  }

  document.getElementById('final-total-score').textContent = totalScore;
  document.getElementById('final-missions').textContent = totalMissions;
  document.getElementById('final-stars').textContent = totalStars;
  document.getElementById('final-score-overlay').classList.add('active');
  startConfetti();
  startFloatingStars();
}

function hideFinalScore() {
  document.getElementById('final-score-overlay').classList.remove('active');
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

function showScorePopup() {
  updateUserDisplay();
  document.getElementById('popup-profile').classList.add('active');
}

function showDeveloperPopup() {
  document.getElementById('popup-developer').classList.add('active');
}

function showObjectivesPopup() {
  document.getElementById('popup-objectives').classList.add('active');
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

const musicFiles = ['lagu/lagu1.mp3', 'lagu/lagu2.mp3', 'lagu/lagu3.mp3', 'lagu/lagu4.mp3'];
let currentMusicIndex = 0;

function toggleSound() {
  state.soundOn = !state.soundOn;
  document.getElementById('icon-sound-on').style.display = state.soundOn ? 'block' : 'none';
  document.getElementById('icon-sound-off').style.display = state.soundOn ? 'none' : 'block';

  const audio = document.getElementById('bg-music');
  if (audio) {
    audio.muted = !state.soundOn;
  }
}

function toggleMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  currentMusicIndex = (currentMusicIndex + 1) % musicFiles.length;
  audio.src = musicFiles[currentMusicIndex];
  audio.muted = !state.soundOn;

  audio.play().catch(() => {});
  state.musicOn = true;

  document.getElementById('btn-music').classList.add('active');
}

function startBackgroundMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio || state.musicOn) return;

  audio.src = musicFiles[currentMusicIndex];
  audio.muted = !state.soundOn;
  audio.play().catch(() => {});
  state.musicOn = true;
  document.getElementById('btn-music').classList.add('active');
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

  document.addEventListener('click', function startOnInteraction() {
    if (state.musicOn) return;
    startBackgroundMusic();
    document.removeEventListener('click', startOnInteraction);
  }, { once: true });
});
