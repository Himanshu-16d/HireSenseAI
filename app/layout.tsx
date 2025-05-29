import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Navbar } from "@/components/navbar"
import dynamic from 'next/dynamic'

// Dynamically import backgrounds with no SSR
const VideoBackground = dynamic(() => import('@/components/VideoBackground'), { ssr: false })
const StaticBackground = dynamic(() => import('@/components/StaticBackground'), { ssr: false })

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
  // For development, always use VideoBackground
  // In production, we'll try the video but have a static fallback
  const isProduction = process.env.NODE_ENV === 'production';
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        {isProduction ? (
          <>
            {/* In production, we use both but hide one with CSS based on video loading */}
            <VideoBackground />
            <div id="static-bg-fallback" className="hidden">
              <StaticBackground />
            </div>
            <script dangerouslySetInnerHTML={{ __html: `
              // If video fails to load or play within 3 seconds, show static background
              setTimeout(() => {
                const video = document.querySelector('video');
                if (!video || video.readyState < 3) {
                  document.getElementById('static-bg-fallback').classList.remove('hidden');
                }
              }, 3000);
            `}} />
          </>
        ) : (
          // In development, just use the video background
          <VideoBackground />
        )}
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