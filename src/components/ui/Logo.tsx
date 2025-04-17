import React from 'react';

const Logo = ({ className = "", size = 40 }: { className?: string; size?: number }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Circle background */}
      <circle 
        cx="20" 
        cy="20" 
        r="19" 
        fill="#E6F3FF" 
        stroke="#1E40AF" 
        strokeWidth="2"
      />

      {/* Picture frame */}
      <rect
        x="12"
        y="14"
        width="16"
        height="14"
        rx="2"
        fill="white"
        stroke="#1E40AF"
        strokeWidth="1.5"
      />

      {/* Decorative mountain inside frame */}
      <path
        d="M13 26l4-4 2 2 4-4 4 4v2H13v-0.5z"
        fill="#93C5FD"
      />

      {/* Magic wand */}
      <path
        d="M28 10L32 6"
        stroke="#1E40AF"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Star at wand tip */}
      <path
        d="M33.5 4.5l-1 1-0.5-0.5L31 6l-1-1 1-1-1-1 1-1 1 1 1-1 0.5 0.5L32 4z"
        fill="#FCD34D"
        stroke="#1E40AF"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />

      {/* Magic sparkles/stars */}
      <circle
        cx="26"
        cy="12"
        r="1"
        fill="#FCD34D"
        stroke="#1E40AF"
        strokeWidth="0.5"
      />
      <circle
        cx="30"
        cy="8"
        r="0.8"
        fill="#FCD34D"
        stroke="#1E40AF"
        strokeWidth="0.5"
      />
      
      {/* Magic trail effect */}
      <path
        d="M12 14c8-2 12-2 16 0"
        stroke="#FCD34D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="2 2"
      />
      
      {/* Small sparkles around the frame */}
      <circle cx="10" cy="16" r="0.6" fill="#FCD34D" />
      <circle cx="30" cy="16" r="0.6" fill="#FCD34D" />
      <circle cx="14" cy="12" r="0.6" fill="#FCD34D" />
      <circle cx="26" cy="12" r="0.6" fill="#FCD34D" />
    </svg>
  );
};

export default Logo; 