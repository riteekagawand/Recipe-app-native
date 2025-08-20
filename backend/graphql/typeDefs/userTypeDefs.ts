import gql from "graphql-tag";

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    token: String
  }

  type Query {
    getUsers: [User]
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
  }
`;

export default typeDefs;
