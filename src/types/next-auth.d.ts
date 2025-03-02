import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role?: "user" | "admin";
      balance: {
        IRR: number;
        GBP: number;
        EUR: number;
        TRY: number;
        AED: number;
        SEK: number;
        USD: number;
      };
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "user" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "user" | "admin";
    balance?: {
      IRR: number;
      GBP: number;
      EUR: number;
      TRY: number;
      AED: number;
      SEK: number;
      USD: number;
    };
  }
}




