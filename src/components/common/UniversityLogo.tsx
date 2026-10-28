import React from 'react';

export const UniversityLogo: React.FC<{
  className?: string;
  size?: number;
  showText?: boolean;
}> = ({ className = 'w-10 h-10', size = 48, showText = false }) => {
  return (
    <div className="inline-flex items-center gap-2.5">
      <svg
        width={size}
        height={(size * 105) / 90}
        viewBox="0 0 180 210"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Official Emblem of Jamalpur Science & Technology University"
      >
        <defs>
          <clipPath id="shieldClip">
            <path d="M 15 15 L 165 15 L 165 95 C 165 145 90 178 90 178 C 90 178 15 145 15 95 Z" />
          </clipPath>
        </defs>

        {/* Shield Group with Clip Path */}
        <g clipPath="url(#shieldClip)">
          {/* Top Left Quadrant: Dark Green for Biology, DNA, Atom & Mechanical Gear */}
          <rect x="15" y="15" width="75" height="65" fill="#0C6E3D" />

          {/* DNA Double-Helix Ring in Top Left */}
          <ellipse cx="52" cy="40" rx="19" ry="19" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeDasharray="3 2" />
          <ellipse cx="52" cy="40" rx="23" ry="23" stroke="#FFFFFF" strokeWidth="1.2" fill="none" opacity="0.8" />

          {/* Mechanical Cog Gear Wheel in Red */}
          <path
            d="M 33 60 L 37 55 L 42 56 L 46 52 L 49 55 L 55 55 L 58 52 L 62 56 L 67 55 L 71 60 L 68 64 L 71 69 L 66 73 L 62 70 L 58 74 L 52 72 L 47 75 L 42 70 L 37 72 L 33 68 Z"
            fill="#B91C1C"
          />

          {/* Atomic Structure Center */}
          <circle cx="52" cy="42" r="14" fill="#FFFFFF" stroke="#000000" strokeWidth="1.2" />
          <ellipse cx="52" cy="42" rx="10" ry="4" stroke="#000000" strokeWidth="1" transform="rotate(-30 52 42)" fill="none" />
          <ellipse cx="52" cy="42" rx="10" ry="4" stroke="#000000" strokeWidth="1" transform="rotate(30 52 42)" fill="none" />
          <ellipse cx="52" cy="42" rx="10" ry="4" stroke="#000000" strokeWidth="1" transform="rotate(90 52 42)" fill="none" />
          <circle cx="52" cy="42" r="2.2" fill="#000000" />

          {/* Top Right Quadrant: Warm Yellow/Gold for Academic Cap, Pen & Open Book */}
          <rect x="90" y="15" width="75" height="65" fill="#F4BA1B" />

          {/* Academic Mortarboard Cap */}
          <path d="M 127 21 L 148 29 L 127 37 L 106 29 Z" fill="#000000" />
          <path d="M 115 33 L 115 41 C 115 44 139 44 139 41 L 139 33 Z" fill="#000000" />
          <path d="M 144 30 L 147 42" stroke="#000000" strokeWidth="1.5" />
          <circle cx="147" cy="43" r="1.5" fill="#000000" />

          {/* Fountain Pen Nib */}
          <path d="M 122 41 L 132 41 L 129 60 L 127 67 L 125 60 Z" fill="#000000" />
          <circle cx="127" cy="49" r="1.5" fill="#F4BA1B" />
          <line x1="127" y1="49" x2="127" y2="67" stroke="#F4BA1B" strokeWidth="1" />

          {/* Open Book */}
          <path
            d="M 103 76 C 113 69 123 70 127 74 C 131 70 141 69 151 76 L 151 64 C 141 57 131 58 127 62 C 123 58 113 57 103 64 Z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="1.2"
          />
          {/* Book Page Lines */}
          <line x1="108" y1="65" x2="123" y2="64" stroke="#000000" strokeWidth="0.8" />
          <line x1="108" y1="68" x2="123" y2="67" stroke="#000000" strokeWidth="0.8" />
          <line x1="108" y1="71" x2="123" y2="70" stroke="#000000" strokeWidth="0.8" />
          <line x1="131" y1="64" x2="146" y2="65" stroke="#000000" strokeWidth="0.8" />
          <line x1="131" y1="67" x2="146" y2="68" stroke="#000000" strokeWidth="0.8" />
          <line x1="131" y1="70" x2="146" y2="71" stroke="#000000" strokeWidth="0.8" />

          {/* Middle Band: Electrical Circuit Diagram (Resistor, Inductor, Capacitor) */}
          <rect x="15" y="80" width="150" height="18" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
          {/* Wire lead in */}
          <line x1="24" y1="89" x2="40" y2="89" stroke="#000000" strokeWidth="1.5" />
          {/* Resistor symbol */}
          <path d="M 40 89 L 43 83 L 47 95 L 51 83 L 55 95 L 59 83 L 63 95 L 66 89" stroke="#000000" strokeWidth="1.5" fill="none" />
          <line x1="66" y1="89" x2="80" y2="89" stroke="#000000" strokeWidth="1.5" />
          {/* Inductor symbol (coils) */}
          <path d="M 80 89 C 80 82 86 82 86 89 C 86 82 92 82 92 89 C 92 82 98 82 98 89 C 98 82 104 82 104 89" stroke="#000000" strokeWidth="1.5" fill="none" />
          <line x1="104" y1="89" x2="122" y2="89" stroke="#000000" strokeWidth="1.5" />
          {/* Capacitor symbol (parallel plates) */}
          <line x1="122" y1="82" x2="122" y2="96" stroke="#000000" strokeWidth="2" />
          <line x1="127" y1="82" x2="127" y2="96" stroke="#000000" strokeWidth="2" />
          {/* Wire lead out */}
          <line x1="127" y1="89" x2="156" y2="89" stroke="#000000" strokeWidth="1.5" />

          {/* Lower Field: Industry, Agriculture & River (Light Green/Off-White Background) */}
          <rect x="15" y="98" width="150" height="85" fill="#E8ECE9" />

          {/* Factory Silhouette in Dark Green */}
          <path d="M 86 112 L 89 135 L 83 135 Z" fill="#0A5C36" />
          <circle cx="82" cy="107" r="4.5" fill="#94A3B8" opacity="0.6" />
          <circle cx="85" cy="102" r="3.5" fill="#94A3B8" opacity="0.5" />
          <rect x="70" y="118" width="14" height="20" rx="3" fill="#0A5C36" />
          <rect x="73" y="121" width="3" height="4" fill="#FFFFFF" />
          <rect x="78" y="121" width="3" height="4" fill="#FFFFFF" />
          <rect x="73" y="128" width="3" height="4" fill="#FFFFFF" />
          <rect x="78" y="128" width="3" height="4" fill="#FFFFFF" />

          <path d="M 88 126 L 98 126 L 98 138 L 88 138 Z" fill="#0A5C36" />
          <path d="M 98 118 L 107 126 L 107 118 L 116 126 L 116 118 L 125 126 L 125 138 L 98 138 Z" fill="#0A5C36" />
          <rect x="102" y="130" width="18" height="4" fill="#FFFFFF" />

          {/* Green Trees around Factory */}
          <circle cx="66" cy="134" r="3.5" fill="#15803D" />
          <circle cx="129" cy="133" r="4" fill="#15803D" />
          <circle cx="134" cy="135" r="3" fill="#15803D" />
          <line x1="45" y1="138" x2="135" y2="138" stroke="#0A5C36" strokeWidth="1.5" />

          {/* River Waves at the Base of the Shield (Old Brahmaputra River) */}
          <path d="M 35 146 Q 50 142 65 146 Q 80 150 95 146 Q 110 142 125 146 Q 140 150 150 146" stroke="#000000" strokeWidth="1.8" fill="none" />
          <path d="M 45 152 Q 60 148 75 152 Q 90 156 105 152 Q 120 148 135 152" stroke="#000000" strokeWidth="1.8" fill="none" />
          <path d="M 55 158 Q 70 154 85 158 Q 100 162 115 158 Q 125 154 130 158" stroke="#000000" strokeWidth="1.8" fill="none" />
          <path d="M 65 164 Q 80 160 95 164 Q 105 167 115 164" stroke="#000000" strokeWidth="1.8" fill="none" />
        </g>

        {/* Shield Outer Borders */}
        <path
          d="M 15 15 L 165 15 L 165 95 C 165 145 90 178 90 178 C 90 178 15 145 15 95 Z"
          stroke="#000000"
          strokeWidth="4"
          fill="none"
        />
        <path
          d="M 18 18 L 162 18 L 162 94 C 162 142 90 174 90 174 C 90 174 18 142 18 94 Z"
          stroke="#0C6E3D"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Bottom Banner Ribbon with Official Bengali Calligraphy */}
        <path d="M 6 166 L 25 178 L 25 192 L 6 180 Z" fill="#E2E8F0" stroke="#000000" strokeWidth="1.5" />
        <path d="M 174 166 L 155 178 L 155 192 L 174 180 Z" fill="#E2E8F0" stroke="#000000" strokeWidth="1.5" />

        <path
          d="M 18 174 C 55 160 125 160 162 174 L 160 200 C 125 186 55 186 20 200 Z"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="2"
        />

        <text
          x="90"
          y="189"
          textAnchor="middle"
          fill="#000000"
          fontSize="8.5"
          fontWeight="bold"
          fontFamily="'Hind Siliguri', 'Noto Sans Bengali', sans-serif"
          letterSpacing="0.2"
        >
          জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়
        </text>
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className="text-base sm:text-lg font-extrabold tracking-tight text-[#0F172A] leading-tight">
            JSTU <span className="text-[#1E3A8A] font-semibold">Smart Campus</span>
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়
          </span>
        </div>
      )}
    </div>
  );
};
