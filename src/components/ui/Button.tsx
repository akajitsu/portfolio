import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

type Common = {
  children: ReactNode;
  variant?: Variant;
  icon?: ReactNode;
  className?: string;
  size?: "md" | "sm";
};

type AsLink = Common & {
  href: string;
  external?: boolean;
  download?: string | boolean;
  disabled?: false;
  onClick?: never;
};
type AsButton = Common & { href?: undefined; onClick?: () => void; disabled?: boolean; type?: "button" | "submit" };
/** Renders a non-interactive pill with a reason — for things like a resume that isn't uploaded yet. */
type AsDisabled = Common & { href?: string; disabled: true; disabledLabel?: string };

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 rounded-full font-medium tracking-[0.01em] whitespace-nowrap transition-[background-color,color,border-color,transform,box-shadow] duration-500 ease-out-expo active:scale-[0.97]";

const sizes = {
  md: "h-12 px-6 text-[0.9rem]",
  sm: "h-10 px-4 text-sm",
};

/** A soft band of light that sweeps across the button on hover. */
const sheen =
  "overflow-hidden before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/2 before:w-1/2 before:-skew-x-12 before:bg-linear-to-r before:from-transparent before:via-white/35 before:to-transparent before:-translate-x-full before:transition-transform before:duration-[900ms] before:ease-out hover:before:translate-x-[420%]";

const variants: Record<Variant, string> = {
  // Midnight ink by day, champagne gold by night.
  primary:
    sheen +
    " bg-ink text-paper shadow-[0_10px_30px_-14px_rgba(16,23,43,0.55)] hover:bg-accent dark:bg-accent dark:text-night dark:shadow-[0_10px_34px_-14px_rgba(228,197,139,0.45)] dark:hover:bg-[#f0d9a6]",
  // Minimal gold outline.
  secondary: sheen + " border border-moon/55 bg-card/30 text-ink backdrop-blur hover:border-moon hover:bg-moon/10 hover:text-accent",
  ghost: "!px-3 text-ink hover:text-accent",
};

/** Icon slot that nudges on hover. */
function IconSlot({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex transition-transform duration-300 ease-out-expo group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5">
      {children}
    </span>
  );
}

export default function Button(props: AsLink | AsButton | AsDisabled) {
  const { children, variant = "primary", icon, className, size = "md" } = props;
  const cls = cn(base, sizes[size], variants[variant], className);

  if (props.disabled && "disabledLabel" in props) {
    return (
      <span
        aria-disabled="true"
        title={props.disabledLabel}
        className={cn(base, sizes[size], "cursor-not-allowed border border-dashed border-moon/40 text-mute active:scale-100", className)}
      >
        {children}
        {props.disabledLabel && (
          <span className="rounded-full bg-paper-2 px-2 py-0.5 text-xs font-normal">
            {props.disabledLabel}
          </span>
        )}
      </span>
    );
  }

  if (typeof props.href === "string" && !props.disabled) {
    const { href, external, download } = props as AsLink;
    const content = (
      <>
        {children}
        {icon && <IconSlot>{icon}</IconSlot>}
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </>
    );
    if (external || download || href.startsWith("mailto:") || /\.[a-z0-9]+$/i.test(href)) {
      return (
        <a
          href={href}
          className={cls}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...(download ? { download: download === true ? "" : download } : {})}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {content}
      </Link>
    );
  }

  const { onClick, disabled, type = "button" } = props as AsButton;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cn(cls, "disabled:cursor-not-allowed disabled:opacity-50")}>
      {children}
      {icon && <IconSlot>{icon}</IconSlot>}
    </button>
  );
}
