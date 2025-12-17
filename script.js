const intro = document.getElementById("intro");
const explore = document.getElementById("explore");
const statusEl = document.getElementById("status");
const site = document.getElementById("site");
const audioWelcome = document.getElementById("audio-welcome");
const audioInit = document.getElementById("audio-init");
const audioToggleBtn = document.getElementById("intro-audio-toggle");
const toggle = document.getElementById("toggle");
const suspendBtn = document.getElementById("suspend");
const logo = document.getElementById("logo");
const logoSub = document.getElementById("logo-sub");

let introAudioMuted = true;
let welcomePlayed = false;

/* messages for logo subline */
const logoMessages = [
  "SYSTEMS ONLINE",
  "VER 2025.1",
  "DIAGNOSTICS CLEAN",
  "NO BUGS DETECTED"
];
let logoMsgIndex = 0;

/* Theme handling */
function setTheme(theme) {
  document.body.classList.remove("theme-light", "theme-dark");
  document.body.classList.add(theme);
  localStorage.setItem("theme", theme);
}

toggle.addEventListener("click", () => {
  const isDark = document.body.classList.contains("theme-dark");
  setTheme(isDark ? "theme-light" : "theme-dark");
});

/* Keep audio elements in sync with logical mute */
function applyMuteState() {
  if (audioWelcome) audioWelcome.muted = introAudioMuted;
  if (audioInit) audioInit.muted = introAudioMuted;
}

/* Init mute button UI */
audioToggleBtn.classList.add("muted");
audioToggleBtn.setAttribute("aria-pressed", "false");

/* When welcome finishes, go back to muted UI */
if (audioWelcome) {
  audioWelcome.addEventListener("ended", () => {
    introAudioMuted = true;
    audioToggleBtn.classList.add("muted");
    audioToggleBtn.setAttribute("aria-pressed", "false");
    applyMuteState();
  });
}

/* Mute button = play / pause welcome */
audioToggleBtn.addEventListener("click", () => {
  if (!audioWelcome) return;

  if (!audioWelcome.paused && !audioWelcome.ended) {
    audioWelcome.pause();
    introAudioMuted = true;
    audioToggleBtn.classList.add("muted");
    audioToggleBtn.setAttribute("aria-pressed", "false");
    applyMuteState();
    return;
  }

  introAudioMuted = false;
  audioToggleBtn.classList.remove("muted");
  audioToggleBtn.setAttribute("aria-pressed", "true");

  welcomePlayed = true;
  audioWelcome.currentTime = 0;
  applyMuteState();
  audioWelcome.play().catch(() => {});
});

/* OPEN BASE click */
explore.addEventListener("click", () => {
  statusEl.textContent = "INITIALIZING SYSTEMS…";

  if (audioWelcome) {
    audioWelcome.pause();
    audioWelcome.currentTime = 0;
  }

  introAudioMuted = true;
  audioToggleBtn.classList.add("muted");
  audioToggleBtn.setAttribute("aria-pressed", "false");
  applyMuteState();

  if (audioInit) {
    audioInit.muted = false;
    audioInit.currentTime = 0;
    audioInit.play().catch(() => {});
  }

  setTimeout(() => {
    intro.style.opacity = "0";
    intro.style.pointerEvents = "none";
  }, 900);

  setTimeout(() => {
    intro.style.display = "none";
    site.classList.add("visible");
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, 1700);
});

/* SUSPEND SYSTEMS click */
suspendBtn.addEventListener("click", () => {
  intro.style.display = "grid";
  intro.style.opacity = "1";
  intro.style.pointerEvents = "auto";

  site.classList.remove("visible");

  statusEl.textContent = "SYSTEM READY";

  window.scrollTo({ top: 0, left: 0, behavior: "instant" });

  introAudioMuted = true;
  audioToggleBtn.classList.add("muted");
  audioToggleBtn.setAttribute("aria-pressed", "false");
  applyMuteState();
});

/* LOGO press + status blip + scroll to top + cycle subtext */
logo.addEventListener("click", () => {
  logo.classList.remove("pulse");
  void logo.offsetWidth;
  logo.classList.add("pulse");

  if (statusEl) {
    const previous = statusEl.textContent;
    statusEl.textContent = "SYSTEM NOMINAL";
    setTimeout(() => {
      statusEl.textContent = previous || "SYSTEM READY";
    }, 800);
  }

  if (logoSub) {
    logoMsgIndex = (logoMsgIndex + 1) % logoMessages.length;
    logoSub.textContent = logoMessages[logoMsgIndex];
  }

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  });
});

/* Initial theme from storage and initial mute state */
const saved = localStorage.getItem("theme");
setTheme(saved === "theme-dark" ? "theme-dark" : "theme-light");
applyMuteState();
