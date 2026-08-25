"use server";

import { db, games, GameStatus } from "@portfolio/db";
import { and, eq } from "drizzle-orm";
import { getSessionPayload } from "@lib/Auth/sessions";

export const closeGameAction = async (gameId: string) => {
  const user = await getSessionPayload();
  if (!user) {
    return false;
  }

  const [game] = await db
    .update(games)
    .set({
      finishedAt: new Date(),
      status: GameStatus.finished
    })
    .where(and(eq(games.id, gameId), eq(games.ownerId, user.id)))
    .returning();

  return game;
};
