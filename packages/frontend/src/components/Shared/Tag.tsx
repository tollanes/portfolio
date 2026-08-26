import type { PropsWithChildren } from "react";

import styles from "./Tag.module.scss";

/** An outlined label. Used for the skill list. */
const Tag = ({ children }: PropsWithChildren) => <span className={styles.tag}>{children}</span>;

export default Tag;
