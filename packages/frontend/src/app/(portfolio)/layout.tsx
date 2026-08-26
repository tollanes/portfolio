import type { ReactNode } from "react";

import styles from "./portfolio.module.scss";
import ChessGame from "@components/Chess/ChessGame";
import Footer from "@components/Footer/Footer";

/**
 * The public site. The chess widget lives here rather than on a page so the
 * game keeps playing while you read — it is a sprinkle in the corner, not a
 * feature of the landing page.
 */
export default function PortfolioLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.page}>
      {children}
      <Footer />
      <ChessGame />
    </div>
  );
}
