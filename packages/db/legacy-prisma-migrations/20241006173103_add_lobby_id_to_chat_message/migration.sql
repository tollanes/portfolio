/*
  Warnings:

  - A unique constraint covering the columns `[lobbyId]` on the table `ChatMessage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lobbyId` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "lobbyId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ChatMessage_lobbyId_key" ON "ChatMessage"("lobbyId");

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "Lobby"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
