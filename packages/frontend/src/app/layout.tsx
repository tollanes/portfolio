import "@styles/globals.scss";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Archivo } from "next/font/google";

import Nav from "@components/Nav/Nav";
import { UserProvider } from "@components/Auth/UserProvider";
import { getSessionPayload } from "@lib/Auth/sessions";
import { profile } from "@lib/portfolio/profile";

/** The system is set entirely in Archivo. Variable, so no weight list. */
const archivo = Archivo({ subsets: ["latin"], display: "swap", variable: "--font-archivo" });

export const metadata: Metadata = {
  title: {
    default: `${profile.shortName} — fullstack developer`,
    template: `%s — ${profile.shortName}`
  },
  description:
    "Fullstack developer in Kristiansand, Norway. Firmware on custom hardware, the cloud that manages it, and the interfaces people actually look at."
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await getSessionPayload();

  return (
    <html lang="en" className={archivo.variable}>
      <body>
        <UserProvider userData={user}>
          <Nav />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
