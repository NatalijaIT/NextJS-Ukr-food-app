import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { findUserByEmail, verifyPassword } from '@/lib/services/users.service';

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const email = credentials?.email as string | undefined;
                const password = credentials?.password as string | undefined;

                if (!email || !password) {
                    return null;
                }

                const user = await findUserByEmail(email);
                if (!user) {
                    return null;
                }

                const isValid = await verifyPassword(password, user.password);
                if (!isValid) {
                    return null;
                }

                return {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/auth/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id as string;
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.id) {
                session.user.id = token.id as string;
            }
            return session;
        },
        async authorized({ auth, request }) {
            const isLoggedIn = !!auth?.user;
            const isOnSharePage = request.nextUrl.pathname.startsWith('/meals/share');

            if (isOnSharePage && !isLoggedIn) {
                return Response.redirect(
                    new URL('/auth/login?callbackUrl=/meals/share', request.nextUrl.origin)
                );
            }
            return true;
        },
    },
});
