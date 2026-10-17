# Esports Org Manager

A browser-based esports organisation management game. The current repository build is **Update 15.0 — Match Preparation & Player Form**.

## Play

https://13kyron13.github.io/esports-org-manager/

## Current build: Update 15.0 — Match Preparation & Player Form

- **Update 14 — Match Preparation:** added a once-per-match-week opponent scouting action. The report estimates opponent strength and gives a small preparation bonus; an Analyst improves the bonus.
- **Update 15 — Deeper Season Simulation:** players now have form (-3 to +3) and fatigue (0–100). Form changes after wins/losses, fatigue affects team power, Rest training reduces fatigue, and players recover at the start of a new season.
- **Coming soon consistency:** other game divisions cannot be newly opened from Empire and show Coming soon until their dedicated systems are ready. Existing legacy divisions in old saves are preserved.
- **Validation:** JavaScript syntax check passed. Full interactive browser QA and balance testing are still needed.

## Previous build: Update 13.2 — First-Career Guide

- **Implemented:** the title screen now has a How to Play guide for roster management, finances, training, match preparation, organisation expansion and long-term planning.
- **Implemented:** the guide is optional and accessible from the main menu, so players can check the basics before starting a career.
- **Validation:** JavaScript syntax check passed. Full interactive browser QA is still needed.

## Previous build: Update 13.1 — Organisation Identity & Starting Esport

- **Implemented:** the game picker is headed “Choose Your Starting Esport”; only CS2 can be selected, while VALORANT, Overwatch and League of Legends are marked Coming Soon.
- **Implemented:** organisation setup supports a custom name, short tag, emblem, primary colour and secondary colour, with a live preview.
- **Implemented:** organisation identity can be edited later from the Org tab; the logo, name, tag and primary colour appear in the game UI.
- **Implemented:** the organisation shares one brand and finances while adding other game divisions from Empire. Division teams use game-specific role labels and have a Manage Team prompt for renaming the team and its five players.
- **Important limitation:** this is a first pass. The core weekly/match simulation is shared across starting games, and non-primary divisions use a simplified weekly result model rather than fully separate game-specific simulations. CS2-specific map/tactical UI is not yet rebuilt for every title.
- **Validation:** JavaScript syntax check passed; full interactive browser QA is still needed.

## Earlier build notes: Update 13.0 — Main Menu & Career Saves

- **Implemented:** title screen with Continue Career, New Career, Load Career and Import Backup actions.
- **Implemented:** new-career game picker. CS2 is playable; Valorant is shown as coming soon until its dedicated roles, maps and match simulation are implemented.
- **Implemented:** multiple named local save slots (up to 20), overwrite confirmation, load/delete/export per slot, and automatic recovery save.
- **Implemented:** JSON backup export and file-based import, plus compatibility loading for existing Update 12-era saves.
- **Implemented:** save/load tools are available from the title screen and the in-game Empire area. Browser saves remain local to that browser/device; use export/import to move careers.
- **Validation:** JavaScript syntax check passed. Full interactive browser QA is still needed for menu flows, autosave timing, storage limits and legacy-save migration.

## Earlier build notes: Update 12.3 — Bomb Result Consistency

- **Bug fix:** the C4 marker now uses the reached attacker's actual radar position at the planting checkpoint, instead of drawing at a separate guessed point. A valid plant position is saved so the marker stays put if its carrier is eliminated later.
- **Needs playtesting:** verify site alignment and planting/cancellation on all seven maps and both sides. Site locations and routes remain hand-authored radar coordinates.

- **Implemented:** map-veto initiative alternates between player-first and opponent-first, rather than always giving the player the first action.
- **Implemented:** veto choices are explicitly labelled BAN or PICK, and the completed veto shows the resulting maps before asking the player to choose a CT or T starting side for Map 1.
- **Implemented first pass:** the selected starting side now controls which team attacks/defends on the radar, the match header shows the active side, and the sides switch after 12 rounds.
- **Implemented first pass:** animated bomb rounds are cancelled if no living Terrorist-side player reaches the selected site area at the plant checkpoint; the round log then avoids claiming a successful plant. Whole-map instant simulation skips the unverified bomb animation event.
- **Implemented:** an expandable “Why are rounds going this way?” panel explains roster power, opponent power, map familiarity and the main match factors, while clarifying that the radar animation illustrates a statistical result.
- **Needs playtesting:** objective checks use hand-authored radar-coordinate movement, not a true CS2 navigation mesh. Validate every map, side, veto format, round-by-round mode, autoplay and skip behaviour. Round outcomes remain statistically simulated.

## Earlier build notes: Update 11.1

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


### Match feedback & Update 11.1 — Match Clarity Pass

- Fixed the premature C4 marker: the bomb now has a later plant phase and is only drawn after a Terrorist-side player reaches the selected site area.
- Added 0.5×, 1×, 2× and 4× match animation speeds. These only change presentation speed, not the round result calculation.
- Added four animation speeds to the match controls: 0.5× slow, 1× normal, 2× fast and 4× very fast. This changes presentation speed, not the round result calculation.
- Still planned: full map-veto turn-order correction, explicit final-map PICK vs BAN language, and a clear starting-side choice for CT/T where competitive rules allow it.
- Still planned: round-by-round explanations, a first-time manager tutorial, tactical hints, economy/utility guidance, and a post-round explanation of the key factors behind each result.
- Still planned: a match presentation and layout pass to reduce clutter, improve visual hierarchy and make controls/status easier to understand.
- Needs browser playtesting: validate bomb timing on different maps and sides, confirm all speed settings behave correctly, and ensure map vetoes/side selection follow the intended competitive rules.

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
