'use client'

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { ThemeAnimation } from "@/components/theme-animation"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <ThemeAnimation>
          <Navbar />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto py-6"
          >
            {children}
          </motion.div>
        </ThemeAnimation>
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  )
} 