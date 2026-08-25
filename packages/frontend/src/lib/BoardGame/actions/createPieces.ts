"use server";

import { Prisma } from "@prisma/client";
import { getSessionPayload } from "@lib/Auth/sessions";
import prisma from "@db/prisma";

export const createPiecesAction = async (gameId: string, piecesInput: Prisma.GamePieceCreateManyInput[]) => {
  const user = await getSessionPayload();
  if (!user) {
    return;
  }

  const game = await prisma.game.findUnique({
    where: {
      id: gameId,
      ownerId: user.id
    }
  });

  if (!game) {
    return;
  }

  await prisma.gamePiece.createMany({
    data: piecesInput,
    skipDuplicates: true
  });

  return prisma.gamePiece.findMany({
    where: {
      gameId: gameId
    }
  });
};
