import "server-only";
import { getSessionPayload } from "@lib/Auth/sessions";
import { db, games } from "@portfolio/db";
import { eq } from "drizzle-orm";

export const getGame = async (id: string) => {
  const user = await getSessionPayload();
  if (!user) {
    return;
  }

  const game = await db.query.games.findFirst({
    where: eq(games.id, id),
    with: {
      lobby: {
        with: {
          lobbyMembers: true
        }
      },
      owner: true,
      winner: true,
      pieces: true
    }
  });

  if (!game) {
    return;
  }

  if (game.lobby?.lobbyMembers.find((member) => member.userId === user.id)) {
    return game;
  }
};
