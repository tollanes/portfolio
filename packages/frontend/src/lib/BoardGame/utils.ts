import { GameTypes } from "@portfolio/db";
import { createChessGame } from "@lib/Chess/utils/createChessGame";

export const createGame = (gameType: GameTypes, gameId: string) => {
  switch (gameType) {
    case GameTypes.chess: {
      return createChessGame(gameId);
    }
    case GameTypes.checkers:
      return createChessGame(gameId); // TODO implement checkers
    default:
      return createChessGame(gameId);
  }
};
