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
  "group/btn relative inline-flex select-none items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,color,border-color,transform,box-shadow] duration-300 ease-out-expo active:scale-[0.97]";

const sizes = {
  md: "h-12 px-6 text-[0.95rem]",
  sm: "h-10 px-4 text-sm",
};

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-accent dark:bg-accent dark:hover:bg-ink",
  secondary: "border border-line bg-card/60 text-ink backdrop-blur hover:border-ink",
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
        className={cn(base, sizes[size], "cursor-not-allowed border border-dashed border-line text-mute active:scale-100", className)}
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
