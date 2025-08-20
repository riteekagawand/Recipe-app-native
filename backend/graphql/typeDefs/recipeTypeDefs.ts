import { gql } from "graphql-tag";

const recipeTypeDefs = gql`
  type Recipe {
    id: ID!
    title: String!
    ingredients: [String!]!
    steps: [String!]!
    category: String!
    image: String
    notes: [String]
  }

  type Query {
    getRecipes: [Recipe!]!
    getRecipe(id: ID!): Recipe
  }

  type Mutation {
    createRecipe(
      title: String!
      ingredients: [String!]!
      steps: [String!]!
      category: String!
      image: String
    ): Recipe!

    updateRecipe(
      id: ID!
      title: String
      ingredients: [String!]
      steps: [String!]
      category: String
      image: String
    ): Recipe!

    deleteRecipe(id: ID!): Boolean!
  }
`;

export default recipeTypeDefs;
