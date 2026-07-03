"""
Regenerates the static SVG figures in this folder from the same sector
data used by js/main.js. Useful if you want standalone chart images for
a slide deck or PDF report, separate from the interactive site.

Run with: python3 generate_figures.py
Requires only the standard library.
"""

INK = "#080C15"
LINE = "#1E293F"
MUTED = "#5B6376"
COVID = "#FF5D5D"
BEAR = "#E8A33D"

sectors = [
    {"name": "Consumer Staples", "short": "Con. Staples", "hex": "#6FCF97", "ddC": -24.7, "ddB": -21.5, "recC": 320, "recB": 295},
    {"name": "Healthcare",       "short": "Healthcare",    "hex": "#56CCF2", "ddC": -26.7, "ddB": -25.1, "recC": 130, "recB": 131},
    {"name": "Technology",       "short": "Technology",    "hex": "#BB86FC", "ddC": -30.0, "ddB": -38.9, "recC": 87,  "recB": 431},
    {"name": "Financial",        "short": "Financial",     "hex": "#F2C94C", "ddC": -39.8, "ddB": -33.5, "recC": 307, "recB": 576},
    {"name": "Defense",          "short": "Defense",       "hex": "#B9A46B", "ddC": -46.2, "ddB": -28.6, "recC": 733, "recB": 186},
    {"name": "Energy",           "short": "Energy",        "hex": "#FF8A4C", "ddC": -50.9, "ddB": -33.7, "recC": 596, "recB": 350},
]
market_index = {"name": "S&P 500 (SPY)", "short": "Index", "hex": "#8892A6", "ddC": -32.8, "ddB": -24.5, "recC": 227, "recB": 498}

ALL = sectors + [market_index]


def slope_chart(path):
    W, H = 620, 460
    pad_top, pad_bottom = 30, 50
    left_x, right_x = 130, 520
    min_val, max_val = -55, 0

    def y(v):
        return pad_top + (v - max_val) / (min_val - max_val) * (H - pad_top - pad_bottom)

    parts = [f'<svg viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg" font-family="IBM Plex Mono, monospace">']
    parts.append(f'<rect x="0" y="0" width="{W}" height="{H}" fill="{INK}"/>')
    parts.append(f'<text x="{left_x}" y="18" font-size="11" fill="{MUTED}">COVID-19</text>')
    parts.append(f'<text x="{right_x}" y="18" font-size="11" fill="{MUTED}" text-anchor="end">BEAR MARKET</text>')

    for v in [0, -10, -20, -30, -40, -50]:
        yy = y(v)
        parts.append(f'<line x1="{left_x-14}" y1="{yy}" x2="{right_x+14}" y2="{yy}" stroke="{LINE}" stroke-width="1"/>')
        parts.append(f'<text x="{left_x-22}" y="{yy+3}" font-size="9" fill="{MUTED}" text-anchor="end">{v}%</text>')

    for s in ALL:
        y1, y2 = y(s["ddC"]), y(s["ddB"])
        parts.append(f'<line x1="{left_x}" y1="{y1}" x2="{right_x}" y2="{y2}" stroke="{s["hex"]}" stroke-width="2.5" opacity="0.9"/>')
        parts.append(f'<circle cx="{left_x}" cy="{y1}" r="4.5" fill="{s["hex"]}"/>')
        parts.append(f'<circle cx="{right_x}" cy="{y2}" r="4.5" fill="{s["hex"]}"/>')
        parts.append(f'<text x="{left_x-22}" y="{y1+3}" font-size="10" fill="{s["hex"]}" text-anchor="end">{s["ddC"]:.1f}%</text>')
        parts.append(f'<text x="{right_x+22}" y="{y2+3}" font-size="10" fill="{s["hex"]}" text-anchor="start">{s["ddB"]:.1f}%</text>')
        parts.append(f'<text x="{right_x+62}" y="{y2+3}" font-size="10" fill="{MUTED}" text-anchor="start">{s["name"]}</text>')

    parts.append('</svg>')
    open(path, "w").write("\n".join(parts))


def grouped_bar_chart(path, key_c, key_b, max_abs, unit, title):
    W, H = 700, 420
    pad_left, pad_bottom, pad_top = 50, 60, 40
    chart_w = W - pad_left - 30
    chart_h = H - pad_top - pad_bottom
    n = len(ALL)
    group_w = chart_w / n

    def bar_h(v):
        return min(1.0, abs(v) / max_abs) * chart_h

    parts = [f'<svg viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg" font-family="IBM Plex Mono, monospace">']
    parts.append(f'<rect x="0" y="0" width="{W}" height="{H}" fill="{INK}"/>')
    parts.append(f'<text x="{pad_left}" y="24" font-size="13" fill="#EDE7D8">{title}</text>')
    base_y = pad_top + chart_h
    parts.append(f'<line x1="{pad_left}" y1="{base_y}" x2="{W-30}" y2="{base_y}" stroke="{LINE}" stroke-width="1"/>')

    for i, s in enumerate(ALL):
        gx = pad_left + i * group_w
        bw = group_w * 0.28
        hc = bar_h(s[key_c])
        hb = bar_h(s[key_b])
        xc = gx + group_w * 0.18
        xb = gx + group_w * 0.54
        parts.append(f'<rect x="{xc}" y="{base_y-hc}" width="{bw}" height="{hc}" fill="{COVID}" rx="2"/>')
        parts.append(f'<rect x="{xb}" y="{base_y-hb}" width="{bw}" height="{hb}" fill="{BEAR}" rx="2"/>')
        val_c = f'{s[key_c]:.1f}{unit}' if unit == '%' else f'{int(round(s[key_c]))}{unit}'
        val_b = f'{s[key_b]:.1f}{unit}' if unit == '%' else f'{int(round(s[key_b]))}{unit}'
        parts.append(f'<text x="{xc+bw/2}" y="{base_y-hc-6}" font-size="8.5" fill="{MUTED}" text-anchor="middle">{val_c}</text>')
        parts.append(f'<text x="{xb+bw/2}" y="{base_y-hb-6}" font-size="8.5" fill="{MUTED}" text-anchor="middle">{val_b}</text>')
        parts.append(f'<text x="{gx+group_w/2}" y="{base_y+18}" font-size="9" fill="{MUTED}" text-anchor="middle">{s["short"]}</text>')

    legend_y = H - 14
    parts.append(f'<rect x="{pad_left}" y="{legend_y-9}" width="10" height="10" fill="{COVID}"/>')
    parts.append(f'<text x="{pad_left+16}" y="{legend_y}" font-size="10" fill="{MUTED}">Covid-19</text>')
    parts.append(f'<rect x="{pad_left+110}" y="{legend_y-9}" width="10" height="10" fill="{BEAR}"/>')
    parts.append(f'<text x="{pad_left+126}" y="{legend_y}" font-size="10" fill="{MUTED}">Bear Market</text>')

    parts.append('</svg>')
    open(path, "w").write("\n".join(parts))


if __name__ == "__main__":
    slope_chart("slope_reversal.svg")
    grouped_bar_chart("drawdown_by_sector.svg", "ddC", "ddB", 55, "%", "Maximum Drawdown by Sector (%)")
    grouped_bar_chart("recovery_by_sector.svg", "recC", "recB", 800, "d", "Recovery Time by Sector (days)")
    print("Wrote slope_reversal.svg, drawdown_by_sector.svg, recovery_by_sector.svg")
