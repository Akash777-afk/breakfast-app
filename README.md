# BreakFit — India's first breakfast app (demo)

Mobile-first React 18 + TypeScript + Vite + CSS Modules. Hash routing (`react-router-dom`), no UI or chart libraries.

```bash
npm install
npm run dev      # http://localhost:5180
npm run build    # type-check + production build
```

Design tokens, components and accessibility notes: [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).

## What works

Browse and search dishes → customise (portion, spice, note, add-ons) → favourites → checkout (address book, delivery slots, "Other Timings") → coupons → UPI / card / cash payment → order status with map → order history and reorder. Also: subscription plans (free trial, upgrade, editable combo, cancel), a health tracker (log sleep, personalised report), dietician insights and recommendations, profile and menu.

State (cart, favourites, addresses, plan, orders, health, profile) is saved in `localStorage` under `breakfit:v1`. **Menu → Reset demo data** clears it.

## Try the demo paths

| Try | Result |
|---|---|
| Coupon `DISCWITHSTARBUCK` | 10% off, max ₹60, min ₹100 |
| Coupon `BREAKFIT50` | ₹50 off orders ≥ ₹250 |
| Coupon `FIRSTBITE` | 20% off, max ₹80, min ₹150 |
| UPI id `anything@upi` | Payment succeeds |
| UPI id containing `fail` (e.g. `fail@upi`) | Declined — retry with another id |
| UPI id starting with `timeout` | Times out — retry |
| Card number ending `0000` | Declined |
| Delivery | ₹30, free from ₹250 or with a plan |

## Mock vs real

Nothing here talks to a server. `src/data/*` is static mock content and `src/services/api.ts` is an async mock backend with simulated latency, so loading, empty and error states are exercised. To go live, replace the function bodies in `services/api.ts` with `fetch` calls (the signatures are what the UI depends on) and swap `lib/pricing.ts` totals for server-side ones. Payments, accounts and live delivery tracking are **not** implemented; voice search relies on the browser's Web Speech API.
