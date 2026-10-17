# Esports Org Manager

A browser-based esports organisation management game. The current repository build is **Update 9.1 — Boardroom & Objectives**.

## Play

Open [index.html](./index.html) in a modern desktop browser. The game is a standalone HTML file and does not require a build step or package installation.

## Current build: Update 9.1

- Finance dashboard: cash balance, sponsor and merchandise income, and a cashflow outlook alongside weekly income, wages, running costs and net balance. Negative cashflow now surfaces a debt-limit warning with an estimated runway.
- Boardroom: persistent board confidence and three season objectives covering league top-four qualification, positive end-of-season cash, and senior-team development.
- Season reviews: objectives are assessed at year-end, confidence rises or falls based on results, and strong seasons can earn a board bonus.
- Focus for this phase: make organisation management, finances and long-term decisions the core experience, while keeping match simulation as one part of the wider career.

- Balance pass: stat growth now slows from about 70 upward and stalls once a player reaches their potential, so rosters no longer all hit 99 by year 3. Rival teams ramp up slightly with each year, and round results use a softer win curve so upsets happen more often.
- Measured with an automated passive manager over 6 seasons: roughly a 47% win rate, average stats near 90 by year 5 and trophies that are hard to win. A manager who uses sponsors, staff, map practice and tactics should do noticeably better.

### Update 8.8

- Added a team economy: pistol rounds, eco, force and full buys, win and loss-bonus income, a half-time reset and a Force buy tactic. The next buy type and both teams' money show in the match header.
- Bomb outcomes now follow the round winner and side. Previously a bomb round overrode the skill roll, so the T side won regardless of team strength.
- Existing systems from earlier updates: waypoint movement for seven CS2 maps with side switching (8.2–8.3), C4 plant, explosion and defuse (8.5–8.6), and full-match autoplay (8.7).

## Known limitations

Routes are hand-authored approximations mapped to the radar images, not extracted in-game navigation meshes. Movement should be more structured and avoid the old arbitrary straight-line motion, but every route still needs visual testing against the exact radar artwork. Round outcomes are still simulated statistically; the minimap animation illustrates the round rather than calculating individual player combat.

## Master roadmap

See [ROADMAP.md](./ROADMAP.md) for the full long-term plan, including:

- CS2 match simulation, map vetoes, navigation, bomb planting/defusing, utility and balance.
- Player transfers, negotiations, buyouts, contracts, morale and team chemistry.
- Staff recruitment, scouting reports, youth academy and player development.
- Sponsors, brand, merchandise, social media, facilities and finances.
- Seasons, tournaments, brackets, rankings, player awards and Hall of Fame.
- Rival organisations, dynamic storylines, meta/patch changes and player careers.
- A data-driven multi-game framework, starting with Valorant.
- Save/load, export/import, accessibility, testing and extra design ideas.

The roadmap distinguishes existing or partially implemented work from future plans; items listed as planned are not claims about the current playable build.
