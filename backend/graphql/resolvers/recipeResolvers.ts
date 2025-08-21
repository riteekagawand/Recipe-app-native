import Recipe from "../../models/Recipe";
import User from "../../models/User";

interface Context {
  userId?: string;
}

const recipeResolvers = {
  Query: {
    // READ all recipes
    recipes: async () => {
      const recipes = await Recipe.find().populate("user", "name email");
      const safeRecipes = recipes.filter((r) => r.user !== null);

      console.log(`Fetched ${recipes.length} recipes`);
      console.log(`Valid recipes with users: ${safeRecipes.length}`);
      console.log(
        `Invalid recipes (user missing): ${recipes.length - safeRecipes.length}`
      );

      return safeRecipes;
    },

    // READ single recipe
     recipe: async (_: any, { id }: { id: string }) => {
      const recipe = await Recipe.findById(id).populate("user", "name email");

      if (!recipe) {
        console.error(`Recipe with id ${id} not found`);
        throw new Error("Recipe not found");
      }

      if (!recipe.user) {
        console.error(`Recipe ${id} has missing user`);
        throw new Error("Recipe user missing");
      }

      return recipe;
    },
  },

  Mutation: {
    // CREATE
    createRecipe: async (
  _: any,
  {
    title,
    ingredients,
    instructions,
    category,
    image,
    notes,
  }: {
    title: string;
    ingredients: string[];
    instructions: string;
    category?: string;
    image?: string;
    notes?: string[];
  },
  context: Context
) => {
  if (!context.userId) throw new Error("Unauthorized");

  const recipe = new Recipe({
    title,
    ingredients,
    instructions,
    category,
    image,
    notes,
    user: context.userId,
  });

  await recipe.save();
  return recipe.populate("user", "name email");
},



updateRecipe: async (
  _: any,
  {
    id,
    title,
    ingredients,
    instructions,
    category,
    image,
    notes,
  }: {
    id: string;
    title?: string;
    ingredients?: string[];
    instructions?: string;
    category?: string;
    image?: string;
    notes?: string[];
  },
  context: Context
) => {
  if (!context.userId) throw new Error("Unauthorized");

  const recipe = await Recipe.findOneAndUpdate(
    { _id: id, user: context.userId },
    { $set: { title, ingredients, instructions, category, image, notes } },
    { new: true }
  ).populate("user", "name email");

  if (!recipe) throw new Error("Recipe not found or not authorized");
  return recipe;
}, 
deleteRecipe: async (_: any, { id }: { id: string }, context: Context) => {
  if (!context.userId) throw new Error("Unauthorized");

  // Find the recipe for the current user
  const recipe = await Recipe.findOne({ _id: id, user: context.userId });
  if (!recipe) throw new Error("Recipe not found or not authorized");

  // Delete the recipe
  await recipe.deleteOne();

  // Return the deleted recipe to satisfy non-nullable field
  return recipe.populate("user", "name email");
},

  },
};

export default recipeResolvers;
