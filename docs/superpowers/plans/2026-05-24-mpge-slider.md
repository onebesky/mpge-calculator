# MPGe Slider Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the small MPGe number input with a large hero display, a red-to-green gradient slider, 30 vehicle tick marks, and a live nearest-vehicle chip — all within the existing single panel.

**Architecture:** Single-file change to `index.html`. New `VEHICLES` constant + three JS helpers (`buildTicks`, `updateNearest`, `syncSlider`) are added to the existing `<script>` block. New CSS rules are appended to the existing `<style>` block. The HTML replaces the two-column `mpge + gas` row with a full-width MPGe section followed by a standalone gas field.

**Tech Stack:** Vanilla JS, CSS custom properties already defined in `:root`, Google Fonts (Fraunces) already loaded.

---

### Task 1: Add VEHICLES constant and helper functions

**Files:**
- Modify: `index.html` — `<script>` block, before existing `const DATA = window.PRICES;` line

- [ ] **Step 1: Add VEHICLES array and slider constants**

  In `index.html`, find the line `const DATA = window.PRICES;` and insert the following **before** it:

  ```javascript
  const VEHICLES = [
    { name: "Wrangler 4xe",          mpge: 49,  type: "phev" },
    { name: "BMW X5 45e",            mpge: 50,  type: "phev" },
    { name: "Volvo XC60 PHEV",       mpge: 55,  type: "phev" },
    { name: "Grand Cherokee 4xe",    mpge: 56,  type: "phev" },
    { name: "Rivian R1T",            mpge: 73,  type: "bev"  },
    { name: "BMW 330e",              mpge: 75,  type: "phev" },
    { name: "F-150 Lightning",       mpge: 78,  type: "bev"  },
    { name: "Hyundai Tucson PHEV",   mpge: 80,  type: "phev" },
    { name: "Kia Sportage PHEV",     mpge: 84,  type: "phev" },
    { name: "Toyota RAV4 Prime",     mpge: 94,  type: "phev" },
    { name: "Cadillac Lyriq",        mpge: 95,  type: "bev"  },
    { name: "Audi Q4 e-tron",        mpge: 96,  type: "bev"  },
    { name: "Mustang Mach-E",        mpge: 100, type: "bev"  },
    { name: "BMW i4",                mpge: 102, type: "bev"  },
    { name: "Tesla Model X",         mpge: 102, type: "bev"  },
    { name: "Ford Escape PHEV",      mpge: 105, type: "phev" },
    { name: "VW ID.4",               mpge: 107, type: "bev"  },
    { name: "Polestar 2",            mpge: 107, type: "bev"  },
    { name: "Nissan Leaf",           mpge: 111, type: "bev"  },
    { name: "Hyundai Ioniq 5",       mpge: 114, type: "bev"  },
    { name: "Chevy Bolt EUV",        mpge: 115, type: "bev"  },
    { name: "Kia EV6",               mpge: 117, type: "bev"  },
    { name: "Chevy Bolt EV",         mpge: 118, type: "bev"  },
    { name: "Hyundai Kona Electric", mpge: 120, type: "bev"  },
    { name: "Tesla Model Y",         mpge: 123, type: "bev"  },
    { name: "Tesla Model S",         mpge: 124, type: "bev"  },
    { name: "Lucid Air",             mpge: 131, type: "bev"  },
    { name: "Tesla Model 3",         mpge: 132, type: "bev"  },
    { name: "Toyota Prius Prime",    mpge: 133, type: "phev" },
    { name: "Hyundai Ioniq 6",       mpge: 140, type: "bev"  },
  ];
  const SLIDER_MIN = 25, SLIDER_MAX = 150;
  ```

- [ ] **Step 2: Add helper functions**

  In `index.html`, find the comment `// --- Data helpers ---` and add these three functions **before** it:

  ```javascript
  function buildTicks() {
    const container = el("mpge-ticks");
    VEHICLES.forEach(v => {
      const pct = (v.mpge - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN) * 100;
      const tick = document.createElement("span");
      tick.className = "mpge-tick " + v.type;
      tick.style.left = pct + "%";
      tick.title = v.name + " · " + v.mpge + " MPGe";
      container.appendChild(tick);
    });
  }

  function updateNearest(mpge) {
    let closest = VEHICLES[0], minDist = Infinity;
    for (const v of VEHICLES) {
      const d = Math.abs(v.mpge - mpge);
      if (d < minDist) { minDist = d; closest = v; }
    }
    el("mpge-nearest").innerHTML =
      "≈ <span class='vname'>" + closest.name + "</span>" +
      " · " + closest.mpge + " MPGe" +
      " · <span class='vtype " + closest.type + "'>" + closest.type.toUpperCase() + "</span>";
  }

  function syncSlider(mpge) {
    el("mpge-slider").value = Math.max(SLIDER_MIN, Math.min(SLIDER_MAX, mpge));
  }
  ```

- [ ] **Step 3: Verify no syntax errors**

  Open `index.html` in a browser (e.g. `open index.html` from the project root). Open the browser console. Confirm no errors. The page should still function as before (MPGe field still works, result calculates).

---

### Task 2: Add CSS for the new MPGe section

**Files:**
- Modify: `index.html` — `<style>` block, append after the existing `.footnote code` rule

- [ ] **Step 1: Append new CSS rules**

  Find the line `.footnote code { color: var(--accent); }` and add the following **after** it:

  ```css
  /* MPGe hero section */
  .mpge-hero {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 10px;
    margin: 8px 0 4px;
  }
  .mpge-hero input[type="number"] {
    width: 160px;
    background: transparent;
    border: none;
    border-bottom: 2px solid var(--panel-line);
    border-radius: 0;
    padding: 0 8px 4px;
    font-family: 'Fraunces', serif;
    font-size: 68px;
    font-weight: 900;
    color: var(--accent);
    text-align: center;
    letter-spacing: -0.03em;
    line-height: 1;
    transition: border-color 0.18s;
  }
  .mpge-hero input[type="number"]:focus {
    outline: none;
    border-bottom-color: var(--ev);
  }
  .mpge-hero .unit {
    font-size: 22px;
    color: var(--ink-dim);
    font-family: 'DM Mono', monospace;
  }

  /* Gradient slider */
  #mpge-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 10px;
    border-radius: 5px;
    background: linear-gradient(to right, #e84040, #e88040, #f4c840, #a0d040, #40c060);
    outline: none;
    cursor: pointer;
    border: none;
    padding: 0;
    margin: 12px 0 0;
    display: block;
  }
  #mpge-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--ink);
    border: 3px solid var(--bg);
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.5);
  }
  #mpge-slider::-moz-range-track {
    background: linear-gradient(to right, #e84040, #e88040, #f4c840, #a0d040, #40c060);
    height: 10px;
    border-radius: 5px;
    border: none;
  }
  #mpge-slider::-moz-range-thumb {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--ink);
    border: 3px solid var(--bg);
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.5);
  }

  /* Tick marks */
  .mpge-ticks {
    position: relative;
    height: 12px;
    margin-top: 6px;
  }
  .mpge-tick {
    position: absolute;
    top: 0;
    width: 2px;
    height: 10px;
    border-radius: 1px;
    transform: translateX(-50%);
    opacity: 0.65;
    cursor: default;
  }
  .mpge-tick.bev  { background: var(--ev); }
  .mpge-tick.phev { background: var(--accent); }

  /* Nearest-vehicle chip */
  .mpge-nearest {
    text-align: center;
    font-size: 12px;
    color: var(--ink-dim);
    min-height: 1.5em;
    margin-top: 5px;
  }
  .mpge-nearest .vname { color: var(--ink); font-weight: 500; }
  .mpge-nearest .vtype.bev  { color: var(--ev); }
  .mpge-nearest .vtype.phev { color: var(--accent); }
  ```

- [ ] **Step 2: Verify no visual regressions**

  Reload `index.html` in the browser. The page should look identical to before (no new elements yet — CSS only). Check that the result panel, state dropdown, and charge buttons still look correct.

---

### Task 3: Replace the MPGe + gas HTML row

**Files:**
- Modify: `index.html` — inside `.panel`, the `<div class="row">` containing `#mpge` and `#gas`

- [ ] **Step 1: Replace the two-column row with the new MPGe section + standalone gas field**

  Find and replace this block:

  ```html
      <div class="row">
        <div class="field">
          <label for="mpge">EV efficiency (MPGe)</label>
          <input type="number" id="mpge" value="100" min="1" step="1">
        </div>
        <div class="field">
          <label for="gas">Gas price</label>
          <div class="prefix-wrap"><span>$</span><input type="number" id="gas" value="3.30" step="0.01"></div>
        </div>
      </div>
  ```

  With:

  ```html
      <div class="field mpge-section">
        <label for="mpge">EV efficiency</label>
        <div class="mpge-hero">
          <input type="number" id="mpge" value="100" min="1" step="1">
          <span class="unit">MPGe</span>
        </div>
        <input type="range" id="mpge-slider" min="25" max="150" value="100" step="1">
        <div class="mpge-ticks" id="mpge-ticks"></div>
        <div class="mpge-nearest" id="mpge-nearest"></div>
      </div>

      <div class="field">
        <label for="gas">Gas price</label>
        <div class="prefix-wrap"><span>$</span><input type="number" id="gas" value="3.30" step="0.01"></div>
      </div>
  ```

- [ ] **Step 2: Verify the new structure renders**

  Reload `index.html` in the browser. You should see:
  - The large yellow "100 MPGe" display
  - The gradient slider below it (red → green)
  - Empty ticks area (ticks aren't built yet — JS init not wired)
  - Empty nearest chip area
  - Gas price field below as a standalone row
  - Result still calculates correctly

---

### Task 4: Wire up event listeners and init

**Files:**
- Modify: `index.html` — `<script>` block, event listeners section and `// --- Init ---` section

- [ ] **Step 1: Replace the mpge listener in the forEach**

  Find:

  ```javascript
  ["mpge", "gas", "home-rate", "dcfc-rate"].forEach(id => el(id).addEventListener("input", calc));
  ```

  Replace with:

  ```javascript
  el("mpge").addEventListener("input", () => {
    const v = parseFloat(el("mpge").value) || 0;
    syncSlider(v);
    updateNearest(v);
    calc();
  });
  ["gas", "home-rate", "dcfc-rate"].forEach(id => el(id).addEventListener("input", calc));
  el("mpge-slider").addEventListener("input", () => {
    const v = parseInt(el("mpge-slider").value);
    el("mpge").value = v;
    updateNearest(v);
    calc();
  });
  ```

- [ ] **Step 2: Add init calls**

  Find the `// --- Init ---` section:

  ```javascript
  // --- Init ---
  el("prices-updated-gas").textContent = DATA.updatedGas || DATA.updated;
  el("prices-updated-elec").textContent = DATA.updatedElec || DATA.updated;
  populateStates();
  readUrl();
  calc();
  ```

  Replace with:

  ```javascript
  // --- Init ---
  el("prices-updated-gas").textContent = DATA.updatedGas || DATA.updated;
  el("prices-updated-elec").textContent = DATA.updatedElec || DATA.updated;
  populateStates();
  readUrl();
  buildTicks();
  const initMpge = parseFloat(el("mpge").value) || 100;
  syncSlider(initMpge);
  updateNearest(initMpge);
  calc();
  ```

- [ ] **Step 3: Full browser verification**

  Reload `index.html`. Verify all of the following:

  1. **Tick marks visible** — 30 colored ticks below the gradient slider (green for BEV, yellow for PHEV)
  2. **Nearest chip works** — shows "≈ Mustang Mach-E · 100 MPGe · BEV" at default value of 100
  3. **Slider → number sync** — drag the slider left toward red; the large number input updates in real time; nearest chip updates
  4. **Number → slider sync** — click the large number, type `50`; slider thumb moves left to the red zone; nearest chip shows a PHEV near 50
  5. **Tick hover tooltips** — hover over any tick mark; native browser tooltip shows vehicle name and MPGe
  6. **Calc still works** — changing MPGe (via either input) still updates the result panel correctly
  7. **State change still works** — select a state; gas/electricity prices update; MPGe and slider stay unchanged
  8. **Out-of-range typing** — type `200` in the number input; slider pegs at max (150) but calc uses 200; nearest chip shows Ioniq 6 (140, closest to 200)

- [ ] **Step 4: Commit**

  ```bash
  git add index.html
  git commit -m "feat: MPGe hero display with gradient slider and vehicle markers"
  ```
