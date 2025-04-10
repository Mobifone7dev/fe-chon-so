import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "@/lib/api";
const API_URL = process.env.NEXTAUTH_APP_API_URL_SSL;
export const LOGIN_URL = `${API_URL}/login`;

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password, user, accessToken } = credentials;

        return { ...user, email: email }; // Đảm bảo trả về thông tin người dùng hợp lệ

      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  jwt: {
    maxAge: 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
