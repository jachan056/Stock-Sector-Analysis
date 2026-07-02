// ---------------- DATA (sector-level means from the study) ----------------
const sectors = [
  {name:"Consumer Staples", short:"Con. Staples", color:"var(--c-staples)", hex:"#6FCF97",
   betaC:0.93, betaB:0.50, ddC:-24.7, ddB:-21.5, recC:320, recB:295,
   narrative:"Smallest drawdown of any sector in both crashes (−24.7% / −21.5%) — but recovery consistently lagged the market. Protects on the way down, drags on the way up."},
  {name:"Healthcare", short:"Healthcare", color:"var(--c-health)", hex:"#56CCF2",
   betaC:0.91, betaB:0.69, ddC:-26.7, ddB:-25.1, recC:130, recB:131,
   narrative:"The only sector that delivered on every metric, every time: lowest beta, near-smallest drawdown, and the fastest recovery of any sector in both crashes."},
  {name:"Technology", short:"Technology", color:"var(--c-tech)", hex:"#BB86FC",
   betaC:1.12, betaB:1.53, ddC:-30.0, ddB:-38.9, recC:87, recB:431,
   narrative:"Snapped back fastest after Covid (87 days) on rapid tech adoption — then took the hardest, longest hit once interest rates rose. Rate-sensitive at its core."},
  {name:"Financial", short:"Financial", color:"var(--c-fin)", hex:"#F2C94C",
   betaC:1.24, betaB:0.94, ddC:-39.8, ddB:-33.5, recC:307, recB:576,
   narrative:"Similar drawdowns in both crashes, but a very different recovery: 307 days after Covid vs. 576 days after the bear market, as sustained high rates squeezed lending margins."},
  {name:"Defense", short:"Defense", color:"var(--c-defense)", hex:"#B9A46B",
   betaC:1.07, betaB:0.72, ddC:-46.2, ddB:-28.6, recC:733, recB:186,
   narrative:"The slowest recovery of any sector in Covid (733 days) — government spending froze. In the bear market it became the fastest-recovering sector of all, as defense budgets held firm."},
  {name:"Energy", short:"Energy", color:"var(--c-energy)", hex:"#FF8A4C",
   betaC:1.18, betaB:0.57, ddC:-50.9, ddB:-33.7, recC:596, recB:350,
   narrative:"Worst sector in the demand-shock crash — then second-best in the inflation-shock crash. The single clearest proof that crash cause, not sector label, drives outcomes."},
];
const marketIndex = {name:"S&P 500 (SPY)", color:"var(--c-index)", hex:"#8892A6", betaC:1.0, betaB:1.0, ddC:-32.8, ddB:-24.5, recC:227, recB:498};

// ---------------- SLOPE CHART (drawdown reversal) ----------------
(function(){
  const svg = document.getElementById('slopeChart');
  const all = [...sectors, marketIndex];
  const W = 460, H = 380, padTop = 18, padBottom = 34, leftX = 70, rightX = 390;
  const minVal = -55, maxVal = 0;
  const y = v => padTop + (v - maxVal) / (minVal - maxVal) * (H - padTop - padBottom);

  let svgHTML = '';
  // gridlines
  [0,-10,-20,-30,-40,-50].forEach(v=>{
    const yy = y(v);
    svgHTML += `<line x1="${leftX-14}" y1="${yy}" x2="${rightX+14}" y2="${yy}" stroke="#1E293F" stroke-width="1"/>`;
    svgHTML += `<text x="${leftX-20}" y="${yy+3}" font-family="IBM Plex Mono" font-size="9" fill="#5B6376" text-anchor="end">${v}%</text>`;
  });

  all.forEach(s=>{
    const y1 = y(s.ddC), y2 = y(s.ddB);
    svgHTML += `<line x1="${leftX}" y1="${y1}" x2="${rightX}" y2="${y2}" stroke="${s.hex}" stroke-width="2" opacity="0.9"/>`;
    svgHTML += `<circle cx="${leftX}" cy="${y1}" r="4" fill="${s.hex}"/>`;
    svgHTML += `<circle cx="${rightX}" cy="${y2}" r="4" fill="${s.hex}"/>`;
    svgHTML += `<text x="${leftX-14}" y="${y1+3}" font-family="IBM Plex Mono" font-size="10" fill="${s.hex}" text-anchor="end">${s.ddC.toFixed(1)}%</text>`;
    svgHTML += `<text x="${rightX+14}" y="${y2+3}" font-family="IBM Plex Mono" font-size="10" fill="${s.hex}" text-anchor="start">${s.ddB.toFixed(1)}%</text>`;
  });
  svg.innerHTML = svgHTML;

  const legend = document.getElementById('slopeLegend');
  legend.innerHTML = all.map(s=>`<div class="leg-item"><span class="leg-dot" style="background:${s.hex};"></span>${s.name}</div>`).join('');
})();

// ---------------- GROUPED BAR CHARTS ----------------
function buildGroupedBars(containerId, dataKeyC, dataKeyB, unit, maxAbs, formatter){
  const el = document.getElementById(containerId);
  const all = [...sectors, marketIndex];
  let html = '';
  all.forEach(s=>{
    const vC = Math.abs(s[dataKeyC]);
    const vB = Math.abs(s[dataKeyB]);
    const hC = Math.min(100, (vC / maxAbs) * 100);
    const hB = Math.min(100, (vB / maxAbs) * 100);
    html += `<div class="bargroup">
      <div class="bar" style="height:${hC}%; background:var(--covid);"><span class="val">${formatter(s[dataKeyC])}</span></div>
      <div class="bar" style="height:${hB}%; background:var(--bear);"><span class="val">${formatter(s[dataKeyB])}</span></div>
      <div class="bargroup-label">${s.short || s.name}</div>
    </div>`;
  });
  el.innerHTML = html;
}

buildGroupedBars('drawdownChart','ddC','ddB','%',55, v=>v.toFixed(1)+'%');
buildGroupedBars('recoveryChart','recC','recB','d',800, v=>Math.round(v)+'d');

// ---------------- SECTOR PROFILE CARDS ----------------
(function(){
  const el = document.getElementById('profiles');
  const icons = {
    "Consumer Staples": `<path d="M6 10h24l-2 16H8L6 10z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 10a6 6 0 0 1 12 0" fill="none" stroke="currentColor" stroke-width="2"/>`,
    "Healthcare": `<rect x="14" y="6" width="8" height="24" fill="currentColor"/><rect x="6" y="14" width="24" height="8" fill="currentColor"/>`,
    "Technology": `<rect x="9" y="9" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="15" y="15" width="6" height="6" fill="currentColor"/><path d="M18 4v5M18 27v5M4 18h5M27 18h5" stroke="currentColor" stroke-width="2"/>`,
    "Financial": `<path d="M18 4l14 8H4l14-8z" fill="currentColor"/><rect x="6" y="14" width="4" height="14" fill="currentColor"/><rect x="16" y="14" width="4" height="14" fill="currentColor"/><rect x="26" y="14" width="4" height="14" fill="currentColor"/><rect x="4" y="30" width="28" height="2" fill="currentColor"/>`,
    "Defense": `<path d="M18 4l12 5v9c0 8-5.5 13.5-12 15-6.5-1.5-12-7-12-15V9l12-5z" fill="none" stroke="currentColor" stroke-width="2"/>`,
    "Energy": `<path d="M15 4c-4 8-9 11-9 18a9 9 0 0 0 18 0c0-3-1.5-5-3-7 0 3-2 4-2 4 1-6-2-9-4-15z" fill="currentColor"/>`
  };
  el.innerHTML = sectors.map(s=>`
    <div class="profile" style="border-top:3px solid ${s.hex};">
      <svg class="icon" viewBox="0 0 36 36" style="color:${s.hex};">${icons[s.name]}</svg>
      <h4>${s.name}</h4>
      <div class="stats">
        <div>DRAWDOWN<b style="color:${s.hex};">${s.ddC}% / ${s.ddB}%</b></div>
        <div>RECOVERY<b style="color:${s.hex};">${s.recC}d / ${s.recB}d</b></div>
      </div>
      <p>${s.narrative}</p>
    </div>
  `).join('');
})();

// ---------------- scroll progress + reveal ----------------
window.addEventListener('scroll', ()=>{
  const h = document.documentElement;
  const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  document.getElementById('progress').style.width = pct + '%';
});

const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); } });
}, {threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
