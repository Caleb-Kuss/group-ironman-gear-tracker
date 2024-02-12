import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

type Token = JWT & {};

type User = {};

type CustomSession = Session & {};

export const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      profile(profile) {
        return {
          ...profile,
          id: profile.sub,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: Token; user?: User }): Promise<Token> {
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: CustomSession;
      token: Token;
    }): Promise<CustomSession> {
      return session;
    },
  },
};
