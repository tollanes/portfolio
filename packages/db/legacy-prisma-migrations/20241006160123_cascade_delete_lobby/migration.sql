-- DropForeignKey
ALTER TABLE "LobbyMember" DROP CONSTRAINT "LobbyMember_lobbyId_fkey";

-- DropForeignKey
ALTER TABLE "LobbyMember" DROP CONSTRAINT "LobbyMember_userId_fkey";

-- AddForeignKey
ALTER TABLE "LobbyMember" ADD CONSTRAINT "LobbyMember_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "Lobby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LobbyMember" ADD CONSTRAINT "LobbyMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
