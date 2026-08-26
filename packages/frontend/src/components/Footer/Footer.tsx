import styles from "./Footer.module.scss";
import { profile } from "@lib/portfolio/profile";

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      {profile.name} — {profile.location}
    </div>
  </footer>
);

export default Footer;
