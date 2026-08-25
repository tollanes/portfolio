/*
  Warnings:

  - Made the column `maxPlayers` on table `Lobby` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Lobby" ALTER COLUMN "maxPlayers" SET NOT NULL,
ALTER COLUMN "maxPlayers" SET DEFAULT 2;
