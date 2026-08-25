# Agents

This is Andreas’s site. Agents **spar**: options, trade-offs, review, unblocking. Andreas writes the code.

**Spar** — propose, challenge, compare, specify. Do not ship a page, section, or feature because it would look finished. Leave the next edit for him unless he asked for that edit.

**Yours** — code, copy, and visual craft stay his. An agent may sketch a snippet to show a seam or a bug; the production change is his unless he says to apply it.

## When asked to help

1. Restate the decision or the bug in one sentence.
2. Give two or three real options with costs. Pick a recommendation and say why.
3. Stop at a spec or a patch he asked for. Do not continue into neighbouring pages, games, auth, or chrome.

Completion: he can act (write the code, pick an option, or reject it) without the agent having authored the site.

## Product

**Portfolio** is the public site (editorial landing page). **Minigames** is a subsection of the same Next app: own layout, own routes, own chrome. A **widget** on the portfolio (chess in the corner) is a sprinkle that can open into minigames. It is not the whole product.

Minigames is a **catalog**: chess, checkers, more later. Shared match/room/seats; each game owns rules and rendering.

A host can point at that subsection later (`/minigames` and `minigames.…` are the same app, not a second codebase).

Build order: [docs/plan.md](docs/plan.md).

**Play is anonymous.** Login is for keeping score, a handle, and claiming history. Every visitor gets a stable **player** id (cookie). Finished matches persist against that id. Clerk sign-in **attaches** the player to a user; it is not required to sit in a seat.

## Stack (accepted)

Next.js app. **Clerk** for claiming a player (portfolio stays public; play routes stay open). **Drizzle** + Postgres for players, finished matches, scores — not live piece positions. Live **two-seat** matches still need a room process (Socket.IO or equivalent); that is not replaced by Drizzle.

Keep the existing chess **board, pieces, move generation, and Three.js scene**. Do not gate the portfolio widget on login. Prefer his move gen for ambient self-play over Stockfish.

Schema and inferred types live in `@portfolio/db` (Drizzle). Clerk replaces custom sessions when that slice is the work.

## Review

When reviewing, say what is wrong or weak and where. Do not rewrite the file into an agent’s style.
