import "@styles/globals.scss";
import { getServerUser } from "@lib/Auth/session";

import Nav from "@components/Nav/Nav";
import { ReactNode } from "react";
import { UserProvider } from "@components/Auth/UserProvider";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app"
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await getServerUser();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{metadata.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body>
        <UserProvider user={user}>
          <Nav user={user} />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
