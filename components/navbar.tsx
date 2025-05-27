'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'
import { UserNav } from '@/components/user-nav'
import { useSession, signIn } from 'next-auth/react'
import { useToast } from '@/components/ui/use-toast'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { InferenceToggle } from '@/components/ui/inference-toggle'

export function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const { toast } = useToast()

  const handleProtectedRoute = () => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to access this feature",
        variant: "destructive"
      })
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b shadow-sm"
    >
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Left: Logo/Title */}
        <div className="flex items-center w-[200px]">
          <Link href="/" className="text-2xl font-extrabold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent font-poppins tracking-tight">
            HireSenseAI
          </Link>
        </div>
        
        {/* Center: Nav Links */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <nav className="flex space-x-8">
            <Link 
              href={session ? "/resume-builder" : "/login?redirect=/resume-builder"}
              className={cn(
                "font-medium text-base px-3 py-2 rounded transition-colors hover:bg-primary/10 hover:text-primary",
                pathname === "/resume-builder" && "text-primary font-semibold bg-primary/10"
              )}
              onClick={() => !session && handleProtectedRoute()}
            >
              Resume Builder
            </Link>
            <Link 
              href={session ? "/job-finder" : "/login?redirect=/job-finder"}
              className={cn(
                "font-medium text-base px-3 py-2 rounded transition-colors hover:bg-primary/10 hover:text-primary",
                pathname === "/job-finder" && "text-primary font-semibold bg-primary/10"
              )}
              onClick={() => !session && handleProtectedRoute()}
            >
              Job Finder
            </Link>
            <Link 
              href={session ? "/job-insights" : "/login?redirect=/job-insights"}
              className={cn(
                "font-medium text-base px-3 py-2 rounded transition-colors hover:bg-primary/10 hover:text-primary",
                pathname === "/job-insights" && "text-primary font-semibold bg-primary/10"
              )}
              onClick={() => !session && handleProtectedRoute()}
            >
              Job Insights
            </Link>
            <Link 
              href="/about" 
              className={cn(
                "font-medium text-base px-3 py-2 rounded transition-colors hover:bg-primary/10 hover:text-primary",
                pathname === "/about" && "text-primary font-semibold bg-primary/10"
              )}
            >
              About
            </Link>
          </nav>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-4 w-auto justify-end">
          <InferenceToggle />
          {status === 'authenticated' ? (
            <UserNav />
          ) : (
            <Button onClick={() => signIn()} variant="default" className="font-semibold">
              Sign in
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="flex md:hidden justify-center gap-4 pb-2">
        <Link 
          href={session ? "/resume-builder" : "/login?redirect=/resume-builder"}
          className={cn(
            "font-medium text-base px-3 py-2 rounded transition-colors hover:bg-primary/10 hover:text-primary",
            pathname === "/resume-builder" && "text-primary font-semibold bg-primary/10"
          )}
          onClick={() => !session && handleProtectedRoute()}
        >
          Resume Builder
        </Link>
        <Link 
          href={session ? "/job-finder" : "/login?redirect=/job-finder"}
          className={cn(
            "font-medium text-base px-3 py-2 rounded transition-colors hover:bg-primary/10 hover:text-primary",
            pathname === "/job-finder" && "text-primary font-semibold bg-primary/10"
          )}
          onClick={() => !session && handleProtectedRoute()}
        >
          Job Finder
        </Link>
        <Link 
          href={session ? "/job-insights" : "/login?redirect=/job-insights"}
          className={cn(
            "font-medium text-base px-3 py-2 rounded transition-colors hover:bg-primary/10 hover:text-primary",
            pathname === "/job-insights" && "text-primary font-semibold bg-primary/10"
          )}
          onClick={() => !session && handleProtectedRoute()}
        >
          Job Insights
        </Link>
        <Link 
          href="/about"
          className={cn(
            "font-medium text-base px-3 py-2 rounded transition-colors hover:bg-primary/10 hover:text-primary",
            pathname === "/about" && "text-primary font-semibold bg-primary/10"
          )}
        >
          About
        </Link>
      </div>
    </motion.nav>
  )
}