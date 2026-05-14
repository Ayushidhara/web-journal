const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/journalDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// Import Model
const Entry = require("./models/Entry");

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});


// ================= ROUTES =================

// ➕ Add Entry
app.post("/add", async (req, res) => {
  try {
    const entry = new Entry(req.body);
    await entry.save();
    res.status(201).send("Entry saved successfully");
  } catch (error) {
    res.status(500).send("Error saving entry");
  }
});

// 📥 Get All Entries
app.get("/entries", async (req, res) => {
  try {
    const data = await Entry.find();
    res.json(data);
  } catch (error) {
    res.status(500).send("Error fetching entries");
  }
});

// ✏️ Update Entry
app.put("/update/:id", async (req, res) => {
  try {
    await Entry.findByIdAndUpdate(req.params.id, req.body);
    res.send("Entry updated successfully");
  } catch (error) {
    res.status(500).send("Error updating entry");
  }
});

// ❌ Delete Entry
app.delete("/delete/:id", async (req, res) => {
  try {
    await Entry.findByIdAndDelete(req.params.id);
    res.send("Entry deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting entry");
  }
});


// ================= SERVER =================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});