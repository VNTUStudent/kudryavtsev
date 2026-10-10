'use client'

export function Shop({ night }: { night: number }) {
  const windowLit = night > 0.4
  return (
    <svg
      viewBox="0 0 1600 700"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
    >
      <rect x="1050" y="255" width="350" height="215" fill="#f3e6c8" />
      <rect x="1050" y="460" width="350" height="10" fill="#d9c8a4" />
      <rect x="1038" y="236" width="374" height="22" rx="5" fill="#2a4d8f" />
      <rect x="1038" y="252" width="374" height="6" fill="#1f3d7a" />
      <rect x="1100" y="278" width="250" height="38" rx="5" fill="#14213d" />
      <text
        x="1225"
        y="305"
        textAnchor="middle"
        fontSize="23"
        fontWeight="800"
        fill="#ffd23f"
        letterSpacing="5"
      >
        МАРКЕТ
      </text>
      {night > 0.05 && (
        <ellipse cx="1160" cy="385" rx="110" ry="60" fill="#ffe9a3" opacity={night * 0.25} />
      )}
      <rect
        x="1080"
        y="345"
        width="160"
        height="78"
        rx="4"
        fill={windowLit ? '#f6d67f' : '#b8dcf0'}
        stroke="#7d8794"
        strokeWidth="4"
      />
      <line x1="1160" y1="345" x2="1160" y2="423" stroke="#7d8794" strokeWidth="3" />
      <rect x="1288" y="362" width="62" height="108" rx="4" fill="#4a3728" />
      <rect x="1304" y="412" width="7" height="18" rx="3" fill="#d9c8a4" />
      <rect x="1268" y="352" width="34" height="24" rx="3" fill="#9aa5b1" />
      <line x1="1274" y1="364" x2="1296" y2="364" stroke="#6d7681" strokeWidth="3" />
      <line x1="1274" y1="370" x2="1290" y2="370" stroke="#6d7681" strokeWidth="3" />
    </svg>
  )
}
