import Link from "next/link";

import styles from "./Nav.module.scss";
import Button from "@components/Shared/Button";
import { profile } from "@lib/portfolio/profile";

const Nav = () => (
  <nav className={styles.nav}>
    <Link className={styles.brand} href="/">
      {profile.shortName}
    </Link>

    <Link className={styles.link} href="/">
      Work
    </Link>
    <Link className={styles.link} href="/3d">
      3D
    </Link>
    <Link className={styles.link} href="/about">
      About
    </Link>

    <Button variant="primary" href={`mailto:${profile.email}`}>
      {profile.email}
    </Button>
  </nav>
);

export default Nav;
