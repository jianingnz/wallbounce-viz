// GT -> prediction error vectors for a prediction pane: blue GT cloud + red segments.
// Usage: const ov = makeOverlay(scene, sprite, size); ov.alloc(N); ov.update(gt, pred, gtFrame, predFrame, N); ov.setVisible(true)
window.makeOverlay = function(scene, sprite, size){
  const ptsGeo = new THREE.BufferGeometry();
  const pts = new THREE.Points(ptsGeo, new THREE.PointsMaterial({size: size || 0.02, map: sprite, color: 0x0a84ff,
    transparent: true, alphaTest: 0.3, depthWrite: false, sizeAttenuation: true}));
  pts.frustumCulled = false; pts.visible = false; scene.add(pts);
  const segGeo = new THREE.BufferGeometry();
  const segs = new THREE.LineSegments(segGeo, new THREE.LineBasicMaterial({color: 0xff3b30, transparent: true, opacity: 0.9}));
  segs.frustumCulled = false; segs.visible = false; scene.add(segs);
  return {
    alloc(N){ ptsGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
              segGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 6), 3)); },
    setVisible(v){ pts.visible = segs.visible = v; },
    get visible(){ return pts.visible; },
    update(gt, pred, fg, fp, N){
      if (!pts.visible) return;
      const o = fg * N * 3, op = fp * N * 3;
      ptsGeo.attributes.position.array.set(gt.subarray(o, o + N * 3)); ptsGeo.attributes.position.needsUpdate = true;
      const sp = segGeo.attributes.position.array;
      for (let i = 0; i < N; i++){ const a = o + i * 3, b = op + i * 3, k = i * 6;
        sp[k] = gt[a]; sp[k+1] = gt[a+1]; sp[k+2] = gt[a+2]; sp[k+3] = pred[b]; sp[k+4] = pred[b+1]; sp[k+5] = pred[b+2]; }
      segGeo.attributes.position.needsUpdate = true;
    }
  };
};
window.vizDisc = function(){ const s=64, cv=document.createElement('canvas'); cv.width=cv.height=s; const g=cv.getContext('2d');
  const rg=g.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2); rg.addColorStop(0,'rgba(255,255,255,1)'); rg.addColorStop(.5,'rgba(255,255,255,.95)'); rg.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle=rg; g.beginPath(); g.arc(s/2,s/2,s/2,0,7); g.fill(); return new THREE.CanvasTexture(cv); };
// mark the best (min) numeric cell per column in a table; cols = indices to consider
// Playback speed: <select> in a control bar. Values are slow-down factors
// (1 = real time: 1 ms of wall clock per 1 ms of physics). Returns a getter.
window.makeSpeed = function(ctl, opts, onChange){
  const s=document.createElement('select'); s.id='speed'; s.className='mono'; s.title='Playback speed relative to real physical time';
  (opts||[[1,'Real time'],[4,'¼ speed'],[10,'1/10 speed'],[40,'1/40 speed']]).forEach(([v,l])=>{const o=document.createElement('option'); o.value=v; o.textContent=l; s.appendChild(o);});
  ctl.appendChild(s); s.onchange=()=>onChange&&onChange(+s.value); return ()=>+s.value;
};
// Physical-time clock for frame viewers: advances wall-clock/speed, clamps at
// the clip end, holds there `hold` wall-ms, then restarts (so a 50 ms clip is
// still perceivable at real time).
window.makeClock = function(getSpeed, hold){ hold=hold||700; let tPhys=0,last=0,endAt=0;
  return { tick(ts,playing,spanMs){ if(!playing||!last){ last=ts; return tPhys; } tPhys+=(ts-last)/getSpeed(); last=ts;
      if(tPhys>=spanMs){ tPhys=spanMs; if(!endAt) endAt=ts; else if(ts-endAt>hold){ tPhys=0; endAt=0; } } else endAt=0; return tPhys; },
    set(t){ tPhys=t; endAt=0; }, get(){ return tPhys; } }; };
window.markBest = function(table, cols){
  const rows=[...table.querySelectorAll('tr')].filter(r=>r.querySelector('td'));
  for(const c of cols){ let best=null, bv=Infinity;
    rows.forEach(r=>{ const td=r.children[c]; if(!td) return; const v=parseFloat(td.textContent); if(!isNaN(v)&&v<bv){bv=v;best=td;} });
    if(best) best.classList.add('best'); }
};
