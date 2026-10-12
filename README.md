# nbsleep

**Baby sleep, week by week** — how much sleep a baby needs from day 1 to 12 months.

Live: https://jorgequijano.github.io/nbsleep/

## What it is

A single-page, mobile-first reference for newborn/infant sleep:

- **Week-by-week table (0–16 weeks)** — total sleep, night/day split, naps, wake windows, night wakings, and what's happening developmentally each week.
- **Month-by-month table (3–12 months)** — same columns for the month granularity.
- **Birth-date calculator** — enter the birth date once (saved in the browser's localStorage); the page shows the baby's age and highlights the matching row in both tables. Due date also works (you get the week-0 guide).
- **Next-sleep helper** — enter when the baby woke up; it shows the next sleep window based on the current age's wake-window range.
- **Sample days, feeding guide, safe-sleep checklist, sleepy cues, growth spurts & regressions** — all sourced, all cited.
- **Auto light/dark theme** — follows the OS `prefers-color-scheme`; no toggle by design.

No server, no accounts, no analytics, no tracking. Everything runs client-side; the only stored value is the birth date in localStorage.

## Sources

Data ranges compiled from: AAP HealthyChildren.org, CDC, NHS, Stanford Medicine Children's Health, Cleveland Clinic, Johns Hopkins Medicine, CHOP, plus week-by-week sleep guides (BabySleepSite, The Sleep Lady, NCSA, Huckleberry, Raising Children Network). Full list with links on the page.

## Files

- `index.html` — page structure + static sections
- `style.css` — theme (light/dark via CSS variables), responsive tables
- `app.js` — data tables + age calculator + next-sleep helper
- `favicon.svg`

## Local preview

```bash
python3 -m http.server 4173
# open http://localhost:4173/
```

Deployed with GitHub Pages: branch `main`, path `/` (repo root).
