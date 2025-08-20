import express, { Request } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import connectDB from "./config/db"; // your MongoDB connection
import typeDefs from "./graphql/typeDefs/userTypeDefs"; // your GraphQL typeDefs
import resolvers from "./graphql/resolvers/userResolvers"; // your GraphQL resolvers
import jwt from "jsonwebtoken";
import "dotenv/config"; // automatically loads .env
import notesRoutes from "./routes/notes"; // your notes routes

// Define context type
interface Context {
  userId?: string;
}

// Helper to get user ID from token
const getUserIdFromToken = (req: Request): string | undefined => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return undefined;

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    return decoded.id;
  } catch (err) {
    return undefined;
  }
};

async function main() {
  // Connect to MongoDB
  await connectDB();

  const app = express();

  app.use("/api/notes", express.json(), notesRoutes);

  // Create Apollo Server

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

  await server.start();

  // Middlewares
  app.use(
    "/graphql",
    cors(),
    express.json(), // parse JSON
    expressMiddleware(server, {
      context: async ({ req }: { req: Request }): Promise<Context> => ({
        userId: getUserIdFromToken(req),
      }),
    })
  );

  app.listen(4000, () => {
    console.log("🚀 Server ready at http://localhost:4000/graphql");
  });
}

main().catch((err) => console.error(err));
