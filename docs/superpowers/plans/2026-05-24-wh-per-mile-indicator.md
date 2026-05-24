# Wh/mi Indicator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a live read-only `→ 337 Wh/mi` indicator inline with the MPGe hero row, updating on every input event.

**Architecture:** Three changes to one file (`index.html`): add a `<span id="wh-mi">` after the existing `MPGe` unit span, add CSS to style it, and update `calc()` to write the computed value. No new files, no dependencies.

**Tech Stack:** Vanilla JS, single static HTML file. No build step or test framework — verification is manual browser testing.

---

### Task 1: HTML — add the Wh/mi display span

**Files:**
- Modify: `index.html:578-580`

The `.mpge-hero` div currently looks like:
```html
<div class="mpge-hero">
  <input type="number" id="mpge" value="100" min="1" step="1">
  <span class="unit">MPGe</span>
</div>
```

- [ ] **Step 1: Add the span after the `.unit` span**

Replace the `.mpge-hero` div contents (lines 578–580) with:
```html
<div class="mpge-hero">
  <input type="number" id="mpge" value="100" min="1" step="1">
  <span class="unit">MPGe</span>
  <span id="wh-mi"></span>
</div>
```

- [ ] **Step 2: Open the site in a browser and confirm no visual change**

Open `index.html` directly in a browser (or use a local server). The MPGe row should look identical to before — the new span is empty and unstyled.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add wh-mi span placeholder to mpge hero"
```

---

### Task 2: CSS — style the Wh/mi span

**Files:**
- Modify: `index.html:440-444` (after the `.mpge-hero .unit` rule)

- [ ] **Step 1: Add styles for `#wh-mi` after the `.mpge-hero .unit` block (line 444)**

Insert immediately after the closing brace of `.mpge-hero .unit { ... }`:
```css
    #wh-mi {
      font-family: 'DM Mono', monospace;
      font-size: 18px;
      color: var(--ink-dim);
    }
    #wh-mi b {
      color: var(--accent);
      font-weight: 600;
      font-size: 22px;
    }
    #wh-mi small {
      font-size: 14px;
    }
```

`--ink-dim` is `#9bab9d` (dim text). `--accent` is `#f4e04d` (yellow). This matches the design: yellow value, dim `→` separator and `Wh/mi` unit.

- [ ] **Step 2: Verify in browser — span still invisible, no layout shift**

Reload `index.html`. The MPGe row should still look identical — no content in the span yet.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add wh-mi indicator styles"
```

---

### Task 3: JS — compute and render Wh/mi in `calc()`

**Files:**
- Modify: `index.html:873-893` (the `calc()` function)

- [ ] **Step 1: Update `calc()` to compute Wh/mi before the early-return guard**

The current `calc()` function (line 873) starts like this:
```js
function calc() {
  const mpge = parseFloat(el("mpge").value) || 0;
  const gas = parseFloat(el("gas").value) || 0;
  const rate = blendedRate();

  if (mpge <= 0 || rate <= 0) return;
```

Add the Wh/mi update **before** the `if (mpge <= 0 || rate <= 0) return;` line, so it always renders when mpge is valid even if rate is zero:
```js
function calc() {
  const mpge = parseFloat(el("mpge").value) || 0;
  const gas = parseFloat(el("gas").value) || 0;
  const rate = blendedRate();

  el("wh-mi").innerHTML = mpge > 0
    ? '→ <b>' + Math.round(33700 / mpge) + '</b> <small> Wh/mi</small>'
    : '';

  if (mpge <= 0 || rate <= 0) return;
```

The rest of `calc()` is unchanged.

- [ ] **Step 2: Verify in browser — default state**

Reload `index.html`. The MPGe hero row should now show:
```
100  MPGe  →  337  Wh/mi
```
(100 is yellow, MPGe is dim, → is dim, 337 is yellow, Wh/mi is dim and smaller)

- [ ] **Step 3: Verify live updates**

Drag the MPGe slider to 50. The display should update instantly to `→ 672 Wh/mi`. Type `132` in the MPGe input. Display should show `→ 255 Wh/mi` (Tesla Model 3).

- [ ] **Step 4: Verify state change**

Select "California" from the state dropdown. The Wh/mi indicator should remain unchanged (Wh/mi depends only on MPGe, not prices).

- [ ] **Step 5: Verify edge case — clear the MPGe field**

Delete the value in the MPGe number input (make it empty). The `→ Wh/mi` display should disappear entirely.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: add live wh/mi indicator to mpge hero row"
```
