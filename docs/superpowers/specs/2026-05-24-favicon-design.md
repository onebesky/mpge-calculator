# Favicon Design Spec

**Date:** 2026-05-24  
**Project:** True MPG (mpge-calculator)

## Summary

Add a favicon to the True MPG site using a bolt + gas drop icon with transparent background, delivered as SVG (primary) + PNG fallback (32×32).

## Visual Design

**Concept:** A lightning bolt (representing EV) alongside a teardrop gas drop (representing gas), side by side with no background.

**Colors:**
- Lightning bolt: `#5fd08a` (EV green, matches `--ev` CSS variable)
- Gas drop: `#e8843c` (gas orange, matches `--gas` CSS variable)
- Background: transparent

**SVG viewBox:** `0 0 72 72`

**Bolt path:** `polygon points="28,8 16,38 27,38 22,64 42,30 31,30 40,8"`

**Drop path:** `path d="M52 22 C52 22 44 32 44 38 C44 44 47.5 48 52 48 C56.5 48 60 44 60 38 C60 32 52 22 52 22Z"`

## Files to Deliver

| File | Size | Format | Purpose |
|------|------|--------|---------|
| `favicon.svg` | ~400B | SVG | Primary — served to all modern browsers |
| `favicon.png` | ~1KB | PNG 32×32 | Fallback for older Safari and edge cases |

## HTML Changes

Two `<link>` tags added to `<head>` in `index.html`:

```html
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="icon" type="image/png" href="favicon.png">
```

The SVG link is listed first so modern browsers prefer it; the PNG is the fallback.

## Rationale

- **Bolt + Drop** directly represents the EV vs gas comparison the tool makes
- **Transparent background** adapts to both dark and light browser chrome without clashing
- **SVG primary** scales perfectly to all tab sizes (16px, 32px, retina) with one file
- **PNG fallback** covers older Safari versions that don't support SVG favicons
- No `apple-touch-icon` needed — this is a calculator tool, not an app users are expected to install to their home screen
