import jwt from "jsonwebtoken";
import { IUser } from "../models/User";

export const generateToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
};
