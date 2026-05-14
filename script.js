// 🔐 Protect Page
const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
  window.location.href = "login.html";
}

const entryText = document.getElementById("entryText");
const moodSelect = document.getElementById("mood");
const tagSelect = document.getElementById("tags");
const timeline = document.getElementById("entryTimeline");

let entries = [];
let moodChartInstance = null;

// SAVE ENTRY
function saveEntry() {
  if (!entryText.value || !moodSelect.value) {
    alert("Please enter text and select mood.");
    return;
  }

  const entry = {
    id: Date.now(),
    user: currentUser,
    text: entryText.value,
    mood: Number(moodSelect.value),
    tag: tagSelect.value,
    date: new Date().toISOString()
  };

  let allEntries = JSON.parse(localStorage.getItem("entries")) || [];
  allEntries.push(entry);
  localStorage.setItem("entries", JSON.stringify(allEntries));

  entryText.value = "";
  moodSelect.value = "";
  tagSelect.value = "";

  loadEntries();
}

// LOAD ENTRIES
function loadEntries() {
  const allEntries = JSON.parse(localStorage.getItem("entries")) || [];
  entries = allEntries.filter(e => e.user === currentUser);
  renderTimeline();
  renderChart();
}

// RENDER TIMELINE
function renderTimeline() {
  timeline.innerHTML = "";
  entries.forEach(entry => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${new Date(entry.date).toLocaleDateString()}</strong>
      <br>
      Mood: ${entry.mood} | Tag: ${entry.tag || "None"}
      <br>
      ${entry.text}
      <br>
      <button onclick="deleteEntry(${entry.id})">🗑 Delete</button>
    `;
    timeline.appendChild(li);
  });
}

// DELETE ENTRY
function deleteEntry(id) {
  let allEntries = JSON.parse(localStorage.getItem("entries")) || [];
  allEntries = allEntries.filter(e => e.id !== id);
  localStorage.setItem("entries", JSON.stringify(allEntries));
  loadEntries();
}

// CHART
function renderChart() {
  if (moodChartInstance) moodChartInstance.destroy();
  if (!entries.length) return;

  moodChartInstance = new Chart(document.getElementById("moodChart"), {
    type: "line",
    data: {
      labels: entries.map(e => new Date(e.date).toLocaleDateString()),
      datasets: [{
        label: "Mood Trend",
        data: entries.map(e => e.mood),
        fill: true,
        tension: 0.3
      }]
    }
  });
}

// DARK MODE TOGGLE
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

// THEME CHANGE
function applyTheme(theme) {
  document.body.className = "";
  if (theme) document.body.classList.add("theme-" + theme);
}

// LOGOUT
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// VOICE INPUT
function startDictation() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Speech recognition not supported.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = function(event) {
    entryText.value += " " + event.results[0][0].transcript;
  };
}

loadEntries();