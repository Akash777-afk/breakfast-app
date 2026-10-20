import type { AddOnArt as Art } from '../types'

const CREAM = '#fff6e2'
const SOFT = '#bfe9b0'
const LEAF = '#7fcf6b'
const DARK = '#0d5a2b'
const AMBER = '#ffbf3d'
const TAN = '#e8b36a'

/** Flat, friendly line-and-fill drawings for add-ons that don't have a photo yet. Decorative: the card carries the name. */
export function AddOnArt({ art, className }: { art: Art; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false">
      {drawing(art)}
    </svg>
  )
}

function drawing(art: Art) {
  switch (art) {
    case 'cup':
      return (
        <>
          <path d="M14 26h30v9a13 13 0 0 1-13 13h-4A13 13 0 0 1 14 35z" fill={CREAM} />
          <path d="M44 29h3.5a5.5 5.5 0 0 1 0 11H43" stroke={CREAM} strokeWidth="3.4" strokeLinecap="round" />
          <path d="M22 20c-2-3 2-4 0-8M30 20c-2-3 2-4 0-8M38 20c-2-3 2-4 0-8" stroke={SOFT} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M18 31h22" stroke={AMBER} strokeWidth="3" strokeLinecap="round" />
        </>
      )
    case 'sugar':
      return (
        <>
          <rect x="14" y="24" width="24" height="24" rx="5" fill={CREAM} />
          <rect x="30" y="16" width="20" height="20" rx="4" fill={SOFT} transform="rotate(12 40 26)" />
          <path d="M18 31h16M18 38h10" stroke={TAN} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M48 44l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill={AMBER} />
        </>
      )
    case 'cookie':
      return (
        <>
          <circle cx="32" cy="32" r="18" fill={TAN} />
          <circle cx="32" cy="32" r="18" stroke={CREAM} strokeOpacity=".5" strokeWidth="2" />
          <circle cx="25" cy="26" r="2.6" fill={DARK} />
          <circle cx="38" cy="29" r="2.6" fill={DARK} />
          <circle cx="29" cy="38" r="2.6" fill={DARK} />
          <circle cx="40" cy="40" r="2" fill={DARK} />
        </>
      )
    case 'leaf':
      return (
        <>
          <path d="M32 10c17 6 21 24 9 38-12 5-27-3-27-18 0-10 7-17 18-20z" fill={LEAF} />
          <path d="M22 44c6-12 12-20 20-26" stroke={DARK} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M31 33l-7-2M36 26l-6-4" stroke={DARK} strokeWidth="2" strokeLinecap="round" />
        </>
      )
    case 'seeds':
      return (
        <>
          {[
            [22, 24, -20],
            [34, 20, 15],
            [44, 28, -10],
            [26, 36, 25],
            [38, 38, -25],
            [31, 47, 10],
            [47, 44, 30],
          ].map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx="5" ry="3" transform={`rotate(${r} ${x} ${y})`} fill={i % 2 ? CREAM : AMBER} />
          ))}
        </>
      )
    case 'ice':
      return (
        <>
          <rect x="12" y="24" width="24" height="24" rx="5" fill={CREAM} fillOpacity=".92" transform="rotate(-10 24 36)" />
          <rect x="30" y="16" width="22" height="22" rx="5" fill={SOFT} fillOpacity=".9" transform="rotate(14 41 27)" />
          <path d="M17 32l5-3M36 22l5-2" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        </>
      )
    case 'nuts':
      return (
        <>
          <path d="M16 38c0-12 8-20 15-20 4 12 3 24-8 28-4-1-7-4-7-8z" fill={TAN} />
          <path d="M33 40c0-11 7-18 16-18 1 11-4 21-13 24-2-1-3-3-3-6z" fill={AMBER} />
          <path d="M22 36c1-6 4-10 7-13M41 38c1-5 3-9 6-12" stroke={CREAM} strokeOpacity=".7" strokeWidth="2.2" strokeLinecap="round" />
        </>
      )
    case 'onion':
      return (
        <>
          <path d="M30 14c0 5-12 10-12 24a14 14 0 0 0 28 0c0-14-12-19-12-24z" fill="#efb6d6" />
          <path d="M32 18v32M25 24c-4 8-4 18 2 26M39 24c4 8 4 18-2 26" stroke="#c97aa6" strokeWidth="2" strokeLinecap="round" />
          <path d="M44 10c6 2 10 8 9 14" stroke={LEAF} strokeWidth="5" strokeLinecap="round" />
        </>
      )
    case 'cubes':
      return (
        <>
          <rect x="12" y="30" width="20" height="20" rx="4" fill={CREAM} transform="rotate(-8 22 40)" />
          <rect x="32" y="26" width="20" height="20" rx="4" fill={CREAM} transform="rotate(10 42 36)" />
          <rect x="22" y="12" width="20" height="20" rx="4" fill={SOFT} transform="rotate(-3 32 22)" />
        </>
      )
    case 'egg':
      return (
        <>
          <ellipse cx="32" cy="34" rx="15" ry="19" fill={CREAM} />
          <circle cx="32" cy="36" r="8" fill={AMBER} />
          <path d="M26 24c2-3 5-4 8-4" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        </>
      )
    case 'beans':
      return (
        <>
          <ellipse cx="24" cy="30" rx="10" ry="6" fill={LEAF} transform="rotate(-35 24 30)" />
          <ellipse cx="40" cy="26" rx="10" ry="6" fill={SOFT} transform="rotate(30 40 26)" />
          <ellipse cx="34" cy="43" rx="10" ry="6" fill={TAN} transform="rotate(-10 34 43)" />
        </>
      )
    case 'avocado':
      return (
        <>
          <path d="M32 8c8 0 12 12 15 22 3 12-3 24-15 24S14 42 17 30C20 20 24 8 32 8z" fill={LEAF} />
          <path d="M32 14c6 0 9 10 11 18 2 9-2 17-11 17s-13-8-11-17c2-8 5-18 11-18z" fill="#e7f6b9" />
          <circle cx="32" cy="38" r="8" fill="#a8693b" />
          <circle cx="29.5" cy="35.5" r="2" fill="#d79a65" />
        </>
      )
    case 'drop':
      return (
        <>
          <path d="M32 8c9 12 16 20 16 30a16 16 0 0 1-32 0c0-10 7-18 16-30z" fill={AMBER} />
          <path d="M24 38a8 8 0 0 0 6 8" stroke={CREAM} strokeWidth="3" strokeLinecap="round" />
        </>
      )
    case 'scoop':
      return (
        <>
          <path d="M12 36h40a20 20 0 0 1-40 0z" fill={CREAM} />
          <path d="M18 36a14 14 0 0 1 28 0z" fill="#fff" />
          <path d="M24 28c3-5 13-5 16 0" stroke={SOFT} strokeWidth="3" strokeLinecap="round" />
          <circle cx="40" cy="22" r="2.4" fill={AMBER} />
        </>
      )
    case 'jar':
      return (
        <>
          <rect x="19" y="26" width="26" height="28" rx="6" fill="#c8742c" />
          <rect x="21" y="16" width="22" height="11" rx="3" fill={CREAM} />
          <rect x="23" y="34" width="18" height="12" rx="3" fill={CREAM} fillOpacity=".92" />
          <path d="M26 40h12" stroke="#c8742c" strokeWidth="2.4" strokeLinecap="round" />
        </>
      )
  }
}
