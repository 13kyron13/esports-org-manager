# Roadmap

This roadmap records the status of work on Esports Org Manager.

## Update 8.2 — CS2 Movement & Navigation — implemented first pass

- [x] Map-specific waypoint routes for Mirage, Inferno, Nuke, Ancient, Anubis, Dust II, and Vertigo.
- [x] Separate T/CT spawn positions and side switch after 12 rounds.
- [x] Role-aware movement, site attacks, mid support, lurker pacing, and CT defensive holds.
- [x] Visible round phases: spawn/setup, execute/rotate, engagements, and round result.
- [ ] Visual validation and route tuning against each exact radar image.
- [ ] More reactive rotations, utility use, bomb plant/retake logic, and individual combat simulation.

Note: navigation is currently driven by hand-authored radar-coordinate waypoint paths, not extracted CS2 navmeshes. Treat this as a substantial first pass, not a claim of pixel-perfect in-game pathfinding.

## Update 9 — Transfer Overhaul

- Salary and contract negotiations.
- Buyout clauses and transfer fees.
- Competing offers from rival organisations.
- Contract expiry and free-agent decisions.
- Improved AI roster building and squad needs.

## Update 10 — Living Esports Ecosystem

- Rival organisations develop players and talent.
- Transfers affect other teams and the wider market.
- Multi-season progression.
- Competition results influence organisations over time.

## Status notes

- Current repository build: Update 8.2.
- The earlier arbitrary straight-line movement has been replaced with map-specific waypoint routes; visual route tuning remains a known follow-up task.
