import styles from "./Divider.module.scss";

const Divider = ({ margin = "4rem 0" }: { margin?: string }) => <hr className={styles.divider} style={{ margin }} />;

export default Divider;
