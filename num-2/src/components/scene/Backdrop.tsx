'use client'

const PUMP_ISLAND_X = [336, 504, 672, 840]

export function Backdrop() {
  return (
    <svg
      viewBox="0 0 1600 700"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
    >
      <rect y="380" width="1600" height="110" fill="#8ab559" />
      <path d="M0 432 Q 240 396 470 426 T 950 418 T 1600 424 L 1600 500 L 0 500 Z" fill="#79a44c" />
      {[
        { x: 150, s: 1 },
        { x: 1000, s: 0.85 },
        { x: 1572, s: 1.1 },
      ].map((tree) => (
        <g key={tree.x} transform={`translate(${tree.x} 470) scale(${tree.s})`}>
          <rect x="-6" y="-70" width="12" height="70" rx="4" fill="#7d5a3c" />
          <circle cx="0" cy="-88" r="30" fill="#588a3c" />
          <circle cx="-22" cy="-70" r="22" fill="#639944" />
          <circle cx="22" cy="-68" r="23" fill="#4e7d35" />
        </g>
      ))}
      <g>
        {Array.from({ length: 29 }, (_, index) => (
          <rect
            key={index}
            x={index * 56 + 8}
            y="456"
            width="7"
            height="16"
            rx="2"
            fill="#8a6a45"
          />
        ))}
        <rect y="461" width="1600" height="4" fill="#9a7a52" />
      </g>
      <rect y="470" width="1600" height="230" fill="#4b4e58" />
      <rect y="470" width="1600" height="6" fill="#5c606b" />
      {PUMP_ISLAND_X.map((x) => (
        <rect key={x} x={x - 52} y="446" width="104" height="28" rx="6" fill="#5a5e68" />
      ))}
      {Array.from({ length: 11 }, (_, index) => (
        <rect
          key={index}
          x={index * 148 + 30}
          y="612"
          width="58"
          height="8"
          rx="4"
          fill="#d9d2b0"
          opacity="0.75"
        />
      ))}
      {[70, 150].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="549" r="24" fill="#34373e" stroke="#5a5e68" strokeWidth="5" />
          <line x1={cx - 18} y1="535" x2={cx + 18} y2="563" stroke="#4a4d55" strokeWidth="4" />
          <line x1={cx + 18} y1="535" x2={cx - 18} y2="563" stroke="#4a4d55" strokeWidth="4" />
        </g>
      ))}
    </svg>
  )
}
