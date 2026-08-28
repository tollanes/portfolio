import Image from "next/image";
import Link from "next/link";

import styles from "./Home.module.scss";
import Button from "@components/Shared/Button";
import Content from "@components/Shared/Content";
import Divider from "@components/Shared/Divider";
import Kicker from "@components/Shared/Kicker";
import { alsoShipped, capabilities, profile } from "@lib/portfolio/profile";
import { caseStudies } from "@lib/portfolio/work";
import { featuredRender } from "@lib/portfolio/renders";

export default function Home() {
  return (
    <main>
      <Content>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            <span>I build the whole stack —</span>
            <span>firmware on the board,</span>
            <span>dashboard on the wall.</span>
          </h1>

          <p className={styles.heroLede}>
            Fullstack developer in {profile.location}. For the last five years I have owned systems end to end: from C++
            and Python firmware on custom PCBs, to the cloud that manages them, and the Next.js interfaces people
            actually look at. I studied as a 3D artist at first, which is why the interfaces come out polished.
          </p>

          <p className={styles.heroLede}>{profile.role}. Open to new work, remote first.</p>

          <div className={styles.heroActions}>
            <Button variant="primary" href="/work/momentbound">
              Momentbound
            </Button>
            <Button href={profile.github} newTab>
              GitHub
            </Button>
            <Button href={profile.linkedin} newTab>
              LinkedIn
            </Button>
          </div>
        </section>

        <Divider />

        <section className={styles.capabilities}>
          {capabilities.map((capability) => (
            <div key={capability.kicker}>
              <Kicker size="sm" className={styles.capabilityKicker}>
                {capability.kicker}
              </Kicker>
              <p className={styles.capabilityTitle}>{capability.title}</p>
              <p className={styles.capabilityBody}>{capability.body}</p>
            </div>
          ))}
        </section>

        <Divider />

        <section className={styles.work}>
          <Kicker className={styles.sectionKicker}>Selected work</Kicker>

          {caseStudies.map((study, index) => (
            <Link key={study.slug} className={styles.workRow} href={`/work/${study.slug}`}>
              <p className={styles.workIndex}>{String(index + 1).padStart(2, "0")}</p>
              <h2 className={styles.workTitle}>{study.title}</h2>
              <p className={styles.workSummary}>{study.summary}</p>
              <span className={styles.workRead}>Read</span>
            </Link>
          ))}
        </section>

        <Divider />

        <section className={styles.shipped}>
          <Kicker className={styles.sectionKicker}>Also shipped</Kicker>

          <div className={styles.shippedGrid}>
            {alsoShipped.map((item) => (
              <div key={item.title} className={styles.shippedCell}>
                <h3 className={styles.shippedTitle}>{item.title}</h3>
                <p className={styles.shippedBody}>{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        <section className={styles.renders}>
          <div className={styles.rendersCopy}>
            <Kicker className={styles.sectionKicker}>Before the code</Kicker>
            <h2 className={styles.rendersTitle}>Two years of 3D, then everything else</h2>
            <p className={styles.rendersBody}>
              I studied 3D design, animation and game design at Noroff before front-end development, and kept doing it
              professionally: over fifty visualisations for clients at Q-Light. It is a side thing now, but it is the
              reason I care about how things look.
            </p>
            <div className={styles.rendersAction}>
              <Button href="/3d">See the gallery</Button>
            </div>
          </div>

          <Link className={styles.rendersImage} href="/3d">
            <Image
              src={featuredRender.image}
              alt={featuredRender.alt}
              sizes="(max-width: 900px) 100vw, 560px"
              placeholder="blur"
            />
          </Link>
        </section>
      </Content>

      <section className={styles.band}>
        <Content className={styles.bandInner}>
          <h3 className={styles.bandTitle}>
            <span>Looking for remote work.</span>
            <span>Let us talk.</span>
          </h3>

          <div className={styles.bandActions}>
            <Button variant="inverse" href={`mailto:${profile.email}`}>
              {profile.email}
            </Button>
            <Button variant="inverse" href={profile.phoneHref}>
              {profile.phone}
            </Button>
          </div>
        </Content>
      </section>
    </main>
  );
}
