import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcryptjs from "bcryptjs"
import { prisma } from "@/lib/db"
import { PrismaAdapter } from "@auth/prisma-adapter"

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              accounts: {
                where: {
                  provider: "credentials"
                }
              }
            }
          })

          if (!user || !user.accounts[0]?.password) {
            return null
          }

          // Compare password
          const isValid = await bcryptjs.compare(
            credentials.password,
            user.accounts[0].password
          )

          if (!isValid) {
            return null
          }

          // Update user role if provided
          if (credentials.role && credentials.role !== user.role) {
            await prisma.user.update({
              where: { id: user.id },
              data: { role: credentials.role }
            })
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: credentials.role || user.role,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log("Sign in callback:", { user, account, profile })
        if (account?.provider === "google") {
          console.log("Google sign in attempt:", {
            email: user.email,
            name: user.name,
            provider: account.provider,
            providerAccountId: account.providerAccountId
          })

          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: { accounts: true }
          })

          if (existingUser) {
            // Check if existing user is a recruiter - block Google sign in for recruiters
            if (existingUser.role === "recruiter") {
              console.log("Blocking Google sign in for recruiter:", existingUser.email)
              return false // Block the sign in
            }
            console.log("Existing user found:", existingUser)
          } else {
            console.log("Creating new user for Google sign in")
            // Only allow candidate role for new Google users
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                role: "candidate",
                accounts: {
                  create: {
                    type: "oauth",
                    provider: "google",
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token,
                    token_type: account.token_type,
                    scope: account.scope,
                    id_token: account.id_token,
                  }
                }
              }
            })
          }
        }
        return true
      } catch (error) {
        console.error("Sign in error:", error)
        return false
      }
    },
    async session({ session, token }) {
      try {
        console.log("Session callback:", { session, token })
        if (session.user) {
          session.user.id = token.sub
          session.user.role = token.role as string
        }
        return session
      } catch (error) {
        console.error("Session error:", error)
        return session
      }
    },
    async jwt({ token, user, account }) {
      try {
        console.log("JWT callback:", { token, user, account })
        if (user) {
          token.id = user.id
          token.role = (user as any).role
        }
        // If token doesn't have role, fetch it from database
        if (!token.role && token.sub) {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { role: true }
          })
          if (dbUser) {
            token.role = dbUser.role
          }
        }
        return token
      } catch (error) {
        console.error("JWT error:", error)
        return token
      }
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback:", { url, baseUrl })
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  }
})

export { handler as GET, handler as POST }
