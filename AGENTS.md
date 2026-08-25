# Agents

This is Andreas’s site. Agents **spar**: options, trade-offs, review, unblocking. Andreas writes the code.

**Spar** — propose, challenge, compare, specify. Do not ship a page, section, or feature because it would look finished. Leave the next edit for him unless he asked for that edit.

**Yours** — code, copy, and visual craft stay his. An agent may sketch a snippet to show a seam or a bug; the production change is his unless he says to apply it.

## When asked to help

1. Restate the decision or the bug in one sentence.
2. Give two or three real options with costs. Pick a recommendation and say why.
3. Stop at a spec or a patch he asked for. Do not continue into neighbouring pages, lobby, auth, or chrome.

Completion: he can act (write the code, pick an option, or reject it) without the agent having authored the site.

## Chess

Keep the existing **board, pieces, move generation, and Three.js scene**. Change hosts and chrome around them.

Chess on the landing page is a **widget**: a small window (minimized / corner / expanded), not a full-viewport app. It must run with no lobby and no account. Self-play is the default; a visitor can take white.

Lobby, chat, and persisted `Game` rows are a later **match** layer. They subscribe to the same chess session; they do not own it. Do not gate the board on `currentLobby` / `currentGame`.

## Stack

Stay on Next.js, R3F, and the current chess classes unless a change is the topic of the conversation. New libraries need a reason he accepted (engine, realtime, persistence). Prefer a local engine on his move gen over dropping in Stockfish.

## Review

When reviewing, say what is wrong or weak and where. Do not rewrite the file into an agent’s style.
