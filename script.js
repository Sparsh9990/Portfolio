const intro = document.getElementById("intro");
const explore = document.getElementById("explore");
const statusEl = document.getElementById("status");
const site = document.getElementById("site");
const audioWelcome = document.getElementById("audio-welcome");
const audioInit = document.getElementById("audio-init");
const audioToggleBtn = document.getElementById("intro-audio-toggle");
const toggle = document.getElementById("toggle");

let introAudioMuted = true;      // logical mute flag
let welcomePlayed = false;       // whether welcome has ever been started

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

  // If audio is currently playing → pause + mute it.
  if (!audioWelcome.paused && !audioWelcome.ended) {           // [web:730]
    audioWelcome.pause();
    introAudioMuted = true;
    audioToggleBtn.classList.add("muted");
    audioToggleBtn.setAttribute("aria-pressed", "false");
    applyMuteState();
    return;
  }

  // Otherwise: start (or restart) welcome at full volume.
  introAudioMuted = false;
  audioToggleBtn.classList.remove("muted");
  audioToggleBtn.setAttribute("aria-pressed", "true");

  welcomePlayed = true;
  audioWelcome.currentTime = 0;
  applyMuteState();                                            // make sure not muted [web:286][web:713]
  audioWelcome.play().catch(() => {});
});

/* OPEN BASE click:
   - stop welcome
   - force mute ON
   - play init once, unmuted
*/
explore.addEventListener("click", () => {
  statusEl.textContent = "INITIALIZING SYSTEMS…";

  // Stop welcome immediately
  if (audioWelcome) {
    audioWelcome.pause();
    audioWelcome.currentTime = 0;
  }

  // Force mute ON and update UI
  introAudioMuted = true;
  audioToggleBtn.classList.add("muted");
  audioToggleBtn.setAttribute("aria-pressed", "false");
  applyMuteState();

  // Play init once on this click (allowed by autoplay rules) [web:280][web:286][web:496]
  if (audioInit) {
    audioInit.muted = false;
    audioInit.currentTime = 0;
    audioInit.play().catch(() => {});
  }

  // Fade intro away
  setTimeout(() => {
    intro.style.opacity = "0";
    intro.style.pointerEvents = "none";
  }, 900);

  setTimeout(() => {
    intro.style.display = "none";
    site.classList.add("visible");
  }, 1700);
});

/* Initial theme from storage and initial mute state */
const saved = localStorage.getItem("theme");
setTheme(saved === "theme-dark" ? "theme-dark" : "theme-light");
applyMuteState();
