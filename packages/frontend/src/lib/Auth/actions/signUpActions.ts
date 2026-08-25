"use server";

import { registerSchema } from "@components/Auth/schemas/registerSchema";
import { hashPassword } from "@lib/Auth/hashing";
import { db, users } from "@portfolio/db";
import { createSession } from "@lib/Auth/sessions";

export const signUpAction = async (username: string, email: string, password: string) => {
  const validatedData = registerSchema.safeParse({ username, email, password });
  if (!validatedData.success) {
    return { error: validatedData.error };
  }

  const passwordHash = hashPassword(validatedData.data.password);
  if (!passwordHash) {
    return { error: { message: "Password hashing failed" } };
  }

  console.log("new user", {
    email: validatedData.data.email,
    username: validatedData.data.username || validatedData.data.email || "",
    password: passwordHash
  });

  try {
    const [user] = await db
      .insert(users)
      .values({
        email: validatedData.data.email,
        username: validatedData.data.username || validatedData.data.email || "",
        password: passwordHash
      })
      .returning();

    console.log("user", user);

    if (!user) {
      return { error: { message: "User could not be created" } };
    }

    await createSession(user);

    return { user };
  } catch (e) {
    console.log(e);
    return { error: { message: "User creation failed" } };
  }
};
