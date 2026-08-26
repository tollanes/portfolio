import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Fragment } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";

import styles from "./CaseStudy.module.scss";
import Button from "@components/Shared/Button";
import Content from "@components/Shared/Content";
import Divider from "@components/Shared/Divider";
import Kicker from "@components/Shared/Kicker";
import PageHeader from "@components/Shared/PageHeader";
import { caseStudies, findCaseStudy, nextAfter, type WorkBlock } from "@lib/portfolio/work";

export const generateStaticParams = () => caseStudies.map((study) => ({ slug: study.slug }));

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> => {
  const study = findCaseStudy((await params).slug);

  if (!study) {
    return {};
  }

  return { title: study.title, description: study.lede };
};

const Block = ({ block }: { block: WorkBlock }) => {
  if (block.kind === "prose") {
    return (
      <section className={styles.prose}>
        <h2 className={styles.proseHeading}>{block.heading}</h2>

        <div className={styles.proseBody}>
          {block.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
    );
  }

  if (block.kind === "figure") {
    return (
      <section className={styles.plate}>
        <figure>
          <Image
            className={styles.screenshot}
            src={block.image}
            alt={block.alt}
            sizes="(max-width: 1160px) 100vw, 1112px"
            placeholder="blur"
          />
          <figcaption className={styles.caption}>{block.caption}</figcaption>
        </figure>
      </section>
    );
  }

  return (
    <section className={styles.slots}>
      <Kicker>{block.kicker}</Kicker>
      <p className={styles.slotsNote}>{block.note}</p>

      <div className={styles.slotsGrid}>
        {block.labels.map((label) => (
          <div key={label} className={styles.slot} style={{ "--slot-ratio": block.ratio } as CSSProperties}>
            <span className={styles.slotLabel}>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = findCaseStudy(slug);

  if (!study) {
    notFound();
  }

  const next = nextAfter(study.slug);

  return (
    <main>
      <Content>
        <PageHeader
          title={study.title}
          lede={study.lede}
          actions={
            study.link && (
              <Button variant="primary" href={study.link.href} newTab>
                {study.link.label}
              </Button>
            )
          }
        />

        <Divider />

        <section className={styles.facts}>
          {study.facts.map((fact) => (
            <div key={fact.label}>
              <p className={styles.factLabel}>{fact.label}</p>
              <p className={styles.factValue}>{fact.value}</p>
            </div>
          ))}
        </section>

        {study.blocks.map((block, index) => {
          // Consecutive figures sit together as one plate, so the rule between
          // them is dropped.
          const previous = study.blocks[index - 1];
          const flush = previous?.kind === "figure" && block.kind === "figure";

          return (
            <Fragment key={index}>
              {!flush && <Divider />}
              <Block block={block} />
            </Fragment>
          );
        })}

        <div className={styles.next}>
          <Button href={next.href}>{next.label}</Button>
        </div>
      </Content>
    </main>
  );
}
