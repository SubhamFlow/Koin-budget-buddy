import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "../../../../../lib/models/db";
import Otp from "../../../../../lib/models/Otp";
import User from "../../../../../lib/models/User";
import { sendMail, buildKoinWelcomeHtml } from "../../../../../lib/models/mail";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) {
          return null;
        }

        const email = credentials.email.trim().toLowerCase();
        const otp = credentials.otp.trim();

        if (!email || !otp) {
          return null;
        }

        await connectDB();
        const record = await Otp.findOne({ email, otp });

        if (!record) {
          return null;
        }

        await Otp.deleteOne({ _id: record._id });

        await User.findOneAndUpdate(
          { email },
          { $setOnInsert: { email, name: email.split("@")[0], provider: 'otp' } },
          { upsert: true, new: true }
        );

        return {
          id: record._id.toString(),
          email,
          name: email.split("@")[0],
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user?.email) {
        try {
          await connectDB();
          await User.findOneAndUpdate(
            { email: user.email.trim().toLowerCase() },
            {
              $set: {
                name: user.name || '',
                image: user.image || '',
                provider: 'google',
              },
              $setOnInsert: { email: user.email.trim().toLowerCase() },
            },
            { upsert: true, new: true }
          );

          const textMessage = `Hello ${user.name || 'there'}, you signed in with Google successfully. Welcome to Koin! Koin helps you track spending, organize expenses, and build better financial habits.`;
          const htmlMessage = buildKoinWelcomeHtml(user.name || 'there');

          await sendMail(
            user.email,
            'Welcome to Koin',
            textMessage,
            htmlMessage
          );
        } catch (error) {
          console.error('Google login email send failed:', error);
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email || session.user.email;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };