"use server";

import { GamePieceInsert, db, gamePieces, games } from "@portfolio/db";
import { getSessionPayload } from "@lib/Auth/sessions";
import { and, eq } from "drizzle-orm";

export const createPiecesAction = async (gameId: string, piecesInput: GamePieceInsert[]) => {
  const user = await getSessionPayload();
  if (!user) {
    return;
  }

  const [game] = await db
    .select()
    .from(games)
    .where(and(eq(games.id, gameId), eq(games.ownerId, user.id)))
    .limit(1);

  if (!game) {
    return;
  }

  await db.insert(gamePieces).values(piecesInput).onConflictDoNothing();

  return db.select().from(gamePieces).where(eq(gamePieces.gameId, gameId));
};
