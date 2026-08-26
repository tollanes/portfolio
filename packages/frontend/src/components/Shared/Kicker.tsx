import type { PropsWithChildren } from "react";

import styles from "./Kicker.module.scss";

/** The small uppercase accent label that opens a section. */
const Kicker = ({
  children,
  size = "md",
  className
}: PropsWithChildren<{ size?: "sm" | "md"; className?: string }>) => (
  <p className={[styles.kicker, size === "sm" && styles.sm, className].filter(Boolean).join(" ")}>{children}</p>
);

export default Kicker;
