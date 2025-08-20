import mongoose, { Schema, Document } from "mongoose";

export interface IRecipe extends Document {
  title: string;
  ingredients: string[];
  steps: string[];
  category: string;
  image?: string;
}

const recipeSchema = new Schema<IRecipe>({
  title: { type: String, required: true },
  ingredients: [String],
  steps: [String],
  category: String,
  image: String,
});

export default mongoose.model<IRecipe>("Recipe", recipeSchema);
