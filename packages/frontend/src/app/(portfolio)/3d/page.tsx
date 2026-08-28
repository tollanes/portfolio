import type { Metadata } from "next";

import styles from "./Renders.module.scss";
import Button from "@components/Shared/Button";
import Content from "@components/Shared/Content";
import Divider from "@components/Shared/Divider";
import Gallery from "@components/Media/Gallery";
import PageHeader from "@components/Shared/PageHeader";
import { profile } from "@lib/portfolio/profile";
import { renders } from "@lib/portfolio/renders";

export const metadata: Metadata = {
  title: "3D work",
  description:
    "Architectural and product visualisation — over fifty pieces for major clients, plus the studio work behind them."
};

export default function Renders() {
  return (
    <main>
      <Content>
        <PageHeader
          title="3D work"
          lede="Architectural and product visualisation. I studied 3D design, animation and game design at Noroff, then completed more than fifty visualisations for major clients while at Q-Light."
          actions={
            <Button variant="primary" href={profile.artstation} newTab>
              Full portfolio on ArtStation
            </Button>
          }
        />

        <Divider />

        <section className={styles.gallery}>
          <Gallery items={renders} />
        </section>

        <div className={styles.next}>
          <Button href="/about">About me</Button>
        </div>
      </Content>
    </main>
  );
}
