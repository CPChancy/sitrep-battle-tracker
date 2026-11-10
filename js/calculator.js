// The calculator screen: army ledgers, turn tracker, scoring editor and the Discord report.
function rows(g=S){ return g.rows; }
function ensureCounts(){
  const n = rows().length;
  ["A","B"].forEach(p=>{ S.counts[p] = (S.counts[p]||[]).slice(0,n); while(S.counts[p].length<n) S.counts[p].push(0); });
}
function total(p,g=S){ return rows(g).reduce((s,r,i)=>s + r.v*(g.counts[p][i]||0), 0); }

function renderSetup(){
  // System, mission and points are chosen in setup; here they are shown, and changed through "Edit game setup".
  const m = mission(S.scen);
  $("missionName").textContent = m ? `${m.roll?m.roll+" · ":""}${m.name}` : S.scen;
  $("gameInfo").textContent = `${S.sys} · ${S.pts} pts`;
  $("margin").value=S.margin; $("nameA").value=S.nameA; $("nameB").value=S.nameB;
  $("playerA").value=S.playerA||""; $("playerB").value=S.playerB||"";
  // Missions won on objectives have no VP margin, and their totals count objectives rather than VP.
  $("marginField").hidden = S.scoring==="majority";
  document.querySelectorAll(".totLabel").forEach(l=>l.textContent = (S.scoring==="majority" && mission(S.scen)?.total) || "Victory points");
  $("legacyNote").hidden = !S.legacy; $("legacyName").textContent = mission(S.scen)?.name || "";
  // Deployment is chosen in setup; here it is shown with its rules, and changed through "Edit game setup".
  $("deployText").textContent = deployNames(S, " · ") ||"Not decided yet. Use Edit game setup to choose or roll it.";
  $("fogWarn").textContent = fogWarning(S.scen, S.deploy);
  $("turns").innerHTML = [1,2,3,4,5,6,7].map(t=>`<button type="button" class="${t<=S.turn?"done":""} ${t===7?"t7":""}" data-t="${t}" aria-label="Turn ${t}">${t}</button>`).join("");
}
// Briefings are drawn only when the game opens or the mission changes, so an open one doesn't snap shut.
function renderBriefs(){ briefMission($("brief"),S.scen,S.sys); briefZones($("zonesBrief"),S.zones); briefType($("deployBrief"),S.deploy); }
function renderEditor(){
  $("editor").innerHTML = rows().map((r,i)=>`<div class="edit">
    <input type="text" id="el${i}" value="${esc(r.l)}" aria-label="Scoring line ${i+1} name">
    <input type="number" id="ev${i}" value="${r.v}" step="1" aria-label="VP each">
    <button type="button" data-del="${i}" aria-label="Remove line">✕</button></div>`).join("");
}
function renderLines(){
  ensureCounts();
  const maj = S.scoring==="majority";
  ["A","B"].forEach(p=>{
    // Missions that don't score kills track them separately, only to settle drawn games.
    const tb = mission(S.scen)?.tiebreak ? `<div class="line tb">
      <div class="what"><b>Enemy units destroyed</b><small>tie-breaker only</small></div>
      <div class="stepper">
        <button type="button" data-p="${p}" data-tb="-1" aria-label="Remove one tie-breaker kill">−</button>
        <output>${S.tb[p]}</output>
        <button type="button" class="plus" data-p="${p}" data-tb="1" aria-label="Add one tie-breaker kill">+</button>
      </div></div>` : "";
    $("lines"+p).innerHTML = rows().map((r,i)=>`<div class="line">
      <div class="what"><b>${esc(r.l)}</b><small>${maj ? "counts towards the result" : `${r.v} VP each`}</small></div>
      <div class="stepper">
        <button type="button" data-p="${p}" data-i="${i}" data-d="-1" aria-label="Remove one ${esc(r.l)}">−</button>
        <output>${S.counts[p][i]}</output>
        <button type="button" class="plus" data-p="${p}" data-i="${i}" data-d="1" aria-label="Add one ${esc(r.l)}">+</button>
      </div></div>`).join("") + tb;
  });
  renderResult();
}
function renderResult(){
  const m = mission(S.scen), maj = S.scoring==="majority";
  const a=total("A"), b=total("B"), diff=a-b, need = maj ? 1 : Math.max(1,+S.margin||1);
  // A scored line that ends the game (briefcase off the table, base destroyed) makes the result final at once.
  const over = S.turn>=6 || rows().some((r,i)=>r.ends && (S.counts.A[i]||S.counts.B[i]));
  $("totA").textContent=a; $("totB").textContent=b;
  const v=$("verdict");
  let res;
  if(Math.abs(diff)>=need){ res = `${diff>0?S.nameA:S.nameB} ${over?"win":"lead"}`; }
  else {
    const k = S.tb.A-S.tb.B; // tie-breaker: enemy units destroyed, 2 or more ahead
    res = m?.tiebreak && Math.abs(k)>=2 ? `${over?"Winning draw":"Too close to call, edge"}: ${k>0?S.nameA:S.nameB}` : (over?"Draw":"Too close to call");
  }
  v.textContent = over ? res : `Turn ${S.turn}: ${res}`;
  v.className = "verdict " + (!over?"live":(Math.abs(diff)>=need?"win":"draw"));
  const unit = maj ? "" : " VP";
  $("scoreline").textContent = `${S.nameA} ${a} – ${b} ${S.nameB}`;
  const who = p => S["player"+p] ? ` (${S["player"+p]})` : "";
  const detail = p => rows().map((r,i)=>S.counts[p][i]?`  ${r.l}: ${S.counts[p][i]} × ${r.v} = ${S.counts[p][i]*r.v}`:null).filter(Boolean).join("\n") || "  (none)";
  const dep = deployNames(S, ", ");
  $("report").textContent =
`**${S.sys} — ${m?m.name:S.scen}** (${S.pts} pts, ${over?`ended turn ${S.turn}`:`turn ${S.turn}`})${dep?`\nDeployment: ${dep}`:""}
**${S.nameA}**${who("A")} ${a}${unit} vs **${S.nameB}**${who("B")} ${b}${unit}
Result: ${over?res:"in progress – "+res}${m?.tiebreak?`\nTie-breaker (enemy units destroyed): ${S.nameA} ${S.tb.A}, ${S.nameB} ${S.tb.B}`:""}
${S.nameA}:
${detail("A")}
${S.nameB}:
${detail("B")}`;
}
// Records a change to the open game: saves it and marks it as just played.
function changed(){ S.updated = Date.now(); store.set("fsc-games", games); }
function readEditor(){
  S.rows = rows().map((x,i)=>({...rows()[i], l:$("el"+i).value||"Scoring line", v:+$("ev"+i).value||0}));
  renderLines(); changed();
}
// Starts the open game's scoring afresh from its mission: scoring style, margin, counters and tie-breaker.
function applyMission(){
  const m = mission(S.scen); S.scoring=m.scoring; S.margin=m.margin||1;
  S.rows=presetRows(S.scen); S.counts={A:[],B:[]}; S.tb={A:0,B:0}; delete S.legacy;
}

document.addEventListener("click", e=>{
  const t=e.target.closest("button"); if(!t) return;
  if(t.dataset.d){ const p=t.dataset.p, i=+t.dataset.i, r=rows()[i], o=p==="A"?"B":"A";
    let n = Math.max(0, S.counts[p][i] + +t.dataset.d); if(r.max!=null) n = Math.min(n, r.max);
    S.counts[p][i]=n; if(r.one && n>0) S.counts[o][i]=0;
    renderLines(); changed(); }
  else if(t.dataset.tb){ const p=t.dataset.p; S.tb[p]=Math.max(0,S.tb[p]+ +t.dataset.tb); renderLines(); changed(); }
  else if(t.dataset.t){ S.turn=+t.dataset.t; renderSetup(); renderResult(); changed(); }
  else if(t.dataset.del!==undefined){ const i=+t.dataset.del; S.rows.splice(i,1); ["A","B"].forEach(p=>S.counts[p].splice(i,1)); renderEditor(); renderLines(); changed(); }
});
$("editor").addEventListener("input", readEditor);
$("addRow").onclick = ()=>{ S.rows.push({l:"New objective",v:1}); renderEditor(); renderLines(); changed(); };
$("resetRows").onclick = ()=>{ S.rows=presetRows(S.scen); S.counts={A:[],B:[]}; S.tb={A:0,B:0}; renderEditor(); renderLines(); changed(); };
$("margin").addEventListener("input",e=>{ S.margin=+e.target.value; renderResult(); changed(); });
["nameA","nameB"].forEach(id=>$(id).addEventListener("input",e=>{ S[id]=e.target.value||(id==="nameA"?"Your army":"Opponent's army"); renderResult(); changed(); }));
["playerA","playerB"].forEach(id=>$(id).addEventListener("input",e=>{ S[id]=e.target.value.trim(); renderResult(); changed(); }));
$("legacyUpgrade").onclick = ()=>{ applyMission(); renderSetup(); renderEditor(); renderLines(); changed(); };
$("legacyKeep").onclick = ()=>{ delete S.legacy; renderSetup(); changed(); };
$("newGame").onclick = ()=>{ $("newGame").hidden=true; $("confirmClear").hidden=false; setTimeout(()=>{$("newGame").hidden=false;$("confirmClear").hidden=true},3000); };
$("confirmClear").onclick = ()=>{ S.counts={A:[],B:[]}; S.tb={A:0,B:0}; S.turn=1; $("newGame").hidden=false; $("confirmClear").hidden=true; renderSetup(); renderLines(); changed(); };
$("copy").onclick = ()=>{
  const txt=$("report").textContent, ok=()=>{$("toast").textContent="Copied. Paste it into Discord."};
  navigator.clipboard.writeText(txt).then(ok).catch(()=>{ const r=document.createRange(); r.selectNodeContents($("report")); const s=getSelection(); s.removeAllRanges(); s.addRange(r); $("toast").textContent="Text selected. Copy it from your device menu."; });
};
