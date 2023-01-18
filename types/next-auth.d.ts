import { JWT } from "next-auth/jwt";
import "next-auth";

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    accessTokenExpires: number;
    refreshToken: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      accessToken: string;
      refreshToken: string;
      userName: string | unknown;
    };
  }
}
