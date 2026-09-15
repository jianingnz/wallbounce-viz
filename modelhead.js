/* Shared model header for every losses and performance page.
   One registry so the two pages of a model can never disagree about its config.
   Usage:  <div id="mh"></div> ... <script src="modelhead.js?v=1"></script>
           <script>modelHead('c2n6_dt50_adaln_bi', 'Rollout performance');</script>   */
(function(){
const M = {
  frs1024_c2n2_dt150: {
    name: 'Sand · wide Δt', pts: '1,024 sand points', cn: 'C=2, N=2',
    dt: 'Δt 2.5 / 5 / 10 / 20 / 40 / 60 / 100 / 150 ms · held out 30, 80',
    cond: 'time-RoPE Δt', attn: 'causal', params: '38.6 M',
    train: '200k steps, batch 64', arena: '1 m arena'},
  c2n6_dt50_adaln_bi: {
    name: 'Sand · narrow Δt', pts: '1,024 sand points', cn: 'C=2, N=6',
    dt: 'Δt 2.5 / 5 / 10 / 20 / 40 / 50 ms · held out 15, 30',
    cond: 'adaLN Δt', attn: 'bidirectional', params: '39.2 M',
    train: '300k steps, batch 32', arena: '1 m arena'},
  c2f6_cube: {
    name: 'Cube · wide Δt', pts: '512 cube-shell points', cn: 'C=2, N=6',
    dt: 'Δt 2.5 / 5 / 10 / 20 / 40 / 60 / 100 / 150 ms · held out 30, 80',
    cond: 'time-RoPE Δt', attn: 'causal', params: '38.6 M',
    train: '200k steps, then branched at 180k and continued to 400k · batch 64',
    arena: '1 m arena'},
  c2f6_cube_dt5_adaln_bi: {
    name: 'Cube · 5 ms', pts: '512 cube-shell points', cn: 'C=2, N=16',
    dt: 'single Δt 5 ms', cond: 'adaLN Δt', attn: 'bidirectional', params: '39.2 M',
    train: '140k steps, batch 32', arena: '1 m arena'},
  cube_dt5_adaln_bi: {
    name: 'Cube · 5 ms · 331 M', pts: '512 cube-shell points', cn: 'C=2, N=16',
    dt: 'single Δt 5 ms', cond: 'adaLN Δt', attn: 'bidirectional',
    params: '331.4 M · widths to 1024, depths 1/2/4/8',
    train: '140k steps, batch 16 — half the 39 M’s windows at the same step count',
    arena: '1 m arena'},
  c2n6_water_dt5_adaln_bi: {
    name: 'Water · 5 ms', pts: '1,024 liquid points', cn: 'C=2, N=6',
    dt: 'single Δt 5 ms', cond: 'adaLN Δt', attn: 'bidirectional', params: '39.2 M',
    train: '300k steps, batch 32 · all 480 frames, untrimmed',
    arena: '0.35 m arena'},
};
const CSS = `
.mh{border-top:2px solid var(--ink); border-bottom:1px solid var(--line);
    padding:12px 0 13px; margin:0 0 22px}
.mh h1{font-family:var(--serif); font-size:22px; font-weight:700; letter-spacing:-.006em;
       margin:0 0 3px; line-height:1.2}
.mh h1 span{font-family:ui-monospace,Menlo,monospace; font-size:12.5px; font-weight:400;
            color:var(--soft); letter-spacing:0; margin-left:9px}
.mh .kind{font-size:12px; letter-spacing:.06em; text-transform:uppercase; color:var(--soft);
          margin:0 0 6px}
.mh ul{list-style:none; display:flex; flex-wrap:wrap; gap:3px 0; margin:0; padding:0;
       font-size:13px; color:#333; line-height:1.5}
.mh li{padding:0 11px; border-left:1px solid var(--line)}
.mh li:first-child{padding-left:0; border-left:0}
.mh b{font-weight:600; color:var(--ink)}
@media(max-width:700px){ .mh ul{display:block} .mh li{padding:0; border-left:0; display:block} }
`;
window.modelHead = function(key, kind, host){
  const m = M[key]; if (!m) return;
  const el = host || document.getElementById('mh'); if (!el) return;
  if (!document.getElementById('mh-css')){
    const s = document.createElement('style'); s.id = 'mh-css'; s.textContent = CSS;
    document.head.appendChild(s);
  }
  el.className = 'mh';
  const bits = [m.pts, m.arena, m.cn, m.dt, `<b>${m.cond}</b>`, `<b>${m.attn}</b>`,
                m.params, m.train].filter(Boolean);
  el.innerHTML = (kind ? `<p class="kind">${kind}</p>` : '')
    + `<h1>${m.name}<span>${key}</span></h1>`
    + '<ul>' + bits.map(b => `<li>${b}</li>`).join('') + '</ul>';
};
window.modelHeadPair = function(keyA, keyB, kind, title){
  const el = document.getElementById('mh'); if (!el) return;
  if (!document.getElementById('mh-css')){
    const s = document.createElement('style'); s.id = 'mh-css'; s.textContent = CSS;
    document.head.appendChild(s);
  }
  el.className = 'mh';
  const line = k => { const m = M[k]; return m ? `<li><b>${m.name}</b> — ${m.pts}, ${m.cn}, `
    + `${m.cond}, ${m.attn}, ${m.params}, ${m.train} <span style="font-family:ui-monospace,Menlo,monospace;`
    + `font-size:11.5px;color:var(--soft)">${k}</span></li>` : ''; };
  el.innerHTML = (kind ? `<p class="kind">${kind}</p>` : '')
    + `<h1>${title}</h1>`
    + `<ul style="display:block">${line(keyA)}${line(keyB)}</ul>`;
};
})();
