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
    length:                  '100', // EIA returns ~55 electricity entries; safe ceiling
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
  console.error(err);
  process.exit(1);
});
