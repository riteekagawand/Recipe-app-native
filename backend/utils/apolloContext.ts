// src/utils/apolloContext.ts
import { ExpressContextFunctionArgument } from "@apollo/server/express4";

export type AppContext = {
  // user?: { id: string } | null; // later if you add auth
};

export function buildContext(_args: ExpressContextFunctionArgument): AppContext {
  return {};
}
