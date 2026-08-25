-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_lobbyId_fkey";

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "Lobby"("id") ON DELETE CASCADE ON UPDATE CASCADE;
