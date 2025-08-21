import { gql } from "graphql-tag";

const recipeTypeDefs = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
  }

  type Recipe {
    _id: ID!
    title: String!
    ingredients: [String!]!
    instructions: String!
    category: String
    image: String
    notes: [String]
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    recipes: [Recipe!]!
    recipe(id: ID!): Recipe
  }

  type Mutation {
    createRecipe(
      title: String!
      ingredients: [String!]!
      instructions: String!
      category: String
      image: String
      notes: [String]
    ): Recipe!

    updateRecipe(
      id: ID!
      title: String
      ingredients: [String!]
      instructions: String
      category: String
      image: String
      notes: [String]
    ): Recipe!

    deleteRecipe(id: ID!): Recipe!
  }
`;

export default recipeTypeDefs;
