'use client'

const COLUMNS = [250, 420, 588, 756, 910]

export function Canopy({ night }: { night: number }) {
  return (
    <svg
      viewBox="0 0 1600 700"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
    >
      {COLUMNS.map((x) => (
        <g key={x}>
          <rect x={x} y="198" width="16" height="272" fill="#d9dce3" />
          <rect x={x} y="198" width="5" height="272" fill="#b4bac4" />
        </g>
      ))}
      <rect x="250" y="196" width="676" height="10" fill="#c8cdd7" />
      {night > 0.05 &&
        [310, 540, 770].map((x) => (
          <g key={x}>
            <ellipse cx={x + 65} cy="240" rx="120" ry="30" fill="#ffe9a3" opacity={night * 0.22} />
            <rect x={x} y="200" width="130" height="7" rx="3" fill="#fff3c4" opacity={night} />
          </g>
        ))}
      <rect x="222" y="134" width="716" height="18" rx="6" fill="#2a4d8f" />
      <rect x="222" y="150" width="716" height="46" rx="7" fill="#ffd23f" />
      <rect x="222" y="190" width="716" height="7" fill="#dba32a" />
      <text
        x="580"
        y="183"
        textAnchor="middle"
        fontSize="31"
        fontWeight="800"
        fill="#1f3d7a"
        letterSpacing="6"
      >
        ТРЕМБІТА
      </text>
    </svg>
  )
}
