import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 16, children, ...rest }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ArrowUpRight = (p: P) => <Base {...p}><path d="M7 17 17 7M8 7h9v9" /></Base>;
export const ArrowRight = (p: P) => <Base {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Base>;
export const ArrowDown = (p: P) => <Base {...p}><path d="M12 5v14M6 13l6 6 6-6" /></Base>;
export const ArrowUp = (p: P) => <Base {...p}><path d="M12 19V5M6 11l6-6 6 6" /></Base>;
export const Download = (p: P) => <Base {...p}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></Base>;
export const Eye = (p: P) => <Base {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></Base>;
export const Mail = (p: P) => <Base {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Base>;
export const Copy = (p: P) => <Base {...p}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></Base>;
export const Check = (p: P) => <Base {...p}><path d="m5 12 5 5L20 7" /></Base>;
export const Sun = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Base>
);
export const Moon = (p: P) => <Base {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></Base>;
export const FileText = (p: P) => (
  <Base {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h4" />
  </Base>
);
export const Sparkle = (p: P) => (
  <Base {...p}>
    <path d="M12 3c.6 4.6 1.9 7.4 9 9-7.1 1.6-8.4 4.4-9 9-.6-4.6-1.9-7.4-9-9 7.1-1.6 8.4-4.4 9-9Z" />
  </Base>
);
