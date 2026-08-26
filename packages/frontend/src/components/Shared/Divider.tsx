import styles from "./Divider.module.scss";

/**
 * The 2px rule between major sections. Flush by default — sections carry their
 * own padding, so the rule sits directly on the edge of the block above it.
 */
const Divider = ({ margin = "0" }: { margin?: string }) => <hr className={styles.divider} style={{ margin }} />;

export default Divider;
