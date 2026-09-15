# 国庆曼谷行程

Static travel planner for 2026-10-02 to 2026-10-07.

- `dist/index.html`: source-backed recommendations, budget and reference links.
- `dist/dashboard.js`: timezone-aware itinerary dashboard and device-local packing checklist.
- `dist/routes.js`: approximate route overview, transport estimates and Google Maps navigation.
- `dist/style.css`: responsive UI.

Authoritative trip times come from user-provided flight screenshots. No passenger names, ticket numbers or booking-session URLs are retained. Four hotel nights are booked; events and vehicles remain unbooked. Prices are dated reference snapshots or explicitly labeled estimates. Map markers are approximate orientation points, not surveyed entrances; connectors are schematic, not road routes. Checklist state is browser-local only. No background notifications.

Preview: `python3 -m http.server 4173 --directory dist`.

Primary website: https://rayhlw.github.io/bangkok-trip-2026/

GitHub repository: https://github.com/rayhlw/bangkok-trip-2026

Edit `dist/`, commit on `main`, and run `sh publish.sh`. The script pushes source to `main` and a `git subtree split` of only `dist/` to `gh-pages`. GitHub Pages automatically builds and publishes that branch. This uses GitHub's built-in branch publishing and does not require OAuth workflow scope. Check the Pages build and live page after each update. Local CSS and JavaScript use relative paths so the site works under `/bangkok-trip-2026/`.

The old Sites identity in `.openai/hosting.json` is retained for reference; GitHub Pages is the user's chosen publishing destination for future updates. Do not redeploy to Sites or start AWS resources unless requested.

Leaflet license is retained in `dist/LEAFLET-LICENSE.txt`. Photograph attribution appears on the page. External Google Maps and map tiles may have different network availability from the main website. Checklist selections are stored per browser and will not migrate automatically from the previous domain.
