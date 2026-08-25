/*
  Warnings:

  - Made the column `password` on table `Lobby` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Lobby" ALTER COLUMN "password" SET NOT NULL;
