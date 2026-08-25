import "server-only";
import { getSessionPayload } from "@lib/Auth/sessions";
import { db, chatMessages } from "@portfolio/db";
import { eq } from "drizzle-orm";

export const getLobbyMessages = async (lobbyId: string) => {
  const user = await getSessionPayload();
  if (!user) {
    return { error: "getLobbyMessagesAction:No user found" };
  }

  const messages = await db.query.chatMessages.findMany({
    where: eq(chatMessages.lobbyId, lobbyId),
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

  if (!messages) {
    return { error: "Failed to create chat message" };
  }

  return { messages };
};
