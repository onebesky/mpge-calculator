# Price Update Script Design

**Date:** 2026-05-23  
**Status:** Approved

## Overview

A Node.js script (`scripts/update-prices.js`) fetches live state-level gas and electricity prices from the EIA API and merges them into the existing `prices.js` file. A GitHub Actions workflow runs it weekly and auto-commits any changes.

## Files

```
scripts/update-prices.js              ← fetch + merge + write script
.github/workflows/update-prices.yml  ← weekly cron workflow
.env                                  ← EIA_API_KEY=... (gitignored, local only)
.gitignore                            ← add .env entry
```

`prices.js` is the only file modified at runtime. Its structure is unchanged.

## Script Data Flow

1. **Load current prices** — Set `global.window = {}`, then `require('../prices.js')` to capture `window.PRICES` as a JS object. This preserves all static fields (TOU rates, DCFC, city data, TOU program descriptions).

2. **Fetch gas prices** — EIA endpoint `v2/petroleum/pri/gnd/data/` with `frequency=weekly`, `product=EPM0`, `grade=R` (regular unleaded). Returns the latest weekly retail average per state. Map EIA two-letter state codes to our slugs (`CA` → `california`).

3. **Fetch electricity prices** — EIA endpoint `v2/electricity/retail-sales/data/` with `frequency=monthly`, `sectorName=residential`. Returns latest monthly average in cents/kWh per state. Convert to $/kWh.

4. **Merge** — Walk `states` object. For each state, overwrite `avgGas` and `avgElec` with EIA values if present; leave all other fields untouched. Update `national` with US-level EIA figures. Set `updated` to today's date (YYYY-MM-DD).

5. **Write** — Serialize back to `window.PRICES = { ... }` format with the original comment header. Write to `prices.js`.

## What EIA covers vs. what stays static

| Field | Source |
|---|---|
| `avgGas` | EIA (updated by script) |
| `avgElec` | EIA (updated by script) |
| `touOffPeak` | Static (manual update) |
| `dcfc` | Static (manual update) |
| `touProgram` | Static (manual update) |
| city-level prices | Static (manual update) |

## GitHub Actions Workflow

- **Schedule:** `cron: '0 8 * * 1'` — Monday 8am UTC
- **Manual trigger:** `workflow_dispatch`
- **Node version:** 24
- **Steps:**
  1. Checkout with `GITHUB_TOKEN`
  2. Setup Node 24
  3. Run `node scripts/update-prices.js` with `EIA_API_KEY` from repo secret
  4. If `prices.js` changed: commit `chore: update prices [skip ci]` and push
  5. If unchanged: log "Prices unchanged" and exit cleanly
- **`[skip ci]`** on commit message prevents Netlify deploy loop

## Local Usage

Node 24 has `--env-file` built in — no dotenv dependency needed.

```bash
node --env-file=.env scripts/update-prices.js
# or inline:
EIA_API_KEY=your_key node scripts/update-prices.js
```

## Out of Scope

- DCFC rate APIs (no single authoritative source — networks vary)
- TOU off-peak rate APIs (utility-specific, no standard API)
- City-level price updates (EIA data is state-level only)
- Default MPGe change to 100 (separate one-line fix in `index.html`)
