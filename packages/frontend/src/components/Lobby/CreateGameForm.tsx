"use client";

import { useLobbyStore } from "@lib/Lobby/stores/lobbyStore";
import { GameTypes } from "@portfolio/db";
import { useState } from "react";

const CreateGameForm = () => {
  const { createGame } = useLobbyStore();

  const [gameType, setGameType] = useState<GameTypes>(GameTypes.chess);

  const handleCreateGame = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await createGame(gameType);
    console.log(result);
  };

  return (
    <form onSubmit={(e) => handleCreateGame(e)}>
      <div className="formGroup">
        <label htmlFor="gameType">Game Type</label>
        <select name="gameType" value={gameType} onChange={(e) => setGameType(e.target.value as GameTypes)}>
          <option value={GameTypes.chess}>Chess</option>
          <option value={GameTypes.checkers}>Checkers</option>
        </select>
      </div>

      <button type="submit" className="btn">
        Create Game
      </button>
    </form>
  );
};

export default CreateGameForm;
