# MandiBook — explainer site

A standalone marketing/explainer page for **MandiBook**, the mandi day-book for
APMC commission agents (arhtiya / aadhatiya).

> **Every lot, split & settled.** — pricing on discovery, subscription basis

This is *not* the product UI. It is a polished, self-contained landing page that
makes the idea instantly clear to a non-technical mandi arhtiya and to an
investor skimming for 30 seconds.

## What the product does

A mandi lot is the most mechanical money there is — weight times rate, minus two
fixed cuts — yet it's still split by hand, lot after lot, on a paper parchi.
MandiBook turns that into a clean lot → split → settlement cycle:

- **Lot entry with a live bill** — weight × rate → gross; commission and mandi
  fee come off → the net payable to the farmer, computed as you type.
- **Three-way split** — farmer, agent and mandi settled to the rupee on every lot.
- **Farmer dues board** — a running balance per farmer; part-payments carry forward.
- **Buyer outstanding board** — every buyer's open credit, kept true across days.
- **Daily patti, tallied** — every lot for a date with gross, commission, fee, net.
- **Commission dashboard** — earned today and this month, dues and outstanding.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page markup — all sections, inline SVG only. |
| `styles.css` | All styling. Palette built around the mandi-green accent `#65a30d`. |
| `app.js` | Sticky-nav highlight, smooth scroll, and the animated hero "lot bill" that splits and settles itself. No dependencies. |
| `favicon.svg` | Bahi-khata book mark. |
| `og.svg` / `og.png` | 1200×630 social share card. |

## Design notes

- Palette: mandi-green accent `#65a30d`, deep olive-black ink, warm harvest
  paper, a muted khaki-green tint, and a burnt-sienna warning colour for buyer
  outstanding / overdue.
- **Signature:** money is always set in tabular monospace, so the whole page
  reads like an arhtiya's bahi-khata. The hero widget is a live lot bill where a
  wheat lot visibly splits — gross → commission & fee off → net → farmer paid →
  buyer settled.
- Fully self-contained: no CDNs, no external fonts, images or scripts. System
  font stack only. Renders correctly opened as a local `file://` and deploys to
  any static host unchanged.
- Responsive down to mobile with no horizontal page scroll; the wide patti table
  scrolls inside its own container.
- Respects `prefers-reduced-motion` (the hero animation freezes on its split state).

## Run it

Just open `index.html` in a browser. No build step. To serve locally:

```sh
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy

Upload the folder to any static host (Netlify, Cloudflare Pages, GitHub Pages,
S3). No configuration required. This repo ships a GitHub Actions workflow
(`.github/workflows/deploy-pages.yml`) that publishes to GitHub Pages on push to
`main`.

---

A **KARYA** studio build · sreeni.nintendo@gmail.com
