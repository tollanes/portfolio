"use server";

import { getSessionPayload } from "@lib/Auth/sessions";
import { hashPassword } from "@lib/Auth/hashing";
import { db, lobbies, lobbyMembers } from "@portfolio/db";
import { eq } from "drizzle-orm";
import { saveLobbyIdCookie } from "@lib/Lobby/lobbyStorage";
import { LobbyType } from "@lib/Lobby/types";

export const createLobbyAction = async (name: string, password: string) => {
  console.log("createLobbyAction");
  console.log(name, password);

  try {
    const user = await getSessionPayload();
    if (!user) {
      return { error: ":createLobbyAction No user found" };
    }

    const hashedPassword = hashPassword(password);

    const lobby = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(lobbies)
        .values({
          name,
          password: hashedPassword
        })
        .returning();

      await tx.insert(lobbyMembers).values({
        lobbyId: created.id,
        userId: user.id
      });

      return tx.query.lobbies.findFirst({
        where: eq(lobbies.id, created.id),
        with: {
          lobbyMembers: {
            with: {
              user: true
            }
          }
        }
      });
    });

    if (!lobby) {
      return { error: "Failed to create lobby" };
    }

    console.log(lobby);

    await saveLobbyIdCookie(lobby.id.toString());

    const result = lobby as LobbyType;
    delete (result as { password?: string | null }).password;
    for (const member of result.lobbyMembers) {
      member.user.password = null;
    }

    return { lobby: result };
  } catch (error) {
    console.error(error);
    return { error: error };
  }
};
