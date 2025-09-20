// ------------------ Data ------------------
const tips = [
  "Break study into 25-minute chunks (Pomodoro).",
  "Review your notes within 24 hours.",
  "Teach the topic to someone else.",
  "Eliminate distractions around you.",
  "Use active recall instead of just rereading.",
  "Summarize today’s learning in your own words.",
  "Tackle the hardest task first.",
  "Take short breaks to recharge."
];

const quotes = [
  "“The future depends on what you do today.” – Gandhi",
  "“Success is the sum of small efforts repeated daily.”",
  "“Don’t watch the clock; do what it does. Keep going.”",
  "“Push yourself, because no one else will do it for you.”",
  "“The secret to getting ahead is getting started.”"
];

let currentTip = "";

// ------------------ Elements ------------------
const tipBtn = document.getElementById("studyTipBtn");
const saveBtn = document.getElementById("saveTipBtn");
const showSavedBtn = document.getElementById("showSavedBtn");
const exportBtn = document.getElementById("exportBtn");
const darkModeBtn = document.getElementById("darkModeBtn");
const output = document.getElementById("tipOutput");
const savedTipsList = document.getElementById("savedTipsList");

// Timer elements
const timerDisplay = document.getElementById("timerDisplay");
const startTimerBtn = document.getElementById("startTimerBtn");
const resetTimerBtn = document.getElementById("resetTimerBtn");

let timerInterval;
let timeLeft = 25 * 60; // 25 minutes

// ------------------ Study Tip Logic ------------------
tipBtn.addEventListener("click", () => {
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  currentTip = `${randomTip} \n👉 ${randomQuote}`;
  output.textContent = currentTip;
  saveBtn.style.display = "inline-block";
});

saveBtn.addEventListener("click", () => {
  if (currentTip) {
    chrome.storage.local.get({ saved: [] }, (data) => {
      const updated = [...data.saved, currentTip];
      chrome.storage.local.set({ saved: updated }, () => {
        alert("Tip saved! ✅");
      });
    });
  }
});

showSavedBtn.addEventListener("click", () => {
  savedTipsList.innerHTML = "";
  chrome.storage.local.get({ saved: [] }, (data) => {
    data.saved.forEach((t) => {
      const li = document.createElement("li");
      li.textContent = t;
      savedTipsList.appendChild(li);
    });
  });
});

// ------------------ Export Saved Tips ------------------
exportBtn.addEventListener("click", () => {
  chrome.storage.local.get({ saved: [] }, (data) => {
    if (data.saved.length === 0) {
      alert("No tips saved yet!");
      return;
    }
    const blob = new Blob([data.saved.join("\n\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "saved_tips.txt";
    a.click();
    URL.revokeObjectURL(url);
  });
});

// ------------------ Dark Mode ------------------
darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// ------------------ Pomodoro Timer ------------------
function updateTimerDisplay() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  timerDisplay.textContent = 
    `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

startTimerBtn.addEventListener("click", () => {
  if (timerInterval) return; // prevent multiple intervals
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      alert("⏰ Time's up! Take a break.");
    }
  }, 1000);
});

resetTimerBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  timeLeft = 25 * 60;
  updateTimerDisplay();
});

// Initialize
updateTimerDisplay();