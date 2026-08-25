# Project plan

Andreas writes the code. This is the order of work, not a license for an agent to build the site.

Portfolio is layout and type. Minigames is the product: catalog, anonymous play, two-seat rooms, claim-later scores.

## Done when

- `/` is the editorial portfolio (PDF). Chess sits in the corner as a public widget (self-play, size up / down).
- `/minigames` is a separate layout: catalog, chess, then another game (checkers) on the same match/player rails.
- Two people can sit in a room with no login. Finished matches persist to a **player** cookie. Clerk attaches that player to a user; handle + scores require that claim.
- Custom auth is gone from the target path. Drizzle (`@portfolio/db`) + Clerk + a live room process are in.

Subdomain (`minigames.…`) is DNS + rewrite. Last, not first.

## Do not do first

- Prisma → Drizzle of the whole lobby schema
- Socket.IO “platform” before a local chess session exists
- Clerk on the portfolio
- Checkers before chess plays anonymously end-to-end
- Stockfish
- Persisting every ply while pieces move

---

## Phase 0 — Freeze the old spine

Treat current lobby/auth/Prisma as **legacy**. Stop extending it.

- Home no longer *requires* lobby + `currentGame` to show chess.
- Leave `packages/server` dormant until Phase 4.

**Exit:** you can delete or ignore lobby UI on `/` without the board disappearing from the plan (the board may still be ungated in Phase 2).

## Phase 1 — Portfolio (design only)

Static Next routes, PDF layout: nav, hero, work list, also-shipped, 3D blurb, hire strip, footer.

No Clerk, no DB, no minigames chrome. Placeholder corner is fine (empty box or a still).

**Exit:** `/` matches the PDF at a glance (desktop). Copy can be rough.

## Phase 2 — Chess kernel as a widget

Reuse board, pieces, move gen, R3F scene.

- `createChessGame` in the client. No Prisma, no lobby store.
- Canvas fills a **box**: minimized / corner / expanded.
- Self-play tick. Legal moves including check (stubs are a blocker).
- Click white → human vs engine on that seat.
- `frameloop` suitable for a portfolio tab (demand + invalidate on move).

**Exit:** land on `/`, board plays in the corner, no account.

## Phase 3 — Minigames island

Route group/folder with **its own layout**. Catalog page. `/minigames/chess` hosts the same kernel, full chrome (not the sprinkle).

Widget CTA: open `/minigames/chess`.

**Exit:** two faces, one scene module. Portfolio layout does not leak into minigames and vice versa.

## Phase 4 — Player cookie (no Clerk)

Stable `player_id` cookie on minigames (and on widget if you count those games).

Drizzle + Postgres. Tables: `player`, later `user` / `match` / `match_seat`. No `GamePiece` rows.

**Exit:** every minigames visitor has a player id. Nothing to claim yet.

## Phase 5 — Two-seat room

Live match process (Socket.IO on the existing server package, or equivalent). Room id in the URL. Two seats. Invite link. Room owns FEN + moves; clients render. Last leave deletes the room (optional short reconnect grace).

Play routes stay logged out. Cookie player is the seat identity.

**Exit:** two browsers, one chess game, no login.

## Phase 6 — Persist the result

On match end (and only then): store game type, result, PGN/FEN, both `player_id`s.

Self-play vs engine: persist if you want “games this cookie played”; skip if noise.

**Exit:** refresh does not keep a live room; history/score for that cookie exists after a finished match.

## Phase 7 — Clerk as claim

Clerk on minigames account routes only (`sign-in`, `me`, scores). Play stays open.

On sign-in: attach `player.user_id`. Handle unique on `user`. Scores = matches for players owned by this user. Merge policy if two player cookies hit one Clerk user.

**Exit:** anonymous play still works; signed-in user sees kept score and a handle.

## Phase 8 — Second game (checkers)

Same room/player/match rails. New rules + view. Proves the catalog is not a chess app with a nav lie.

**Exit:** catalog lists two games; a checkers match can finish and persist like chess.

## Phase 9 — Host / polish

`minigames.example` → rewrite to `/minigames`. Widget copy. Drop legacy Prisma/auth when nothing reads it.

---

## Suggested first coding week

1. Phase 1 far enough that `/` is the portfolio shell.
2. Phase 2 widget on that shell (the sprinkle the PDF advertises).
3. Phase 3 folder so chess has a “real” page without building Clerk.

Identity and sockets after the board is honest in a box.
