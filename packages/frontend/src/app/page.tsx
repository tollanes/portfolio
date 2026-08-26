import styles from "./page.module.css";
import ChessGame from "@components/Chess/ChessGame";

export default function Home() {
  return (
    <main className={styles.main}>
      <ChessGame />
    </main>
  );
}
