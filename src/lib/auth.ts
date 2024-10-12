import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth"; // Add this import
import db from "./db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcrypt";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",  // Ensure you're using "jwt" for JWT-based sessions
  },
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "mayowaawoyomi@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;
        
        const isPasswordCorrect = await compare(credentials.password, user.password);
        if (!isPasswordCorrect) return null;

        // Return user without password
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user;
        return { ...userWithoutPassword, id: String(userWithoutPassword.id) };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, id: user.id, email: user.email, name: user.name };
      }
      return token;
    },
    async session({ session, token, user }) {
      if (token) {
        session.user = {
          email: token.email,
          name: token.name,
          image: user?.image ?? ''
        };
      }
      return session;
    },
  },
  debug: true,
};
