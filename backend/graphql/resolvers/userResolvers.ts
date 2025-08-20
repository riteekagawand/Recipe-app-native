import User, { IUser } from "../../models/User";
import { hashPassword, comparePassword } from "../../utils/hash";
import { generateToken } from "../../utils/auth";

const resolvers = {
  Query: {
    getUsers: async () => await User.find(),
  },

  Mutation: {
    register: async (
      _: unknown,
      { name, email, password }: { name: string; email: string; password: string }
    ) => {
      const existing = await User.findOne({ email });
      if (existing) throw new Error("User already exists");

      const hashed = await hashPassword(password);
      const user: IUser = new User({ name, email, password: hashed });
      await user.save();

      const token = generateToken(user);

      return {
        ...user.toObject(),
        id: user._id.toString(),
        token,
      };
    },

    login: async (
      _: unknown,
      { email, password }: { email: string; password: string }
    ) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      const valid = await comparePassword(password, user.password);
      if (!valid) throw new Error("Invalid password");

      const token = generateToken(user);

      return {
        ...user.toObject(),
        id: user._id.toString(),
        token,
      };
    },
  },

  User: {
    id: (parent: IUser) => parent._id.toString(),
  },
};

export default resolvers;
