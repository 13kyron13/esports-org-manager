# Esports Org Manager — Master Roadmap

This is the master plan for the full game, including the original concept, previously agreed update roadmap, current repository work, and additional ideas. It is intentionally comprehensive: items marked **Planned** are design goals, not claims that they already exist in the playable build.

## Project vision

Build a long-running esports organisation simulator. Start with one Counter-Strike roster and a limited budget, then grow into a respected esports brand that can compete across multiple games. The player manages both the sporting side (players, tactics, training, scouting, tournaments) and the business side (contracts, staff, finances, sponsors, facilities, reputation and risk).

The game should reward smart long-term decisions rather than simply buying the highest-rated players. It should be challenging but fair, support multi-season stories, and keep the existing standalone browser-game approach where practical.

## Current repository status

### Update 15.0 — Match Preparation & Player Form

- **Update 14 implemented:** once-per-match-week opponent scouting shows an estimated opponent power and grants a small team preparation bonus; Analyst staff improve the bonus.
- **Update 15 implemented:** player form and fatigue are saved per player and included in team power. Form shifts after series results; fatigue rises through preparation and matches, Rest training lowers it, and a new season provides recovery and brings form toward neutral.
- **Coming soon consistency:** the Empire expansion action no longer opens new non-CS2 divisions. Existing divisions stored in legacy saves remain available rather than being deleted.
- **Validation:** JavaScript syntax checks passed. Browser playtesting, save migration checks and multi-season balance testing remain outstanding.

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
