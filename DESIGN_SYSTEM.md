# BreakFit Design System

Describes the whole app as built in `breakfast-app` (React 18, TypeScript, Vite 4, CSS Modules, react-router 6): Home plus Dish/Customize, Checkout, Payment, Order status, Subscription plans, Health Tracker, Dietician insight, Recommendations, Favorites and Orders.
**Source of truth:** [`src/styles/tokens.css`](src/styles/tokens.css). Component CSS reads tokens; the only literals left are layout geometry (see §6).

---

## 1. Principles

1. **Phone-width column.** Designed for ~360–430px. The app is a single column capped at `--app-max-width: 430px` and centred (with a soft frame shadow) on larger screens.
2. **One brand green, one accent.** Brand green `#039719` plus a forest-green header, and lime `#c6e84d` as the single accent. Everything else is neutral.
3. **Photography carries the colour.** Food images are the loudest thing on screen; UI chrome stays white, soft and quiet.
4. **Soft geometry.** Generous radii (14 / 22 / 24 / pill). Hard edges only appear in the hero "sticker" (badge + outlined headline).
5. **Compact, touch-first density.** 4px spacing scale; every control has at least a 44px touch area.
6. **Motion is seasoning.** Ambient motion lives in the hero only; everything else responds to input. All motion switches off for `prefers-reduced-motion`.
7. **Tokens first.** Colour, spacing, radius, shadow, type and easing come from `tokens.css`.

---

## 2. Foundations

### 2.1 Colour

| Token | Value | Role | Used in |
|---|---|---|---|
| `--color-brand` | `#039719` | Interactive / logo green — **for icons and graphics** | Search + mic icons, active nav pill, "added" dish state, focus ring on light surfaces |
| `--color-brand-text` | `#027d18` | Brand green for **small text** on light surfaces (AA) | Filter chip label + icon, active nav label |
| `--color-green-700` | `#137a3b` | Header gradient — top | Home header block |
| `--color-green-900` | `#0d5a2b` | Header gradient — bottom | Home header block |
| `--color-lime` | `#c6e84d` | The one accent | Hero badge fill; focus ring inside the green header |
| `--color-ink` | `#0b0b0b` | Neutral black | Dish-card "+" icon |
| `--color-ink-deep` | `#06210f` | Forest-black (replaces pure black in the hero) | Hero badge text/border/shadow, headline outline, CTA fill |
| `--color-white` | `#ffffff` | White | Search bar, mic, card buttons, text on green |
| `--color-bg-page` | `#eef1ef` | Page background (outside the phone column) | `body` |
| `--color-surface` | `#ffffff` | Screen / sheet surface | Screen, bottom nav |
| `--color-chip-bg` | `#f6f6f6` | Chip fill | Filter chip |
| `--color-card-placeholder` | `#eceeed` | Image placeholder | Dish card behind photo |
| `--color-text-primary` | `#1b1f1d` | Body / headings on light | Headings, labels, input text |
| `--color-text-secondary` | `#5f6964` | Secondary text (≥ 5:1 on white, card grey and the light-green fills) | Placeholder, descriptions, hints |
| `--color-text-nav-inactive` | `#6f6f6f` | Inactive nav label/icon | Bottom nav |
| `--color-text-on-green` | `#ffffff` | Text on green | Brand name |
| `--color-text-on-green-muted` | `rgba(255,255,255,.95)` | Secondary text on green | Tagline |
| `--color-accent-active` | `#f08a24` | Selected-state underline | Active category |
| `--color-focus` | `var(--color-brand)` | Focus ring colour (overridden to lime inside the green header) | Global `button:focus-visible`, search focus-within |
| `--color-avatar-ring / -bg / -text` | `#e8b04a / #fff4d6 / #8a5a00` | Avatar | Header avatar |
| `--color-ring` | `rgba(255,255,255,.12)` | Decorative ring | Header ring |
| `--color-hero-light` | `rgba(255,255,255,.14)` | Glow behind headline | Hero |
| `--color-shine` | `rgba(255,255,255,.6)` | Highlight sweep | Hero badge |
| `--color-cta-border` | `rgba(255,255,255,.9)` | CTA outline | Hero CTA |
| `--color-card-shade-top / -bottom` | `rgba(0,0,0,0)` / `rgba(0,0,0,.72)` | Photo scrim for names | Dish card |
| `--color-chip-border` | `rgba(0,0,0,.06)` | Chip hairline | Filter chip |

**Rules**
- On the green header, text is white; the only coloured accent is lime.
- Green is for *action and state* (icons, selected, added), not decoration.
- **Brand green has two jobs:** `--color-brand` for icons/graphics (needs 3:1), `--color-brand-text` for any small text (needs 4.5:1). Never set body-size text in `--color-brand`.
- Never use pure black for hero chrome — use `--color-ink-deep`.

**App surfaces & states (inner screens)**

| Token | Value | Role |
|---|---|---|
| `--color-surface-card` | `#f6f6f6` | Cards, inputs, top bar pill, stat tiles |
| `--color-border-soft` | `rgba(0,0,0,.08)` | Hairlines and unselected outlines |
| `--color-accent-active` / `-soft` / `-soft-text` / `-text` | `#f08a24` / `#fdebd6` / `#8a4300` / `#b45309` | Orange family: slot chips, "scheduled" pills, filter-applied dot, warnings (use `-text` variants for small text) |
| `--color-success-bg` | `#e7f6ea` | Light-green fills: hover, selected payment method, applied coupon |
| `--color-danger` / `--color-danger-bg` | `#b3261e` / `#fdecea` | Errors, destructive actions |
| `--color-overlay` | `rgba(10,24,14,.5)` | Modal scrim |
| `--gradient-primary` | `#08a321 → #027d18` | Primary button, cart bar, coupon banner, success badge |
| `--radius-md / -lg / -xl` | 12 / 18 / 28px | Chips & tiles / cards / sheets |
| `--shadow-soft / -sheet / -button` | see `tokens.css` | Circular buttons / sheets / primary button |
| `--font-size-stat`, `--font-size-button` | 26px, 19px | Report percentages; button labels (bold 19px counts as "large text") |
| `--duration-fast / -base / -slow` | .15 / .2 / .32s | Press, hover/state, entrance |
| `--z-dock / -overlay / -toast` | 20 / 100 / 110 | Stacking order |

### 2.2 Typography

Family: **Poppins** (weights 400–800 loaded from Google Fonts), fallback `system-ui, Segoe UI, Roboto, Helvetica, Arial`.

| Token | Size | Weight | Used for |
|---|---|---|---|
| `--font-size-2xl` | 28px | 800, −0.02em, lh 1.1 | Brand name "BreakFit" |
| `--font-size-xl` | 18px | 600, −0.01em | "Explore Healthy breakfast" section heading |
| `--font-size-lg` | 16px | 700 | Avatar initial |
| `--font-size-md` | 14px | 500 / 600 | Search input, category labels (600 when active), hero CTA (600) |
| `--font-size-sm` | 12px | 400 / 500 / 600 | Tagline (400), nav labels (500, 600 active), dish names (600), Filter chip (600) |
| `--font-size-hero-kicker` | `clamp(15px, 4.9vw, 19px)` | 800, UPPERCASE, +0.05em | Hero badge |
| `--font-size-hero-title` | `clamp(34px, 11vw, 44px)` | 800, −0.02em, lh 1.05 | Hero headline |

### 2.3 Spacing — 4px scale

| Token | px | Where it is used |
|---|---|---|
| `--space-1` | 4 | Category-row gap |
| `--space-2` | 8 | Nav gap, hero text-stack gap |
| `--space-3` | 12 | Header/search gaps, nav padding, category bottom padding |
| `--space-4` | 16 | **Page gutter** (header, categories, dish section), header → search → hero stack gap |
| `--space-5` | 20 | Dish grid gap (both axes) |
| `--space-6` | 24 | Dish section bottom padding |

### 2.4 Shape — radius & elevation

| Token | Value | Used for |
|---|---|---|
| `--radius-sm` | 7px | Hero badge, dish "+" button |
| `--radius-control` | 14px | Search bar |
| `--radius-card` | 22px | Dish cards |
| `--radius-sheet` | 24px | Bottom-nav top corners |
| `--radius-pill` | 999px | CTA, Filter chip, nav pill |
| `50%` | circle | Avatar, mic, decorative ring |

| Shadow token | Value | Used for |
|---|---|---|
| `--shadow-control` | `0 2px 8px rgba(0,0,0,.14)` | Search bar, mic |
| `--shadow-chip` | `0 0 3px rgba(0,0,0,.13)` | Filter chip |
| `--shadow-card` | `0 4px 14px rgba(0,0,0,.08)` | Dish cards |
| `--shadow-nav` | `0 -4px 18px rgba(0,0,0,.08)` | Bottom nav (casts upward) |
| `--shadow-screen` | `0 0 40px rgba(0,0,0,.12)` | Phone column frame on wide screens |
| `--shadow-badge` | `2px 2px 0 var(--color-ink-deep)` | Hero badge hard shadow |
| `--shadow-cta` / `--shadow-cta-hover` | `0 4px 10px …,.25` / `0 7px 16px …,.32` | Hero CTA rest / hover |
| `--drop-shadow-dish` | `drop-shadow(0 6px 8px rgba(0,0,0,.28))` | Hero dish cut-outs (filter) |

### 2.5 Layout & responsiveness

- **Frame:** `AppShell` renders one `.frame` — `max-width: 430px`, centred, `min-height: 100dvh`, flex column. Pages render inside `<main>`; on the tab routes (`/`, `/health`, `/favorites`) a sticky `<footer>` dock holds the CartBar and the BottomNav. Other routes end in an `ActionBar`.
- **Gutter:** 16px left/right on every section so edges align (header, search, hero, category row, section heading, grid).
- **Dish grid:** always 3 columns (`repeat(3, minmax(0,1fr))`), 20px gap, cards keep a `127 / 162` aspect ratio.
- **No breakpoints.** The layout is fluid: `clamp()` type in the hero, equal-width flex items in the category row, and a container query on dish cards.
- **Container query:** when a dish card is ≤ **104px** wide (phones ≈ 360px), the "+" button moves from beside the name to the top-right corner so names never collide with it.
- **Category row:** four equal items (`flex: 1 0 76px`, 4px gap); scrolls horizontally only below ≈ 316px of available width.
- **Touch targets:** small controls keep their visual size but get an invisible `::after` hit area (see §4).
- **Verified widths:** 320, 360, 390, 430, 768 and 1280 on all 11 routes — no horizontal overflow and no clipped or off-column text (automated check). ActionBar labels scale with `clamp()` and may wrap to two lines at 320px.

### 2.6 Motion

Easing: `--ease-out: cubic-bezier(0.2, 0.7, 0.2, 1)`. Animate **transform-family and opacity only** (individual `translate` / `scale` / `rotate` properties so they compose with static tilts).

| Animation | Target | Timing | Effect |
|---|---|---|---|
| `riseIn` (entrance) | Badge → headline → CTA | 0.6s, delays 0.05 / 0.15 / 0.28s | Fade + 10px rise |
| `dishIn` (entrance) | Salad, dosa | 0.8s, delays 0.3 / 0.42s | Fade, scale .78→1, swing 14°→0 onto resting tilt |
| `float` (ambient) | Salad / dosa | 6s / 7s reverse, infinite | ±4px vertical drift |
| `glowBreathe` (ambient) | Light behind headline | 7s, infinite | Opacity .7 ↔ 1 |
| `shine` (ambient) | Hero badge | 6s, 1.4s delay, infinite | Highlight sweeps across for ~35% of the cycle, then rests |
| `ringPulse` (ambient) | Header ring | 9s, infinite | Scale 1 ↔ 1.035, opacity .85 ↔ 1 |
| CTA hover | Hero CTA | 0.2s, **`(hover: hover)` only** | Lift 1px, deeper shadow, arrow nudges 3px |
| Press | CTA, dish "+" | 0.15s | Scale .97 / .9 |
| State | Add button, nav pill | 0.2s | Background/colour crossfade |
| `pageIn` | Every route | 0.32s | Fade + 8px rise (`translate`) |
| `sheetUp` / `popIn` / `fadeIn` | Sheets / dialogs / scrim | 0.32s / 0.32s / 0.2s | Slide-up, scale .94→1, fade |
| `toastIn`, `barIn` | Toast, CartBar | 0.32s | Rise 14–16px + fade |
| `draw`, `spinIn`, `grow` | Line chart, donuts, progress bars | 0.9–1.1s, once | Line draws in, ring spins in, bars grow from the left |
| `shimmer` | Skeletons | 1.3s, infinite | Highlight sweep |
| Card hover | Dish card (`(hover: hover)`) | 0.2s / 0.35s | Lift 2px + photo zoom 1.06 |

Entrance animations use `fill-mode: backwards` (not `both`) so finished elements keep no leftover transform and hover effects still work.
**Reduced motion:** under `prefers-reduced-motion: reduce` every keyframe animation and transition is disabled (verified: no running animations on Home or Health) and toasts, sheets and page changes appear instantly.

### 2.7 Iconography

Inline SVG React components in `src/components/icons.tsx`, all drawn with `currentColor` so colour comes from CSS.
Stroke icons use 2–2.6px strokes with round caps/joins; the Filter icon is a filled glyph.
Sizes: 12 (dish "+"), 14 (chevron, Filter), 20 (search), 22 (mic), 24 (nav).

### 2.8 Imagery

| Asset class | Location | Spec | Display |
|---|---|---|---|
| Category thumbnails | `assets/categories/*.png` | 240×180 transparent PNG. Subject trimmed to its alpha box and fitted in a 204×152 area, centred — so every thumbnail has identical framing | 72×54, `object-fit: contain` |
| Hero dishes | `assets/food/{dosa,salad}.png` | 480px-wide transparent PNG cut-outs | Dosa width = `--size-hero-dish` = `clamp(90px, calc(36vw - 30px), 126px)` (110px at 390px wide); salad = that minus 15px (95px at 390px wide); both with `--drop-shadow-dish` |
| Dish photos | `assets/dishes/*.jpg` | Shorter side 400px, JPEG q84 (≈3× density at card size) | Card-filling, `object-fit: cover`, dark bottom scrim for the name |

Alt text: dish photos use the dish name; decorative images use `alt=""`.

---

## 3. Components

### 3.1 Home-screen components (look unchanged, now wired up)

| Component | File | Spec |
|---|---|---|
| **AppHeader** | `components/AppHeader.tsx` | Row: brand block (name 28/800 + tagline 12/400 on `--color-text-on-green-muted`) and a 44px circular avatar button (2px ring, cream fill, dark-gold initial taken from the profile name). Opens the profile sheet. |
| **SearchRow** | `components/SearchRow.tsx` | 44px white search bar (radius 14, `--shadow-control`) with controlled value, a 22px clear button (44px hit area) and a 44px mic button. The mic uses the Web Speech API: pulsing lime ring while listening; unsupported / blocked / silent cases show an explanatory toast. |
| **HeroBanner** | `components/HeroBanner.tsx` | 160px sticker hero (see §2.6). "Explore now" navigates to `/plans`. |
| **CategoryRow** | `components/CategoryRow.tsx` | Equal-width buttons; `aria-pressed`; 3px accent underline. Filters the grid. |
| **DishGrid** | `components/DishGrid.tsx` | Heading + FilterButton above a 3-column grid; a horizontally scrolling `row` variant (116px cards, scroll-snap with `scroll-padding`); a skeleton while loading and an `empty` slot. |
| **DishCard** | `components/DishCard.tsx` | `127/162` card. The whole card is a link to `/dish/:id` (cover `<a>`, z-index 1); the name sits above it with `pointer-events: none`; the 22px "+" toggles the cart (toast with Undo, 44px hit area); optional favourite heart (top-left). Hover on pointer devices: lifts 2px, photo zooms 1.06. Names drop to 11px on 105–124px cards so words like "Paniyaram" never touch the button. |
| **AddOnCard** | `components/AddOnCard.tsx` | Same card/CSS as DishCard with a two-line label (name + lime price); tap anywhere or the "+" to select. |

### 3.2 UI kit (`components/ui`)

| Component | Notes |
|---|---|
| **Button** | `primary` (56px, `--gradient-primary`, 19/700), `outline`, `link`, `pill` (36px), `light`; `loading` spinner + `aria-busy`; hover lift only under `(hover: hover)`, pressed = scale .96–.98. |
| **Sheet / Dialog** (`Overlay`) | Portal to `body`; `role=dialog` + `aria-modal` + labelled; Esc closes, Tab is trapped, `html` scroll is locked, focus returns to the opener; `[data-autofocus]` picks the first focus. Sheets are capped at the 430px column. |
| **ConfirmDialog** | Title, text, cancel (autofocused) + confirm (`danger` variant). |
| **Toast** | `useToast().show(msg, {tone, actionLabel, onAction})`; `aria-live`, max 2 stacked, 3.4s, dismissible. |
| **TextField / TextArea** | Label, hint, error (`role=alert`, `aria-invalid`, `aria-describedby`); focus = brand border + 3px soft ring. |
| **Stepper** | − qty + group; at the minimum the − becomes a Remove button when `removable`. |
| **RadioCard** | Black-ring radio dot; a real radio button when `onSelect` is passed, a static "selected" indicator otherwise; `actions` live outside the radio (no nested controls). |
| **Chips** | `FilterButton` (with an "applied" dot), `SlotChip` (orange outline → light-orange when selected), `OptionChip` (radio or checkbox), `InfoPill`. |
| **Skeleton / SkeletonGrid / EmptyState** | Shimmer placeholders; icon + title + text + action for empty and error states. |

### 3.3 Layout (`components/layout`)

| Component | Notes |
|---|---|
| **AppShell** | Frame, route outlet (fade/rise `pageIn`), scroll-to-top + focus `<main>` on navigation, per-route `document.title`, menu / profile / reset overlays (shared through `ShellContext`). |
| **TopBar** | Sticky 56px pill: back (history-aware, falls back to a given route), centred title (ellipsis), menu button. |
| **ActionBar** | Sticky bottom bar with one or two buttons (the second is 1.25× wide) and an optional note line. |
| **BottomNav** | `NavLink`s Home / Health Tracker / Favorites; active = brand pill + `aria-current=page`. |
| **CartBar** | Green summary link (`N items · ₹total → View order`) above the nav while the cart is non-empty. |
| **MenuSheet / ProfileSheet** | Navigation, plan status, editable display name (2–40 chars), reset-demo-data confirmation. |
| **Splash** | Gradient + flame logo + slab-serif title, once per browser session; tap to skip; shortened under reduced motion. |

### 3.4 Features & charts

`FilterSheet` (diet + sort), `CustomizeSheet` (portion, spice, note), `EditOrderSheet`, `AddressSheet` (validated, inline delete confirmation, last address protected), `SlotSheet` (any day up to 4 ahead + any slot), `PaymentSheet` (bill, coupons, UPI / card / cash, processing + decline + retry), `ComboSheet` (4–6 items), `LogSleepSheet`, `SummarySheet`, `DeliveryMap` (illustrative SVG with route, animated courier, zoomable address pin).

Charts are plain SVG with no dependency: `LineChart` (smooth line, keyboard / tap / hover points, pink low and green high, legend), `DonutChart` (4 weighted shade segments + AA label pill), `ProgressBar` (`role=progressbar`).

### 3.5 Screens & routes

| Route | Screen |
|---|---|
| `/` | Home — search, category + filter, grid, hero, dock |
| `/dish/:id` | Customize your order — dish card, Customize, Add + / stepper, add-ons, Back to home / Proceed checkout |
| `/checkout` | Order, address radios, slot grid + Other Timings, "Cut your cost, choose smart", bill, Proceed to payment |
| `/order/:id` | Order status — map, success dialog (first view only), collapsible details sheet |
| `/plans` | Subscription plans — radios, Edit combo, Free Trial, Subscribe / Upgrade, Cancel plan |
| `/health` → `/health/insights` → `/health/recommendations` | Weekly chart + report + dietician banner → insight donuts/bars + picks → preferred + recommended food |
| `/favorites` · `/orders` | Saved dishes (heart to remove) · order history with Reorder |

Every screen has the states that apply to it: loading (skeleton), empty, error-with-retry, validation, success.

---

## 4. Accessibility

**Text contrast** (WCAG; measured from the rendered page / token values)

| Pair | Ratio | Needs | Result |
|---|---|---|---|
| White on `green-700` (header top) | 5.42 | 4.5 | AA |
| Tagline (white 95%) on `green-700` | 5.06 | 4.5 | AA |
| White on `green-900` (header bottom) | 8.35 | 4.5 | AAA |
| `ink-deep` on lime (badge) | 12.21 | 4.5 | AAA |
| White on `ink-deep` (CTA) | 17.04 | 4.5 | AAA |
| `text-primary` on white | 16.66 | 4.5 | AAA |
| `text-secondary` `#5f6964` on white / `#f6f6f6` / `#e7f6ea` | 5.69 / 5.26 / 5.08 | 4.5 | AA |
| White on donut pills `#d61f1f` / `#1236ff` / `#a43fcb` | 5.15 / 7.01 / 5.06 | 4.5 | AA |
| White on the primary gradient (19px / 700 = large text) | ≥ 4.9 | 3 | AA |
| Avatar initial `#8a5a00` on `#fff4d6` | 5.41 | 4.5 | AA |
| Filter label `#027d18` on chip fill | 4.92 | 4.5 | AA |
| Active nav label `#027d18` on white | 5.32 | 4.5 | AA |
| Inactive nav label `#6f6f6f` on white | 5.02 | 4.5 | AA |

**Graphics / icons** (need 3:1): brand `#039719` on white = 3.86 (search/mic icons); white on brand = 3.86 (active nav icon, "added" check). Both pass.

**Touch targets** (measured at 390px wide; guideline 44px)

| Control | Visual | Touch area |
|---|---|---|
| Dish "+" button | 22×22 | **44×44** |
| Filter chip | 83×35 | **90×44** |
| Hero CTA | 144×39 | **144×47** |
| Avatar / mic | 44×44 | 44×44 |
| Bottom-nav item | 114×62 | 114×62 |
| Search bar | full width × 44 | same |

**Automated audit:** axe-core 4.8 reports 0 violations on all 11 routes and on the payment, filter and customize sheets and the plan confirmation dialog (including colour contrast and landmarks).

**Patterns:** `button:focus-visible` 2px outline (`--color-focus`, 2px offset); search bar shows a 3px focus-within ring; selected states use `aria-pressed`/`aria-current`; hero is labelled via `aria-labelledby`; decorative imagery is hidden from assistive tech; reduced motion respected.

---

## 5. Code conventions

- **Styling:** CSS Modules only (`Component.module.css`), one per component; no inline colours; no global classes except the reset in `styles/global.css`.
- **File layout:** `src/components/{ui,layout,features,charts}`, `src/pages/<Screen>/`, `src/state/AppState.tsx` (context + reducer, persisted to `localStorage["breakfit:v1"]` with defensive hydration), `src/services/api.ts` (**mock backend** — async, simulated latency; replace the bodies with `fetch`), `src/data/` (static mock content + image imports), `src/lib/` (pricing, formatting, filters, storage, hooks), `src/assets/{categories,food,dishes,addons}/`, `src/styles/{tokens,global}.css`.
- **Mock vs real:** everything under `src/data` and `src/services` is mock. UI code talks to `services/api` for async lists and to `lib/pricing` for money, so a real backend swaps in at those two seams.
- **Adding a token:** add it to `tokens.css` with a one-line role comment, group it with its siblings, and use it via `var(--…)`. Remove tokens that stop being used.
- **Adding a component:** props-driven, content comes from `src/data`, CSS reads tokens, then test at 360 / 390 / 430px.
- **Small controls:** keep the visual size, add an invisible `::after` hit area to reach ~44px (don't clip it with `overflow: hidden` on the control's parent).
- **Small text colours:** check contrast ≥ 4.5:1 before choosing a token; use `--color-brand-text`, not `--color-brand`, for green text.
- **Adding imagery:** follow §2.8 sizes so framing and weight stay consistent.

---

## 6. Status

### Resolved

| Issue | Was | Now |
|---|---|---|
| Avatar initial contrast | `#c98a12` on `#fff4d6` = 2.69:1 | `#8a5a00` = 5.41:1 |
| Small brand-green text | 3.57–3.86:1 | `--color-brand-text` `#027d18` = 4.92–5.32:1 (icons keep `#039719`) |
| Inactive nav label | `#787878` = 4.42:1 | `#6f6f6f` = 5.02:1 |
| Touch targets | "+" 22px, Filter 35px, CTA 39px | 44×44, 90×44, 144×47 |
| Unused tokens | `--color-green-600`, `--color-surface-muted`, `--font-size-xs` unused; `--font-size-xl` unused | First three removed; `--font-size-xl` redefined to 18px and adopted by the section heading |
| Secondary text contrast | `#6b7570` = 4.41:1 on card grey, 4.26:1 on light green | `#5f6964` = 5.26 / 5.08 |
| Donut label pills | White on `#ff2d2d` 3.7:1, on `#c26ae0` 3.3:1 | Dedicated `accent` colours ≥ 5:1 |
| Hard-coded values | 7px radii, 18px heading, hero `clamp()` sizes, hero shadows/gradients/drop-shadow | Now tokens: `--radius-sm`, `--font-size-xl`, `--font-size-hero-*`, `--shadow-badge/-cta/-cta-hover`, `--drop-shadow-dish`, `--color-shine`, `--color-cta-border` |

Audit after the fixes: no colour, shadow, radius or font-size literals remain in component/page CSS, and no token is unused.

### Still open

| # | Item | Notes |
|---|---|---|
| 1 | **No real backend, payments or accounts** | Menu, plans, coupons, health numbers, dietician picks and orders are mock data. Payments are simulated (a UPI id containing "fail" or a card ending 0000 is declined, "timeout…" times out). There is no sign-in — the profile is a local display name. Everything lives in this browser's `localStorage`. |
| 2 | **Voice search needs browser support** | Uses the Web Speech API (Chrome / Edge / Safari) and microphone permission; other browsers get a clear fallback message. |
| 3 | **Map is illustrative** | The order-status map is an SVG, not live tracking; the courier animation is decorative. |
| 4 | **Scope limits** | No dark mode; fonts come from the Google Fonts CDN; wide screens show the phone column; order status never advances by itself ("Delivered" is inferred from the delivery date). |
| 5 | **Layout geometry stays literal (by design)** | Component pixel sizes (44, 22, 72×54, 64×40…), the 560px ring, dish offsets/rotations, gradient stops, chart geometry and keyframe values are one-off geometry, not shared tokens. |
