import { MongoClient } from "mongodb";
import NextAuth from "next-auth";

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}


declare module "next-auth" {
  interface User {
    id: string;
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

  interface Session {
    user: User;
     accessToken: string; // Explicitly type accessToken as a string
  }

  interface JWT {
    id: string;
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
}

