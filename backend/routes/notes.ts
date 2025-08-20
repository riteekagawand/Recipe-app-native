//routes/notes
import { Router, Request, Response } from "express";
import Note from "../models/Note";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Create Note
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const userId = (req as any).userId; // injected by middleware

    const note = new Note({ title, content, user: userId }); // attach user
    await note.save();

    res.status(201).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create note" });
  }
});



// Get all notes (for logged-in user)
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    // Fetch notes for the logged-in user and populate the 'user' field
    const notes = await Note.find({ user: req.userId }).populate("user", "name email"); 

    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});



export default router;
