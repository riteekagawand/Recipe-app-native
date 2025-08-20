import Recipe from "../../models/Recipe";

const recipeResolvers = {
  Query: {
    getRecipes: async () => await Recipe.find(),
    getRecipe: async (_: any, { id }: { id: string }) => await Recipe.findById(id),
  },
  Mutation: {
    createRecipe: async (_: any, args: any, context: any) => {
      if (!context.userId) throw new Error("Unauthorized");
      const recipe = new Recipe({ ...args });
      return await recipe.save();
    },
    updateRecipe: async (_: any, { id, ...updates }: any, context: any) => {
      if (!context.userId) throw new Error("Unauthorized");
      return await Recipe.findByIdAndUpdate(id, updates, { new: true });
    },
    deleteRecipe: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.userId) throw new Error("Unauthorized");
      await Recipe.findByIdAndDelete(id);
      return true;
    },
  },
};

export default recipeResolvers;
