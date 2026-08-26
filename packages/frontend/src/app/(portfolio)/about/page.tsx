import type { Metadata } from "next";

import styles from "./About.module.scss";
import Content from "@components/Shared/Content";
import Divider from "@components/Shared/Divider";
import PageHeader from "@components/Shared/PageHeader";
import Tag from "@components/Shared/Tag";
import { education, experience, languages, profile, skills } from "@lib/portfolio/profile";

export const metadata: Metadata = {
  title: "About",
  description:
    "Andreas Halvorsen Tollånes — fullstack developer in Kristiansand, Norway. Experience, education, skills and how to reach me."
};

export default function About() {
  return (
    <main>
      <Content>
        <PageHeader
          title="About"
          lede="I started in 3D and moved into code, and the two have not really separated since. What I want from a role is the full width of a system: the device, the service and the interface, rather than one layer of it."
          note={`Based in ${profile.location}. Looking for remote work primarily. Climbing is how I stay active and gaming with friends is how I switch off.`}
        />

        <Divider />

        <section className={styles.row}>
          <h2 className={styles.rowHeading}>Experience</h2>

          <div className={styles.rowBody}>
            {experience.map((role) => (
              <div key={role.title} className={styles.role}>
                <p className={styles.roleTitle}>{role.title}</p>
                <p className={styles.rolePeriod}>{role.period}</p>
                <p className={styles.roleBody}>{role.body}</p>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        <section className={styles.row}>
          <h2 className={styles.rowHeading}>Education</h2>

          <div className={`${styles.rowBody} ${styles.schools}`}>
            {education.map((school) => (
              <div key={school.title}>
                <p className={styles.schoolTitle}>{school.title}</p>
                <p className={styles.rolePeriod}>{school.period}</p>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        <section className={styles.row}>
          <h2 className={styles.rowHeading}>Skills</h2>

          <div className={`${styles.rowBody} ${styles.tags}`}>
            {skills.map((skill) => (
              <Tag key={skill}>{skill}</Tag>
            ))}
          </div>
        </section>

        <Divider />

        <section className={`${styles.row} ${styles.contact}`}>
          <h2 className={styles.rowHeading}>Contact</h2>

          <div className={`${styles.rowBody} ${styles.contactList}`}>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={profile.phoneHref}>{profile.phone}</a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              github.com/tollanes
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={profile.artstation} target="_blank" rel="noreferrer">
              ArtStation
            </a>
            <span className={styles.languages}>{languages}</span>
          </div>
        </section>
      </Content>
    </main>
  );
}
