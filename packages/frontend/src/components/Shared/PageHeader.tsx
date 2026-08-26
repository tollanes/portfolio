import type { ReactNode } from "react";
import Link from "next/link";

import styles from "./PageHeader.module.scss";

interface PageHeaderProps {
  title: string;
  lede: string;
  /** A second paragraph under the lede, in the muted copy tone. */
  note?: string;
  /** Buttons that sit at the foot of the header. */
  actions?: ReactNode;
}

/** The opening of every page below the landing page: back out, title, lede. */
const PageHeader = ({ title, lede, note, actions }: PageHeaderProps) => (
  <header className={styles.header}>
    <Link className={styles.back} href="/">
      ← All work
    </Link>

    <h1 className={styles.title}>{title}</h1>
    <p className={styles.lede}>{lede}</p>
    {note && <p className={styles.note}>{note}</p>}

    {actions && <div className={styles.actions}>{actions}</div>}
  </header>
);

export default PageHeader;
