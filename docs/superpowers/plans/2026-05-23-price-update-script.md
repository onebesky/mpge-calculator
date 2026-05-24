# Price Update Script Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Node.js script that fetches live gas and electricity prices from the EIA API and merges them into `prices.js`, triggered weekly by GitHub Actions.

**Architecture:** The script loads the current `prices.js` via `require()` (using a `global.window` shim), fetches state-level data from two EIA v2 endpoints, overwrites only `avgGas` and `avgElec` fields, then writes the updated object back as `window.PRICES = ...`. A GitHub Actions workflow runs it on a Monday 8am UTC schedule and commits any changes with `[skip ci]` to avoid a Netlify deploy loop.

**Tech Stack:** Node.js 24 (built-in `fetch`, `--env-file` for local `.env`), GitHub Actions

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `index.html` | Modify line 199 | Change default MPGe from 60 → 100 |
| `.gitignore` | Create | Exclude `.env` from git |
| `.env` | Create (gitignored) | Local EIA_API_KEY for running script manually |
| `scripts/update-prices.js` | Create | Fetch + merge + write script |
| `.github/workflows/update-prices.yml` | Create | Weekly cron workflow |
| `prices.js` | Modified at runtime | Updated by the script, not directly edited |

---

## Task 1: Change default MPGe to 100

**Files:**
- Modify: `index.html:199`

- [ ] **Step 1: Edit the MPGe input default value**

In `index.html` line 199, change `value="60"` to `value="100"`:

```html
<input type="number" id="mpge" value="100" min="1" step="1">
```

- [ ] **Step 2: Verify in browser**

Open `index.html` directly in a browser. The MPGe field should show `100` on load and the result panel should calculate immediately with that default.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: default MPGe to 100 (BEV fleet average)"
```

---

## Task 2: Add .gitignore

**Files:**
- Create: `.gitignore`

- [ ] **Step 1: Create .gitignore**

Create `/Users/ondrejnebesky/workspace/mpge-calculator/.gitignore` with:

```
.env
node_modules/
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: add .gitignore"
```

---

## Task 3: Create local .env

**Files:**
- Create: `.env` (gitignored — never committed)

- [ ] **Step 1: Create .env**

Create `/Users/ondrejnebesky/workspace/mpge-calculator/.env` with:

```
EIA_API_KEY=YOUR_EIA_API_KEY
```

Replace `YOUR_EIA_API_KEY` with the actual key. This file is gitignored and local-only.

- [ ] **Step 2: Verify it's ignored**

Run:
```bash
git status
```
Expected: `.env` does NOT appear in the output (it is ignored).

---

## Task 4: Create scripts/update-prices.js

**Files:**
- Create: `scripts/update-prices.js`

- [ ] **Step 1: Create the scripts directory and script file**

Create `/Users/ondrejnebesky/workspace/mpge-calculator/scripts/update-prices.js`:

```javascript
#!/usr/bin/env node
'use strict';

const fs   = require('fs');
const path = require('path');

const API_KEY = process.env.EIA_API_KEY;
if (!API_KEY) {
  console.error('Error: EIA_API_KEY environment variable is not set.');
  process.exit(1);
}

// Load current prices.js via a window shim so window.PRICES assignment works
global.window = {};
require('../prices.js');
const prices = global.window.PRICES;

// EIA petroleum/pri/gnd duoarea code → our state slug
// NUS = national US average
const GAS_DUOAREA_TO_SLUG = {
  NUS: null,
  SAL: 'alabama',
  SAZ: 'arizona',
  SCA: 'california',
  SCO: 'colorado',
  SCT: 'connecticut',
  SFL: 'florida',
  SGA: 'georgia',
  SIL: 'illinois',
  SIN: 'indiana',
  SKY: 'kentucky',
  SLA: 'louisiana',
  SMA: 'massachusetts',
  SMD: 'maryland',
  SMI: 'michigan',
  SMN: 'minnesota',
  SMO: 'missouri',
  SNC: 'north-carolina',
  SNJ: 'new-jersey',
  SNV: 'nevada',
  SNY: 'new-york',
  SOH: 'ohio',
  SOK: 'oklahoma',
  SOR: 'oregon',
  SPA: 'pennsylvania',
  SSC: 'south-carolina',
  STN: 'tennessee',
  STX: 'texas',
  SVA: 'virginia',
  SWA: 'washington',
  SWI: 'wisconsin',
};

// EIA electricity/retail-sales stateid (2-letter) → our state slug
// US = national US average
const ELEC_STATEID_TO_SLUG = {
  US: null,
  AL: 'alabama',
  AZ: 'arizona',
  CA: 'california',
  CO: 'colorado',
  CT: 'connecticut',
  FL: 'florida',
  GA: 'georgia',
  IL: 'illinois',
  IN: 'indiana',
  KY: 'kentucky',
  LA: 'louisiana',
  MA: 'massachusetts',
  MD: 'maryland',
  MI: 'michigan',
  MN: 'minnesota',
  MO: 'missouri',
  NC: 'north-carolina',
  NJ: 'new-jersey',
  NV: 'nevada',
  NY: 'new-york',
  OH: 'ohio',
  OK: 'oklahoma',
  OR: 'oregon',
  PA: 'pennsylvania',
  SC: 'south-carolina',
  TN: 'tennessee',
  TX: 'texas',
  VA: 'virginia',
  WA: 'washington',
  WI: 'wisconsin',
};

// Build a query string without percent-encoding bracket notation in keys.
// EIA v2 uses data[0]=value, facets[product][0]=EPMR style params.
function eiaUrl(base, params) {
  const qs = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
  return `${base}?${qs}`;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

async function fetchGasPrices() {
  const url = eiaUrl('https://api.eia.gov/v2/petroleum/pri/gnd/data/', {
    api_key:              API_KEY,
    frequency:            'weekly',
    'data[0]':            'value',
    'facets[product][0]': 'EPMR',
    'facets[process][0]': 'PTE',
    'sort[0][column]':    'period',
    'sort[0][direction]': 'desc',
    length:               '100',
  });

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gas API ${res.status}: ${body}`);
  }
  const { response } = await res.json();

  // Results are sorted newest-first; first occurrence per duoarea = most recent
  const byArea = {};
  for (const row of response.data) {
    if (!(row.duoarea in byArea) && row.value != null) {
      byArea[row.duoarea] = round2(parseFloat(row.value));
    }
  }
  return byArea;
}

async function fetchElecPrices() {
  const url = eiaUrl('https://api.eia.gov/v2/electricity/retail-sales/data/', {
    api_key:                 API_KEY,
    frequency:               'monthly',
    'data[0]':               'price',
    'facets[sectorName][0]': 'residential',
    'sort[0][column]':       'period',
    'sort[0][direction]':    'desc',
    length:                  '100',
  });

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Electricity API ${res.status}: ${body}`);
  }
  const { response } = await res.json();

  // Price is in cents/kWh — convert to $/kWh
  const byState = {};
  for (const row of response.data) {
    if (!(row.stateid in byState) && row.price != null) {
      byState[row.stateid] = round2(parseFloat(row.price) / 100);
    }
  }
  return byState;
}

function writePricesJs(data) {
  const content =
    '// Price data — update this file periodically. Sources: EIA (electricity), AAA/EIA (gas), utility tariff sheets (TOU).\n' +
    `// Last updated: ${data.updated}\n` +
    `window.PRICES = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(path.resolve(__dirname, '../prices.js'), content, 'utf8');
}

async function main() {
  console.log('Fetching EIA gas prices…');
  const gas = await fetchGasPrices();
  console.log(`  ${Object.keys(gas).length} areas returned`);

  console.log('Fetching EIA electricity prices…');
  const elec = await fetchElecPrices();
  console.log(`  ${Object.keys(elec).length} states returned`);

  // Patch national averages
  if (gas.NUS  !== undefined) prices.national.avgGas  = gas.NUS;
  if (elec.US  !== undefined) prices.national.avgElec = elec.US;

  // Patch per-state avgGas
  let gasPatched = 0;
  for (const [code, slug] of Object.entries(GAS_DUOAREA_TO_SLUG)) {
    if (!slug || !prices.states[slug]) continue;
    if (gas[code] !== undefined) { prices.states[slug].avgGas = gas[code]; gasPatched++; }
  }

  // Patch per-state avgElec
  let elecPatched = 0;
  for (const [code, slug] of Object.entries(ELEC_STATEID_TO_SLUG)) {
    if (!slug || !prices.states[slug]) continue;
    if (elec[code] !== undefined) { prices.states[slug].avgElec = elec[code]; elecPatched++; }
  }

  prices.updated = new Date().toISOString().slice(0, 10);
  writePricesJs(prices);
  console.log(`prices.js written — gas: ${gasPatched} states, elec: ${elecPatched} states (${prices.updated})`);
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
```

- [ ] **Step 2: Run the script locally to verify it works**

```bash
node --env-file=.env scripts/update-prices.js
```

Expected output (approximate):
```
Fetching EIA gas prices…
  40+ areas returned
Fetching EIA electricity prices…
  50+ states returned
prices.js written — gas: 29 states, elec: 29 states (2026-05-23)
```

If the EIA API returns a non-200 status, the error message will include the status code and response body — use that to diagnose (wrong key, wrong parameter name, etc.).

- [ ] **Step 3: Verify prices.js was updated correctly**

Open `prices.js` and confirm:
- `updated` field shows today's date
- `avgGas` and `avgElec` values are plausible (gas: $2–$6, elec: $0.10–$0.35)
- TOU fields, DCFC, city data, and `touProgram` strings are untouched
- File starts with the comment header and `window.PRICES = {`

- [ ] **Step 4: Open index.html in a browser and verify it loads correctly**

The page should load with state data intact. Select California — it should show updated prices.

- [ ] **Step 5: Commit**

```bash
git add scripts/update-prices.js prices.js
git commit -m "feat: add EIA price update script"
```

---

## Task 5: Create GitHub Actions workflow

**Files:**
- Create: `.github/workflows/update-prices.yml`

- [ ] **Step 1: Create the workflow directory and file**

Create `/Users/ondrejnebesky/workspace/mpge-calculator/.github/workflows/update-prices.yml`:

```yaml
name: Update fuel prices

on:
  schedule:
    - cron: '0 8 * * 1'  # Monday 08:00 UTC
  workflow_dispatch:       # allow manual trigger from GitHub UI

jobs:
  update-prices:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '24'

      - name: Fetch and update prices
        run: node scripts/update-prices.js
        env:
          EIA_API_KEY: ${{ secrets.EIA_API_KEY }}

      - name: Commit if prices changed
        run: |
          git config user.name  "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          if git diff --quiet prices.js; then
            echo "Prices unchanged — nothing to commit."
          else
            git add prices.js
            git commit -m "chore: update prices [skip ci]"
            git push
          fi
```

- [ ] **Step 2: Commit the workflow**

```bash
git add .github/workflows/update-prices.yml
git commit -m "ci: add weekly price update workflow"
```

- [ ] **Step 3: Add EIA_API_KEY as a GitHub Actions secret**

Once the repo is pushed to GitHub:
1. Go to repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `EIA_API_KEY`, Value: your EIA key
4. Save

- [ ] **Step 4: Verify via manual trigger**

After pushing to GitHub, go to Actions → "Update fuel prices" → "Run workflow". Confirm it runs successfully and produces a `chore: update prices [skip ci]` commit (or logs "Prices unchanged").

---

## Self-review notes

- No TDD applied here: the script calls a live external API with no mockable interface — the manual run in Task 4 Step 2 is the integration test.
- The `[skip ci]` tag on the auto-commit prevents Netlify from re-deploying on every Monday price update (Netlify respects this tag by default).
- The `global.window = {}` shim in the script is deliberately simple — it relies on `prices.js` being a synchronous assignment, which it is.
- City-level prices (`cities` sub-objects) are not updated — EIA data is state-level only.
