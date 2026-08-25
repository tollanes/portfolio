"use server";

import { getSessionPayload } from "@lib/Auth/sessions";
import prisma from "@db/prisma";
import { comparePassword } from "@lib/Auth/hashing";
import { cookies } from "next/headers";

export const joinLobbyAction = async (name: string, password: string) => {
  const user = await getSessionPayload();
  if (!user) {
    return;
  }

  const lobby = await prisma.lobby.findFirst({
    where: {
      name: name
    },
    include: {
      lobbyMembers: true
    }
  });

  if (!lobby || !lobby.password) {
    return;
  }

  // If you are already in the lobby, you can't join again
  if (lobby.lobbyMembers.find((member) => member.userId === user.id)) {
    return;
  }

  // If the lobby is full, you can't join
  if (lobby.lobbyMembers.length >= lobby.maxPlayers) {
    return;
  }

  // If the password is incorrect, you can't join
  if (!comparePassword(password, lobby.password)) {
    return;
  }

  const result = await prisma.lobby.update({
    where: {
      id: lobby.id
    },
    data: {
      lobbyMembers: {
        create: {
          user: {
            connect: {
              id: user.id
            }
          }
        }
      }
    },
    include: {
      lobbyMembers: {
        include: {
          user: true
        }
      }
    }
  });

  if (!result) {
    return;
  }

  // If the lobby was updated successfully, you can join
  // Set cookie http only
  (await cookies()).set("lobbyId", lobby.id.toString(), {
    path: "/",
    httpOnly: true
  });

  return result;
};
