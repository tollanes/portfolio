"use server";

import { loginSchema } from "@components/Auth/schemas/loginSchema";
import { db, users } from "@portfolio/db";
import { eq } from "drizzle-orm";
import { comparePassword } from "@lib/Auth/hashing";
import { createSession } from "@lib/Auth/sessions";

export const loginAction = async (email: string, password: string) => {
  const validatedData = loginSchema.safeParse({ password, email });
  if (!validatedData.success) {
    return { error: validatedData.error };
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.data.email || validatedData.data.username || ""))
      .limit(1);

    if (!user || !user.password) {
      return { error: { message: "User not found" } };
    }

    if (!comparePassword(validatedData.data.password, user.password)) {
      return { error: { message: "Wrong password" } };
    }

    await createSession(user);
    return { user };
  } catch {
    return { error: { message: "User not found" } };
  }
};
