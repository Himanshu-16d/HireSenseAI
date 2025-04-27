'use client'

import { useTheme } from "next-themes"

export function ThemeAnimation({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      {children}
      <div className="fixed inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="fixed inset-0 -z-10 h-full w-full bg-[radial-gradient(circle_500px_at_50%_200px,#8b5cf650,transparent)]"></div>
    </div>
  )
} 