import Recipe from "../../models/Recipe";
import User from "../../models/User";

interface Context {
  userId?: string;
}

const recipeResolvers = {
  Query: {
    recipes: async () => {
      return await Recipe.find().populate("user", "name email");
    },
    recipe: async (_: any, { id }: { id: string }) => {
      return await Recipe.findById(id).populate("user", "name email");
    },
  },
  Mutation: {
    createRecipe: async (
      _: any,
      { title, ingredients, instructions }: { title: string; ingredients: string[]; instructions: string },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error("Unauthorized");
      }

      const recipe = new Recipe({
        title,
        ingredients,
        instructions,
        user: context.userId,
      });

      await recipe.save();
      return recipe.populate("user", "name email");
    },
  },
};

export default recipeResolvers;
