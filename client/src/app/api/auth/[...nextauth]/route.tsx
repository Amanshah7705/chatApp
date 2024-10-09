import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { axiosInstance } from "@/helper/axios";
import { backend } from "@/helper/constant";
import { cookies } from "next/headers";
import { socket } from "@/helper/socketStart";
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_ID || "",
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_ID || "",
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "string" },
        password: { label: "Password", type: "password" },
        deviceId: { lable: "deviceId", type: "string" },
      },
      //@ts-ignore
      async authorize(credentials) {
        const response = await axiosInstance({
          baseURL: `${backend}/auth/login`,
          method: "post",
          data: credentials,
        });
        if (response.data && response.data.user) {
          const cookieStore = cookies();
          cookieStore.set("Authorization", `${response.data.user.token}`);
          const token = cookieStore.get("Authorization");
          socket.emit("join-server", {
            userId: response.data.user.id,
          });
          return response.data.user;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/Login",
    signOut: "/Login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        (token.username = user.username), (token.email = user.email);
        token.pureToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        //@ts-ignore
        session.user.id = token.id;
        //@ts-ignore
        session.user.username = token.username;
      }
      return session;
    },

    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST };
