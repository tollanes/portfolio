"use client";

import { Lobby, User } from "@portfolio/db";
import { useLobbyStore } from "@lib/Lobby/stores/lobbyStore";

const LobbyInfo = ({ lobby, user }: { lobby: Lobby; user: User }) => {
  const { currentLobby, lobbyMembers, leaveLobby } = useLobbyStore();

  if (!user) {
    return null;
  }

  return (
    <div>
      <div>Lobby name: {lobby.name}</div>
      {currentLobby && <button onClick={() => leaveLobby()}>Leave Lobby</button>}

      <div>
        <div>Players:</div>
        {lobbyMembers.map((player) => (
          <div key={player.id}>{player.username}</div>
        ))}
      </div>
    </div>
  );
};

export default LobbyInfo;
