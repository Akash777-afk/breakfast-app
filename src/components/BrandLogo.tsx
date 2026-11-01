import { useId } from 'react'

const FLAME =
  'M617 53C630 140 680 190 720 230C790 300 829 340 829 415C829 530 735 623 617 623C499 623 405 528 405 410C405 340 430 290 461 230C456 262 458 312 485 311C505 310 506 292 506 270C506 230 512 200 527 170C550 120 590 80 617 53Z'
const SPOON =
  'M560 377C590 377 602 430 600 465C598 505 588 520 570 528C552 536 546 545 543 560L532 640H500L512 553C514 540 508 528 497 517C487 507 484 497 484 485C484 445 525 377 560 377Z'
const FORK_BODY =
  'M637 492L749 472C755 505 750 525 737 538C724 551 721 566 724 580L734 640H702L692 575C688 555 678 543 662 535C646 527 640 512 637 492Z'

function Cutlery({ color }: { color: string }) {
  return (
    <g fill={color}>
      <path d={SPOON} />
      <path d={FORK_BODY} />
      <g stroke={color} strokeWidth="18" strokeLinecap="round">
        <path d="M628 400L648 500" />
        <path d="M672 394L692 494" />
        <path d="M716 386L738 490" />
      </g>
    </g>
  )
}

interface BrandLogoProps {
  className?: string
  /** Pass a label when the logo stands alone; omit it when text next to it already names the brand. */
  label?: string
}

/** Flame with the spoon & fork cut out, so whatever is behind it shows through. */
export function BrandLogo({ className, label }: BrandLogoProps) {
  // Splash and header can be mounted together, so mask/clip ids must be unique per instance.
  const uid = useId().replace(/:/g, '')
  const clipId = `breakfit-flame-${uid}`
  const maskId = `breakfit-cutlery-${uid}`

  return (
    <svg
      className={className}
      viewBox="400 48 434 580"
      xmlns="http://www.w3.org/2000/svg"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={FLAME} />
        </clipPath>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="400" y="48" width="434" height="580">
          <rect x="400" y="48" width="434" height="580" fill="#fff" />
          <Cutlery color="#000" />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <path d={FLAME} fill="#fff" />
        <g clipPath={`url(#${clipId})`}>
          <g transform="translate(14 2)">
            <Cutlery color="#dccb9a" />
          </g>
        </g>
      </g>
    </svg>
  )
}
