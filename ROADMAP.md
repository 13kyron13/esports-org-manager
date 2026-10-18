# Esports Org Manager — Master Roadmap

This is the master plan for the full game, including the original concept, previously agreed update roadmap, current repository work, and additional ideas. It is intentionally comprehensive: items marked **Planned** are design goals, not claims that they already exist in the playable build.

## Project vision

Build a long-running esports organisation simulator. Start with one Counter-Strike roster and a limited budget, then grow into a respected esports brand that can compete across multiple games. The player manages both the sporting side (players, tactics, training, scouting, tournaments) and the business side (contracts, staff, finances, sponsors, facilities, reputation and risk).

The game should reward smart long-term decisions rather than simply buying the highest-rated players. It should be challenging but fair, support multi-season stories, and keep the existing standalone browser-game approach where practical.

## Current repository status

### Update 19.6 — Training Fix & Multi-Season Validation

- **Training bug fixed:** weekly training options — Aim drills, Game sense and Mental coaching, as well as Rest — now work in CS2, VALORANT, Overwatch, League of Legends and Rocket League. All five games use the shared training routine, including coach and facility bonuses.
- **Validation reported:** three seasons were played in a real browser for each of the five games, including contracts, events, map vetoes and season rollover; no JavaScript errors were observed during those runs.
- **Balance observation:** League of Legends passive bot power was reported to increase from 55 before the training fix to 79 after it. Passive-bot win rates were roughly 45–58% in the tested runs. These are useful initial checks, not proof of final balance.
- **Known tuning note:** non-CS2 balance still needs tuning. Fatigue can rise substantially when the manager never schedules rest, which can also affect morale.
- **Multiplayer validation boundary:** `multiplayer.js` was syntax-checked, but the multiplayer flow was not independently end-to-end tested in this validation pass because it requires the live backend. Multiplayer is reported to be working; preserve the existing flow and avoid unnecessary rewrites.
- **Repository housekeeping:** stray root-level `.patch` files were removed, and the displayed update title and README version were brought to 19.6.
- **Remaining QA:** continue regression checks on saves and older careers, and tune non-CS2 training/match balance across longer runs.

### Update 19.0 baseline — Multi-Game Simulation & Living Esports World

- **Update 16 implemented:** CS2 and non-CS2 careers show a persistent latest-match report with player performance ratings, MVP and post-match analysis. Non-CS2 matches also generate game-specific map-by-map scorelines and objective/stat summaries. Form, fatigue and morale respond to results.
- **Update 17 implemented:** the existing league/championship schedule can now be played from any supported starting esport; the match path routes into the selected game's scoring model.
- **Update 18 integrated:** existing transfer offers, contract renewals, scouting, development, staff and finance systems remain part of multi-game careers; player market roles follow the selected game.
- **Update 19 implemented:** rival team power changes over time and periodic simulated roster moves are announced in the news/history.
- **Playable titles:** CS2, VALORANT, Overwatch, League of Legends and Rocket League are selectable. Each has a distinct role list and map pool; non-CS2 games have a dedicated map ban/pick and automated best-of-three simulation with game-specific statistics.
- **Division support:** Rocket League has been added to the organisation expansion catalogue; all listed games can be opened as divisions with game-specific roles.
- **Known limitation:** non-CS2 matches are automated series simulations with detailed result/stat reports, not live round-by-round visual gameplay. Some legacy organisation systems still use shared abstractions and need deeper per-title balancing.
- **Validation at that milestone:** JavaScript syntax check passed; the full browser and multi-season checks described in Update 19.6 were not yet part of that earlier status.

### Update 20.0 — The Big Update: Career Depth & UI Overhaul (Planned)

Update 20 is being implemented in stages, keeping the current career systems and save data working as each screen is upgraded. Phase 1 has an initial browser implementation; Phase 2 is underway and still needs live-browser regression testing.

#### Phase 2 — Season simulation and esport-specific circuits (initial implementation)

- [x] Add a season simulation panel with selectable week counts and milestone actions (next event, playoffs, season end).
- [x] Add a per-game 2026 circuit guide for CS2, VALORANT, Overwatch, League of Legends and Rocket League, including qualification concepts and a simplified career championship-points tracker.
- [ ] Replace the shared legacy league/major progression with fully distinct per-game event engines and qualification rules; validate each title through multi-season browser playtests.
- [ ] Tune simulated income, development, results and points so long simulations remain fair and do not bypass meaningful management decisions.
- **Research sources:** Valve’s CS2 Regional Standings / Major rulebooks; Riot’s VCT and LoL Esports 2026 handbooks; Blizzard’s OWCS 2026 season format; Psyonix’s RLCS 2026 season announcement. The in-game guide is a high-level abstraction and does not yet reproduce every region-specific rule or slot count.

#### Career and story features

1. **Career story layer**
   - [ ] Give each season a narrative arc: preseason board expectations, a meaningful midseason turning point and an end-of-season review.
   - [ ] Make the story respond to actual results, finances, roster changes and objectives rather than replaying the same scripted events.

2. **Weekly inbox and decisions**
   - [ ] Create a weekly inbox for important messages from the board, players, agents and sponsors.
   - [ ] Include meaningful choices, deadlines, costs and consequences; prioritise actionable items over notification spam.

3. **Press conferences and media**
   - [ ] Add pre-match media moments for important fixtures and rivalries.
   - [ ] Let choices affect morale, board trust, rival hype or reputation in clear, balanced ways.

4. **Player personalities and relationships**
   - [ ] Add readable player personalities, leadership and a dressing-room relationship web, including friendships, mentors and clashes.
   - [ ] Make relationships influence chemistry and decisions without letting hidden or arbitrary effects overpower player skill.

5. **Scouting network and world map**
   - [ ] Present scouting regions in a world-map or regional-network view.
   - [ ] Let assignments take time and reveal prospects gradually, with regional knowledge and hidden-potential discoveries.

6. **Match moments and highlights**
   - [ ] Generate a concise highlight reel after each series, including simulation-grounded clutches, comebacks and decisive performances.
   - [ ] Save notable moments to the organisation's history so they can be revisited later.

7. **Trophy cabinet and Hall of Fame**
   - [ ] Build a trophy cabinet, club legends and retired-number features where appropriate.
   - [ ] Add a year-in-review summary of champions, awards, records and the organisation's biggest moments.

8. **Difficulty and career modes**
   - [ ] Offer Story, Standard and Ironman career modes, each with clearly explained balance settings and save rules.
   - [ ] Make difficulty choices fair and transparent; Ironman should clearly explain its save limitations before a career starts.

9. **Shareable season recap**
   - [ ] Create an exportable season recap image showing the final table, MVP, trophies and key achievements.
   - [ ] Ensure generated recaps remain readable and accurate for each supported esport and division.

#### UI overhaul: esports management broadcast presentation

The visual direction is inspired by the information hierarchy and polish of F1 Manager and FC career modes, while keeping a distinctive esports identity. The goal is a clean, high-quality management interface—not a superficial reskin.

- [ ] **Career hub dashboard:** replace the initial tab-heavy feel with a home dashboard featuring a prominent Next Match hero card (opponent, form, countdown and primary action), plus compact tiles for squad, finances, inbox and standings.
- [ ] **Persistent navigation shell:** add a top bar with organisation crest/name, in-game date, cash, board confidence and a clear Continue/Next action; move main destinations into a left sidebar.
- [x] **Player cards — first pass:** present senior starters and bench players as responsive cards with role, overall rating, form, fatigue, morale, potential, MVP count and contract salary. Keep the existing roster table available as a hidden fallback while the new cards are validated.
- [ ] **Player profiles and portraits:** add profile entry points, portrait/fallback avatar art, attributes, career history and richer development details.
- [ ] **Potential development upgrades:** allow managers to spend organisation funds to raise a senior player’s potential ceiling in controlled increments, capped at 99. Implemented as a first pass; balance and save-compatibility still need browser testing.
- [ ] **Consistent visual system:** use a dark, readable base, the organisation's chosen primary colour as an accent, consistent spacing and a clear heading font. Apply the organisation theme consistently without sacrificing contrast or accessibility.
- [ ] **Purposeful motion:** use restrained count-up numbers, standings transitions and pre-match lineup/countdown moments. Respect reduced-motion preferences and keep animations from delaying actions.
- [ ] **Broadcast-style match centre:** improve team identity, scoreboard, timeline, map/series progress, momentum and relevant statistics around the existing simulation. Presentation must not pretend an automated simulation is live round-by-round gameplay.
- [ ] **Clear screen hierarchy:** give each screen one obvious primary action, use sticky next-step actions where useful, and keep individual cards focused rather than overcrowded.
- [ ] **Competition and organisation presentation:** connect standings, season calendar, brackets, finance forecasts, staff/facilities and history to the career hub.
- [ ] **Accessibility and quality of life:** support responsive layouts, keyboard navigation, visible focus, tooltips, useful empty states, confirmations for destructive actions, readable contrast, search/filtering and autosave status.
- [ ] **Keep the current game intact:** existing management screens should continue working inside the new shell during the transition. Do not replace contracts, saves, finances, divisions or multiplayer with mock UI.

#### Recommended implementation stages

1. **Phase 1 — Career shell and hub:** build the persistent top bar, sidebar and dashboard/Next Match card first. Embed or route to existing screens so all current management systems continue to work.
2. **Phase 2 — Squad presentation and sandbox balance:** introduce player cards, add a paid potential-ceiling upgrade, and tune recurring income, operating costs, match travel and the bankruptcy threshold so the default career feels like a sandbox management game rather than financial survival. Add profile entry points next; validate multi-season balance and older saves in-browser.
3. **Phase 3 — Match centre:** improve the pre-match and post-match presentation, timeline and highlights on top of the current simulation rules.
4. **Phase 4 — Career story layer:** add the inbox, board expectations, press moments, scouting progression, season reviews, awards, trophy cabinet and Hall of Fame.
5. **Phase 5 — Polish and options:** add difficulty modes, shareable season recaps, accessibility refinements, responsive layouts and final multi-season regression/balance checks.

#### Sandbox economy requirement

- [ ] **Avoid forced bankruptcy:** the default career should support experimentation, roster building and optional expansion. Finance remains meaningful, but ordinary weak seasons must not create a near-guaranteed game over. Re-check income, wages, travel, sponsor revenue and optional division costs across at least three seasons and all five games.
- [ ] **Potential upgrades must be transparent:** show the cost and increase before purchase, cap potential at 99, and persist upgrades in existing save formats.

#### Update 20 guardrails

- [ ] Preserve existing careers and migrate save data safely; never silently discard older save fields.
- [ ] Keep single-player and multiplayer career rules consistent where they share systems, and preserve the working multiplayer flow.
- [ ] Build the new shell around existing screens first; refactor simulation logic only when a concrete need and regression tests justify it.
- [ ] Verify each phase in the actual browser build before marking it complete.
- [ ] “Premium experience” means presentation, clarity and depth—not paid advantages or pay-to-win mechanics.

## Confirmed future priorities — Match Simulation, Awards & Career Depth

These five feature groups have been added to the roadmap. They are planned work, not claims that every feature is already implemented. Multiplayer has been reported as working, so preserve the existing multiplayer career flow and avoid unnecessary rewrites while building these systems.

### 1. Deeper, more believable match simulation
- [ ] Make player attributes, roles, teamwork, morale, form, fatigue, map/game familiarity and tactical choices influence match outcomes in clear, balanced ways.
- [ ] Add meaningful team tactics and counter-tactics, with results that can create plausible upsets without relying on arbitrary hidden bonuses.
- [ ] Expand round-by-round or map-by-map match reports with key events and concise explanations of why the result happened.
- [ ] Keep simulation rules consistent between single-player and multiplayer, and ensure shared multiplayer results remain identical for every participant.
- [ ] Add repeatable balance tests across multiple seasons, roster strengths and tactics; document known limits of automated non-CS2 simulations.

### 2. Player awards, records and league history
- [ ] Award season MVP and Rookie of the Year using season performance, not overall rating alone.
- [ ] Create All-Pro / All-League selections by role or position for each supported esport.
- [ ] Track career and season statistics, records, award history, team achievements and notable milestones.
- [ ] Build a history/records view so players can compare seasons, remember champions and follow standout careers.
- [ ] Make awards and records work across supported games and shared multiplayer seasons.

### 3. More meaningful roster management
- [ ] Expand contract negotiations with salary, duration, role, playing-time expectations and other appropriate terms.
- [ ] Add transparent buyouts and transfer fees, rival offers, contract expiry decisions and player retention choices.
- [ ] Model player development and decline over time, with potential, age, coaching, playtime and form affecting progression.
- [ ] Let AI organisations make plausible transfers and roster changes based on budget, role needs, performance and long-term plans.
- [ ] Improve team chemistry and role conflicts so roster choices involve trade-offs beyond simply selecting the highest-rated players.

### 4. Sponsors, brand and organisation finances
- [ ] Add sponsor offers with requirements, contract lengths, payouts and clear performance or reputation conditions.
- [ ] Make organisation reputation, competitive results, fan popularity and brand identity affect sponsor interest and deal value.
- [ ] Add optional merchandise and community/content income streams, balanced against costs and organisational scale.
- [ ] Show sponsor obligations, payment schedules, progress and missed-target consequences clearly in the finance dashboard.
- [ ] Keep sponsor income and bonuses balanced across multiple seasons and avoid making one income source an automatic win condition.

### 5. Smarter AI organisations and long-term rivals
- [ ] Give rival organisations distinct budgets, ambitions, roster needs and competitive strengths.
- [ ] Improve AI roster building so teams recruit for role fit, potential, performance and affordability rather than rating alone.
- [ ] Let rivals react to results, player availability and changing team strength, creating believable rebuilds and competitive cycles.
- [ ] Track recurring rivalries, head-to-head records, major upsets, championship runs and other long-term storylines.
- [ ] Ensure AI progression stays competitive but fair over multiple seasons, with visible news/history explaining important changes.

### Suggested sequencing
1. Improve and balance match simulation, with explainable outcomes and repeatable tests.
2. Add season awards, records and historical summaries on top of reliable match statistics.
3. Deepen contracts, transfers, player progression and team chemistry.
4. Add sponsor deals and connected brand/finance systems.
5. Improve AI roster decisions and long-term rival behaviour, then tune the whole ecosystem across multi-season careers.

### Update 13.3 — CS2-Only Playable Build

- **Implemented:** CS2 is the only selectable starting esport; VALORANT, Overwatch and League of Legends show disabled “Coming soon” cards until dedicated title-specific systems are ready.
- **Validation:** JavaScript syntax check passed; the picker still needs interactive browser testing.

### Update 13.2 — First-Career Guide

- **Implemented:** an optional How to Play page from the title screen introduces roster management, finances, training, match preparation, multi-game expansion and long-term planning.
- **Validation:** JavaScript syntax check passed; the guide and menu flow still need interactive browser testing.

### Update 13.1 — Organisation Identity & Starting Esport

- **Implemented first pass:** “Choose Your Starting Esport” picker; CS2 is selectable, while VALORANT, Overwatch and League of Legends are marked Coming Soon.
- **Implemented first pass:** organisation name, short tag, emblem selection, primary/secondary colours and a live setup preview.
- **Implemented first pass:** edit organisation identity later from the Org tab; display organisation branding in the UI.
- **Implemented first pass:** shared organisation finances and identity with separate game divisions; game-specific role labels for division rosters and prompts to rename a division team and its five players.
- **Known limitation:** all starting esports currently share the core match/weekly simulation; extra divisions use a simplified result simulation. Separate game-specific match rules, map pools, player acquisition and deeper per-division management remain planned.

### Update 13.0 — Main Menu & Career Saves

- **Implemented first pass:** dedicated title screen with Continue Career, New Career, Load Career and Import Backup.
- **Implemented first pass:** title-screen career actions and the original game-selection flow (superseded by Update 13.1's expanded starting-esport picker).
- **Implemented first pass:** up to 20 named browser-local save slots, overwrite confirmation, load/delete/export actions, automatic recovery save, JSON backup import/export and legacy Update 12 save loading.
- **Known limitation:** saves are local to the browser/device, not cloud-synced. Autosave is triggered by UI renders and skipped during an active round animation.
- **Needs playtesting:** start a new career, reload and continue, create multiple saves, overwrite/delete one, import/export a backup, and load a pre-13.0 save. Confirm autosave never captures an in-progress animation or corrupts an existing save.
- **Still planned:** deeper tutorial/onboarding, redesigned squad/player cards, richer transitions and a complete game-specific Valorant career.


### Update 11.0 — Scouting & Player Development

- **Implemented first pass:** senior starters and bench players can receive an individual development focus: Aim, Game sense, Mental or Balanced. The selected plan adds targeted growth alongside weekly team training; coach skill and training facilities can improve growth.
- **Implemented first pass:** academy and Tier 2 players follow their saved development focus during annual progression. Existing saves receive defaults for new fields.
- **Implemented first pass:** scouting assignments can prioritise a player role and region. Youth prospects now have regions, and matching assignment settings improve scouting-report precision. Reports include an estimated confidence value.
- **Still planned:** deeper multi-week scouting expeditions, scout regional knowledge and specialisations, shortlist/watchlist, trial invitations, richer player profiles, form/fatigue/burnout, individual training schedules and development history charts.
- **Needs playtesting:** verify development across several seasons, potential ceilings, assignment matching, save migration, and scouting-report costs.

### Update 10.0 — Squad Inventory Hub

- **Implemented first pass:** the Squad tab now has one overview table for Main Team, Bench, Academy prospects and Tier 2 players, with quick actions for bench swaps, sales and promotions.
- **Still planned:** a true shared inventory model where players can be reassigned between Main Team, Bench and Academy while preserving eligibility, contracts and development data. The current version deliberately retains existing squad rules to avoid breaking match simulation.
- **Needs playtesting:** verify inventory actions, role swaps, promotion limits, and rendering across new and existing careers.


### Update 9.3 — Balance Pass

- **Implemented:** starting cash increased to $30,000; annual rival power growth reduced from +1–2 to +0–1; board confidence penalties softened and objective bonuses increased slightly.
- **Needs playtesting:** run multiple full careers and check that the player can stay financially stable, remain competitive as rivals progress, and recover board confidence after a difficult season.


## Update 9.2 — Dynamic Boardroom

- **Complete:** persistent board confidence, three season objectives (league top four, positive cash, senior-team power growth), end-of-season reviews, confidence changes, and performance bonuses.
- **Still to test:** balance confidence movement and board bonuses across several full careers.

**Current build documented by the repository:** Update 13.3 — CS2-Only Playable Build.

### Update 12.3 — Bomb Result Consistency
- **Implemented first pass:** round scoring is resolved from the bomb outcome and the current side: explosion awards the Terrorists; a completed defuse awards the Counter-Terrorists.
- **UI clarity:** promotion actions now say “Promote to bench.”
- **Needs playtesting:** test bomb rounds as both sides before and after the round-12 side swap, including cancelled plants.

### Update 12.2 — Mirage Site & Spawn Zones
- **Implemented first pass:** Mirage's T and CT spawn coordinates and route starts now sit inside the green-outlined spawn areas.
- **Implemented first pass:** C4 planting is validated against the orange A/B site areas; an attacker outside the selected site's area cannot trigger a plant.
- **Needs playtesting:** verify both sites, both starting sides, and route variants in the live browser. Other maps still need their own verified spawn/site zone coordinates.

Implemented, according to the commit history and current build notes:
- Map-specific waypoint routes for Mirage, Inferno, Nuke, Ancient, Anubis, Dust II and Vertigo.
- Separate Terrorist/Counter-Terrorist spawn routes and side switch after 12 rounds.
- Role-aware movement such as lurker pacing, mid support, site attacks and defensive holds.
- Update 8.3: spawn spacing, line-of-sight-gated firefights and close-range contact for eliminations.
- Updates 8.5–8.6: C4 plant, explosion and defuse outcomes with radar rendering and animation.
- Update 8.7: autoplay for a whole match.
- Update 8.9: slower stat growth near the top, a potential ceiling on development, a yearly rival ramp and a softer round-win curve.
- Update 8.8: team economy (pistol, eco, force and full buys, loss bonus, half-time reset, a Force buy tactic) and bomb outcomes that now follow the round winner and side instead of overriding the skill roll.
- Visible spawn/setup, execute/rotate, engagement and round-result phases.

Known limitations / follow-up:
- Waypoints are hand-authored radar-coordinate paths, not extracted CS2 navmeshes.
- Every route needs visual validation against its exact radar image.
- Round outcomes are still statistically simulated; minimap movement does not yet calculate individual combat.
- More reactive rotations, utility, bomb planting/defusing and individual combat simulation remain planned.

Earlier conversation roadmap items (finances, market/transfers, contracts/drama, hybrid match control, map vetoes, staff/scouting and youth academy) are included below as the intended feature set. Verify each one against the current `index.html` before marking it complete; the version history of standalone HTML prototypes and the current repository build may not be identical.

## Design principles

1. **Readable decisions:** every major choice should explain its cost, benefit and risk.
2. **Fair challenge:** the player can win with good management, but rivals improve and mistakes have consequences.
3. **Depth without busywork:** automate routine rounds and allow meaningful tactical input at important moments.
4. **Persistent world:** rival teams, player careers, records and the market continue evolving between seasons.
5. **Data-driven games:** different titles share the organisation layer but use their own roles, match rules, economies and calendars.
6. **Clear status:** keep the UI and this roadmap honest about what is implemented, experimental or planned.
7. **Save safety:** future persistence should be versioned, exportable and resilient to malformed or older saves.

---

## Player feedback backlog — Match clarity, fairness and presentation

### Immediate match bug fixes
- [x] Delay the C4 plant visual and require a Terrorist-side player to reach the selected site area before the bomb marker appears.
- [x] Add a first-pass animated-round checkpoint: cancel the bomb event and avoid successful-plant narration when no living T-side player reaches the selected site area at the plant checkpoint.
- [x] Anchor the visible C4 to the reaching attacker's actual radar position at the plant checkpoint, then preserve that position if the carrier is eliminated later.
- [ ] Validate bomb carrier movement and planted/defused/exploded outcomes across every map, side and simulation mode. If the attack never reaches a site, the game must not narrate a successful plant. Instant whole-map simulation currently skips bomb events rather than claiming an unverified plant.
- [ ] Add automated or repeatable match checks for planting, defusing, side switches and animation skipping.
- [x] Add an expandable match explanation panel showing roster power, opponent power, map familiarity and the major factors behind statistical outcomes; it also explains the limits of the radar animation.

### Match speed and drama
- [x] Replace the binary Normal/Fast toggle with 0.5× Slow, 1× Normal, 2× Fast and 4× Very fast presentation speeds. The speed setting must not change match outcome calculations.
- [ ] Add more distinct high-pressure moments through simulation-grounded events: clutches, comeback rounds, economy pressure, retakes and close finishes.
- [ ] Keep drama explainable and fair; avoid adding arbitrary random bonuses just to create excitement.
- [ ] Improve the match timeline and broadcast presentation for kills, plants, defuses, round swings and decisive moments.

### Competitive map veto and side choice
- [x] Alternate player-first and opponent-first map-veto initiative so the player does not always receive the first action; verify the exact sequence across formats.
- [x] Label each player action explicitly as **BAN** or **PICK**, and show the completed map order before the side-choice step.
- [ ] Add an explicit **DECIDER** label and refine the final-map procedure to match the appropriate competitive rules.
- [x] Add CT/T starting-side selection for Map 1 and display the active side plus half-time switch; validate that the rule is appropriate for each competition format.
- [ ] Show the full veto history, who made each decision, and which maps remain.

### Teach the player how to win
- [ ] Add a short optional first-career tutorial covering finances, roster strength, practice, map confidence, tactics, economy and match decisions.
- [ ] Explain important tactical controls before the player needs them, with concise tooltips and plain-language effects.
- [ ] Add post-round feedback identifying relevant factors behind the result (team strength, map familiarity, economy, tactic, opponent power and relevant staff effects).
- [ ] Offer contextual suggestions without pretending a statistically simulated result has a single certain cause.
- [ ] Make difficulty fair and legible: communicate opponent strength and why a challenge is increasing, rather than relying on unexplained difficulty spikes.

### UI organisation and presentation
- [ ] Audit the current interface for clutter, inconsistent grouping, excessive tables and unclear navigation.
- [ ] Establish a consistent visual hierarchy: primary action, key decision, supporting information and advanced details.
- [ ] Group match preparation, live match controls, results and post-match analysis into a clear workflow.
- [ ] Introduce progressive disclosure so new players see the essentials first while deeper management tools remain available.
- [ ] Treat the presentation redesign as required work for the expanding game scope, not as optional decoration after adding features.

## Roadmap overview

| Track | Focus | Status |
|---|---|---|
| Foundation | Standalone browser game, organisation and CS2 management | Existing project |
| Match simulation & navigation | Hybrid tactical control, map vetoes, map-aware movement and round logic | In progress; Update 8.2 navigation is a first pass |
| Transfers & contracts | Negotiations, buyouts, rival offers and smarter AI rosters | Planned / verify existing parts |
| Staff, scouting & academy | Staff market, contracts, reports, youth development | Partial; Update 11.0 first pass |
| Organisation & brand | Sponsors, merchandise, social media, reputation | Planned |
| Competition & progression | Calendars, brackets, Majors, awards, records | Planned / expand existing league systems |
| Multi-game expansion | Valorant first, then other titles | Planned |
| Living world | Meta shifts, rivalries, drama, player careers and rival ecosystems | Planned |
| Quality & longevity | Saves, balance, accessibility, testing and polish | Ongoing |
| Design-review additions       | Circuit tiers, role proficiency, roster rules, legal/integrity, presentation | Planned                                            |

## Track A — Core management foundation

### A1. Organisation dashboard
- [ ] A single overview for cash, weekly burn, roster status, staff, morale, upcoming matches and deadlines.
- [ ] Clear alerts for expiring contracts, unpaid expenses, unhappy players, sponsor obligations and upcoming travel.
- [ ] Explainable financial summaries: current balance, recurring income, recurring costs, one-off costs and forecast.
- [ ] Organisation identity: name, tag, colours, logo and home region.
- [ ] Difficulty and simulation settings, with tooltips explaining their effects.

### A2. Finances and economic balance
- [ ] Recurring income, wages, staff salaries, facility costs, travel, bootcamps, scouting and academy upkeep.
- [ ] Tournament prize money with transparent splits, taxes/fees where appropriate and timing.
- [ ] Avoid runaway easy money: expenses should scale with organisation size and ambition.
- [ ] Bankruptcy / financial distress with warnings, recovery options and clear consequences instead of arbitrary surprise failure.
- [ ] Optional financial difficulty presets and a detailed financial history.
- [ ] Loan or emergency funding only if balanced with interest, repayment and reputation risks.
- [ ] Separate cash flow from long-term brand value and sponsor commitments.

### A3. Player development and morale

Update 11.0 establishes the first individual development-plan loop. The full FC-style system remains incomplete: richer training schedules, detailed progress history, scout/player reports and wellbeing trade-offs are still planned.
- [ ] Training focus with meaningful trade-offs between skill development, team practice, rest and tactical preparation.
- [ ] Diminishing stat growth near the 99 cap; elite players improve slowly and need more effort.
- [ ] Age, potential, form, confidence, morale, fatigue, pressure handling and career stage.
- [ ] Avoid excessive random stat jumps; show why a player improved or declined.
- [ ] Burnout prevention through rest, workload management and staff support.
- [ ] Injury/availability systems only if they add fair, understandable management choices.

## Track B — CS2 match simulation, tactics and maps

### B1. Hybrid match control
- [ ] Automatically simulate routine rounds but pause for important tactical moments.
- [ ] Important moments can include pistol rounds, economy pivots, streaks, match point, overtime, clutch situations and bomb-related decisions.
- [ ] Allow the player to change approach, call a timeout or let the coach handle the decision.
- [ ] Add autoplay for a whole map, series or match, with speed controls and a match summary.
- [ ] Show round-by-round events, economy, kills/impact, bomb state and why a round was won.
- [ ] Provide a concise post-match report with key turning points and player performance.

### B2. Tactical choices
- [ ] Keep distinct aggressive, default, slow, execute, anti-strat and save/eco approaches where appropriate.
- [ ] Tactics must have trade-offs; no single tactic should be optimal in every situation.
- [ ] Factor in roles, player stats, morale, fatigue, map, side, opponent tendencies, economy and preparation.
- [ ] Timeouts should be limited and useful, with effects on composure or tactical coordination.
- [ ] Let the opponent adapt to repeated patterns and let the player prepare counter-strategies.
- [ ] Optional assistant/coach recommendations that explain a suggestion without forcing it.

### B3. Map vetoes and map confidence
- [ ] Map veto before each series, with rules matching the series format (BO1, BO3 and eventually BO5).
- [ ] Correct pick/ban order and a clear display of remaining maps.
- [ ] Map pool and map-specific team confidence; practice and results can improve confidence.
- [ ] Opponent map strengths, recent results and scouting information inform veto decisions.
- [ ] Map-specific tactical identities, rotations, site approaches and team strengths.
- [ ] Seasonal map-pool changes when the game's meta system is introduced.

### B4. Movement, combat and objective logic
- [ ] Validate all current waypoint routes against the correct radar artwork.
- [ ] Replace brittle hard-coded movement with reusable, map-specific navigation data where practical.
- [ ] Better path choice around chokepoints, blocked routes, sites, mid and teammate positions.
- [ ] Reactive rotations based on spotted enemies, bomb information, sound/intel and remaining time.
- [ ] Bomb planting, plant-site choice, plant timing, defuse attempts, retakes and round-end conditions. *(Partly done: Updates 8.5–8.6 added plant/explode/defuse; 8.8 ties outcomes to the winner. Player-driven plant timing and retake logic still planned.)*
- [ ] Round should not end just because some players are dead if the bomb is planted and can still explode; bomb explosion/defuse must be handled correctly.
- [ ] Utility simulation: smokes, flashes, HE grenades, molotovs/incendiaries and counter-utility at a sensible abstraction level.
- [ ] Individual engagements using aim, reaction, positioning, utility, weapon, range, role and pressure rather than only a single team-power roll.
- [ ] Weapon/economy logic, save decisions, force buys, full buys and side-specific rules. *(Partly done in Update 8.8: team-level economy. Per-player weapons, drops and kept gear are still planned.)*
- [ ] Spectator clarity: combat log, kill feed, bomb timer and phase indicators.
- [ ] Keep a fast statistical mode available so deeper simulation does not make autoplay painfully slow.

### B5. Balance and testing
- [x] Update 9.2 first-pass finance outlook: display cash balance, sponsor/merch income, weekly net and an estimated runway to the debt limit.
- [ ] Test finance balance across multiple automated careers; compare cash reserves, bankruptcies, sponsor reliance and trophy success before tuning recurring costs.
- [ ] Calibrate team power so new organisations can compete but not dominate instantly. *(First pass in Update 8.9; keep re-testing as new systems land. Money balance for passive play is still harsh and needs its own pass.)*
- [ ] Rival strength scales across seasons without becoming an unbeatable wall.
- [ ] Reduce excessive per-series rival growth and make yearly progression understandable.
- [ ] Test edge cases: overtime, forfeits, disconnect-like interruptions, missing players, tied scores and series completion.
- [ ] Add deterministic seeds or reproducible test scenarios for debugging balance.
- [ ] Track match outcomes over many simulated seasons to catch runaway strategies.

## Track C — Player market, transfers and contracts

### C1. Transfer market
- [ ] Search/filter players by role, age, rating, potential, region, language, salary and contract status.
- [ ] Transfer fee, buyout clauses, contract length and wage demands.
- [ ] Loans, loan-to-buy options and loan recalls where sensible.
- [ ] Free agents, trial players, short-term stand-ins and emergency substitutes.
- [ ] Rival organisations compete for the same player; offers can be accepted, rejected or negotiated.
- [ ] AI teams recruit based on roster gaps, finances, playstyle, language, age and potential.
- [ ] Player valuation should reflect ability, potential, age, contract length, reputation and market demand.
- [ ] Prevent exploits such as repeatedly signing/releasing players without meaningful costs.

### C2. Negotiations and contracts
- [ ] Negotiate salary, length, signing bonus, buyout, role promises and performance bonuses.
- [ ] Players value different things: money, playing time, trophies, team quality, location, language, coach, loyalty and career opportunities.
- [ ] Contract expiry warnings and a clear renewal window.
- [ ] Competing offers and counteroffers.
- [ ] Unhappy players can request a transfer or refuse renewal if promises are broken.
- [ ] Bench role, star status and role changes can affect morale.
- [ ] Contract drama should be contextual and explainable, not random punishment.
- [ ] Include cooldowns and sensible limits on negotiations to avoid repetitive clicking.

### C3. Squad inventory, lineup and depth management

- [ ] **Start with five senior players:** a new organisation begins with a complete five-player main roster, so the player can compete immediately and then improve the squad.
- [ ] **One player inventory:** every signed or scouted-and-recruited player is added to a central squad/inventory screen rather than being assigned automatically to the starting lineup.
- [ ] **Three squad destinations:** assign each owned player to the **Main Team** (active starting five), **Bench** (senior substitutes/reserves) or **Academy Team / Tier 2** (development squad).
- [ ] **Simple squad management:** move players between groups with clear controls, see each group's players and roles, and prevent invalid main-team lineups that do not contain five eligible players.
- [ ] **Transfers and scouting feed the same inventory:** signing from the transfer market or recruiting a scouted player adds them to the organisation's player pool; the manager then decides where they belong.
- [ ] **Squad status at a glance:** show active lineup, bench depth, role coverage, player availability, morale, contracts and development status.
- [ ] **Meaningful trade-offs:** main-team players get competitive experience, bench players provide cover and can receive limited development, while academy players prioritise growth but are not available for the main team's matches unless promoted.
- [ ] **Safe squad changes:** warn before moving a player if it leaves the active team short-handed, breaks role coverage or affects morale/playing-time expectations.

### C3. Roster fit and team chemistry
- [ ] Role compatibility, leadership, communication, language and playstyle fit.
- [ ] Team chemistry improves through practice and results, and can decline after conflict or major roster changes.
- [ ] IGL leadership and tactical understanding influence coordination.
- [ ] A high-rated roster should not automatically beat a better-balanced team.
- [ ] Show a simple fit summary and explain the strongest sources of synergy/conflict.

## Track D — Staff, scouting and academy

### D1. Staff market
- [ ] Easy-to-use hiring market with individually generated staff, skills, salaries and contracts.
- [ ] Head coaches, analysts, scouts and sports psychologists first; expand roles only if they add distinct decisions.
- [ ] Staff have strengths, weaknesses, reputation, experience and wage expectations.
- [ ] Contract length, renewals, poaching and staff departure.
- [ ] Staff capacity and diminishing returns to prevent stacking unlimited bonuses.
- [ ] Staff chemistry and fit with the roster/organisation.
- [ ] Training, tactical preparation, scouting accuracy and morale bonuses should be visible and bounded.

### D2. Scouting reports
- [ ] Scout players for a cost and receive estimates rather than perfect information immediately.
- [ ] Report quality depends on scout skill, scouting time, region familiarity and target visibility.
- [ ] Reports reveal current ability, potential range, role fit, personality/work ethic and wage expectations over time.
- [ ] Keep uncertainty meaningful but not frustrating; let repeated scouting narrow estimates.
- [x] First-pass scouting assignment by priority role and region; matching assignments improve report precision.
- [ ] Multi-week scouting expeditions, regional scout knowledge, shortlist/watchlist, role/age filters and trial invitations.
- [ ] Avoid making scouting a pay-to-click tax: give clear value and sensible free information.

### D3. Youth academy
- [ ] **Academy as the Tier 2 development team:** the academy is a real squad destination in the shared player inventory, not a separate disconnected list.
- [ ] **Stronger focused training:** academy players receive a substantially higher training/development rate than senior-team players, balanced by age, potential, coaching quality and diminishing returns.
- [ ] **Development vs competition trade-off:** academy players grow faster but primarily compete in Tier 2/academy fixtures; promotion makes them available for the senior main team or bench.
- [ ] **Promotion and demotion:** move players between Academy, Bench and Main Team without losing their player history, contract or development progress.
- [ ] **Academy management overview:** show current development progress, potential estimate, training focus and players ready for promotion.
- [ ] Recruit generated prospects into an academy.
- [ ] Prospects have age, potential range, preferred roles, growth rate, personality and development needs.
- [ ] Academy coaches/facilities affect growth and costs.
- [ ] Development plans, promotion to the senior bench/roster, loans and eventual releases.
- [ ] Youth tournaments or academy leagues as a later enhancement.
- [ ] Graduation stories and club-developed-player recognition.
- [ ] Ensure academy development is slower and riskier than instantly buying a ready-made star, but can offer long-term value.

## Track E — Organisation, facilities and brand

### E1. Sponsors
- [ ] Sponsor market with different deal sizes, terms, categories and reputations.
- [ ] Fixed payments, performance bonuses, minimum placement/visibility obligations and contract length.
- [ ] Sponsor fit with organisation identity and audience.
- [ ] Conflicting sponsor categories and contract penalties for missed obligations.
- [ ] Sponsor renewal, negotiation, termination and reputation effects.
- [ ] Larger sponsors expect better results, brand reach or content output.

### E2. Brand, audience and media
- [ ] Brand popularity and fanbase that grow through results, star players, content and consistent identity.
- [ ] Social-media/content actions with cost, reach, risk and cooldowns.
- [ ] Merchandising with production costs, sales and demand fluctuations.
- [ ] Press interviews, announcements, roster reveals and tournament storylines.
- [ ] Fan sentiment reacts to wins, losses, transfers, scandals and player loyalty.
- [ ] Rivalries and star players create extra attention.
- [ ] Brand growth must not become a guaranteed infinite-money button.

### E3. Facilities and operations
- [ ] Training facility upgrades that improve practice quality with recurring upkeep.
- [ ] Bootcamps and travel preparation that cost money but improve coordination or map confidence.
- [ ] Optional performance/analytics equipment with diminishing returns.
- [ ] Travel planning, fatigue and time-zone effects for international events.
- [ ] Visas or eligibility constraints only when clearly communicated and not used as arbitrary blockers.
- [ ] Organisation reputation and operational capacity unlock larger opportunities.

### E4. Risk, PR and governance
- [ ] PR crises and scandals as rare, contextual events with multiple response options.
- [ ] Player disputes, poaching, sponsor conflicts, fines and reputation loss where appropriate.
- [ ] Clear distinction between a manageable setback and a save-ending disaster.
- [ ] Player wellbeing and ethical management: no reward for pushing workload indefinitely.
- [ ] Optional challenge settings for how often business crises appear.

## Track F — Tournaments, seasons and awards

### F1. Competition structure
- [ ] Full season calendar with league matches, qualifiers, cups, playoffs and Majors.
- [ ] Tournament formats: round robin, Swiss-style stages, single/double elimination and group stages as appropriate.
- [ ] Bracket visualisation, match schedules, qualification rules and tie-breakers.
- [ ] Prize money and ranking points consistent with event importance.
- [ ] Travel/rest windows between events.
- [ ] Distinguish a league match, qualifier, playoff, Major and exhibition match in rewards and prestige.

### F2. Rankings and records
- [ ] World/region rankings with transparent points and decay.
- [ ] Organisation history, season records, trophy cabinet and best finishes.
- [ ] Player career stats, maps played, ratings/impact, MVPs and notable milestones.
- [ ] Hall of Fame for players, coaches and organisations.
- [ ] Records for longest win streak, most titles, biggest upsets and all-time achievements.
- [ ] Historical results remain available across seasons and after players retire.

### F3. Player highlights and awards
- [ ] League MVP / best player.
- [ ] Major MVP and tournament MVP.
- [ ] Best player by role (AWPer, entry, support, lurker, IGL or game-specific equivalents).
- [ ] Rookie of the season, best coach and breakthrough player.
- [ ] All-star team or dream team selections.
- [ ] Awards based on performance, consistency, event importance and team context, not only raw kills.
- [ ] Award history and award announcements feed into reputation, market value and storylines.

## Track G — Living world, player careers and storylines

### G1. Rival organisations
- [ ] Rival teams improve their rosters, hire staff, negotiate contracts and manage budgets.
- [ ] Transfers change multiple rosters and the wider market rather than only the player's team.
- [ ] AI organisations have identities, preferred regions, budgets, goals and risk tolerance.
- [ ] Rival teams can rise, decline, rebuild or become financially troubled.
- [ ] Results and roster changes affect long-term standings and rivalries.

### G2. Dynamic storylines
- [ ] Rivalries between organisations and individual players.
- [ ] Redemption arcs, underdog runs, roster reunions and former-player revenge narratives.
- [ ] Breakout rookies, declining veterans, transfer sagas and contract standoffs.
- [ ] News feed summarises important events with clear gameplay consequences.
- [ ] Storylines should emerge from simulation state rather than scripted repetition.
- [ ] Keep events varied and avoid spamming inconsequential notifications.

### G3. Careers and wellbeing
- [ ] Retirement, decline, role changes and late-career resurgence.
- [ ] Form, confidence, pressure and burnout evolve over time.
- [ ] Players react to playing time, team success, leadership, broken promises and personal goals.
- [ ] International rosters consider language and communication fit.
- [ ] Optional injuries/absences should be rare, transparent and balanced.

### G4. Meta and patch changes
- [ ] Periodic balance/meta shifts change the relative value of roles, tactics, maps and team styles.
- [ ] Patch notes explain changes in player-friendly language.
- [ ] Teams adapt through practice, analysts and scouting.
- [ ] Strong teams can fall behind if they fail to adapt; weaker teams can find an edge.
- [ ] Changes should be gradual and testable, not randomly invalidate the player's roster.

## Track H — Expand to more esports titles

### H1. Data-driven game framework

- [ ] **Organisation-wide game switcher:** a persistent selector in the main navigation lets the manager switch between CS2, Valorant and future game divisions without restarting the career.
- [ ] **Independent division state:** each game keeps its own roster, bench, academy/Tier 2 squad, staff assignments, tactics, map/agent pool, league table, schedule, results, contracts and division-specific records.
- [ ] **Resume exactly where you left off:** switching games restores that division's last screen/context and all its current season state; switching must not advance its calendar or simulate matches in the background unless a later, clearly labelled world-tick feature is intentionally added.
- [ ] **Shared organisation layer:** cash, ownership, brand, sponsors, facilities and board/owner objectives belong to the organisation. Each division also has its own budget allocation, performance targets, popularity and return-on-investment reporting.
- [ ] **Cross-division overview:** one dashboard compares all divisions' form, upcoming fixtures, standings, finances, staff needs and alerts, with quick links to open each team.
- [ ] **Division setup and expansion:** create/unlock a division, select its game, set its starting roster and league, and decide how much budget/staff support to allocate. Expansion should have a real cost and risk.
- [ ] **Game-specific depth, not reskins:** every title needs its own complete management loop, player attributes/roles, recruitment market, tactics, match rules, competition structure, calendar, progression and AI rivals.
- [ ] **CS2 stays fully featured:** retain the existing CS2 match simulator and management systems while refactoring title-specific logic behind a division boundary.
- [ ] **Valorant as the next complete division:** its own roster and market, Duelist/Initiator/Controller/Sentinel/IGL/Flex role coverage, agent compositions, map pool, economy and side rules, match simulator, tournament calendar and rival organisations.
- [ ] **More titles later:** add another game only when it has a distinctive playable simulation and management loop, rather than a cosmetic tab.
- [ ] **Safe persistence:** saves store the shared organisation plus each division separately, include schema versions, and preserve every division when switching games or loading an older save.
- [ ] **Cross-division staff and player rules:** staff can be dedicated to one division or shared at a cost/capacity trade-off; transfers between games are allowed only where sensible and should never silently convert incompatible player data.
- [ ] Separate shared organisation systems from title-specific rules.
- [ ] Each game defines its own roles, stats, match format, calendar, economy, roster size and competitive scene.
- [ ] Avoid hard-coding CS2 assumptions into every future game.
- [ ] Shared finances, brand, staff and organisation identity work across all teams.
- [ ] Each title has its own roster, standings, tournaments, staff needs and results.

### H2. Valorant — first expansion
- [ ] Unlock a Valorant division after reaching an appropriate reputation/financial milestone.
- [ ] Valorant-specific roles: Duelist, Initiator, Controller, Sentinel, IGL and Flex as applicable.
- [ ] Agent/map pool, composition fit and role coverage.
- [ ] Valorant-specific match simulation, economy, rounds, side switching and tournament calendar.
- [ ] Separate player market and scene while sharing organisation finances and brand.
- [ ] Hiring or sharing staff across divisions creates trade-offs in cost and attention.

### H3. Future titles
- [ ] Consider Fortnite or other esports only after the shared framework works well.
- [ ] Give each title a genuinely distinct competitive format and management loop rather than reskinning CS2.
- [ ] Make expansion costly and risky enough to feel like a strategic milestone.
- [ ] Track each division's budget, results, audience and return on investment.

## Track I — Save games, UX, accessibility and quality

### I1. Persistence
- [x] Save/load game state across browser sessions (first pass; browser-local).
- [x] Export/import saves as a portable JSON file.
- [x] Save payload versioning and legacy Update 12 migration (continue testing future migrations).
- [x] Autosave recovery and invalid-save checks (first pass; storage-limit and corruption cases need testing).
- [x] Multiple named save slots (up to 20); new-game-plus and challenge starts remain planned.
- [ ] Do not silently erase an old save when a new version changes its data shape.

### I2. Interface and usability
- [ ] Responsive layout for common desktop resolutions; keep dense management screens readable.
- [ ] Consistent navigation and clear empty states.
- [ ] Search, filters, sorting and tooltips for long lists.
- [ ] Confirmations for irreversible decisions such as selling a star, releasing a player or deleting a save.
- [ ] Keyboard accessibility, visible focus, adequate contrast and reduced-motion options.
- [ ] Match speed controls, pause/resume and skip animations.
- [ ] Tutorial/onboarding and an in-game glossary for terms such as buyout, potential, chemistry and map veto.

### I3. Engineering and QA
- [ ] Split the single HTML file into logical modules if complexity makes safe iteration difficult, while keeping a simple way to run the game.
- [ ] Centralise balance constants and game data.
- [ ] Add automated smoke tests for season advance, match completion, contracts, transfers, finances, vetoes and saves.
- [ ] Test long simulations across many seasons for balance and performance.
- [ ] Validate all map routes and objective states.
- [ ] Keep a changelog for each update and document known limitations.
- [ ] Add a bug-report template and reproducible test scenarios.

## Additional ideas backlog

These are optional ideas beyond the previously agreed roadmap. Prioritise only when the core loop is stable.

### High-value additions
- [ ] **Club philosophy:** choose an identity (youth development, star-heavy, tactical, budget/value, regional pride) with benefits and trade-offs.
- [ ] **Board / ownership expectations:** owners set targets for results, finances and brand; missing them affects trust.
- [ ] **Season objectives:** short-term goals with meaningful rewards and consequences.
- [ ] **Player personality and leadership groups:** mentoring and chemistry emerge from veteran/rookie relationships.
- [ ] **Opponent scouting dossier:** collect tendencies from prior matches and choose an anti-strategy.
- [ ] **Post-match review:** identify weak maps, economy mistakes, role fit and clutch performance.
- [ ] **Custom difficulty sliders:** rival growth, finances, player development, event frequency and match variance.
- [ ] **Achievements and challenge modes:** rebuild a struggling organisation, win with academy players, or become profitable without trophies.

### Medium-priority additions
- [ ] **Negotiation agent:** delegate renewals and transfers to a manager/assistant with defined limits.
- [ ] **Academy affiliate / loan network:** send prospects to smaller teams for experience.
- [ ] **Regional identity and fan culture:** home region affects recruitment reach and audience.
- [ ] **Merch drops and player collaborations:** limited-time demand based on popularity and results.
- [ ] **Broadcast narratives:** pre-match storylines, upset alerts and rivalry recaps.
- [ ] **Scouting combine:** annual event where prospects can be compared before the transfer window.
- [ ] **Staff career progression:** assistants can improve, earn reputation and be poached.
- [ ] **Tactical playbook presets:** save preferred approaches and adjust them per opponent.
- [ ] **Custom tournaments / sandbox mode:** configure teams, format, prize pool and rules.

### Long-term / experimental
- [ ] **Community-created scenarios** using validated data files.
- [ ] **Mod-friendly game data** for teams, maps, roles and tournament formats.
- [ ] **Spectator replay mode** with timeline controls and event markers.
- [ ] **Historical start dates / alternate esports timelines.**
- [ ] **Online league or asynchronous challenge mode** only if offline gameplay is already robust.
- [ ] **Optional fictional sponsors/brands and generated team identities** to avoid depending on real-world licensing.
- [ ] **Advanced ownership decisions:** sell a stake, merge organisations or acquire another division.
- [ ] **Retired-player transition:** former pros can become coaches, analysts or academy mentors.

## Track J — Additions from design review

These items were identified after comparing the original concept with this roadmap. Most are planned, not implemented. Verify against `index.html` before marking anything complete.

### J1. Competitive ladder and roster rules

- [ ] **Circuit tiers and qualifying path:** Tier 3, Tier 2 and Tier 1 events with open qualifiers, invites and ranking-based seeding, so the climb into Majors is part of the game.
- [ ] **Roster continuity rule:** ranking points and invites depend on how much of the roster stays together, which discourages constant transfers.
- [ ] **Scrims against other teams:** scrim partners improve map confidence, but risk leaking tendencies to rivals. Choosing partners becomes a decision.
- [ ] **LAN vs online:** some players thrive or choke on stage; home-crowd advantage at big events.
- [ ] **Rivalry derbies:** matches against a main rival carry extra hype, prize money and morale swings.
- [ ] **Silly season:** an off-season transfer window with rumours, leaks and bidding wars.

### J2. Players

- [ ] **Role proficiency and retraining:** a skill level per role (rifler, AWP, IGL, lurker, support and so on), improved through scrims, so players can be retrained into new roles. This was part of the original concept.
- [ ] **Player traits:** visible and hidden traits such as clutch, consistent, leader, mentor, injury-prone or difficult, which scouting can uncover over time. (A basic trait field exists in the current build; expand it.)
- [ ] **Detailed player stats:** rating, ADR, opening duels, KAST, clutch record and impact, feeding awards, valuations and post-match reviews.
- [ ] **Relationship web:** duos and friend groups, in-roster rivals and players who want to follow a friend to another organisation.
- [ ] **Role scarcity:** good IGLs and supports are rare, and stars need the right teammates, so roster building is a puzzle rather than "buy the highest ratings".

### J3. Business, legal and world events

- [ ] **Legal and integrity problems:** contract disputes, tampering, match-fixing or cheating bans, plus visa and tax issues, handled as rare and explainable events.
- [ ] **Prize splits and revenue share:** how prize money is divided between organisation, players and staff, with player revenue-share demands.
- [ ] **Investors and franchising:** funding rounds, investors who expect returns, and franchised league slots that can be bought or lost.
- [ ] **Wildcard events:** a tournament is cancelled, a patch lands mid-event, a rival disbands or a sponsor goes bankrupt.

### J4. Presentation and platform

- [ ] **Premium management-game visual redesign:** evolve the interface from a functional browser dashboard into a polished PC management-game presentation inspired by the information hierarchy and production style of F1 Manager and FC career modes, while retaining a distinctive esports identity.
- [ ] **Organisation headquarters home screen:** a branded HQ dashboard with division shortcuts, upcoming fixtures, board objectives, news, finance alerts and season milestones.
- [ ] **Visual squad hub:** player portraits/cards, clear overall and potential ratings, role labels, form/morale indicators, a visual starting lineup and bench, and drag-and-drop or similarly intuitive squad assignment.
- [ ] **Rich player and staff profiles:** dedicated pages with attributes, career history, development, contracts, reports, relationships and contextual actions.
- [ ] **Premium management UI system:** consistent typography, spacing, iconography, colour themes, graphs, responsive panels, polished transitions, hover/focus states and accessible contrast; avoid making every screen a plain table.
- [ ] **Broadcast-style match presentation:** clear team identities, scoreboard, timeline, kill feed, economy/bomb state, tactical map, match intro and detailed post-match report, layered over the existing simulation rather than replacing its rules.
- [ ] **Game-specific presentation:** CS2 and Valorant should each have appropriate visual language, match displays and management terminology while remaining inside the same organisation career.
- [ ] **Art and asset pipeline:** create or source suitable player portraits, team logos, facility illustrations and game-specific visual assets with appropriate usage rights; support fallbacks when assets are missing.
- [ ] **Stage the visual upgrade:** first polish the existing browser UI, then consider packaging it as a desktop app with Electron or Tauri. Desktop packaging improves delivery, not visual quality by itself.
- [ ] **Long-term engine decision:** only consider migrating parts of the game to Unity or Unreal if a genuinely 3D headquarters, animated 3D scenes or a much more cinematic match presentation justifies the added rebuild and maintenance cost.
- [ ] **Preserve the management simulation:** presentation upgrades must not discard existing management systems or corrupt saves; keep the game playable and test each screen as it is redesigned.
- [ ] **Distribution:** optional desktop packaging (Electron or Tauri) and release on itch.io or Steam.


- [ ] **Caster commentary and highlights:** generated lines during matches, replayable highlight moments and map heatmaps built from simulated movement.
- [ ] **Playstyle identity:** roster makeup gives the team a readable style that rivals can scout and counter.
- [ ] **Explained coach suggestions** so newer players can learn CS concepts while playing.
- [ ] **Ironman mode:** one save, no reloading.
- [ ] **Organisation legacy:** retired numbers, a museum screen and a history of the biggest moments.
- [ ] **Mobile and touch support:** the current build targets desktop browsers.
- [ ] **Distribution:** optional desktop packaging (Electron or Tauri) and release on itch.io or Steam.

## Suggested implementation order

This order prioritises foundational systems and avoids building later features on unstable simulation logic.

1. Finish and validate CS2 match/navigation/objective logic (including bomb plant/defuse and correct round-end rules).
2. Stabilise finances, contracts, transfer negotiations and AI roster building; implement the shared player inventory and Main Team / Bench / Academy assignment flow, then verify existing systems before reimplementing them.
3. Complete staff market, scouting reports and youth academy with transparent costs and bounded bonuses.
4. Finish competition calendars, brackets, rankings and individual awards.
5. Add persistence, export/import saves and automated regression tests before large new systems.
6. Build sponsor deals, brand, content, merch and facilities.
7. Add living-world rival teams, dynamic storylines, player careers and meta changes.
8. Build the multi-division state model and persistent game switcher, then implement Valorant as a genuinely separate, fully featured division.
9. Polish the browser UI into a premium management-game experience, then consider desktop packaging; defer any full 3D engine migration until the core game and multi-division architecture are stable.\n10. Continue accessibility, balancing, achievements and optional sandbox/modding features.

## Definition of done for each update

- The feature works in the actual repository build, not just in a design note or separate prototype.
- Existing features still work after the update.
- Key edge cases have been tested and known limitations are documented.
- New recurring costs, bonuses and progression are balance-tested.
- README and this roadmap are updated to distinguish implemented, partial and planned work.

## Status notes

- Update 8.2 navigation is a substantial first pass, not pixel-perfect navmesh pathfinding.
- Do not mark a feature complete solely because it appeared in an earlier conversation or prototype file; verify it in the current repository.
- This roadmap is deliberately broad. It is a long-term direction, not a promise that every optional idea will be implemented in one update.

## Track K — Three-mode game structure

**Vision:** Sandbox offers creative freedom, Manager Mode offers the enduring core simulation (including multiplayer), and Story Mode delivers a character-led, branching journey through the realities of building an esports organisation. These are distinct experiences built on shared rules and compatible data concepts where technically appropriate. This is a design roadmap; none of the items below should be considered implemented until verified in the relevant build.

### K1. Shared simulation foundation

- [ ] Define a versioned, documented world-state/data model for organisations, divisions, players, staff, contracts, finances, competitions, relationships, events and historical records.
- [ ] Keep simulation rules separate from UI presentation and narrative/cinematic presentation.
- [ ] Use a deterministic or reproducibly seeded simulation path for tests, with explicit handling of random events.
- [ ] Create a simulation event log: record what happened, when, why, and which systems were affected; use it for debugging, news, recaps and story triggers.
- [ ] Preserve existing browser careers and multiplayer. Add safe, versioned save migrations and regression tests before changing persisted structures.
- [ ] Share rules and data contracts between the browser and Godot versions where useful; do not force code reuse across different architectures when it increases risk.
- [ ] Provide clear simulation explanations so users can understand important match, transfer, development and financial outcomes.

### K2. Sandbox Mode — unrestricted organisation creator

- [ ] Add a dedicated mode with no mandatory budget or progression restrictions, plus optional custom starting money, salary rules, difficulty, progression speed and world settings.
- [ ] Allow editing/creation of organisations, divisions, players, staff, sponsors, rivals, competitions and tournament formats within supported data rules.
- [ ] Offer an organisation/scenario editor with starting conditions, objectives, restrictions, rosters and custom rules.
- [ ] Add a Scenario Lab for testing ideas such as superstar rosters with poor chemistry, academy-only teams, financial challenges or rival superteams.
- [ ] Support instant simulation of matches, tournaments, seasons and multi-season histories, with speed controls and clear warnings when advancing large amounts of time.
- [ ] Allow users to save, duplicate, reset, export/import and share scenarios in a validated format; reject malformed or incompatible data safely.
- [ ] Make sandbox edits explicit and reversible where possible; distinguish a sandbox career from competitive multiplayer careers.
- [ ] Consider community-created scenarios and mod-friendly data files after save validation, security and core simulation stability are proven.

### K3. Manager Mode — core career and multiplayer

- [ ] Keep this as the main long-term management experience: scouting, contracts, transfers, player development, staff, finances, sponsors, brand, divisions, facilities, competition and organisation growth.
- [ ] Give the world independent progression: AI organisations recruit, develop prospects, hire staff, change strategies, experience financial pressure and pursue their own goals.
- [ ] Add clear career setup choices for difficulty, simulation detail, financial realism, event frequency and automation.
- [ ] Support optional delegation to staff, showing the proposed action and expected trade-offs before confirmation.
- [ ] Build a configurable career calendar and weekly decision hub that prioritises actionable decisions over notification spam.
- [ ] Keep multiplayer rules authoritative and synchronised: common match outcomes, contracts, transfers, finances and world progression must resolve consistently for all participants.
- [ ] Define multiplayer pause/turn ownership, offline/late-player handling, save ownership, reconnect behaviour and exploit prevention before adding complex shared-world systems.
- [ ] Ensure sandbox-only editing and narrative-only benefits cannot create unfair advantages in multiplayer.

### K4. Story Mode — branching narrative and Godot presentation

- [ ] Build a small vertical slice first: one organisation, a compact cast, a short opening chapter, a limited set of branching decisions and several distinct outcomes.
- [ ] Let storylines arise from actual simulation state (results, cash flow, contracts, relationships, promises, reputation and board objectives), not just fixed scene order.
- [ ] Create reusable event definitions with trigger conditions, dialogue/scene content, player choices, immediate effects, delayed effects, cooldowns and follow-up conditions.
- [ ] Separate narrative triggers and outcomes from Godot 3D scenes; cinematics present consequences and should not secretly mutate game state.
- [ ] Give characters personalities, ambitions, relationships, trust and a memory of important events and management promises.
- [ ] Track both the event and each character's interpretation of it; different personalities can respond differently to the same decision.
- [ ] Support multiple viable paths: competitive dynasty, underdog development, media/content brand, player-first culture, recovery/comeback, sale/merger or other believable outcomes.
- [ ] Make choices have understandable trade-offs without guaranteeing a single correct path or punishing players with arbitrary hidden effects.
- [ ] Use cinematic scenes selectively: important signings, difficult conversations, major matches, sponsor/ownership meetings, turning points and endings; keep routine events concise and skippable.
- [ ] Add accessibility options for subtitles, text speed, scene skipping, reduced motion and replaying key story summaries.
- [ ] Test branching paths for continuity, state consistency, unreachable outcomes and save/load correctness.

### K5. Organisation legacy across modes

- [ ] Track persistent organisational history: former players/staff/owners, trophies, records, transfers, academy graduates, sponsorships, crises, rivalries and ownership changes.
- [ ] Let former players and staff progress into later roles where suitable, including coaching, scouting, management or rival organisations.
- [ ] Build a timeline, trophy cabinet, Hall of Fame and season/year-in-review summaries.
- [ ] Use history as input for Story Mode callbacks and as an optional archive in Manager and Sandbox modes.
- [ ] Allow sandbox scenarios to generate alternate histories without overwriting the user's other careers.

### K6. Delivery order and guardrails

1. Stabilise Manager Mode and existing saves/multiplayer before adding major new dependencies.
2. Define the shared data model, event log and repeatable simulation tests.
3. Implement Sandbox editing and scenario saving on top of the proven simulation.
4. Prototype Story Mode with a small branching narrative before investing in a large volume of 3D assets.
5. Expand the narrative library, character memory, organisational legacy and cinematic production only after the vertical slice proves engaging.
6. Test every mode for balance, usability, save compatibility and long-run simulation consistency.
- [ ] Never let cinematic scope delay core simulation quality.
- [ ] Never claim a mode or feature is implemented based on a roadmap entry alone.

## Track L — Lessons from sports management and franchise games

This track translates research into original esports-specific design goals. The cited games are references for patterns, not templates to copy wholesale. Feature details can change between yearly releases; verify current behaviour before using a specific version as a benchmark.

### L1. Career hub, weekly rhythm and actionable decisions

- [ ] Create a central hub that answers: what matters now, what happens next, what needs a decision, and what happens if I ignore it?
- [ ] Organise the career into readable cycles (week, event, transfer window, season, offseason) with a clear next action and the ability to delegate or advance time.
- [ ] Prioritise meaningful events over dozens of low-value emails. Group routine updates and surface urgent deadlines separately.
- [ ] Let users tune detail: concise summaries for quick progression and deeper reports for players who want full simulation detail.
- [ ] Keep the main hub useful on both quiet weeks and high-stakes tournament weeks.

### L2. Staff identity, delegation and trust

- [ ] Give coaches, scouts, analysts and executives distinct skills, preferences, judgement quality and development paths.
- [ ] Let the player delegate tasks with visible scope, spending limits, selection criteria and a preview of the staff recommendation.
- [ ] Show why staff recommended an action, its assumptions and uncertainty; allow the user to override it.
- [ ] Model owner/board trust and staff credibility through promises kept, goals met and sensible communication.
- [ ] Let delegation save time but introduce understandable trade-offs based on staff competence and workload.

### L3. Recruitment, contracts and AI roster logic

- [ ] Make scouting information incomplete and probabilistic: regional knowledge, sample size, role fit, personality fit and potential uncertainty should be visible.
- [ ] Base recruitment on a roster plan, tactical/role needs, age/career stage, budget, contract length, chemistry and future availability—not overall rating alone.
- [ ] Give AI teams coherent squad plans, roster-size limits, budget constraints and follow-up actions after signing or selling a player.
- [ ] Add credible contract negotiations, player/agent expectations, competing offers, renewal deadlines, buyouts and role/playing-time promises.
- [ ] Prevent obvious AI errors such as collecting redundant starters, ignoring required roles, overspending without a plan or leaving suitable free agents unused.
- [ ] Add a transfer/roster audit test suite and multi-season simulation tests for AI decision quality.

### L4. Player development, identity and team dynamics

- [ ] Model development as a combination of potential, coaching, practice quality, role fit, competitive experience, workload, confidence and opportunity.
- [ ] Make development non-linear and plausible: prospects can stall, break out, change roles or exceed expectations; stars do not all progress to elite ratings automatically.
- [ ] Give players understandable motivations, leadership, team influence, career ambitions and responses to management promises.
- [ ] Track squad hierarchy, mentoring, friendships, tensions and role competition without allowing chemistry to overwhelm demonstrated skill.
- [ ] Ensure players can react to being benched, sold, promoted, overworked or treated fairly.
- [ ] Provide a clear development report that distinguishes current ability, estimated potential, recent growth and uncertainty.

### L5. Tactics, preparation and explainable competition

- [ ] Give each esport a distinct tactical/preparation model instead of copying football or motorsport mechanics literally.
- [ ] Add opponent dossiers based on prior matches, maps, roles, tendencies and sample size; let analysts improve confidence and reduce uncertainty.
- [ ] Make preparation choices compete for limited time: opponent analysis, practice, rest, role changes and team-building cannot all be maximised simultaneously.
- [ ] Explain match outcomes through relevant factors and events, including role fit, tactics, form, fatigue, map familiarity, opponent adaptation and variance.
- [ ] Make every match report answer both “what happened?” and “what can I do about it?”
- [ ] Ensure match presentation communicates the actual simulation and never invents gameplay events that did not occur.

### L6. Finance, ownership and long-term constraints

- [ ] Separate cash balance, operating profit/loss, committed future wages, transfer instalments, sponsor receivables and forecast runway.
- [ ] Add meaningful but understandable ownership/board expectations, annual budgets and strategic directives.
- [ ] Give financial decisions delayed consequences: expensive renewals can restrict future recruitment; investment may improve development or commercial reach but take time to pay off.
- [ ] Offer realistic recovery paths such as selling a player, reducing scope, finding investment, restructuring or exiting a division before a sudden game-over.
- [ ] Add optional stricter rules for players who want harder financial realism while keeping the default career sustainable and learnable.
- [ ] Use multi-season automated balance tests for wages, revenue, player values, AI budgets and competitive parity.

### L7. Customisation, historical starts and scenario replay

- [ ] Let Sandbox users configure league size, roster rules, tournament format, salary rules, development speed, AI behaviour and starting date/conditions where supported.
- [ ] Add challenge scenarios with a clear premise, objective, constraints and optional medal/rating based on how well the player performs.
- [ ] Allow users to replay a historic or generated turning point as an alternate scenario, where data exists.
- [ ] Preserve custom settings in save metadata and show them clearly when loading or sharing a career.
- [ ] Prioritise flexible scenario creation over an expensive hand-authored catalogue of one-off challenges.

### L8. Immersion and presentation with purpose

- [ ] Use a clean information hierarchy inspired by the best management hubs: one primary action, contextual detail and optional deeper views.
- [ ] Use visual moments (trophy celebrations, banners, season reviews, roster reveals, important negotiations) to celebrate outcomes created by the simulation.
- [ ] Make team/league history visible through records, honours, banners and former-player connections.
- [ ] Keep dense tables available for power users while offering summaries, filters and explanations for everyone else.
- [ ] Prefer accurate, context-aware presentation over a high volume of generic commentary or cinematic scenes.

### L9. QA principles derived from franchise-game failure patterns

- [ ] Simulation correctness takes priority over adding more modes or cosmetic content.
- [ ] Add automated tests for plausible AI roster composition, budgets, contract logic, player development curves, awards and league statistics.
- [ ] Run large seeded simulations and compare distributions (wins, player ratings, wages, roster sizes, awards, finances) against documented expected ranges.
- [ ] Build tools to inspect why an AI team made a move or why a player developed, rather than relying on guesswork.
- [ ] Use data-driven rules and versioned tuning parameters so balance fixes do not require risky UI rewrites.
- [ ] Keep a known-issues list and validate new updates in real browser/game builds before marking them complete.

### Research references informing this track

- Football Manager 2024 Console feature overview — dynamics, player buy-in, training, mentoring, smarter transfers and a career timeline: https://www.footballmanager.com/features/football-manager-2024-console-new-features-unveiled
- Football Manager 2024 recruitment and finance design notes: https://www.footballmanager.com/features/smarter-transfers-squad-building-and-finance
- PC Gamer's Football Manager 2024 review — strong emotional attachment and long-term immersion, alongside a warning about information overload and menu friction: https://www.pcgamer.com/football-manager-2024-review/
- EA SPORTS Madden NFL 26 Franchise deep dive — weekly coaching decisions, staff, preparation and making games feel different: https://www.ea.com/games/madden-nfl/madden-nfl-26/news/madden-26-gridiron-notes-franchise-deep-dive
- EA SPORTS Madden NFL Franchise guide — weekly hub and emergent decisions: https://help.ea.com/en/articles/madden-nfl/madden-franchise-mode/
- EA SPORTS FC 26 Career features — live challenges, an evolving manager market and off-pitch events: https://www.ea.com/games/ea-sports-fc/fc-26/features/fc-26-career-mode
- EA SPORTS FC 25 Career Mode deep dive — live start points, scouting, development and tactical customisation: https://www.ea.com/games/ea-sports-fc/fc-25/news/pitch-notes-fc-25-career-mode-deep-dive
- F1 / Frontier, F1 Manager 2024 — Create A Team, sponsorships, mentality, affiliates and Race Replay: https://corp.formula1.com/f1-manager-2024-to-launch-23-july-including-new-create-a-team-mode/
- NBA 2K27 MyNBA announcement — community-requested franchise tools, contract negotiation, GM trust, league rule changes and long-form legacy play: https://newsroom-anz.2k.com/news/nbar-2k27-mynba-answers-the-community-with-a-back-to-basics-franchise-overhaul-and-modern-cba-rules
- NBA 2K26 MyNBA overview — simulation speed options and season directives: https://newsroom.2k.com/news/endless-possibilities-await-as-mynba-levels-up-in-nbar-2k26
- Community feedback on MyNBA — recurring complaints about roster AI, progression, rules fidelity and bugs; treat as anecdotal signals rather than representative measurements: https://www.reddit.com/r/NBA2k/comments/1ttbujx/what_new_mynba_features_would_you_like_to_see_in/
- Community discussion on franchise mode's long-term value and historic customisation: https://www.reddit.com/r/NBA2k/comments/wse8fv/mynba_eras_will_only_really_work_if_they_get/

