import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextAuthConfig } from "next-auth";

export default {
  providers: [
    Credentials({
      credentials: {
        id_no: { label: "ID No.", type: "text", placeholder: "21B1569" },
        password: { label: "Password", type: "password", placeholder: "Password" },
      },
      async authorize(credentials) {
        if (!credentials || typeof credentials.id_no !== "string" || typeof credentials.password !== "string") {
          console.error("Invalid credentials: ID No. or password is missing or incorrect.");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            id_no: credentials.id_no,
          },
        });

        if (!user || !user.password) {
          console.log("Invalid credentials or user has no password.");
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          console.log("Invalid password.");
          return null;
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          birthday: user.birthday.toString(),
          gender: user.gender,
          school: user.school,
          id_no: user.id_no,
          points: user.points,
          image: user.image
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
        token.gender = user.gender;
        token.school = user.school;
        token.id_no = user.id_no;
        token.birthday = user.birthday as string;
        token.points = user.points;
        token.image = user.image;
      }

      // This can be used to persist session changes across updates
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role;
      session.user.gender = token.gender;
      session.user.school = token.school;
      session.user.id_no = token.id_no;
      session.user.birthday = token.birthday;
      session.user.points = token.points;
      session.user.image = token.image as string;

      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/signup",
  },
  trustHost: true
} satisfies NextAuthConfig;
