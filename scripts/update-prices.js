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
  const byArea = {};
  for (const row of response.data) {
    const val = round2(parseFloat(row.value));
    if (!(row.duoarea in byArea) && Number.isFinite(val)) {
      byArea[row.duoarea] = val;
    }
  }
  return byArea;
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
  const byState = {};
  for (const row of response.data) {
    const val = round2(parseFloat(row.price) / 100);
    if (!(row.stateid in byState) && Number.isFinite(val)) {
      byState[row.stateid] = val;
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

  prices.updated = new Date().toISOString().slice(0, 10);
  writePricesJs(prices);
  console.log(`prices.js written — gas: ${gasPatched} states, elec: ${elecPatched} states (${prices.updated})`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
