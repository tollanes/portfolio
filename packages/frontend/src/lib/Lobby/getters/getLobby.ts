import "server-only";

import { getSessionPayload } from "@lib/Auth/sessions";
import { db, lobbies } from "@portfolio/db";
import { eq } from "drizzle-orm";
import { LobbyType } from "@lib/Lobby/types";

export const getLobby = async (lobbyId: string): Promise<{ error?: string; lobby?: LobbyType }> => {
  const user = await getSessionPayload();
  if (!user) {
    return { error: "No user found" };
  }
  if (!lobbyId) {
    return { error: "No lobbyId found" };
  }

  const lobby = await db.query.lobbies.findFirst({
    where: eq(lobbies.id, lobbyId),
    with: {
      lobbyMembers: {
        with: {
          user: true
        }
      }
    }
  });

  if (!lobby) {
    return { error: "Failed to find lobby" };
  }

  const result = lobby as LobbyType;
  delete (result as { password?: string | null }).password;
  for (const member of result.lobbyMembers) {
    member.user.password = null;
  }

  if (result.lobbyMembers.find((member) => member.userId === user.id)) {
    return { lobby: result };
  }

  return { error: "User not found in lobby" };
};
