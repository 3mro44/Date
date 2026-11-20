// Preloader Logic
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hide');
    }, 1650);
  }
});

// Elements
const mainCard = document.getElementById('mainCard');
const progressFill = document.getElementById('progressFill');
const dodgeBadge = document.getElementById('dodgeBadge');
const askSubtitle = document.getElementById('askSubtitle');
const flowerWrap = document.getElementById('flowerWrap');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

const screen1 = document.getElementById('screen1');
const screen2 = document.getElementById('screen2');
const screen3 = document.getElementById('screen3');
const screen4 = document.getElementById('screen4');

const toPlanBtn = document.getElementById('toPlanBtn');
const todayDisplay = document.getElementById('todayDisplay');
const timeChips = document.querySelectorAll('.time-chip');
const planChips = document.querySelectorAll('.plan-chip');
const customNoteInput = document.getElementById('customNote');
const sealBtn = document.getElementById('sealBtn');

const summaryDate = document.getElementById('summaryDate');
const summaryTime = document.getElementById('summaryTime');
const summaryPlan = document.getElementById('summaryPlan');
const letterDetails = document.getElementById('letterDetails');
const letterNote = document.getElementById('letterNote');
const whatsappBtn = document.getElementById('whatsappBtn');
const shareBtn = document.getElementById('shareBtn');
const toast = document.getElementById('toast');
const themeDots = document.querySelectorAll('.theme-dot');

// Optional: Put your phone number here with country code (e.g. "201012345678")
// Leave empty "" to let her pick your chat from WhatsApp directly
const MY_WHATSAPP_NUMBER = "";

// State
let dodgeCount = 0;
let selectedTime = '';
let selectedPlan = '';
let selectedEmoji = '';

// Theme Switcher
themeDots.forEach(dot => {
  dot.addEventListener('click', () => {
    themeDots.forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
    document.body.setAttribute('data-theme', dot.dataset.setTheme);
  });
});

// Lock Date to Today
const todayObj = new Date();
const formattedToday = todayObj.toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'short',
  day: 'numeric'
});
todayDisplay.textContent = `Today (${formattedToday})`;

const subtitles = [
  "Catch No if you can.",
  "حاولي تاني مش هتلحقيه 😄",
  "أسرع منك!",
  "الزرار بيستخبى...",
  "مكسوف منك...",
  "دوسي YES وريحي نفسك ♥"
];

const noTexts = [
  "No",
  "مش مشكله جربي تاني",
  "استني فكري",
  "يعني موحتشكيش",
  "طيب انتي وحشتينيي...",
  "يلاااا",
  "مفيش مفر هننزل يعني هننزل"
];

function dodgeNoButton() {
  dodgeCount++;

  dodgeBadge.textContent = `${dodgeCount} ${dodgeCount === 1 ? 'dodge' : 'dodges'}`;
  dodgeBadge.classList.add('visible');

  askSubtitle.textContent = subtitles[Math.min(dodgeCount, subtitles.length - 1)];
  noBtn.textContent = noTexts[dodgeCount % noTexts.length];

  const shrinkScale = Math.max(0.62, 1 - dodgeCount * 0.045);
  const yesScale = Math.min(1.15, 1 + dodgeCount * 0.02);
  yesBtn.style.transform = `scale(${yesScale})`;

  // Subtle bloom effect on flower
  const flowerScale = Math.min(1.15, 1 + dodgeCount * 0.018);
  flowerWrap.style.transform = `scale(${flowerScale})`;

  // Safe bounds inside card for mobile & desktop
  const cardRect = mainCard.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();
  const horizontalMargin = Math.max(24, (btnRect.width * shrinkScale) / 2 + 12);
  const maxOffsetX = Math.max(20, (cardRect.width / 2) - horizontalMargin);
  const maxOffsetY = Math.min(85, Math.max(35, cardRect.height * 0.16));

  const randomX = (Math.random() * 2 - 1) * maxOffsetX;
  const randomY = -(Math.random() * maxOffsetY);

  noBtn.style.transform = `translate(${randomX}px, ${randomY}px) scale(${shrinkScale})`;
}

noBtn.addEventListener('mouseenter', dodgeNoButton);
noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  dodgeNoButton();
});
noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  dodgeNoButton();
});

function showScreen(screenToShow, stepPercent) {
  [screen1, screen2, screen3, screen4].forEach(s => s.classList.remove('active'));
  screenToShow.classList.add('active');
  progressFill.style.width = stepPercent + '%';
}

function launchCelebration() {
  const items = ['❤️', '💖', '🌸', '✨', '💛', '🥰'];
  for (let i = 0; i < 45; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.textContent = items[Math.floor(Math.random() * items.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = (14 + Math.random() * 14) + 'px';
    el.style.animationDuration = (2.2 + Math.random() * 2.5) + 's';
    el.style.animationDelay = (Math.random() * 0.6) + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }
}

yesBtn.addEventListener('click', () => {
  dodgeBadge.classList.remove('visible');
  showScreen(screen2, 50);
  launchCelebration();
});

toPlanBtn.addEventListener('click', () => {
  showScreen(screen3, 75);
});

// Time Selection
timeChips.forEach(chip => {
  chip.addEventListener('click', () => {
    timeChips.forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
    selectedTime = chip.dataset.time;
    validatePlanner();
  });
});

// Plan Selection
planChips.forEach(chip => {
  chip.addEventListener('click', () => {
    planChips.forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
    selectedPlan = chip.dataset.plan;
    selectedEmoji = chip.dataset.emoji;
    validatePlanner();
  });
});

function validatePlanner() {
  if (selectedTime && selectedPlan) {
    sealBtn.disabled = false;
    sealBtn.classList.add('ready');
    sealBtn.innerHTML = 'يلا نعتمد الخروجة ♥';
  } else {
    sealBtn.disabled = true;
    sealBtn.classList.remove('ready');
    sealBtn.innerHTML = 'اختاري الوقت والمكان الأول ✍️';
  }
}

function buildFinalMessage() {
  const noteVal = customNoteInput.value.trim();
  let msg = `موافقين يا سيدي 💌\n📅 النهارده (${formattedToday})\n🕒 الساعة: ${selectedTime}\n✨ الخطة: ${selectedPlan}`;
  if (noteVal) {
    msg += `\n📝 ملاحظة: ${noteVal}`;
  }
  return msg;
}

// Seal Letter Click
sealBtn.addEventListener('click', () => {
  if (sealBtn.disabled) return;

  const noteVal = customNoteInput.value.trim();

  summaryDate.textContent = `📅 Today`;
  summaryTime.textContent = `🕒 ${selectedTime}`;
  summaryPlan.textContent = `${selectedEmoji} ${selectedPlan}`;


  if (noteVal) {
    letterNote.style.display = 'block';
    letterNote.innerHTML = `📝 <strong>ملاحظتك:</strong> ${noteVal}`;
  } else {
    letterNote.style.display = 'none';
  }

  showScreen(screen4, 100);
  launchCelebration();
});

// Send directly via WhatsApp
whatsappBtn.addEventListener('click', () => {
  const encodedText = encodeURIComponent(buildFinalMessage());
  const waUrl = MY_WHATSAPP_NUMBER
    ? `https://wa.me/${MY_WHATSAPP_NUMBER}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`;
  window.open(waUrl, '_blank');
});

// Copy Details
shareBtn.addEventListener('click', () => {
  const textToShare = buildFinalMessage();
  navigator.clipboard.writeText(textToShare);
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
});
