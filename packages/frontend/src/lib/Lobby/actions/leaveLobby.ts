"use server";

import { getSessionPayload } from "@lib/Auth/sessions";
import { db, lobbies, lobbyMembers } from "@portfolio/db";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { removeLobbyIdCookie } from "@lib/Lobby/lobbyStorage";

export const leaveLobbyAction = async (): Promise<boolean> => {
  const user = await getSessionPayload();
  if (!user || !user.id) {
    return false;
  }

  const lobbyId = (await cookies()).get("lobbyId")?.value;
  if (!lobbyId) {
    return false;
  }

  const lobby = await db.query.lobbies.findFirst({
    where: eq(lobbies.id, lobbyId),
    with: {
      lobbyMembers: true
    }
  });

  if (!lobby) {
    return false;
  }

  if (lobby.lobbyMembers.find((member) => member.userId === user.id)) {
    await db
      .delete(lobbyMembers)
      .where(and(eq(lobbyMembers.lobbyId, lobby.id), eq(lobbyMembers.userId, user.id)));
  }

  removeLobbyIdCookie();

  return true;
};
