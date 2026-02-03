import { Play } from "lucide-react";

interface VideoPlaceholderProps {
  label?: string;
  className?: string;
  videoSrc?: string;
}

export function VideoPlaceholder({ label = "Video Background Placeholder", className = "", videoSrc }: VideoPlaceholderProps) {
  if (videoSrc) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <video
          autoPlay
          muted
          loop
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
          <source src={videoSrc} type="video/quicktime" />
        </video>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-gradient-charcoal flex items-center justify-center ${className}`}
    >
      <div className="text-center text-white/50">
        <Play className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-label text-xs">{label}</p>
      </div>
    </div>
  );
}
