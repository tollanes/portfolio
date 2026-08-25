import "server-only";
import { getSessionPayload } from "@lib/Auth/sessions";
import { db, users } from "@portfolio/db";
import { eq } from "drizzle-orm";

export const getUser = async (userId: string) => {
  const userSession = await getSessionPayload();

  if (!userSession) {
    return null;
  }

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) {
    return null;
  }

  return { ...user, password: null };
};
