import { Schema, model, Document, Types } from "mongoose";
import { IUser } from "./User";

export interface IRecipe extends Document {
  title: string;
  ingredients: string[];
  instructions: string;
  user: Types.ObjectId; // who created the recipe
  createdAt: Date;
  updatedAt: Date;
}

const recipeSchema = new Schema<IRecipe>(
  {
    title: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default model<IRecipe>("Recipe", recipeSchema);
