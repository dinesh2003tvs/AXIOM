export function HeaderMountainWatermark({ className = "" }) {
  return (
    <div className={`pointer-events-none select-none overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 650 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover object-right opacity-85"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="snowGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#eff6ff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f3f6fb" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="snowGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#dbeafe" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f3f6fb" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="shadowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Distant Ridge */}
        <path
          d="M 50 170 L 140 100 L 210 145 L 290 70 L 370 120 L 460 35 L 530 85 L 610 20 L 650 60 L 650 200 L 50 200 Z"
          fill="url(#snowGrad1)"
        />

        {/* Mountain Shadow facets */}
        <path
          d="M 290 70 L 330 115 L 370 120 L 410 75 L 460 35 L 490 80 L 530 85 L 570 50 L 610 20 L 650 60 L 650 190 L 290 190 Z"
          fill="url(#shadowGrad)"
        />

        {/* Foreground Peak 1 */}
        <path
          d="M 180 190 L 260 110 L 320 160 L 410 80 L 490 140 L 560 65 L 630 130 L 650 110 L 650 200 L 180 200 Z"
          fill="url(#snowGrad2)"
        />

        {/* Foreground Ridge Shadow Detail */}
        <path
          d="M 410 80 L 440 125 L 490 140 L 520 95 L 560 65 L 590 110 L 630 130 L 650 110 L 650 200 L 410 200 Z"
          fill="url(#shadowGrad)"
        />

        {/* Detailed sharp peak highlights */}
        <path
          d="M 460 35 L 452 75 L 467 110 L 460 35 Z"
          fill="#ffffff"
          opacity="0.8"
        />
        <path
          d="M 610 20 L 602 60 L 615 95 L 610 20 Z"
          fill="#ffffff"
          opacity="0.9"
        />
        <path
          d="M 560 65 L 553 98 L 566 128 L 560 65 Z"
          fill="#ffffff"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}

export function SidebarMountainArt({ className = "" }) {
  return (
    <div className={`pointer-events-none select-none overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 280 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover object-bottom"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="darkMountainGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#0f172a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0a1122" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="darkMountainGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#1e293b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#080e1a" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="crestGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Back dark ridge */}
        <path
          d="M 0 110 L 45 70 L 90 100 L 150 40 L 210 95 L 260 55 L 280 75 L 280 240 L 0 240 Z"
          fill="url(#darkMountainGrad1)"
        />

        {/* Back ridge crest highlights */}
        <path
          d="M 150 40 L 146 75 L 152 110 L 150 40 Z"
          fill="url(#crestGlow)"
        />
        <path
          d="M 260 55 L 255 85 L 264 110 L 260 55 Z"
          fill="url(#crestGlow)"
        />

        {/* Foreground sharp rocky peaks */}
        <path
          d="M -10 150 L 35 90 L 80 135 L 130 65 L 180 120 L 235 80 L 290 145 L 290 240 L -10 240 Z"
          fill="url(#darkMountainGrad2)"
        />

        {/* Foreground crest snow/light facets */}
        <path
          d="M 130 65 L 122 105 L 135 150 L 130 65 Z"
          fill="#38bdf8"
          opacity="0.25"
        />
        <path
          d="M 35 90 L 28 120 L 39 155 L 35 90 Z"
          fill="#38bdf8"
          opacity="0.2"
        />
        <path
          d="M 235 80 L 227 115 L 240 160 L 235 80 Z"
          fill="#38bdf8"
          opacity="0.25"
        />

        {/* Craggy ridge texture lines */}
        <path
          d="M 130 65 L 105 110 L 120 145 M 130 65 L 150 110 L 140 150 M 235 80 L 215 125 M 35 90 L 55 130"
          stroke="#475569"
          strokeWidth="0.75"
          strokeDasharray="2,3"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}
