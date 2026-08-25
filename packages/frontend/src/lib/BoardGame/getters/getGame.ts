import "server-only";
import { getSessionPayload } from "@lib/Auth/sessions";
import prisma from "@db/prisma";

export const getGame = async (id: string) => {
  const user = await getSessionPayload();
  if (!user) {
    return;
  }

  const game = await prisma.game.findUnique({
    where: {
      id: id
    },
    include: {
      lobby: {
        include: {
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
