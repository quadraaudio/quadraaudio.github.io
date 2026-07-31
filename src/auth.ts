import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const googleId = process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID;
const googleSecret =
  process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET;

export const googleAuthConfigured = Boolean(
  process.env.AUTH_SECRET && googleId && googleSecret
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: googleAuthConfigured
    ? [
        Google({
          clientId: googleId!,
          clientSecret: googleSecret!,
        }),
      ]
    : [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
});
