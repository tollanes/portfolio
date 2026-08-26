import type { PropsWithChildren } from "react";
import styles from "./Content.module.scss";

const Content = ({ children, className }: PropsWithChildren & { className?: string }) => {
  return <div className={[styles.content, className].filter(Boolean).join(" ")}>{children}</div>;
};

export default Content;
