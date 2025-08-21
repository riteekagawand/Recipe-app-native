import express, { Request } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import connectDB from "./config/db"; // MongoDB connection
import jwt from "jsonwebtoken";
import "dotenv/config";
import notesRoutes from "./routes/notes"; // REST notes routes
import { authMiddleware } from "./middleware/auth";

// GraphQL typeDefs & resolvers
import userTypeDefs from "./graphql/typeDefs/userTypeDefs";
import userResolvers from "./graphql/resolvers/userResolvers";
import recipeTypeDefs from "./graphql/typeDefs/recipeTypeDefs";
import recipeResolvers from "./graphql/resolvers/recipeResolvers";

// Merge typeDefs & resolvers
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";

const typeDefs = mergeTypeDefs([userTypeDefs, recipeTypeDefs]);
const resolvers = mergeResolvers([userResolvers, recipeResolvers]);

// Define GraphQL context type
interface Context {
  userId?: string;
}

// Helper to get user ID from JWT
const getUserIdFromToken = (req: Request): string | undefined => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return undefined;

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    return decoded.id;
  } catch {
    return undefined;
  }
};

async function main() {
  // Connect to MongoDB
  await connectDB();

  const app = express();

  // Parse JSON bodies BEFORE routes
app.use(express.json({ limit: "10mb" })); // or higher if needed
app.use(express.urlencoded({ limit: "10mb", extended: true }));


  // REST Notes routes with auth
  app.use("/api/notes", authMiddleware, notesRoutes);

  // Apollo Server for Users + Recipes
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
  });
  await server.start();

  // GraphQL endpoint
  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<Context> => ({
        userId: getUserIdFromToken(req),
      }),
    })
  );

  app.listen(4000, '0.0.0.0', () =>
  console.log("🚀 Server running at http://192.168.1.7:4000/graphql")
);
}

main().catch((err) => console.error(err));
