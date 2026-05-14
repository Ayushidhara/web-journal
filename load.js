async function loadEntries() {
  try {
    const res = await fetch("http://localhost:5000/entries", {
      credentials: "include"
    });

    const data = await res.json();

    entries = data;
    renderTimeline();
    renderChart();

  } catch (err) {
    console.error("Load error:", err);
  }
}