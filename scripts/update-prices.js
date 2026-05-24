#!/usr/bin/env node
'use strict';

const fs   = require('fs');
const path = require('path');

const API_KEY    = process.env.EIA_API_KEY;
const OPENEI_KEY = process.env.OPENEI_API_KEY;

if (!API_KEY) {
  console.error('Error: EIA_API_KEY environment variable is not set.');
  process.exit(1);
}

// Load current prices.js via a window shim so window.PRICES assignment works
global.window = {};
require('../prices.js');
const prices = global.window.PRICES;
if (!prices || typeof prices !== 'object') {
  console.error('Error: prices.js did not assign window.PRICES — file may be corrupt.');
  process.exit(1);
}

// Per-state gas price lookup: state slug → EIA duoarea codes to try in order.
// Tries the state-level code first; falls back to the most specific PADD region.
// EIA only publishes weekly state-level gas prices for 9 states — the rest use
// PADD regional averages (R1X=New England, R1Y=Central Atlantic, R1Z=Lower Atlantic,
// R20=Midwest, R30=Gulf Coast, R40=Rocky Mountain, R5XCA=West Coast ex-CA).
const GAS_STATE_LOOKUPS = {
  'alabama':        ['SAL',  'R30'],    // PADD 3 Gulf Coast
  'arizona':        ['SAZ',  'R5XCA'], // PADD 5 ex-CA (better proxy than R50 which includes CA)
  'california':     ['SCA'],
  'colorado':       ['SCO',  'R40'],   // PADD 4 Rocky Mountain
  'connecticut':    ['SCT',  'R1X'],   // PADD 1A New England
  'florida':        ['SFL'],
  'georgia':        ['SGA',  'R1Z'],   // PADD 1C Lower Atlantic
  'illinois':       ['SIL',  'R20'],   // PADD 2 Midwest
  'indiana':        ['SIN',  'R20'],
  'kentucky':       ['SKY',  'R20'],
  'louisiana':      ['SLA',  'R30'],
  'massachusetts':  ['SMA'],
  'maryland':       ['SMD',  'R1Y'],   // PADD 1B Central Atlantic
  'michigan':       ['SMI',  'R20'],
  'minnesota':      ['SMN'],
  'missouri':       ['SMO',  'R20'],
  'north-carolina': ['SNC',  'R1Z'],
  'new-jersey':     ['SNJ',  'R1Y'],
  'nevada':         ['SNV',  'R5XCA'],
  'new-york':       ['SNY'],
  'ohio':           ['SOH'],
  'oklahoma':       ['SOK',  'R20'],
  'oregon':         ['SOR',  'R5XCA'],
  'pennsylvania':   ['SPA',  'R1Y'],
  'south-carolina': ['SSC',  'R1Z'],
  'tennessee':      ['STN',  'R20'],
  'texas':          ['STX'],
  'virginia':       ['SVA',  'R1Z'],
  'washington':     ['SWA'],
  'wisconsin':      ['SWI',  'R20'],
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

// State slug → USPS 2-letter code (for OpenEI API)
const SLUG_TO_STATE_CODE = {
  'alabama': 'AL',        'arizona': 'AZ',       'california': 'CA',
  'colorado': 'CO',       'connecticut': 'CT',   'florida': 'FL',
  'georgia': 'GA',        'illinois': 'IL',       'indiana': 'IN',
  'kentucky': 'KY',       'louisiana': 'LA',     'massachusetts': 'MA',
  'maryland': 'MD',       'michigan': 'MI',       'minnesota': 'MN',
  'missouri': 'MO',       'north-carolina': 'NC', 'new-jersey': 'NJ',
  'nevada': 'NV',         'new-york': 'NY',       'ohio': 'OH',
  'oklahoma': 'OK',       'oregon': 'OR',         'pennsylvania': 'PA',
  'south-carolina': 'SC', 'tennessee': 'TN',      'texas': 'TX',
  'virginia': 'VA',       'washington': 'WA',     'wisconsin': 'WI',
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
    length:               '100', // EIA returns <35 gas areas; safe ceiling
  });

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gas API ${res.status}: ${body}`);
  }
  const { response } = await res.json();
  if (!Array.isArray(response?.data)) {
    throw new Error(`Gas API returned unexpected response shape: ${JSON.stringify(response)}`);
  }

  // Results are sorted newest-first; first occurrence per duoarea = most recent
  let latestPeriod = null;
  const byArea = {};
  for (const row of response.data) {
    if (!latestPeriod) latestPeriod = row.period;
    const val = round2(parseFloat(row.value));
    if (!(row.duoarea in byArea) && Number.isFinite(val)) {
      byArea[row.duoarea] = val;
    }
  }
  return { byArea, period: latestPeriod };
}

async function fetchElecPrices() {
  const url = eiaUrl('https://api.eia.gov/v2/electricity/retail-sales/data/', {
    api_key:                 API_KEY,
    frequency:               'monthly',
    'data[0]':               'price',
    'facets[sectorid][0]':   'RES',
    'sort[0][column]':       'period',
    'sort[0][direction]':    'desc',
    length:                  '200', // EIA returns ~55 electricity entries; 200 adds safety margin
  });

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Electricity API ${res.status}: ${body}`);
  }
  const { response } = await res.json();
  if (!Array.isArray(response?.data)) {
    throw new Error(`Electricity API returned unexpected response shape: ${JSON.stringify(response)}`);
  }

  // Price is in cents/kWh — convert to $/kWh
  let latestPeriod = null;
  const byState = {};
  for (const row of response.data) {
    if (!latestPeriod) latestPeriod = row.period;
    const val = round2(parseFloat(row.price) / 100);
    if (!(row.stateid in byState) && Number.isFinite(val)) {
      byState[row.stateid] = val;
    }
  }
  return { byState, period: latestPeriod };
}

// Extract the off-peak energy rate at 2 am on a January weekday from an OpenEI rate plan.
// OpenEI energyweekdayschedule is a 12×24 matrix [month][hour] → period index.
// energyratestructure[periodIdx][tier] has { rate, adj, unit } fields.
function planOffPeakRate(plan) {
  try {
    const sched  = plan.energyweekdayschedule;
    const struct = plan.energyratestructure;
    if (!Array.isArray(sched) || !Array.isArray(struct)) return null;
    const periodIdx = sched[0][2]; // January (month 0), 2 am (hour 2)
    if (periodIdx == null || !Array.isArray(struct[periodIdx])) return null;
    const tiers = struct[periodIdx];
    if (!tiers.length) return null;
    // First tier's base rate + adjustment; skip demand-charge-only tiers
    const tier = tiers[0];
    if (tier.unit && tier.unit !== 'kwh') return null;
    const rate = (tier.rate || 0) + (tier.adj || 0);
    // Sanity-check: must be a plausible residential off-peak $/kWh
    return rate > 0.02 && rate < 1.20 ? round2(rate) : null;
  } catch {
    return null;
  }
}

async function fetchOpenEITouRates() {
  if (!OPENEI_KEY) {
    console.log('  OPENEI_API_KEY not set — skipping TOU rate update');
    return {};
  }

  const results = {};
  const stateEntries = Object.entries(SLUG_TO_STATE_CODE);

  // Process states in batches to avoid hammering the API
  const CONCURRENCY = 5;
  for (let i = 0; i < stateEntries.length; i += CONCURRENCY) {
    const batch = stateEntries.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(async ([slug, code]) => {
      try {
        const url = new URL('https://api.openei.org/utility_rates');
        url.searchParams.set('api_key',  OPENEI_KEY);
        url.searchParams.set('version',  'latest');
        url.searchParams.set('format',   'json');
        url.searchParams.set('sector',   'Residential');
        url.searchParams.set('state',    code);
        url.searchParams.set('detail',   'full');
        url.searchParams.set('limit',    '500');
        url.searchParams.set('approved', 'true');

        const res = await fetch(url.toString());
        if (!res.ok) {
          console.warn(`  OpenEI ${code}: HTTP ${res.status}`);
          return;
        }
        const data = await res.json();
        const items = Array.isArray(data.items) ? data.items : [];

        // Prefer plans that mention EV / electric vehicle in their name.
        // Fall back to all TOU plans if none found (e.g. TX deregulated market).
        let candidates = items.filter(p => {
          const n = (p.name || '').toUpperCase();
          return (n.includes('EV') || n.includes('ELECTRIC VEHICLE')) &&
                 p.energyweekdayschedule && p.energyratestructure;
        });

        if (!candidates.length) {
          candidates = items.filter(p =>
            (p.name || '').toUpperCase().includes('TOU') &&
            p.energyweekdayschedule && p.energyratestructure
          );
        }

        if (!candidates.length) return;

        const rates = candidates.map(planOffPeakRate).filter(r => r !== null);
        if (!rates.length) return;

        // Median across matching plans to avoid outliers from oddly-structured entries
        rates.sort((a, b) => a - b);
        results[slug] = rates[Math.floor(rates.length / 2)];
      } catch (e) {
        console.warn(`  OpenEI ${code}: ${e.message}`);
      }
    }));
  }

  return results;
}

function writePricesJs(data) {
  const content =
    '// Price data — update this file periodically. Sources: EIA (electricity), AAA/EIA (gas), OpenEI URDB (TOU).\n' +
    `// Last updated: ${data.updated}\n` +
    `window.PRICES = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(path.resolve(__dirname, '../prices.js'), content, 'utf8');
}

async function main() {
  console.log('Fetching EIA gas prices…');
  const { byArea: gas, period: gasPeriod } = await fetchGasPrices();
  console.log(`  ${Object.keys(gas).length} areas returned (period: ${gasPeriod})`);

  console.log('Fetching EIA electricity prices…');
  const { byState: elec, period: elecPeriod } = await fetchElecPrices();
  console.log(`  ${Object.keys(elec).length} states returned (period: ${elecPeriod})`);

  console.log('Fetching OpenEI TOU off-peak rates…');
  const touRates = await fetchOpenEITouRates();
  const touPatched = Object.keys(touRates).length;
  console.log(`  ${touPatched} states updated from OpenEI`);

  // Patch national averages
  if (gas.NUS  !== undefined) prices.national.avgGas  = gas.NUS;
  if (elec.US  !== undefined) prices.national.avgElec = elec.US;

  // Patch per-state avgGas — try state-level code first, fall back to PADD region
  let gasPatched = 0;
  for (const [slug, codes] of Object.entries(GAS_STATE_LOOKUPS)) {
    if (!prices.states[slug]) continue;
    for (const code of codes) {
      if (gas[code] !== undefined) {
        prices.states[slug].avgGas = gas[code];
        gasPatched++;
        break;
      }
    }
  }

  // Patch per-state avgElec
  let elecPatched = 0;
  for (const [code, slug] of Object.entries(ELEC_STATEID_TO_SLUG)) {
    if (!slug || !prices.states[slug]) continue;
    if (elec[code] !== undefined) { prices.states[slug].avgElec = elec[code]; elecPatched++; }
  }

  // Patch per-state touOffPeak from OpenEI; also update national median
  for (const [slug, rate] of Object.entries(touRates)) {
    if (prices.states[slug]) prices.states[slug].touOffPeak = rate;
  }
  if (touPatched > 0) {
    const allTou = Object.values(touRates).sort((a, b) => a - b);
    prices.national.touOffPeak = allTou[Math.floor(allTou.length / 2)];
  }

  const today = new Date().toISOString().slice(0, 10);
  prices.updatedGas  = gasPeriod  || today;
  prices.updatedElec = elecPeriod || today;
  if (touPatched > 0) prices.updatedTou = today;
  prices.updated = today;

  writePricesJs(prices);
  console.log(
    `prices.js written — gas: ${gasPatched} states (${prices.updatedGas}),` +
    ` elec: ${elecPatched} states (${prices.updatedElec}),` +
    ` tou: ${touPatched} states (${prices.updatedTou || 'unchanged'})`
  );
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
