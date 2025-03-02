import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/models/User";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export interface CustomUser {
  id: string;
  name: string;
  email: string;
  role: string;
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
        const user = await User.findOne({ email: credentials?.email });
        if (!user) return null;
        const isMatch = await bcrypt.compare(credentials!.password, user.password);
        if (!isMatch) return null;

        // Convert Decimal128 balance values to numbers for the session
        const balance = {
          IRR: parseFloat(user.balance.IRR.toString()),
          GBP: parseFloat(user.balance.GBP.toString()),
          EUR: parseFloat(user.balance.EUR.toString()),
          TRY: parseFloat(user.balance.TRY.toString()),
          AED: parseFloat(user.balance.AED.toString()),
          SEK: parseFloat(user.balance.SEK.toString()),
          USD: parseFloat(user.balance.USD.toString()),
        };

        // Return a user object that matches the expected type
        return {
          id: user._id!.toString(),
          name: user.username,
          email: user.email,
          role: user.role,
          balance,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.balance = (user as CustomUser).balance;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as "user" | "admin";
        session.user.balance = token.balance as CustomUser["balance"];
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};