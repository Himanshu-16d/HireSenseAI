"use client"

export function GradientBackground() {
  return (
    <div 
      className="fixed inset-0 w-full h-full -z-10 animate-gradient bg-gradient-to-br from-violet-500 via-pink-500 to-cyan-500 background-animate"
      style={{
        backgroundSize: '400% 400%',
      }}
    >
      {/* Add a subtle overlay for better content readability */}
      <div className="absolute inset-0 bg-background/30 backdrop-blur-[2px]" />
    </div>
  )
}
