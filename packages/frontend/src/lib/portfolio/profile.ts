/** Everything the site says about Andreas that is not a case study. */

export const profile = {
  name: "Andreas Halvorsen Tollånes",
  shortName: "Andreas Tollånes",
  role: "Front-end developer at IoT Solutions AS",
  location: "Kristiansand, Norway",
  email: "andreas@tollanes.dev",
  phone: "+47 450 18 669",
  /** Dialable form of the number above. */
  phoneHref: "tel:+4745018669",
  github: "https://github.com/tollanes",
  linkedin: "https://www.linkedin.com/in/andreas-toll%C3%A5nes-7b438b61/",
  artstation: "https://andreastollanes.artstation.com/",
  momentbound: "https://momentbound.app"
} as const;

/** The three columns under the hero: device, platform, interface. */
export const capabilities = [
  {
    kicker: "Devices",
    title: "Firmware on custom hardware",
    body: "C++ and Python on PCB prototypes through to production. OTA updates, Modbus, MQTT, a working OCPP 1.6 client, Zigbee."
  },
  {
    kicker: "Platform",
    title: "The cloud that manages them",
    body: "Remote control, configuration and fleet administration. Measurement pipelines that aggregate meter and solar data into something usable."
  },
  {
    kicker: "Interface",
    title: "Where people actually look",
    body: "TypeScript, React, Next.js and Vue. I design as well as build, so the redesign and the implementation are the same job."
  }
] as const;

/** Smaller work that does not carry a case study of its own. */
export const alsoShipped = [
  {
    title: "QUDO / QUDO Bridge",
    body: "Firmware updates and testing for the QUDO smart solution, with continued development in Python and C++."
  },
  {
    title: "QUDO Homey app",
    body: "A smart-home app for the Homey ecosystem, integrating the Zigbee protocol."
  },
  {
    title: "Rotating energy dashboards",
    body: "Wall displays that pull meter readings and solar production, aggregate them and present them in a form people can digest."
  },
  {
    title: "Chess in three.js",
    body: "The board in the corner of this site. A recurring project — I rebuild it in whatever I am learning. Click a white piece to take over from the engine."
  },
  {
    title: "Minigame site",
    body: "An early collection of browser minigames, built while studying front-end development. Long offline."
  }
] as const;

export const experience = [
  {
    title: "Front-end developer — IoT Solutions AS",
    period: "02.2025 – present",
    body: "Rotating dashboards on smart-meter data, importing consumption and solar production, aggregated into something readable. Modernised and redesigned the Next.js app behind allmy.energy and built its solar calculator."
  },
  {
    title: "Systems developer / 3D artist — Q-Light AS",
    period: "01.2021 – 12.2024 · Kristiansand",
    body: "Overall responsibility for IT operations and technology across the organisation. Built and ran Next.js sites of varying size and complexity. Designed and handled the full lifecycle of an IoT system, from development through production and operation. Completed over fifty 3D visualisations for major clients."
  }
] as const;

export const education = [
  { title: "Front-end development — Noroff Vocational School", period: "08.2018 – 06.2020" },
  { title: "3D Game Design — Noroff Bachelor, year 2", period: "08.2013 – 06.2014" },
  { title: "3D Design and Animation — Noroff Bachelor, year 1", period: "08.2012 – 06.2013" }
] as const;

export const skills = [
  "TypeScript",
  "React",
  "Next.js",
  "Vue",
  "Node.js",
  "Python",
  "C++",
  "MQTT",
  "Modbus",
  "Zigbee",
  "OCPP 1.6",
  "three.js",
  "3D design / animation"
] as const;

export const languages = "Norwegian (native), English (fluent)";
