# Double Take

An original, offline spot-the-difference game about noticing the little things. Explore Harbour Morning, Garden Picnic, and Night Market: three cheerful canvas illustrations with 16 handmade differences and a tiny synthesized soundtrack.

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/jinglue25/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/jinglue25/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

## How to play

Click a changed detail in either picture. Each find marks both pictures and earns 150 points; a miss costs 25 points. Finish a scene for a bonus of up to 500 points, reduced by elapsed seconds and mistakes. There is no time limit. Your best score is saved in this browser when storage is available.

Enter or Space starts and advances; click anywhere after a level clear to continue. Press R to restart the whole run. Sound starts on your first gesture and is optional if your browser cannot play audio.

## How to run

Run `node serve.ts`, then open http://localhost:8080. No dependencies, downloads, or network services are needed. All artwork is painted with canvas paths.

For deterministic coordinator screenshots, use `?shot=start&seed=42`, `?shot=play&seed=42`, or `?shot=end&seed=42`. Staging sets `window.__shotReady` after painting twice.

## How to hand in

Run `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts` to copy the game and screenshots and build `out/dossier.json` using the competition kit's limits.
