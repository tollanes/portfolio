"use client";

import styles from "./Nav.module.scss";
import Link from "next/link";
import { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { signOutAction } from "@lib/Auth/actions/signOutAction";
import { UserSession } from "@lib/Auth/types";

const Nav = ({ user }: { user?: UserSession | null }) => {
  const router = useRouter();

  const handleSignOut = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    await signOutAction();
    router.refresh();
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navContent}>
        <Link className={styles.navLogo} href="/">
          Andreas Tollånes
        </Link>

        <ul className={styles.navItems}>
          <li className={styles.navItem}>
            <Link href="/">Work</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/3d">3D</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/about">About</Link>
          </li>

          <li>
            <a href="mailto:andreas@tollanes.dev">andreas@tollanes.dev</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
