# hendrixbrent.comv2

## Uma Musume Tier List Page

New page: `uma-musume-tierlist.html` with separate assets:
- CSS: `static/uma-tierlist.css`
- JS: `static/uma-tierlist.js`

Features:
- Ranks 1–20 rendered with pagination (10 per page).
- Placeholder avatar squares; replace by adding `image` paths in the `umas` array within `uma-tierlist.js`.
- Accessible table structure (`<table>` + pagination controls with proper labels).

How to add images:
1. Place image assets (e.g. `static/img/uma-01.png`).
2. In `uma-tierlist.js`, set `image: "./static/img/uma-01.png"` for each object.
3. Optional: Add specific notes for each Uma in the `note` field.

Future improvements (optional):
- Persist rankings via JSON fetch.
- Allow client-side filtering or search.
- Add per-Uma detail modal.
