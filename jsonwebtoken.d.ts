// types/jsonwebtoken.d.ts
declare module "jsonwebtoken" {
  export function sign(payload: any, secret: string, options?: any): string;
  export function verify(token: string, secret: string): any;
}
