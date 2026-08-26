import { create } from "zustand";
import { createLobbyAction } from "@lib/Lobby/actions/createLobby";
import { joinLobbyAction } from "@lib/Lobby/actions/joinLobby";
import { leaveLobbyAction } from "@lib/Lobby/actions/leaveLobby";
import { createGameAction } from "@lib/BoardGame/actions/createGame";
import { closeGameAction } from "@lib/BoardGame/actions/closeGame";
import { Lobby, User, Game, GamePiece, GameTypes } from "@portfolio/db";
import { JoinStatus, LobbyStatus } from "@lib/Lobby/enums";
import { ChatMessageType } from "@lib/Lobby/Chat/types";
import { LobbyType } from "@lib/Lobby/types";
import { AbstractGame } from "@/lib/BoardGame/Game";
import { AbstractBoard } from "@lib/BoardGame/Board";
import { AbstractPlayer } from "@lib/BoardGame/Player";
import { AbstractGameScore } from "@lib/BoardGame/GameScore";
import ChessBoard from "@lib/Chess/ChessBoard";
import { PieceColor } from "@lib/BoardGame/Piece";
import ChessGame from "@lib/Chess/ChessGame";
import { createChessGame } from "@lib/Chess/utils/createChessGame";
import { createGame } from "@lib/BoardGame/utils";

interface LobbyStore {
  // Lobby State
  currentLobby: Lobby | null;
  lobbyMembers: User[];
  joinStatus: JoinStatus;
  lobbyStatus: LobbyStatus;
  setJoinStatus: (status: JoinStatus) => void;
  setLobbyStatus: (status: LobbyStatus) => void;
  setCurrentLobby: (lobby: Lobby | null) => void;
  setLobbyMembers: (players: User[]) => void;
  initializeLobby: (lobby: LobbyType | null, messages: ChatMessageType[]) => void;
  createLobby: (name: string, password: string) => Promise<boolean>;
  joinLobby: (name: string, password: string) => Promise<boolean>;
  leaveLobby: () => Promise<void>;

  // Message State
  messages: ChatMessageType[];
  setMessages: (messages: ChatMessageType[]) => void;
  addMessage: (message: ChatMessageType) => void;
  removeMessage: (message: ChatMessageType) => void;

  // Game State
  currentGame: Game | null;
  currentGameType: GameTypes | null;
  currentPieces: GamePiece[] | null;
  setCurrentGame: (game: Game | null) => void;
  setCurrentPieces: (pieces: GamePiece[] | null) => void;
  createGame: (gameType: GameTypes) => Promise<boolean>;
  closeGame: () => Promise<void>;

  // Board Game State
  game: AbstractGame | null;
  board: AbstractBoard | null;
  players: AbstractPlayer[] | null;
  gameScore: AbstractGameScore | null;
  setGame: (game: AbstractGame | null) => void;
  setBoard: (board: AbstractBoard | null) => void;
  setPlayers: (players: AbstractPlayer[] | null) => void;
  setGameScore: (score: AbstractGameScore | null) => void;
}

export const useLobbyStore = create<LobbyStore>((set, get) => ({
  ////////////////////////////////////////////////////////////////////////////////////
  // Lobby State
  ////////////////////////////////////////////////////////////////////////////////////
  currentLobby: null,
  lobbyMembers: [],
  joinStatus: JoinStatus.None,
  lobbyStatus: LobbyStatus.None,

  setJoinStatus: (status) => set({ joinStatus: status }),

  setLobbyStatus: (status) => set({ lobbyStatus: status }),

  setCurrentLobby: (lobby) => set({ currentLobby: lobby }),

  setLobbyMembers: (lobbyMembers) => set({ lobbyMembers }),

  initializeLobby: (lobby, messages) =>
    set({
      currentLobby: lobby,
      lobbyMembers: lobby?.lobbyMembers.map((member) => member.user) || [],
      messages
    }),

  createLobby: async (name, password) => {
    set({ joinStatus: JoinStatus.Creating });
    const { error, lobby } = await createLobbyAction(name, password);
    if (error || !lobby) {
      console.error(error || "Lobby creation failed");
      set({ joinStatus: JoinStatus.Failed });
      return false;
    }
    set({
      currentLobby: lobby,
      lobbyMembers: lobby.lobbyMembers.map((member) => member.user),
      joinStatus: JoinStatus.Joined
    });

    // Set cookie to lobbyId
    return true;
  },

  joinLobby: async (name, password) => {
    set({ joinStatus: JoinStatus.Joining });
    const lobby = await joinLobbyAction(name, password);
    if (!lobby) {
      console.error("Lobby not joined");
      set({ joinStatus: JoinStatus.Failed });
      return false;
    }
    set({
      currentLobby: lobby,
      lobbyMembers: lobby.lobbyMembers.map((member) => member.user),
      joinStatus: JoinStatus.Joined
    });

    return true;
  },

  leaveLobby: async () => {
    set({ joinStatus: JoinStatus.Leaving });
    const result = await leaveLobbyAction();
    if (!result) {
      console.error("Lobby not left");
      set({ joinStatus: JoinStatus.Failed });
      return;
    }
    set({
      currentLobby: null,
      players: [],
      joinStatus: JoinStatus.None
    });
  },

  ////////////////////////////////////////////////////////////////////////////////////
  // Message State
  ////////////////////////////////////////////////////////////////////////////////////
  messages: [],
  setMessages: (messages) => set({ messages }),

  addMessage: (message) => {
    const oldMessages = get().messages;
    set({ messages: [...oldMessages, message] });
  },

  removeMessage: (message) => {
    const oldMessages = get().messages;
    set({ messages: oldMessages.filter((msg) => msg.id !== message.id) });
  },

  ////////////////////////////////////////////////////////////////////////////////////
  // Game State
  ////////////////////////////////////////////////////////////////////////////////////
  currentGame: null,
  currentGameType: null,
  currentPieces: null,

  setCurrentGame: (game) => set({ currentGame: game }),

  setCurrentPieces: (pieces) => set({ currentPieces: pieces }),

  createGame: async (gameType: GameTypes) => {
    const { currentLobby } = get();
    if (!currentLobby) {
      console.error("No current lobby available");
      return false;
    }
    const data = await createGameAction(currentLobby.id, gameType);

    if (!data) {
      console.error("Game not created");
      return false;
    }

    set({ currentGame: data });

    const { game, board, players, gameScore } = createGame(gameType, data.id);

    board.initBoard();

    set({
      game,
      board,
      players,
      gameScore
    });

    return true;
  },

  closeGame: async () => {
    const { currentGame } = get();
    if (!currentGame) return;

    const data = await closeGameAction(currentGame.id);
    if (!data) {
      console.error("Game not found");
      return;
    }
    set({ currentGame: null, currentPieces: null });
  },

  ////////////////////////////////////////////////////////////////////////////////////
  // Board Game State
  ////////////////////////////////////////////////////////////////////////////////////
  game: null,
  board: null,
  players: null,
  gameScore: null,

  setGame: (game) => set({ game }),

  setBoard: (board) => set({ board }),

  setPlayers: (players) => set({ players }),

  setGameScore: (score) => set({ gameScore: score })
}));
