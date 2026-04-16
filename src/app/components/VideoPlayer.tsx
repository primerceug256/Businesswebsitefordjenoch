"use client";

export default function VideoPlayer({ src }: { src: string }) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <video
        controls
        controlsList="nodownload"
        className="w-full rounded-lg"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support video.
      </video>
    </div>
  );
}