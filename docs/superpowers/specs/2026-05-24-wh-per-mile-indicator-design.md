# Wh/mi Indicator — Design Spec

**Date:** 2026-05-24  
**Status:** Approved

## Summary

Add a live, read-only watts-per-mile (Wh/mi) indicator inline with the MPGe input hero row. Converts MPGe to Wh/mi so users who think in energy-consumption terms can immediately relate to the displayed efficiency number.

## Placement

Inline with the existing MPGe hero row, after the MPGe number and unit:

```
[ 100 ] MPGe  →  337 Wh/mi
```

The `→` separator and `Wh/mi` unit are dim (`#9bab9d`). The numeric value uses the yellow accent (`#f4e04d`) to match the existing slider gradient highlight.

## Formula

```js
Math.round(33700 / mpge)
```

33,700 Wh is the EPA's energy equivalent of one gallon of gasoline (33.7 kWh × 1000). This is consistent with the existing `ENERGY = 33.7` constant already in the code.

## Behaviour

- Updates on every `input` event: slider drag, number field keypress, and programmatic `applyPrices()` calls (state change, page load).
- Hidden (display: none or empty) when `mpge` is 0 or falsy.
- Read-only — not an input field.

## Implementation scope

- **HTML:** add a `<span id="wh-mi">` display element inside the existing `.mpge-hero` div, after the `MPGe` unit span.
- **CSS:** style the new span inline with the existing hero — no new layout rules needed beyond flexbox alignment already present.
- **JS:** compute and write `wh-mi` inside the existing `calc()` function (and clear it on invalid input).

## Out of scope

- Bidirectional input (typing Wh/mi to set MPGe).
- Showing Wh/mi in the result/compare section.
- Any change to the footnote math formula text.
