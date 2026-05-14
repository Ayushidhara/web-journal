async function deleteEntry(id) {
  try {
    await fetch(`http://localhost:5000/entries/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    loadEntries();

  } catch (err) {
    console.error("Delete error:", err);
  }
}