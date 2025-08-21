import { Schema, model, Document, Types } from "mongoose";

export interface IRecipe extends Document {
  title: string;
  ingredients: string[];
  instructions: string;
  category?: string;
  image?: string;
  notes?: string[];
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const recipeSchema = new Schema<IRecipe>(
  {
    title: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: String, required: true },
    category: { type: String },
    image: { type: String }, // could be base64 or URL
    notes: { type: [String], default: [] },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default model<IRecipe>("Recipe", recipeSchema);
