// next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string;
    email: string;
    role?: string;
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

  interface Session {
    user: User;
    accessToken: string; // Add the accessToken property
  }

  interface JWT {
    id: string;
    role?: string;
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
