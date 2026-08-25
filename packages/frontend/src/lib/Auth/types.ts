import { User } from "@portfolio/db";
import { JWTPayload } from "jose";

export type UserSession = User & JWTPayload;

export type UserType = User & {
  password?: string | null;
};
