# MPGe Slider Redesign

**Date:** 2026-05-24  
**Status:** Approved  
**Scope:** `index.html` only — no changes to `prices.js`, `scripts/`, or result panel

---

## Goal

Make MPGe the visually dominant input. Currently it's a small number field buried in a two-column row alongside gas price. The redesign replaces it with a large number display, a gradient slider, and 30 vehicle reference markers.

---

## Layout

No new panels. The existing "Your location & prices" panel keeps its structure:

1. **State** (top, unchanged)
2. **MPGe** (expanded sub-section, new design — described below)
3. **Gas price + charge mode + rates** (unchanged, below)

---

## MPGe Sub-section

### Large number input

- `<input type="number" id="mpge">` styled with Fraunces serif, ~68px, accent yellow (`--accent`)
- Centered, with "MPGe" label in `var(--ink-dim)` beside it
- Remains a real editable input — users can type any value directly
- `id="mpge"` stays as the existing source of truth; no JS changes to downstream calc logic

### Gradient slider

- New `<input type="range" id="mpge-slider">`, range **25–150**, step 1
- Custom CSS: track is a static `linear-gradient(to right, #e84040, #e88040, #f4c840, #a0d040, #40c060)` via `-webkit-appearance: none`
- Custom thumb: 22px circle, `var(--ink)` fill, dark border, subtle box-shadow
- **Bidirectional sync**: slider input → updates `#mpge`; `#mpge` input → clamps to [25,150] and updates slider
- Values outside [25,150] are valid in the number input (e.g. a user typing 160) — slider just pegs at max

### Vehicle tick marks

- Generated in JS from a `VEHICLES` constant array (see below)
- Container: `<div id="mpge-ticks">` with `position: relative`, sits directly below the slider
- Each tick: `<span>` with `position: absolute`, `left: calc(${pct}%)`, `width: 2px`, `height: 10px`
- Position formula: `pct = (v.mpge - 25) / 125 * 100`
- BEV ticks: `var(--ev)` (green) at 60% opacity; PHEV ticks: `var(--accent)` (yellow) at 60% opacity
- Each tick gets `title="[Name] · [MPGe] MPGe"` for native hover tooltip
- Ticks are non-interactive (pointer-events: none) — no click-to-set behavior

### Nearest-vehicle chip

- `<div id="mpge-nearest">` below the ticks, always visible
- Updates on every slider or number input change
- Logic: find vehicle in `VEHICLES` with minimum `Math.abs(v.mpge - current)`
- Display: `≈ [Name] · [MPGe] MPGe · BEV` or `· PHEV`
- BEV label color: `var(--ev)`; PHEV label color: `var(--accent)`
- No threshold — always shows nearest regardless of distance

---

## Vehicle Data

Hardcoded `const VEHICLES` array in the `<script>` block, 30 entries sorted by MPGe ascending:

| Name | MPGe | Type |
|------|------|------|
| Wrangler 4xe | 49 | PHEV |
| BMW X5 45e | 50 | PHEV |
| Volvo XC60 PHEV | 55 | PHEV |
| Grand Cherokee 4xe | 56 | PHEV |
| Rivian R1T | 73 | BEV |
| BMW 330e | 75 | PHEV |
| F-150 Lightning | 78 | BEV |
| Hyundai Tucson PHEV | 80 | PHEV |
| Kia Sportage PHEV | 84 | PHEV |
| Toyota RAV4 Prime | 94 | PHEV |
| Cadillac Lyriq | 95 | BEV |
| Audi Q4 e-tron | 96 | BEV |
| Mustang Mach-E | 100 | BEV |
| BMW i4 | 102 | BEV |
| Tesla Model X | 102 | BEV |
| Ford Escape PHEV | 105 | PHEV |
| VW ID.4 | 107 | BEV |
| Polestar 2 | 107 | BEV |
| Nissan Leaf | 111 | BEV |
| Hyundai Ioniq 5 | 114 | BEV |
| Chevy Bolt EUV | 115 | BEV |
| Kia EV6 | 117 | BEV |
| Chevy Bolt EV | 118 | BEV |
| Hyundai Kona Electric | 120 | BEV |
| Tesla Model Y | 123 | BEV |
| Tesla Model S | 124 | BEV |
| Lucid Air | 131 | BEV |
| Tesla Model 3 | 132 | BEV |
| Toyota Prius Prime | 133 | PHEV |
| Hyundai Ioniq 6 | 140 | BEV |

---

## CSS Changes

New rules added to the existing `<style>` block:

- `.mpge-hero` — flex row, centered, `align-items: baseline`, wraps the number input + unit label
- `.mpge-hero input` — Fraunces serif, ~68px, no border, bottom-border accent, transparent background, centered text, `width: 160px`
- `.mpge-hero .unit` — `var(--ink-dim)`, 22px, monospace
- `#mpge-slider` — full width, custom track + thumb styles, no default appearance
- `#mpge-slider::-webkit-slider-runnable-track` / `::-moz-range-track` — gradient background, 10px height, rounded
- `#mpge-slider::-webkit-slider-thumb` / `::-moz-range-thumb` — 22px circle, `var(--ink)`, dark border + shadow
- `.mpge-ticks` — `position: relative`, `height: 14px`, `margin-top: 6px`
- `.mpge-tick` — `position: absolute`, `width: 2px`, `height: 10px`, `border-radius: 1px`, `transform: translateX(-50%)`
- `.mpge-nearest` — centered, `font-size: 12px`, `color: var(--ink-dim)`, `min-height: 1.5em`, `margin-top: 6px`
- `.mpge-nearest .vname` — `color: var(--ink)`, `font-weight: 500`
- `.mpge-nearest .vtype.bev` — `color: var(--ev)`
- `.mpge-nearest .vtype.phev` — `color: var(--accent)`

The `.mpge-hero input` selector overrides the base `input[type="number"]` styles via higher specificity — no removal needed.

---

## JS Changes

All changes inside the existing `<script>` block:

1. Add `const VEHICLES = [...]` constant before existing code
2. Add `function buildTicks()` — creates tick spans, appends to `#mpge-ticks`
3. Add `function updateNearest(mpge)` — finds closest vehicle, updates `#mpge-nearest` innerHTML
4. Add `function syncSlider(mpge)` — clamps value to [25,150], sets `#mpge-slider` value
5. Modify existing `#mpge` `input` listener: also call `syncSlider()` and `updateNearest()`
6. Add `#mpge-slider` `input` listener: sets `el("mpge").value`, calls `updateNearest()`
7. In init section: call `buildTicks()`, `syncSlider(parseFloat(el("mpge").value))`, `updateNearest(100)`

No changes to `calc()`, `blendedRate()`, `applyPrices()`, or any price/state logic.

---

## Out of Scope

- Vehicle quick-pick dropdown
- Clicking a tick to snap slider to that vehicle
- Persisting selected vehicle in URL
- Updating vehicle data from any API
