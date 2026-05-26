# Spec: Reduce Page Chatter & Improve Result Clarity

**Date:** 2026-05-25

## Goal

Remove verbose explanatory text from the page so the calculator controls and results are more immediately visible. Swap a secondary result stat for a more actionable yearly cost estimate.

## Changes

### 1. Remove header sub-paragraph

Delete the `<p class="sub">` element entirely. The `<h1>` and eyebrow are self-explanatory; the paragraph adds length without helping users act.

### 2. Panel hint → tooltip on `?` icon

The `<p class="hint">` ("Select your state for current average prices, then override any number you know.") is removed from the DOM. Its text moves to a tooltip triggered by a `?` icon placed inline next to the "Your location & prices" `<h2>`. The tooltip appears on hover (desktop) and tap (mobile). No text is visible when idle.

Implementation: a `<span class="hint-icon" title="…">?</span>` next to the heading, styled with a small circle, `cursor: help`, and a CSS `::after` tooltip or native `title` attribute. Native `title` is acceptable for this use case — no JS required.

### 3. Gas price field moves to last in the form

Current order:
1. State
2. EV efficiency (MPGe slider)
3. Gas price
4. Where do you charge? + electricity rates + mix slider

New order:
1. State
2. EV efficiency (MPGe slider)
3. Where do you charge? + electricity rates + mix slider
4. Gas price ← moved last

Gas price is the least-frequently-changed input (state dropdown populates it), so placing it last reduces visual noise at the top of the form.

### 4. Result stat: "Blended electricity rate" → "Yearly electricity cost"

**Current:** second `cstat` shows "Blended electricity rate" with value `$0.17` (the blended $/kWh).

**New:** label becomes "Yearly electricity cost", value is `evCpm × 12,000` formatted as `$504/yr`.

- `evCpm` is already computed in `calc()` as `(ENERGY / mpge) * blendedRate()`
- Annual estimate = `evCpm * 12000`, displayed as `"$" + Math.round(annualCost) + "/yr"`
- Element id changes from `blend-rate` to `annual-cost`
- Updates live with all other inputs

The 12,000 figure is the EPA's standard annual mileage assumption and needs no explanation on the page.

### 5. Verdict sentence — no change

The verdict sentence below the big MPG number is kept as-is.

## Out of Scope

- No changes to the footnote
- No changes to the eyebrow or `<h1>`
- No new inputs added
- No changes to the MPGe slider, ticks, or nearest-vehicle chip
