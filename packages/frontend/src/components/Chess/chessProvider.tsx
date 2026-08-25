"use client";

import { createContext, ReactNode } from "react";
import { useLobbyStore } from "@lib/Lobby/stores/lobbyStore";
import { AbstractGame } from "@lib/BoardGame/Game";
import { AbstractBoard } from "@lib/BoardGame/Board";
import { AbstractPlayer } from "@lib/BoardGame/Player";
import { AbstractGameScore } from "@lib/BoardGame/GameScore";

export interface ChessContextInterface {
  game: AbstractGame | null;
  board: AbstractBoard | null;
  player1: AbstractPlayer | null;
  player2: AbstractPlayer | null;
  gameScore: AbstractGameScore | null;
}

export const ChessContext = createContext({} as ChessContextInterface);

export const ChessProvider = ({ children }: { children: ReactNode }) => {
  const { game, board, players, gameScore } = useLobbyStore();

  return (
    <ChessContext.Provider
      value={{
        game,
        board,
        player1: players?.[0] ?? null,
        player2: players?.[1] ?? null,
        gameScore
      }}
    >
      {children}
    </ChessContext.Provider>
  );
};
