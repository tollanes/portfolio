import Content from "@/components/Shared/Content";
import styles from "./Home.module.scss";
import ChessGame from "@components/Chess/ChessGame";
import Button from "@/components/Shared/Button";
import Divider from "@/components/Shared/Divider";

export default function Home() {
  return (
    <main className={styles.main}>
      <ChessGame />

      <Content className={styles.content}>
        <h1 className={styles.title}>
          <span>I build the whole stack</span>
          <span>firmware on the board,</span>
          <span>dashboard on the wall.</span>
        </h1>

        <p className={styles.description}>
          Fullstack developer in Kristiansand, Norway. For the last five years I have owned systems end to end: from C++
          and Python firmware on custom PCBs, to the cloud that manages them, and the Next.js interfaces people actually
          look at. I studied as a 3D artist at first, which is why the interfaces come out polished.
        </p>

        <p className={styles.description}>Front-end developer at IoT Solutions AS.</p>

        <div className={styles.buttons}>
          <Button variant="primary" href="https://momentbound.app" newTab>
            Momentbound
          </Button>
          <Button href="https://github.com/tollanes" newTab>
            GitHub
          </Button>
          <Button href="https://www.linkedin.com/in/andreas-toll%C3%A5nes-7b438b61/" newTab>
            LinkedIn
          </Button>
        </div>

        <Divider />
      </Content>
    </main>
  );
}
