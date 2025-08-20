import express from "express";
import Note from "../models/Note";

const router = express.Router();

// Get all notes for a recipe
router.get("/:recipeId", async (req, res) => {
  const notes = await Note.find({ recipe: req.params.recipeId })
    .populate("user", "username email"); // only show username & email
  res.json(notes);
});

// Add a note
router.post("/:recipeId", async (req, res) => {
  try {
    const note = new Note({
      content: req.body.content,
      recipe: req.params.recipeId,
      user: req.body.userId, // should come from JWT, not raw body in real app
    });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: "Failed to add note" });
  }
});

export default router;
