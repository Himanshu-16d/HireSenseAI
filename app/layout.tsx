import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Navbar } from "@/components/navbar"
import BackgroundWrapper from "@/components/background-wrapper"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({ 
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins"
})

export const metadata: Metadata = {
  title: "HireSenseAI - Smart Job Search & Resume Builder",
  description: "AI-powered job search and resume building platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload both background images for faster page transitions */}
        <link
          rel="preload"
          href="/Background.png"
          as="image"
          fetchpriority="high"
        />
        <link
          rel="preload"
          href="/Background(2).png"
          as="image"
          fetchpriority="low"
        />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <BackgroundWrapper />

        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}