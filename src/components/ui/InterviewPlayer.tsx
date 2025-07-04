import React from 'react';

interface Props {
  videoUrl: string;
}

export default function InterviewPlayer({ videoUrl }: Props) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <video
        src={videoUrl}
        controls
        preload="metadata"
        className="w-full rounded-xl shadow-lg"
        poster="/video-placeholder.jpg"
      />
    </div>
  );
}