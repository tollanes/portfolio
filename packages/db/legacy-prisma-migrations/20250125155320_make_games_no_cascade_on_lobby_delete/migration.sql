-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_lobbyId_fkey";

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "lobbyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "Lobby"("id") ON DELETE SET NULL ON UPDATE CASCADE;
