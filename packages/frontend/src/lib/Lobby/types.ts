import { Lobby, LobbyMember, User } from "@portfolio/db";

export type LobbyType = Lobby & {
  password?: string | null;
  lobbyMembers: LobbyMemberType[];
};

export type LobbyMemberType = LobbyMember & {
  user: User;
};
