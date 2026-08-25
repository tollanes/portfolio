"use server";

import { getSessionPayload } from "@lib/Auth/sessions";
import { db, lobbies, lobbyMembers } from "@portfolio/db";
import { eq } from "drizzle-orm";
import { comparePassword } from "@lib/Auth/hashing";
import { cookies } from "next/headers";

export const joinLobbyAction = async (name: string, password: string) => {
  const user = await getSessionPayload();
  if (!user) {
    return;
  }

  const lobby = await db.query.lobbies.findFirst({
    where: eq(lobbies.name, name),
    with: {
      lobbyMembers: true
    }
  });

  if (!lobby || !lobby.password) {
    return;
  }

  if (lobby.lobbyMembers.find((member) => member.userId === user.id)) {
    return;
  }

  if (lobby.lobbyMembers.length >= lobby.maxPlayers) {
    return;
  }

  if (!comparePassword(password, lobby.password)) {
    return;
  }

  await db.insert(lobbyMembers).values({
    lobbyId: lobby.id,
    userId: user.id
  });

  const result = await db.query.lobbies.findFirst({
    where: eq(lobbies.id, lobby.id),
    with: {
      lobbyMembers: {
        with: {
          user: true
        }
      }
    }
  });

  if (!result) {
    return;
  }

  (await cookies()).set("lobbyId", lobby.id.toString(), {
    path: "/",
    httpOnly: true
  });

  return result;
};
