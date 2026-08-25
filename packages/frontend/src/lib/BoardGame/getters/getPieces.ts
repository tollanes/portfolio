import "server-only";
import { getSessionPayload } from "@lib/Auth/sessions";
import prisma from "@db/prisma";

export const getPieces = async (gameId: string) => {
  const user = await getSessionPayload();
  if (!user) {
    return;
  }

  const game = await prisma.game.findUnique({
    where: {
      id: gameId
    },
    include: {
      pieces: true,
      lobby: {
        include: {
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
