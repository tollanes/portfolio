import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("Role", ["admin", "user", "guest"]);
export const gameStatusEnum = pgEnum("GameStatus", ["waiting", "playing", "finished"]);
export const gameTypesEnum = pgEnum("GameTypes", ["chess", "checkers"]);

export const Role = {
  admin: "admin",
  user: "user",
  guest: "guest"
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const GameStatus = {
  waiting: "waiting",
  playing: "playing",
  finished: "finished"
} as const;
export type GameStatus = (typeof GameStatus)[keyof typeof GameStatus];

export const GameTypes = {
  chess: "chess",
  checkers: "checkers"
} as const;
export type GameTypes = (typeof GameTypes)[keyof typeof GameTypes];

const timestamps = {
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
};

export const users = pgTable(
  "User",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    password: text("password"),
    role: roleEnum("role").notNull().default("guest"),
    blocked: boolean("blocked").notNull().default(false),
    ...timestamps
  }
);

export const lobbies = pgTable("Lobby", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  password: text("password"),
  maxPlayers: integer("maxPlayers").notNull().default(2),
  ...timestamps
});

export const lobbyMembers = pgTable("LobbyMember", {
  id: serial("id").primaryKey(),
  lobbyId: text("lobbyId")
    .notNull()
    .references(() => lobbies.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  ...timestamps
});

export const games = pgTable("Game", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  type: gameTypesEnum("type").notNull(),
  startedAt: timestamp("startedAt", { mode: "date", precision: 3 }),
  finishedAt: timestamp("finishedAt", { mode: "date", precision: 3 }),
  status: gameStatusEnum("status").notNull().default("waiting"),
  lobbyId: text("lobbyId").references(() => lobbies.id),
  ownerId: text("ownerId")
    .notNull()
    .references(() => users.id),
  winnerId: text("winnerId").references(() => users.id),
  ...timestamps
});

export const gamePieces = pgTable(
  "GamePiece",
  {
    id: serial("id").primaryKey(),
    xPos: integer("xPos").notNull(),
    yPos: integer("yPos").notNull(),
    type: text("type").notNull(),
    color: text("color").notNull(),
    gameId: text("gameId")
      .notNull()
      .references(() => games.id),
    ...timestamps
  },
  (table) => [uniqueIndex("GamePiece_gameId_key").on(table.gameId)]
);

export const gameMoves = pgTable(
  "GameMove",
  {
    id: serial("id").primaryKey(),
    pieceId: integer("pieceId")
      .notNull()
      .references(() => gamePieces.id),
    userId: text("userId")
      .notNull()
      .references(() => users.id),
    xStart: integer("xStart").notNull(),
    yStart: integer("yStart").notNull(),
    xEnd: integer("xEnd").notNull(),
    yEnd: integer("yEnd").notNull(),
    ...timestamps
  },
  (table) => [
    uniqueIndex("GameMove_pieceId_key").on(table.pieceId),
    uniqueIndex("GameMove_userId_key").on(table.userId)
  ]
);

export const chatMessages = pgTable("ChatMessage", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  lobbyId: text("lobbyId")
    .notNull()
    .references(() => lobbies.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  ...timestamps
});

export const usersRelations = relations(users, ({ many }) => ({
  lobbyMembers: many(lobbyMembers),
  ownedGames: many(games, { relationName: "gameOwner" }),
  wonGames: many(games, { relationName: "gameWinner" }),
  gameMoves: many(gameMoves),
  chatMessages: many(chatMessages)
}));

export const lobbiesRelations = relations(lobbies, ({ many }) => ({
  lobbyMembers: many(lobbyMembers),
  games: many(games),
  chatMessages: many(chatMessages)
}));

export const lobbyMembersRelations = relations(lobbyMembers, ({ one }) => ({
  lobby: one(lobbies, { fields: [lobbyMembers.lobbyId], references: [lobbies.id] }),
  user: one(users, { fields: [lobbyMembers.userId], references: [users.id] })
}));

export const gamesRelations = relations(games, ({ one, many }) => ({
  lobby: one(lobbies, { fields: [games.lobbyId], references: [lobbies.id] }),
  owner: one(users, { fields: [games.ownerId], references: [users.id], relationName: "gameOwner" }),
  winner: one(users, { fields: [games.winnerId], references: [users.id], relationName: "gameWinner" }),
  pieces: many(gamePieces)
}));

export const gamePiecesRelations = relations(gamePieces, ({ one, many }) => ({
  game: one(games, { fields: [gamePieces.gameId], references: [games.id] }),
  gameMoves: many(gameMoves)
}));

export const gameMovesRelations = relations(gameMoves, ({ one }) => ({
  piece: one(gamePieces, { fields: [gameMoves.pieceId], references: [gamePieces.id] }),
  user: one(users, { fields: [gameMoves.userId], references: [users.id] })
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, { fields: [chatMessages.userId], references: [users.id] }),
  lobby: one(lobbies, { fields: [chatMessages.lobbyId], references: [lobbies.id] })
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Lobby = typeof lobbies.$inferSelect;
export type LobbyMember = typeof lobbyMembers.$inferSelect;
export type Game = typeof games.$inferSelect;
export type GamePiece = typeof gamePieces.$inferSelect;
export type GamePieceInsert = typeof gamePieces.$inferInsert;
export type GameMove = typeof gameMoves.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
