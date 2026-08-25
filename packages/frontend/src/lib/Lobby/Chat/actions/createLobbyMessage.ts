"use server";

import { getSessionPayload } from "@lib/Auth/sessions";
import { db, chatMessages } from "@portfolio/db";
import { eq } from "drizzle-orm";
import { getLobbyIdCookie } from "@lib/Lobby/lobbyStorage";

export const createLobbyMessageAction = async (message: string) => {
  const user = await getSessionPayload();
  if (!user) {
    return { error: "createLobbyMessageAction: No user found" };
  }

  const lobbyId = await getLobbyIdCookie();
  if (!lobbyId) {
    return { error: "createLobbyMessageAction: No lobbyId found" };
  }

  const [inserted] = await db
    .insert(chatMessages)
    .values({
      userId: user.id,
      lobbyId,
      message
    })
    .returning({ id: chatMessages.id });

  if (!inserted) {
    return { error: "Failed to create chat message" };
  }

  const chatMessage = await db.query.chatMessages.findFirst({
    where: eq(chatMessages.id, inserted.id),
    columns: {
      id: true,
      message: true,
      createdAt: true
    },
    with: {
      user: {
        columns: {
          id: true,
          username: true
        }
      }
    }
  });

  if (!chatMessage) {
    return { error: "Failed to create chat message" };
  }

  return { chatMessage };
};
