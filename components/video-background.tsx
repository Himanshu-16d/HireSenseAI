"use client"

export function VideoBackground() {
  return (
    <div className="fixed inset-0 w-full h-full -z-10">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover opacity-50"
      >
        <source src="/background_video.mp4" type="video/mp4" />
      </video>
      {/* Add an overlay to ensure content remains readable */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
    </div>
  )
}
