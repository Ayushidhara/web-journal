const express = require("express");
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* -------------------------------
   🎯 Mood Utility Function
-------------------------------- */

function formatMood(moodNumber) {
  const moods = {
    5: { label: "Happy", emoji: "😊" },
    4: { label: "Excited", emoji: "🤩" },
    3: { label: "Neutral", emoji: "😐" },
    2: { label: "Anxious", emoji: "😰" },
    1: { label: "Sad", emoji: "😢" }
  };

  return moods[moodNumber] || { label: "Unknown", emoji: "❓" };
}

/* -------------------------------
   📝 CREATE ENTRY
-------------------------------- */

router.post("/", authMiddleware, (req, res) => {
  const { text, mood, tag } = req.body;

  if (!text || !mood) {
    return res.status(400).json({ msg: "Text and mood are required" });
  }

  db.query(
    "INSERT INTO entries (user_id, text, mood, tag) VALUES (?, ?, ?, ?)",
    [req.user, text, mood, tag],
    (err, result) => {
      if (err) return res.status(500).json({ msg: "Error saving entry" });

      res.json({
        msg: "Entry created successfully",
        entryId: result.insertId
      });
    }
  );
});

/* -------------------------------
   📖 GET ALL USER ENTRIES
-------------------------------- */

router.get("/", authMiddleware, (req, res) => {
  db.query(
    "SELECT * FROM entries WHERE user_id = ? ORDER BY created_at DESC",
    [req.user],
    (err, results) => {
      if (err) return res.status(500).json({ msg: "Error fetching entries" });

      const formattedEntries = results.map(entry => {
        const moodInfo = formatMood(entry.mood);

        return {
          id: entry.id,
          text: entry.text,
          mood: entry.mood, // numeric for charts
          mood_label: moodInfo.label,
          mood_emoji: moodInfo.emoji,
          tag: entry.tag,
          created_at: entry.created_at
        };
      });

      res.json(formattedEntries);
    }
  );
});

/* -------------------------------
   ✏ UPDATE ENTRY
-------------------------------- */

router.put("/:id", authMiddleware, (req, res) => {
  const { text, mood, tag } = req.body;

  db.query(
    "UPDATE entries SET text = ?, mood = ?, tag = ? WHERE id = ? AND user_id = ?",
    [text, mood, tag, req.params.id, req.user],
    (err) => {
      if (err) return res.status(500).json({ msg: "Error updating entry" });

      res.json({ msg: "Entry updated successfully" });
    }
  );
});

/* -------------------------------
   🗑 DELETE ENTRY
-------------------------------- */

router.delete("/:id", authMiddleware, (req, res) => {
  db.query(
    "DELETE FROM entries WHERE id = ? AND user_id = ?",
    [req.params.id, req.user],
    (err) => {
      if (err) return res.status(500).json({ msg: "Error deleting entry" });

      res.json({ msg: "Entry deleted successfully" });
    }
  );
});

module.exports = router;