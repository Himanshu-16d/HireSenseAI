"use client"

export function VideoBackground() {
  return (
    <div className="fixed inset-0 w-full h-full -z-10">      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover opacity-50"
        onError={(e) => {
          const video = e.currentTarget;
          if (video.src !== "https://cdnl.iconscout.com/lottie/premium/preview-watermark/technology-background-3997305-3316750.mp4") {
            video.src = "https://cdnl.iconscout.com/lottie/premium/preview-watermark/technology-background-3997305-3316750.mp4";
          }
        }}
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-white-abstract-technology-background-99902-large.mp4" type="video/mp4" />
        <source src="https://cdnl.iconscout.com/lottie/premium/preview-watermark/technology-background-3997305-3316750.mp4" type="video/mp4" />
      </video>
      {/* Add an overlay to ensure content remains readable */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
    </div>
  )
}
