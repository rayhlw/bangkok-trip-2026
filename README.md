# 国庆曼谷行程

Static travel planner for 2026-10-02 to 2026-10-07.

- `dist/index.html`: source-backed recommendations, budget and reference links.
- `dist/dashboard.js`: timezone-aware itinerary dashboard and device-local packing checklist.
- `dist/routes.js`: approximate route overview, transport estimates and Google Maps navigation.
- `dist/style.css`: responsive UI.

Authoritative trip times come from user-provided flight screenshots. No passenger names, ticket numbers or booking-session URLs are retained. Hotels, events and vehicles are not booked. Prices are dated reference snapshots or explicitly labeled estimates. Map markers are approximate orientation points, not surveyed entrances; connectors are schematic, not road routes. Checklist state is browser-local only. No background notifications.

Preview: `python3 -m http.server 4173 --directory dist`.

Published using Sites identity in `.openai/hosting.json`. Reuse this identity on updates. Leaflet license is retained in `dist/LEAFLET-LICENSE.txt`. Photograph attribution appears on the page.
