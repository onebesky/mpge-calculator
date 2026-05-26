# Reduce Chatter & Yearly Cost Stat Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strip verbose explanatory text from the page, reorder the gas price field to last, and replace the "blended electricity rate" result stat with an actionable yearly electricity cost estimate.

**Architecture:** All changes are in a single file — `index.html`. HTML structure changes (remove/move elements), CSS additions (tooltip), and a small JS update (calc function). No new files.

**Tech Stack:** Vanilla HTML/CSS/JS. No build step. Open `index.html` in a browser to verify.

---

### Task 1: Remove header sub-paragraph and its JS reference

**Files:**
- Modify: `index.html:579-581` (HTML — delete `.sub` paragraph)
- Modify: `index.html:903` (JS — delete `sub-mpge` update line)

The `.sub` paragraph contains `<span id="sub-mpge">`, which is updated in `calc()`. Removing the paragraph without removing the JS line causes a `TypeError` on every keystroke.

- [ ] **Step 1: Delete the `.sub` paragraph**

In `index.html`, find and remove lines 579–581:

```html
      <p class="sub">A "<span id="sub-mpge">60</span> MPGe" sticker tells you nothing about your estimated spendings
        since electricity and gas prices vary wildly by region and by where you charge. This tool finds the gas-car MPG
        that would cost the same to fuel where you actually drive.</p>
```

The header block should now read:

```html
    <header>
      <div class="eyebrow">MPGe is energy, not money</div>
      <h1>What does your <em>MPGe</em><br>really cost?</h1>
    </header>
```

- [ ] **Step 2: Remove the `sub-mpge` JS update**

In `index.html`, inside `calc()`, find and delete this line (currently line 903):

```js
      if (mpge > 0) el("sub-mpge").textContent = Math.round(mpge);
```

- [ ] **Step 3: Open in browser, verify header shows only eyebrow + h1, no JS errors in console**

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: remove header sub-paragraph and sub-mpge JS ref"
```

---

### Task 2: Replace panel hint with `?` tooltip

**Files:**
- Modify: `index.html:85-103` (CSS — add `.hint-icon` and `.hint-tip` styles)
- Modify: `index.html:585-586` (HTML — update h2, remove hint paragraph)

- [ ] **Step 1: Add tooltip CSS**

In `index.html`, inside the `<style>` block, find the `.panel .hint` rule (around line 99) and **replace** it entirely with:

```css
    .hint-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 1px solid var(--ink-dim);
      color: var(--ink-dim);
      font-size: 10px;
      cursor: help;
      position: relative;
      vertical-align: middle;
      margin-left: 8px;
      font-family: 'DM Mono', monospace;
    }

    .hint-tip {
      display: none;
      position: absolute;
      left: 50%;
      top: calc(100% + 6px);
      transform: translateX(-50%);
      background: var(--panel);
      border: 1px solid var(--panel-line);
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 12px;
      color: var(--ink-dim);
      width: 220px;
      z-index: 10;
      line-height: 1.5;
      font-family: 'DM Mono', monospace;
      text-align: left;
      white-space: normal;
    }

    .hint-icon:hover .hint-tip,
    .hint-icon:focus .hint-tip {
      display: block;
    }
```

- [ ] **Step 2: Update the panel heading and remove the hint paragraph**

Find this block in `index.html` (around line 585):

```html
      <h2>Your location &amp; prices</h2>
      <p class="hint">Select your state for current average prices, then override any number you know.</p>
```

Replace it with:

```html
      <h2>Your location &amp; prices <span class="hint-icon" tabindex="0">?<span class="hint-tip">Select your state for current average prices, then override any number you know.</span></span></h2>
```

- [ ] **Step 3: Open in browser — hover the `?` to confirm tooltip appears; no hint paragraph visible at rest**

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: replace panel hint paragraph with ? tooltip icon"
```

---

### Task 3: Move gas price field to last in the form

**Files:**
- Modify: `index.html:607-610` (HTML — move gas price field)

The gas price field is currently between the MPGe section and the charging section. It needs to move to after `#mix-field` (the last field in the panel, currently line 642–646).

- [ ] **Step 1: Cut the gas price field**

Find and remove these lines from their current position (around line 607):

```html
      <div class="field">
        <label for="gas">Gas price</label>
        <div class="prefix-wrap"><span>$</span><input type="number" id="gas" value="3.30" step="0.01"></div>
      </div>
```

- [ ] **Step 2: Paste the gas price field after `#mix-field`**

Find the closing `</div>` of `#mix-field` (which ends the mix slider block). Place the gas price field immediately after it, before the panel's closing `</div>`:

```html
      <div class="field" id="mix-field" style="display:none;">
        <div class="slider-label"><label style="margin:0;">Share charged at home</label><b id="mix-val">70%</b></div>
        <input type="range" id="mix-slider" min="0" max="100" value="70">
        <div class="slider-ends"><span>all fast-charge</span><span>all home</span></div>
      </div>

      <div class="field">
        <label for="gas">Gas price</label>
        <div class="prefix-wrap"><span>$</span><input type="number" id="gas" value="3.30" step="0.01"></div>
      </div>
    </div>
```

- [ ] **Step 3: Open in browser — confirm form order is: State → EV efficiency → Where do you charge? / rates → Gas price**

- [ ] **Step 4: Confirm the result still calculates correctly when gas price is changed**

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: move gas price field to last position in form"
```

---

### Task 4: Replace "Blended electricity rate" with "Yearly electricity cost"

**Files:**
- Modify: `index.html:659-662` (HTML — update label and element id)
- Modify: `index.html:912` (JS — replace `blend-rate` update with `annual-cost`)

Annual cost = `evCpm × 12000`. Display as `$504/yr` (rounded to nearest dollar).

- [ ] **Step 1: Update the HTML stat block**

Find this block (around line 659):

```html
        <div class="cstat gas">
          <div class="k">Blended electricity rate</div>
          <div class="v" id="blend-rate">—</div>
        </div>
```

Replace with:

```html
        <div class="cstat gas">
          <div class="k">Yearly electricity cost (12k mi)</div>
          <div class="v" id="annual-cost">—</div>
        </div>
```

- [ ] **Step 2: Update `calc()` to compute and display the annual cost**

Find this line in `calc()` (around line 912):

```js
      el("blend-rate").textContent = "$" + rate.toFixed(3);
```

Replace with:

```js
      el("annual-cost").textContent = "$" + Math.round(evCpm * 12000) + "/yr";
```

- [ ] **Step 3: Open in browser — confirm the stat shows e.g. `$504/yr`, updates when MPGe or electricity rate changes, and there are no console errors**

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: replace blended electricity rate stat with yearly cost estimate"
```
