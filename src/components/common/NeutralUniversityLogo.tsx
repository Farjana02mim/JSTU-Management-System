import React from 'react';

interface NeutralUniversityLogoProps {
  className?: string;
  size?: number;
  textColor?: string;
}

/**
 * Neutral geometric university emblem placeholder.
 * Contains no copyrighted or real university photos/seals.
 * Clearly marked with academic symbols (book, flame, laurel, stars).
 */
export const NeutralUniversityLogo: React.FC<NeutralUniversityLogoProps> = ({
  className = 'w-10 h-10',
  size = 40
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="JSTU Neutral Academic Emblem"
    >
      {/* Outer Circle with dashed border */}
      <circle cx="50" cy="50" r="46" stroke="#1E3A8A" strokeWidth="3" fill="#FFFFFF" />
      <circle cx="50" cy="50" r="42" stroke="#93C5FD" strokeWidth="1" strokeDasharray="3 3" />
      
      {/* Inner Blue Shield */}
      <path
        d="M50 18 L74 28 C74 54 50 78 50 78 C50 78 26 54 26 28 Z"
        fill="#1E3A8A"
        stroke="#1E40AF"
        strokeWidth="1.5"
      />
      
      {/* Open Book in Shield */}
      <path
        d="M34 52 C40 48 46 48 50 50 C54 48 60 48 66 52 L66 64 C60 60 54 60 50 62 C46 60 40 60 34 64 Z"
        fill="#FFFFFF"
        stroke="#CBD5E1"
        strokeWidth="1"
      />
      <line x1="50" y1="50" x2="50" y2="62" stroke="#1E3A8A" strokeWidth="1.5" />
      
      {/* Academic Torch / Flame */}
      <path
        d="M50 30 C47 34 46 38 48 42 C49 44 51 44 52 42 C54 38 53 34 50 30 Z"
        fill="#F59E0B"
      />
      <path
        d="M50 34 C49 37 48 39 50 42 C51 39 51 37 50 34 Z"
        fill="#EF4444"
      />

      {/* Decorative Stars */}
      <polygon points="50,11 51.5,14 54.5,14 52,16 53,19 50,17.5 47,19 48,16 45.5,14 48.5,14" fill="#F59E0B" />
      <polygon points="20,50 21,52 23,52 21.5,53.5 22,55.5 20,54.5 18,55.5 18.5,53.5 17,52 19,52" fill="#3B82F6" />
      <polygon points="80,50 81,52 83,52 81.5,53.5 82,55.5 80,54.5 78,55.5 78.5,53.5 77,52 79,52" fill="#3B82F6" />
    </svg>
  );
};
