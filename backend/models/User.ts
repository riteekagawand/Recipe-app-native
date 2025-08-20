import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  _id: string;            // ✅ Explicitly type _id
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = model<IUser>("User", userSchema);
export default User;
