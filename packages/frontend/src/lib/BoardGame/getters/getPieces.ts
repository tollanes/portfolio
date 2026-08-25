import "server-only";
import { getSessionPayload } from "@lib/Auth/sessions";
import { db, games } from "@portfolio/db";
import { eq } from "drizzle-orm";

export const getPieces = async (gameId: string) => {
  const user = await getSessionPayload();
  if (!user) {
    return;
  }

  const game = await db.query.games.findFirst({
    where: eq(games.id, gameId),
    with: {
      pieces: true,
      lobby: {
        with: {
          lobbyMembers: true
        }
      }
    }
  });

  if (!game) {
    return;
  }

  if (game.lobby?.lobbyMembers.find((member) => member.userId === user.id)) {
    return game.pieces;
  }
};
