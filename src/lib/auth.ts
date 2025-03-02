import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { AuthOptions } from "next-auth";
import UserModel from "@/app/models/User";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { DefaultUser } from "next-auth";
import jwt from "jsonwebtoken";
interface CustomUser extends DefaultUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  balance: {
    IRR: number;
    GBP: number;
    EUR: number;
    TRY: number;
    AED: number;
    SEK: number;
    USD: number;
  };
}
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        await dbConnect();
        const user = await UserModel.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isMatch) {
          throw new Error("Invalid email or password");
        }

        // Explicitly type the returned user object
        const customUser: CustomUser = {
          id: user._id!.toString(),
          name: user.username,
          email: user.email,
          role: user.role as "user" | "admin", // Ensure role is typed correctly
          balance: user.balance,
        };

        return customUser;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? "";
        token.role = user.role ?? "user";
        token.balance = user.balance ?? {
          IRR: 0,
          GBP: 0,
          EUR: 0,
          TRY: 0,
          AED: 0,
          SEK: 0,
          USD: 0,
        };
        token.accessToken =  jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET!, // Use a secret key from environment variables
          { expiresIn: "1h" } // Set an expiration time
        );
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "user" | "admin";
        session.user.balance = token.balance ?? {
          IRR: 0,
          GBP: 0,
          EUR: 0,
          TRY: 0,
          AED: 0,
          SEK: 0,
          USD: 0,
        };
        session.accessToken = token.accessToken as string; // Add the accessToken to the session
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
