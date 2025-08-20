import { Schema, model, Document, Types } from "mongoose";
// import { IUser } from "./User";c

export interface INote extends Document {
  title: string;
  content: string;
  user: Types.ObjectId; // 🔑 Use Types.ObjectId here
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // ✅ now works
  },
  { timestamps: true }
);

const Note = model<INote>("Note", noteSchema);
export default Note;
