import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { auth, signIn, signOut, handlers } = NextAuth({
    pages: {
        signIn: "/signin",
    },

    providers: [
        Credentials({
            async authorize(credentials) {
                const parsed = z
                    .object({
                        email: z.string().email(),
                        password: z.string().min(1),
                    })
                    .safeParse(credentials);

                if (!parsed.success) return null;

                const { email, password } = parsed.data;

                const user = await prisma.user.findUnique({
                    where: { email },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        password: true,
                        role: true,
                        isActive: true,
                    },
                });

                if (!user) return null;

                const passwordsMatch = await bcrypt.compare(password, user.password);
                if (!passwordsMatch) return null;

                if (user.isActive !== true) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isActive: user.isActive,
                };
            },
        }),
    ],

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },

    secret: process.env.AUTH_SECRET,

    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.role = user.role;
                token.isActive = user.isActive;
            }
            return token;
        },

        async session({ session, token }: any) {
            session.user.role = token.role;
            session.user.isActive = token.isActive;
            return session;
        },
    },
});
