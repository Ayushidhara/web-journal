async function saveEntry() {
  const entry = {
    text: entryText.value,
    mood: moodSelect.value,
    tag: tagSelect.value
  };

  try {
    await fetch("http://localhost:5000/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(entry)
    });

    entryText.value = "";
    moodSelect.value = "";
    tagSelect.value = "";

    loadEntries();

  } catch (err) {
    console.error("Save error:", err);
  }
}