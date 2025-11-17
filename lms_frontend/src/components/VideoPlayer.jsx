import React from 'react';
import ReactPlayer from 'react-player';

// PUBLIC_INTERFACE
export default function VideoPlayer({ url }) {
  /** Lightweight wrapper around react-player for course videos */
  if (!url) return <div className="text-sm text-gray-500">No video available.</div>;
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <ReactPlayer url={url} width="100%" height="360px" controls />
    </div>
  );
}
