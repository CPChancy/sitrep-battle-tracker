// The game setup screen: the questions, validation and starting the game. It is also used to edit an existing game.
// ptsSet marks that the player typed a game size, so choosing a system no longer fills in its usual size.
const blankDraft = () => ({sys:"", a:"", pa:"", b:"", pb:"", pts:"", ptsSet:false, scen:"", zones:"", deploy:"", rolled:""});
// Editing an existing game reuses this screen: its answers start from the game, and saving updates it.
let editing = null;           // the id of the game being edited, or null when creating a new one
let newDraft = blankDraft();  // a new game's answers, kept while you go back and forth
let draft = newDraft;
const gameDraft = g => ({sys:g.sys, a:g.nameA, pa:g.playerA||"", b:g.nameB, pb:g.playerB||"", pts:g.pts, ptsSet:true,
  scen:g.scen, zones:g.zones||"", deploy:g.deploy||"", rolled:""});
function startSetup(edit){ editing = edit ? S.id : null; draft = edit ? gameDraft(S) : newDraft; $("setupErr").textContent = ""; renderSetupForm(); }

function renderSetupForm(){
  document.querySelectorAll("#setupSys button").forEach(b=>b.setAttribute("aria-pressed", b.dataset.setsys===draft.sys));
  // The missions and deployment on offer depend on the chosen system.
  $("setupScen").innerHTML = draft.sys
    ? `<option value="">Choose a scenario</option>` + scenarioOptions(draft.scen, draft.sys)
    : `<option value="">Choose a system first</option>`;
  $("setupZones").innerHTML = deployOptions(DEPLOY_ZONES, draft.zones, draft.sys);
  $("setupDeploy").innerHTML = deployOptions(DEPLOY_TYPES, draft.deploy, draft.sys);
  $("setupRoll").disabled = !hasMissions(draft.sys);
  $("setupSysNote").textContent = draft.sys ? "" : "Choose a system first to see its missions.";
  $("setupA").value=draft.a; $("setupPA").value=draft.pa; $("setupB").value=draft.b; $("setupPB").value=draft.pb; $("setupPts").value=draft.pts;
  $("setupRolled").textContent = draft.rolled;
  $("setupBack").dataset.go = editing ? "game" : "new";
  $("setupBack").textContent = editing ? "← Back to game" : "← Back";
  $("setupSubmit").textContent = editing ? "Save changes" : "Start game";
  renderSetupBriefs();
}
function renderSetupBriefs(){
  briefMission($("setupBrief"), draft.scen, draft.sys); briefZones($("setupZonesBrief"), draft.zones); briefType($("setupDeployBrief"), draft.deploy);
  $("setupFogWarn").textContent = fogWarning(draft.scen, draft.deploy);
  $("setupResetWarn").textContent = editing && draft.scen!==S.scen ? "Changing the mission resets this game's counters." : "";
}
[["setupA","a"],["setupPA","pa"],["setupB","b"],["setupPB","pb"],["setupPts","pts"],["setupScen","scen"],["setupZones","zones"],["setupDeploy","deploy"]].forEach(([id,k])=>
  $(id).addEventListener("input", e=>{ draft[k]=e.target.value; if(k==="pts") draft.ptsSet=true; if(["scen","zones","deploy"].includes(k)) renderSetupBriefs(); }));
$("setupRoll").onclick = ()=>{
  const r = rollMatched(draft.sys);
  Object.assign(draft, {scen:r.scen, zones:r.zones, deploy:r.deploy});
  const t = r.dice.type;
  draft.rolled = `Rolled: mission ${r.dice.mission} · zones ${r.dice.zones} · type ${t.join(" → ")}` +
    (t.length>1 ? ` (Fog of War re-rolled for ${mission(r.scen).name})` : "");
  renderSetupForm();
};
$("setupForm").onsubmit = e=>{
  e.preventDefault();
  const a=draft.a.trim(), b=draft.b.trim(), pts=Math.round(+draft.pts);
  const missing = [!draft.sys&&"the system", !a&&"your army", !b&&"your opponent's army",
                   !(pts>0)&&"the points size", !draft.scen&&"the scenario"].filter(Boolean);
  if(missing.length){ $("setupErr").textContent = "Still needed: " + missing.join(", ") + "."; return; }
  $("setupErr").textContent = "";
  if(editing){
    Object.assign(S, {sys:draft.sys, nameA:a, nameB:b, playerA:draft.pa.trim(), playerB:draft.pb.trim(), pts,
      zones:draft.zones, deploy:draft.deploy});
    if(draft.scen!==S.scen){ S.scen=draft.scen; applyMission(); }
    changed(); go("game"); return;
  }
  const m = mission(draft.scen); // the mission sets the scoring style, margin and counters
  games.unshift({ id:Date.now().toString(36), sys:draft.sys, scen:draft.scen, scoring:m.scoring, turn:1, pts, margin:m.margin||1,
    nameA:a, nameB:b, playerA:draft.pa.trim(), playerB:draft.pb.trim(), zones:draft.zones, deploy:draft.deploy,
    rows:presetRows(draft.scen), counts:{A:[],B:[]}, tb:{A:0,B:0}, updated:Date.now() });
  S = games[0]; store.set("fsc-games", games);
  newDraft = draft = blankDraft();
  go("game");
};
document.addEventListener("click", e=>{
  const t=e.target.closest("button[data-setsys]"); if(!t) return;
  draft.sys = t.dataset.setsys;
  // A mission or deployment from the other system no longer fits. When editing, the game's own mission is kept,
  // so its counters are only reset if the player picks a different one.
  if(draft.scen && !forSystem(mission(draft.scen), draft.sys) && !(editing && draft.scen===S.scen)) draft.scen = "";
  if(DEPLOY_ZONES[draft.zones]?.system!==draft.sys) draft.zones = "";
  if(DEPLOY_TYPES[draft.deploy]?.system!==draft.sys) draft.deploy = "";
  // A new game takes the system's usual size unless the player typed one.
  if(!editing && !draft.ptsSet) draft.pts = DEFAULT_POINTS[draft.sys];
  draft.rolled = ""; renderSetupForm();
});
