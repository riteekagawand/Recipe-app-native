import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
  content: string;
  recipe: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    content: { type: String, required: true },
    recipe: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<INote>("Note", noteSchema);
