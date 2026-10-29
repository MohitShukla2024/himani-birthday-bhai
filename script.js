
"use strict";

// ==========================================
// 1. ELEMENTS
// ==========================================

const audioPlayer = document.getElementById("audioPlayer");
const playButton = document.getElementById("playButton");
const musicToggle = document.getElementById("musicToggle");
const nextTrackButton = document.getElementById("nextTrackButton");
const volumeControl = document.getElementById("volumeControl");

const trackTitle = document.getElementById("trackTitle");
const trackSubtitle = document.getElementById("trackSubtitle");
const musicArt = document.getElementById("musicArt");
const equalizer = document.getElementById("equalizer");

const surpriseModal = document.getElementById("surpriseModal");
const modalEmoji = document.getElementById("modalEmoji");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");

let currentTrack = 0;
let lastFocusedElement = null;

// ==========================================
// 2. MUSIC PLAYLIST
// ==========================================

// Put your actual MP3 files in the audio folder.
// These paths must match the filenames exactly.

const tracks = [
  {
    title: "Birthday Song 🎂",
    subtitle: "A little music for your big day 💗",
    src: "nastelbom-happy-birthday-495860.mp3",
    emoji: "🎂"
  },
  {
    title: "A Special Song 💕",
    subtitle: "Picked especially for you, Himani",
    src: "atlasaudio-birthday-606219.mp3",
    emoji: "🎧"
  }
];

audioPlayer.volume = Number(volumeControl.value);

// ==========================================
// 3. LOAD AND PLAY MUSIC
// ==========================================

function loadTrack(index) {
  currentTrack = index;
  const track = tracks[currentTrack];

  audioPlayer.pause();
  audioPlayer.src = track.src;
  audioPlayer.load();

  trackTitle.textContent = track.title;
  trackSubtitle.textContent = track.subtitle;
  musicArt.textContent = track.emoji;

  playButton.textContent = "▶ Play";
  musicToggle.textContent = "🎵 Play Music";
  equalizer.classList.remove("playing");
}

async function toggleMusic() {
  if (!audioPlayer.src || audioPlayer.src === window.location.href) {
    loadTrack(currentTrack);
  }

  if (audioPlayer.paused) {
    try {
      await audioPlayer.play();
    } catch (error) {
      console.error("Could not play audio:", error);
      trackSubtitle.textContent =
        "Add the MP3 file to the audio folder and try again. 🎵";
    }
  } else {
    audioPlayer.pause();
  }
}

playButton.addEventListener("click", toggleMusic);
musicToggle.addEventListener("click", toggleMusic);

nextTrackButton.addEventListener("click", async () => {
  const wasPlaying = !audioPlayer.paused;

  loadTrack((currentTrack + 1) % tracks.length);

  nextTrackButton.textContent =
    currentTrack === 0 ? "🎵 Personal Song" : "🎂 Birthday Song";

  if (wasPlaying) {
    await toggleMusic();
  }
});

volumeControl.addEventListener("input", () => {
  audioPlayer.volume = Number(volumeControl.value);
});

audioPlayer.addEventListener("play", () => {
  playButton.textContent = "⏸ Pause";
  musicToggle.textContent = "⏸ Pause Music";
  equalizer.classList.add("playing");
});

audioPlayer.addEventListener("pause", () => {
  playButton.textContent = "▶ Play";
  musicToggle.textContent = "🎵 Play Music";
  equalizer.classList.remove("playing");
});

audioPlayer.addEventListener("ended", () => {
  // Automatically move to the next song.
  loadTrack((currentTrack + 1) % tracks.length);
});

audioPlayer.addEventListener("error", () => {
  if (!audioPlayer.currentSrc) return;

  trackSubtitle.textContent =
    "Music file not found. Check the filename in your audio folder. 🎵";
});

// Set the first song's information on page load.
loadTrack(0);

// ==========================================
// 4. PHOTO FALLBACKS
// ==========================================

// If a photo is missing, show a cute emoji instead.

document.querySelectorAll(".memory-image img").forEach((img) => {
  function showFallback() {
    img.style.display = "none";

    const fallback = img.parentElement.querySelector(".fallback-emoji");
    if (fallback) {
      fallback.style.display = "grid";
    }
  }

  img.addEventListener("error", showFallback);

  if (img.complete && img.naturalWidth === 0) {
    showFallback();
  }
});

// ==========================================
// 5. SURPRISE POPUP
// ==========================================

function openSurprise(emoji, title, message) {
  lastFocusedElement = document.activeElement;

  modalEmoji.textContent = emoji;
  modalTitle.textContent = title;
  modalText.textContent = message;

  surpriseModal.hidden = false;
  document.body.style.overflow = "hidden";

  document.getElementById("closeModal").focus();

  launchConfetti(150);
}

function closeSurprise() {
  surpriseModal.hidden = true;
  document.body.style.overflow = "";

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

document.getElementById("surpriseButton").addEventListener("click", () => {
  openSurprise(
    "🎁💗",
    "Surprise, Himani!",
    "You are one of a kind! May your birthday bring endless smiles, beautiful memories, and all the happiness your heart can hold. Keep shining, birthday girl! ✨"
  );
});

document.getElementById("finalSurpriseButton").addEventListener("click", () => {
  openSurprise(
    "💌🌷",
    "A Wish Just For You!",
    "Dear Himani, never forget how special you are. May every new year bring you closer to your dreams. You deserve all the love, laughter, and magic in the world. Happy Birthday! 💖"
  );
});

document.getElementById("closeModal").addEventListener("click", closeSurprise);
document.getElementById("modalOkay").addEventListener("click", closeSurprise);

surpriseModal.addEventListener("click", (event) => {
  if (event.target === surpriseModal) {
    closeSurprise();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !surpriseModal.hidden) {
    closeSurprise();
  }
});

// ==========================================
// 6. BIRTHDAY CAKE / BLOW CANDLES
// ==========================================

const cake = document.querySelector(".cake");
const wishButton = document.getElementById("wishButton");
const wishMessage = document.getElementById("wishMessage");

wishButton.addEventListener("click", () => {
  if (cake.classList.contains("blown")) {
    cake.classList.remove("blown");
    wishMessage.textContent = "";
    wishButton.textContent = "Blow the Candles 🕯️";
    return;
  }

  cake.classList.add("blown");

  wishMessage.textContent =
    "✨ Wish made! May all your dreams come true, Himani! 💖";

  wishButton.textContent = "Light the Candles Again 🎂";

  launchConfetti(180);
});

// ==========================================
// 7. CONFETTI EFFECT
// ==========================================

const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
let animationRunning = false;

const confettiColors = [
  "#ff75a9",
  "#ffc857",
  "#b99af7",
  "#8ce3c0",
  "#ff9e80",
  "#a6d8ff"
];

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.round(window.innerWidth * dpr);
  canvas.height = Math.round(window.innerHeight * dpr);

  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchConfetti(amount = 120) {
  const safeAmount = Math.min(amount, 250);

  for (let i = 0; i < safeAmount; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * window.innerHeight * 0.3,
      width: 4 + Math.random() * 6,
      height: 6 + Math.random() * 8,
      color: confettiColors[
        Math.floor(Math.random() * confettiColors.length)
      ],
      speedX: (Math.random() - 0.5) * 4,
      speedY: 2 + Math.random() * 4,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.15,
      life: 150 + Math.random() * 70
    });
  }

  if (!animationRunning) {
    animationRunning = true;
    requestAnimationFrame(animateConfetti);
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles = particles.filter((p) => p.life > 0 && p.y < window.innerHeight + 30);

  particles.forEach((p) => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.rotation += p.spin;
    p.speedX *= 0.995;
    p.life--;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
    ctx.restore();
  });

  if (particles.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    animationRunning = false;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

// ==========================================
// 8. WELCOME EFFECT
// ==========================================

// Start with a small celebration after the page loads.
window.addEventListener("load", () => {
  launchConfetti(65);
});
audioPlayer.addEventListener("ended", () => {
  loadTrack((currentTrack + 1) % tracks.length);
});
audioPlayer.addEventListener("ended", async () => {
  loadTrack((currentTrack + 1) % tracks.length);

  try {
    await audioPlayer.play();
  } catch (error) {
    console.log("Tap Play to continue the music.");
  }
});