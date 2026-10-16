# Esports Org Manager

A browser-based esports organisation management game. The current repository build is **Update 8.2 — CS2 Movement & Navigation**.

## Play

Open [index.html](./index.html) in a modern desktop browser. The game is a standalone HTML file and does not require a build step or package installation.

## Update 8.2

- Added map-specific waypoint routes for Mirage, Inferno, Nuke, Ancient, Anubis, Dust II, and Vertigo.
- Added separate T and CT spawn routes and a side switch after the first 12 rounds.
- Added role-aware movement, including lurker pacing, mid support, site attacks, and defensive holds.
- Added visible spawn/setup, execute/rotate, engagement, and round-result phases.
- Preserved the existing manager systems and match controls.

## Known limitations

Routes are hand-authored approximations mapped to the radar images, not extracted in-game navigation meshes. Movement should be more structured and avoid the old arbitrary straight-line motion, but every route still needs visual testing against the exact radar artwork. Round outcomes are still simulated statistically; the minimap animation illustrates the round rather than calculating individual player combat.

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for later planned updates.
