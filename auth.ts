import NextAuth from "next-auth";
import prisma from "@/lib/prisma";

import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config";


export const { 
    handlers: { GET, POST }, 
    signIn, 
    signOut, 
    auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60,
    },
    
    
    ...authConfig,
});

