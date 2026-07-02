# Protecting Capital — Which Sectors Weather Market Crashes Best?

A single-page research site built from your sector crash-analysis notebook
(47 stocks, 6 sectors, S&P 500 benchmark, Covid-19 crash vs. 2022 bear market).

## Folder structure

```
project/
├── index.html                     ← the site itself, open this in a browser
├── css/
│   └── style.css                  ← all styling, colors, type, layout
├── js/
│   └── main.js                    ← sector data + chart rendering logic
├── assets/
│   └── figures/
│       ├── slope_reversal.svg          ← static export of the drawdown-reversal chart
│       ├── drawdown_by_sector.svg      ← static export of the drawdown bar chart
│       ├── recovery_by_sector.svg      ← static export of the recovery-time bar chart
│       └── generate_figures.py         ← regenerates the three SVGs above
└── README.md                      ← this file
```

## How to view it

Just open `index.html` in a browser — no build step, no server required.
If you want to host it, upload the whole `project/` folder as-is (e.g. to
GitHub Pages, Netlify, or any static host) and point it at `index.html`.

## Where the data lives

All sector figures (drawdown %, recovery days, beta) are hardcoded as plain
JavaScript objects at the top of `js/main.js`, taken directly from the
`sector_summary` table in your notebook. There's no external data file or
API call — if the underlying numbers ever change, edit the `sectors` and
`marketIndex` objects in `main.js` and every chart on the page updates
automatically, since all charts are drawn dynamically from that data.

## About the static figures

The interactive site draws its own charts in the browser (no image files
needed). The three SVGs in `assets/figures/` are standalone exports of
those same charts — useful if you want a chart image for a slide deck,
PDF report, or anywhere outside the website. Run
`python3 assets/figures/generate_figures.py` from inside that folder any
time you update the numbers in `main.js` and want matching static images
(the script uses the same values; keep them in sync by hand for now).

## Design notes

- **Palette**: dark navy base (`#080C15`) with a coral-red / amber-gold
  pair representing the two crash types (Covid = demand shock, Bear
  Market = inflation shock) throughout every chart and card.
- **Type**: Fraunces (serif, headlines) + Inter (body) + IBM Plex Mono
  (data labels, ticker-style figures) — a nod to trading-terminal
  typography without going full neon-on-black cliché.
- **Signature visual**: the slope chart under "The Central Finding" is
  the one piece of the page built specifically to make your core
  argument visible at a glance — sectors trading places between crashes.

## Not investment advice

The footer disclaimer carries over here too: this is a presentation of
historical research findings for educational purposes, not financial advice.
