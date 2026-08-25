"use server";

import { Vector2 } from "@lib/BoardGame/Position";
import { getSessionPayload } from "@lib/Auth/sessions";
import { db, gameMoves, games } from "@portfolio/db";
import { eq } from "drizzle-orm";

export const movePieceAction = async (gameId: string, pieceId: number, from: Vector2, to: Vector2) => {
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

  const [gameMove] = await db
    .insert(gameMoves)
    .values({
      userId: user.id,
      pieceId,
      xStart: from.x,
      yStart: from.y,
      xEnd: to.x,
      yEnd: to.y
    })
    .returning();

  if (!gameMove) {
    return;
  }

  return gameMove;
};
