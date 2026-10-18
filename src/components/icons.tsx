import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </svg>
  )
}

export function MicIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" />
    </svg>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  )
}

export function FilterIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <path d="M12.8333 10.8529C12.8333 10.969 12.7872 11.0802 12.7052 11.1623C12.6231 11.2443 12.5118 11.2904 12.3958 11.2904H9.42079C9.32335 11.6538 9.10876 11.9748 8.81029 12.2038C8.51182 12.4328 8.14614 12.5569 7.76996 12.5569C7.39378 12.5569 7.0281 12.4328 6.72963 12.2038C6.43116 11.9748 6.21657 11.6538 6.11913 11.2904H1.60413C1.48809 11.2904 1.37681 11.2443 1.29477 11.1623C1.21272 11.0802 1.16663 10.969 1.16663 10.8529C1.16663 10.7369 1.21272 10.6256 1.29477 10.5436C1.37681 10.4615 1.48809 10.4154 1.60413 10.4154H6.11913C6.21657 10.0521 6.43116 9.73104 6.72963 9.50206C7.0281 9.27309 7.39378 9.14898 7.76996 9.14898C8.14614 9.14898 8.51182 9.27309 8.81029 9.50206C9.10876 9.73104 9.32335 10.0521 9.42079 10.4154H12.3958C12.5118 10.4154 12.6231 10.4615 12.7052 10.5436C12.7872 10.6256 12.8333 10.7369 12.8333 10.8529ZM12.8333 3.14709C12.8333 3.26313 12.7872 3.37441 12.7052 3.45645C12.6231 3.5385 12.5118 3.58459 12.3958 3.58459H10.9666C10.8692 3.94794 10.6546 4.26899 10.3561 4.49796C10.0577 4.72693 9.69198 4.85104 9.31579 4.85104C8.93961 4.85104 8.57393 4.72693 8.27546 4.49796C7.97699 4.26899 7.7624 3.94794 7.66496 3.58459H1.60413C1.54667 3.58459 1.48978 3.57328 1.4367 3.55129C1.38362 3.5293 1.33539 3.49708 1.29477 3.45645C1.25414 3.41583 1.22192 3.3676 1.19993 3.31452C1.17794 3.26144 1.16663 3.20455 1.16663 3.14709C1.16663 3.08964 1.17794 3.03275 1.19993 2.97967C1.22192 2.92659 1.25414 2.87836 1.29477 2.83773C1.33539 2.79711 1.38362 2.76488 1.4367 2.7429C1.48978 2.72091 1.54667 2.70959 1.60413 2.70959H7.66496C7.7624 2.34625 7.97699 2.0252 8.27546 1.79623C8.57393 1.56725 8.93961 1.44315 9.31579 1.44315C9.69198 1.44315 10.0577 1.56725 10.3561 1.79623C10.6546 2.0252 10.8692 2.34625 10.9666 2.70959H12.3958C12.4535 2.70881 12.5107 2.71959 12.5641 2.7413C12.6176 2.76301 12.6661 2.7952 12.7069 2.83599C12.7477 2.87677 12.7799 2.92531 12.8016 2.97875C12.8233 3.03218 12.8341 3.08942 12.8333 3.14709ZM12.8333 6.99709C12.8341 7.05476 12.8233 7.11201 12.8016 7.16544C12.7799 7.21888 12.7477 7.26742 12.7069 7.3082C12.6661 7.34898 12.6176 7.38118 12.5641 7.40289C12.5107 7.4246 12.4535 7.43538 12.3958 7.43459H5.57079C5.47335 7.79794 5.25876 8.11899 4.96029 8.34796C4.66182 8.57693 4.29614 8.70104 3.91996 8.70104C3.54378 8.70104 3.1781 8.57693 2.87963 8.34796C2.58116 8.11899 2.36657 7.79794 2.26913 7.43459H1.60413C1.48809 7.43459 1.37681 7.3885 1.29477 7.30645C1.21272 7.22441 1.16663 7.11313 1.16663 6.99709C1.16663 6.88106 1.21272 6.76978 1.29477 6.68773C1.37681 6.60569 1.48809 6.55959 1.60413 6.55959H2.26913C2.36657 6.19625 2.58116 5.8752 2.87963 5.64623C3.1781 5.41725 3.54378 5.29315 3.91996 5.29315C4.29614 5.29315 4.66182 5.41725 4.96029 5.64623C5.25876 5.8752 5.47335 6.19625 5.57079 6.55959H12.3958C12.5118 6.55959 12.6231 6.60569 12.7052 6.68773C12.7872 6.76978 12.8333 6.88106 12.8333 6.99709Z" />
    </svg>
  )
}

export function HomeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <path
        d="M21.3334 18.2456V12.3395C21.3334 11.8636 21.223 11.3926 21.009 10.9553C20.7949 10.518 20.4817 10.1234 20.0884 9.79562L13.7114 4.48246C13.3397 4.17271 12.8466 4 12.3339 4C11.8212 4 11.3281 4.17271 10.9564 4.48246L4.57837 9.79562C4.18503 10.1234 3.87181 10.518 3.65778 10.9553C3.44375 11.3926 3.33337 11.8636 3.33337 12.3395V18.2456C3.33337 18.7109 3.54409 19.1571 3.91916 19.4862C4.29423 19.8152 4.80294 20 5.33337 20H19.3334C19.8638 20 20.3725 19.8152 20.7476 19.4862C21.1227 19.1571 21.3334 18.7109 21.3334 18.2456Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function HealthTrackerIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <path
        d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M7 14L9.29289 11.7071C9.68342 11.3166 10.3166 11.3166 10.7071 11.7071L12.2929 13.2929C12.6834 13.6834 13.3166 13.6834 13.7071 13.2929L17 10M17 12.5V10H14.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function BackIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}><path d="M19 12H5M5 12l6-6M5 12l6 6" /></svg>
  )
}

export function MenuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}><path d="M6 6l12 12M18 6L6 18" /></svg>
  )
}

export function MinusIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}><path d="M5 12h14" /></svg>
  )
}

export function TrashIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" /></svg>
  )
}

export function ClockIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
  )
}

export function LocateIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="8" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></svg>
  )
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  )
}

export function ReceiptIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z" /><path d="M9 8h6M9 12h6" /></svg>
  )
}

export function UserIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></svg>
  )
}

export function TagIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}><path d="M3 12V4h8l10 10-8 8L3 12z" /><circle cx="7.5" cy="8.5" r="1" /></svg>
  )
}

export function CardIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18M7 15h3" /></svg>
  )
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M11 18h2" /></svg>
  )
}

export function CashIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}><rect x="3" y="7" width="18" height="10" rx="2" /><circle cx="12" cy="12" r="2.5" /></svg>
  )
}

export function HeartIcon({ filled = false, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}><path d="M12 20.3s-7.5-4.4-9-9.2C2 7.7 4.2 5 7 5c1.9 0 3.5 1.1 5 3 1.5-1.9 3.1-3 5-3 2.8 0 5 2.7 4 6.1-1.5 4.8-9 9.2-9 9.2z" fill={filled ? 'currentColor' : 'none'} /></svg>
  )
}

export function ListIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></svg>
  )
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}><path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" /></svg>
  )
}
