import jwt from "jsonwebtoken";
import { IUser } from "../models/User";

export const generateToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
};

// ✅ new helper to verify token
export const verifyToken = (token: string): { id: string; email: string } | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; email: string };
  } catch {
    return null;
  }
};
