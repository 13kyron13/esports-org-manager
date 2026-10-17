# Esports Org Manager

A browser-based esports organisation management game. The current repository build is **Update 11.0 — Scouting & Player Development**.

## Play

Open [index.html](./index.html) in a modern desktop browser. The game is a standalone HTML file and does not require a build step or package installation.

## Current build: Update 11.0

- Finance dashboard: cash balance, sponsor and merchandise income, and a cashflow outlook alongside weekly income, wages, running costs and net balance. Negative cashflow now surfaces a debt-limit warning with an estimated runway.
- Boardroom: persistent board confidence and three season objectives covering an adaptive league placement target, financial stability, and senior-team development.
- Season reviews: objectives are assessed at year-end, confidence rises or falls based on results, and strong seasons can earn a board bonus.
- Dynamic expectations: league targets adapt to your roster strength and board confidence, while financial objectives account for whether the organisation is already low on cash.
- Board warnings: low confidence now produces clearer warnings, escalating to a formal warning below 25% rather than abruptly ending the career.
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
- A multi-division management framework with a game switcher, independent persistent CS2/Valorant division state, shared organisation finances/brand, and game-specific management and match simulation.
- Premium management-game UI inspired by F1 Manager/FC career modes, esports broadcast presentation, desktop packaging options, save/load, export/import, accessibility and testing.

The roadmap distinguishes existing or partially implemented work from future plans; items listed as planned are not claims about the current playable build.


### Update 11.0 — Scouting & Player Development

- Added individual development plans for senior starters and bench players: Aim, Game sense, Mental or Balanced.
- Individual plans contribute targeted growth alongside weekly team training; coach skill and training facilities can improve growth, while player potential continues to limit development.
- Academy and Tier 2 players use their development focus during annual progression, and older saves receive safe defaults when loaded.
- Added scouting assignments by priority role and region. Prospects now have a region, and matching assignments improve report precision; reports show a confidence estimate.
- Scouting assignment and development focus are stored in the career save.
- JavaScript syntax check passed. Browser playtesting is still needed; scouting is a first pass and does not yet simulate a full multi-week regional scouting expedition.

### Update 10.0 — Squad Inventory Hub

- Added a central squad inventory table in the Squad tab, bringing the main team, bench, academy prospects and Tier 2 players into one overview.
- Shows squad group, role, age, overall rating, potential, morale, salary and contract length where available.
- Includes quick actions to start/sell bench players and promote academy/Tier 2 prospects to the senior bench, with existing squad-capacity and cash checks.
- This is the first inventory UI pass; the underlying squad groups still use their existing separate rules. A full shared-inventory assignment system remains planned.
- JavaScript syntax check passed; playtesting is still needed.

### Multi-game direction (planned)

The intended career is one esports organisation operating several distinct divisions. A persistent game selector will let you switch between (for example) CS2 and Valorant and return to each division exactly where you left it. Each division will retain its own roster, academy, tactics, competition, calendar, results and game-specific systems, while the organisation shares high-level finances, brand, sponsors and facilities. Valorant is planned as a genuinely separate management and match simulation, not a reskinned CS2 tab. These are roadmap goals, not implemented features in Update 10.0.

### Presentation direction (planned)

After the core management and multi-division systems are stable, the UI will be redesigned toward a premium PC management-game feel: an organisation headquarters dashboard, visual squad hub and player profiles, richer graphs and panels, and esports broadcast-style match presentation. The first step is to polish the existing browser build; Electron/Tauri packaging may follow. A full Unity/Unreal migration is a long-term option only if the benefits of 3D presentation justify a substantial rebuild. These are roadmap goals, not current Update 11.0 features.
