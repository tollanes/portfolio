import type { PropsWithChildren } from "react";
import Link from "next/link";

import styles from "./Button.module.scss";

/**
 * primary  — filled, one per view
 * secondary — outlined, on a light background
 * inverse  — outlined, on the accent band
 */
export type ButtonVariant = "primary" | "secondary" | "inverse";

interface Common {
  variant?: ButtonVariant;
  className?: string;
}

interface AsLink extends Common {
  /** A route, mailto:, tel: or external URL. Renders an anchor. */
  href: string;
  newTab?: boolean;
  onClick?: never;
  type?: never;
  disabled?: never;
}

interface AsButton extends Common {
  href?: never;
  newTab?: never;
  onClick: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

type ButtonProps = PropsWithChildren<AsLink | AsButton>;

/** Internal routes go through next/link; mailto, tel and external URLs do not. */
const isRoute = (href: string) => href.startsWith("/");

const Button = ({ children, variant = "secondary", className, ...props }: ButtonProps) => {
  const classes = [styles.button, styles[variant], className].filter(Boolean).join(" ");

  if (props.href === undefined) {
    const { onClick, type = "button", disabled } = props;

    return (
      <button type={type} className={classes} onClick={onClick} disabled={disabled}>
        {children}
      </button>
    );
  }

  const { href, newTab } = props;
  const target = newTab ? { target: "_blank", rel: "noreferrer" } : {};

  if (isRoute(href)) {
    return (
      <Link href={href} className={classes} {...target}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} {...target}>
      {children}
    </a>
  );
};

export default Button;
