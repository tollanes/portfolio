import type { StaticImageData } from "next/image";

import allmyHome from "@/assets/work/allmy-home.png";
import allmyMeter from "@/assets/work/allmy-meter.png";
import allmySimulator from "@/assets/work/allmy-simulator.png";
import qcloudDevices from "@/assets/work/qcloud-devices.png";
import qcloudMqtt from "@/assets/work/qcloud-mqtt.png";

/**
 * One row of a case study. Blocks render in order, separated by the 2px rule —
 * except consecutive figures, which sit together as a single plate.
 */
export type WorkBlock =
  | { kind: "prose"; heading: string; paragraphs: string[] }
  | { kind: "figure"; image: StaticImageData; alt: string; caption: string }
  /** Reserved cells for imagery that does not exist yet. */
  | { kind: "slots"; kicker: string; note: string; ratio: string; labels: string[] };

export interface CaseStudy {
  slug: string;
  title: string;
  /** One line for the work list on the landing page. */
  summary: string;
  /** The opening paragraph of the case study itself. */
  lede: string;
  link?: { label: string; href: string };
  facts: { label: string; value: string }[];
  blocks: WorkBlock[];
}

/** Order is the order of the work list, and the order the Next links follow. */
export const caseStudies: CaseStudy[] = [
  {
    slug: "momentbound",
    title: "Momentbound",
    summary: "A cross-platform collaborative photo-journaling app. My own product, designed and built end to end.",
    lede: "Momentbound is a cross-platform collaborative photo-journaling app for turning shared photos and videos into organized, location-based travel memories.",
    link: { label: "momentbound.app", href: "https://momentbound.app" },
    facts: [
      { label: "Role", value: "Founder, designer, developer" },
      { label: "Platforms", value: "iOS, Android, web" },
      { label: "Stack", value: "TypeScript, React, Node.js" },
      { label: "Status", value: "In active development" }
    ],
    blocks: [
      {
        kind: "prose",
        heading: "The problem",
        paragraphs: [
          "A trip produces photos on five phones and they never end up in the same place. Group chats scroll away, shared albums are an afterthought in every platform, and nobody wants to be the person who collects everything afterwards."
        ]
      },
      {
        kind: "prose",
        heading: "My approach",
        paragraphs: [
          "I designed and built the product around simple group contribution, allowing friends and family to upload media together and create shared journeys without the friction of traditional photo sharing.",
          "Media carries its own location and time, so the journey assembles itself: contributions land on a map and a timeline rather than in a folder someone has to sort. One shared journey, many contributors, no coordination step."
        ]
      },
      {
        kind: "prose",
        heading: "Where it stands",
        paragraphs: [
          "Running on iOS, Android and the web from a single codebase. It is the project where I make every call myself — product, design, backend and release — and the one I use to keep the whole stack in my hands."
        ]
      },
      {
        kind: "slots",
        kicker: "Screens",
        note: "App screenshots go here.",
        ratio: "9 / 16",
        labels: ["Journey view", "Map", "Group upload"]
      }
    ]
  },
  {
    slug: "allmy",
    title: "allmy.energy",
    summary:
      "Modernised and redesigned the Next.js app, and built a solar calculator on simulated and real consumption data.",
    lede: "An energy platform for property managers: metering points across clients, buildings and rooms, with consumption and cost in one place.",
    facts: [
      { label: "Role", value: "Front-end developer, IoT Solutions AS" },
      { label: "Year", value: "2025 – present" },
      { label: "Stack", value: "Next.js, TypeScript, React" },
      { label: "Data", value: "Smart meters, PVSol simulation" }
    ],
    blocks: [
      {
        kind: "prose",
        heading: "The problem",
        paragraphs: [
          "The app worked but had aged, and the questions it needed to answer had grown. A property manager wants to know what a portfolio actually costs, and whether putting panels on a particular roof would pay for itself. Neither answer was available."
        ]
      },
      {
        kind: "prose",
        heading: "My approach",
        paragraphs: [
          "I updated and modernised the Next.js app behind allmy.energy, then redesigned it and implemented the new design. The asset hierarchy — client, building, section, metering point — became the spine of the interface, so the same tree drives navigation, favourites and reporting.",
          "On top of that I built a new solar calculator based on simulated solar production from PVSol combined with real measured consumption, so a projection is grounded in what the building actually uses rather than an average."
        ]
      },
      {
        kind: "figure",
        image: allmyHome,
        alt: "allmy.energy portfolio overview with the client and building tree, metering points and consumption",
        caption: "Portfolio overview — the asset tree on the left, headline consumption on the right."
      },
      {
        kind: "figure",
        image: allmySimulator,
        alt: "The simulator comparing current and simulated energy costs month by month",
        caption: "Simulator — current cost against simulated cost, month by month, from a year of real consumption."
      },
      {
        kind: "figure",
        image: allmyMeter,
        alt: "Meter detail page with map, general information and grid products",
        caption: "Meter detail — location, grid vendor products and tariff history on one page."
      },
      {
        kind: "prose",
        heading: "Result",
        paragraphs: [
          "A managed portfolio is legible at a glance, and a solar investment can be argued with numbers from the building itself. The same measurement pipeline also feeds the rotating wall dashboards I built for import and solar production."
        ]
      }
    ]
  },
  {
    slug: "qcloud",
    title: "Queno & Q-Cloud",
    summary:
      "Firmware for charging hardware — OTA, Modbus, MQTT, a working OCPP 1.6 client — and the cloud platform that runs the fleet.",
    lede: "Firmware on custom PCBs and the cloud platform that manages them. One system, from the bootloader to the device list.",
    facts: [
      { label: "Role", value: "Systems developer, Q-Light AS" },
      { label: "Year", value: "2021 – 2024" },
      { label: "Firmware", value: "C++, Python, OTA, Modbus, MQTT, OCPP 1.6" },
      { label: "Cloud", value: "Next.js, TypeScript" }
    ],
    blocks: [
      {
        kind: "prose",
        heading: "The problem",
        paragraphs: [
          "Hardware in the field cannot be visited. Every device needs to be updatable, configurable and observable from wherever it happens to be installed, and charging hardware has to speak OCPP to whatever back office the customer already runs."
        ]
      },
      {
        kind: "prose",
        heading: "My approach",
        paragraphs: [
          "I wrote the firmware for the Queno PCB prototypes: OTA updates, Modbus, MQTT communication and a fully functional OCPP 1.6 client. Then I built Q-Cloud, the cloud IoT solution around it, with OCPP support, remote control, configuration and administration of Queno devices.",
          "Because I owned both ends, the protocol was designed once. The MQTT topics the firmware publishes are the same ones the platform inspects, which makes debugging a matter of reading the live message stream rather than guessing across a boundary."
        ]
      },
      {
        kind: "figure",
        image: qcloudDevices,
        alt: "Q-Cloud device list with status, firmware and model per device, and connectors nested beneath",
        caption: "Fleet view — devices with live status and firmware version, connectors nested beneath each unit."
      },
      {
        kind: "figure",
        image: qcloudMqtt,
        alt: "Device page showing the live MQTT message stream between cloud and device",
        caption:
          "Device page — the live MQTT stream, cloud on one side and device on the other, with a publish field at the bottom."
      },
      {
        kind: "prose",
        heading: "Result",
        paragraphs: [
          "Devices went from prototype PCB to production and are managed remotely. Alongside this I had overall responsibility for IT operations and technology across the organisation, and did the same firmware and testing work on the QUDO smart solution and its Homey app."
        ]
      }
    ]
  },
  {
    slug: "onepole",
    title: "ONEPOLE",
    summary: "Led the site and its ongoing operation, and produced the product renders it runs on.",
    lede: "A product site where the product had never been photographed. I led the development and operation of the site, and rendered everything on it.",
    facts: [
      { label: "Role", value: "Lead developer and 3D artist" },
      { label: "Year", value: "2021 – 2024" },
      { label: "Stack", value: "Next.js, TypeScript" },
      { label: "Imagery", value: "Product renders, in-house" }
    ],
    blocks: [
      {
        kind: "prose",
        heading: "My approach",
        paragraphs: [
          "I led the development and operation of the ONEPOLE site, with responsibility for content updates and for producing the high-quality product renders it runs on.",
          "Doing both meant the imagery and the layout were designed together. A render can be framed to the crop the page needs, at whatever resolution the page needs, and a product variant is a material swap rather than a photo shoot."
        ]
      },
      {
        kind: "prose",
        heading: "Result",
        paragraphs: [
          "A site I ran for three years without a photographer. It is also the clearest case for the combination: developer and 3D artist in one person removes a whole handover."
        ]
      },
      {
        kind: "slots",
        kicker: "Renders",
        note: "The ONEPOLE product renders go here.",
        ratio: "4 / 3",
        labels: ["Product render", "In situ", "Site page"]
      }
    ]
  }
];

export const findCaseStudy = (slug: string) => caseStudies.find((study) => study.slug === slug);

/**
 * The link at the foot of a case study. The last one hands off to the 3D
 * gallery rather than looping back to the top of the list.
 */
export const nextAfter = (slug: string) => {
  const index = caseStudies.findIndex((study) => study.slug === slug);
  const next = caseStudies[index + 1];

  if (!next) {
    return { label: "Next: the 3D gallery", href: "/3d" };
  }

  return { label: `Next: ${next.title}`, href: `/work/${next.slug}` };
};
