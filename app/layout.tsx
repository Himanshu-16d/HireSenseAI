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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        {/* VideoBackground now handles different sources for prod vs dev */}
        <VideoBackground />
        
        {/* We'll include StaticBackground but hide it initially */}
        <div id="static-bg-fallback" style={{ display: 'none', opacity: 0 }}>
          <StaticBackground />
        </div>
        
        {/* Script to show fallback if video fails to load within 2.5 seconds */}
        <script dangerouslySetInnerHTML={{ __html: `
          setTimeout(() => {
            const video = document.querySelector('video');
            const fallback = document.getElementById('static-bg-fallback');
            
            if (!video || video.readyState < 2 || !video.currentTime) {
              // Video isn't ready or playing, show fallback
              if (fallback) {
                fallback.style.display = 'block';
                setTimeout(() => {
                  fallback.style.opacity = '1';
                  fallback.style.transition = 'opacity 0.5s ease-in';
                }, 50);
              }
            } else {
              // Video is playing fine
              if (video.style) video.style.opacity = '1';
            }
          }, 2500);
        `}} />

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