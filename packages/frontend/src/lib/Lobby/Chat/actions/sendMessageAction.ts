"use server";

import { getSessionPayload } from "@lib/Auth/sessions";
import { db, chatMessages } from "@portfolio/db";

import { ChatMessageType } from "@lib/Lobby/Chat/types";

export const sendMessageAction = async (lobbyId: string, message: ChatMessageType) => {
  const user = await getSessionPayload();
  if (!user) {
    return { error: "No user found" };
  }

  const [created] = await db
    .insert(chatMessages)
    .values({
      userId: user.id,
      lobbyId,
      message: message.message
    })
    .returning();

  if (!created) {
    return { error: "Failed to create chat message" };
  }

  return { messages: created };
};
