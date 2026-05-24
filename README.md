# MPGe Calculator

Converts an EV's MPGe rating into a cost-equivalent gas MPG based on real local electricity and gas prices. Helps drivers understand what their "60 MPGe" sticker actually means for their wallet.

## How it works

The math: `EV $/mi = (33.7 kWh ÷ MPGe) × $/kWh`, then `equivalent MPG = gas $/gal ÷ EV $/mi`. The 33.7 kWh constant is the EPA's energy content of one gallon of gasoline.

Users can pick a state and city to auto-fill local rates, toggle between average and TOU off-peak electricity pricing, and choose their charging mix (home / mixed / mostly fast-charge).

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app — layout, styles, and calculator logic |
| `prices.js` | Price data: 30 states, ~75 cities, TOU off-peak rates. **Update this periodically.** |
| `vercel.json` | Vercel rewrite rule so `/california` serves `index.html` |
| `_redirects` | Netlify equivalent (not used on Vercel) |

## Deploying to Vercel

### First deploy

```bash
npm i -g vercel   # if not already installed
vercel            # follow prompts, deploy from this directory
```

Vercel auto-detects this as a static site (no framework needed). The `vercel.json` rewrite handles all state/city URL paths.

### Subsequent deploys

```bash
vercel --prod
```

### Environment

No build step, no dependencies, no environment variables. Everything is static.

## URL structure

| URL | Behavior |
|---|---|
| `/` | US national average pre-filled |
| `/california` | California state rates pre-filled |
| `/california/san-francisco` | San Francisco (PG&E) rates pre-filled |
| `/?state=california` | Same as `/california` (query param fallback) |

State and city slugs match the keys in `prices.js` (e.g. `new-york`, `new-york-city`, `north-carolina`).

## Updating prices

Edit `prices.js` — it's a plain JS file assigned to `window.PRICES`. Change the `updated` date at the top and update whichever numbers have drifted.

**Sources to check:**
- Electricity state averages: [EIA Electric Power Monthly](https://www.eia.gov/electricity/monthly/) — Table 5.6.A
- Gas prices by state: [EIA Weekly Retail Gasoline](https://www.eia.gov/petroleum/gasprices/) or AAA Gas Prices
- TOU off-peak rates: utility tariff sheets or the utility's EV rate page directly (rates change less often than commodity prices)

### Adding a state

Add an entry to `states` in `prices.js`:

```js
"your-state": {
  name: "Your State",
  avgElec: 0.14,       // $/kWh, EIA state average
  touOffPeak: 0.07,    // $/kWh, utility off-peak EV rate
  avgGas: 3.20,        // $/gal, state average
  dcfc: 0.48,          // $/kWh, fast-charge (roughly national)
  touProgram: "Utility Name EV Rate — off-peak 9 pm–9 am",
  cities: {            // optional — omit if no city data
    "city-slug": {
      name: "City Name",
      utility: "Utility Name",
      avgElec: 0.14,
      touOffPeak: 0.07,
      avgGas: 3.22
    }
  }
}
```

The slug (key) must be URL-safe lowercase with hyphens. It becomes the URL path: `/your-state` and `/your-state/city-slug`.

## SEO

When a state or city is selected, the page updates `<title>` and `<meta name="description">` dynamically. Google renders JavaScript, so these pages are indexable. For each state URL to be crawlable, Vercel must serve `index.html` at that path — which `vercel.json` handles.
