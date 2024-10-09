import "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User {
    username: string;
    token: string;
  }
  interface Session {
    user: {
      id: string;
      username: string;
    } & DefaultSession["user"];
  }
  interface JWT {
    id: number;
    username: string;
    pureToken: string;
  }
}
