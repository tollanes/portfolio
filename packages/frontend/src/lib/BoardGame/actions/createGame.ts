"use server";

import { getSessionPayload } from "@lib/Auth/sessions";
import { db, games, GameTypes } from "@portfolio/db";

export const createGameAction = async (lobbyId: string, gameType: GameTypes) => {
  const user = await getSessionPayload();
  if (!user) {
    return;
  }

  const [game] = await db
    .insert(games)
    .values({
      type: gameType,
      lobbyId,
      ownerId: user.id,
      status: "waiting"
    })
    .returning();

  return game;
};
