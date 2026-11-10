// Saving and loading on this device only (browser storage).
const store = { get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},
                set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}} };

// Games saved before the mission update stored the scenario's name and these preset values; kept only to upgrade them.
const LEGACY = {"Seek & Destroy":"seek-destroy","Key Positions":"key-positions","Breakthrough":"breakthrough","Top Secret":"top-secret",
  "Demolition":"demolition","Hold Until Relieved":"hold-until-relieved","Envelopment":"envelopment","Custom / event":"custom"};
const LEGACY_ROWS = {
  "Seek & Destroy":[{l:"Enemy unit destroyed",v:1}],
  "Key Positions":[{l:"Objective controlled at end",v:3},{l:"Enemy unit destroyed",v:1}],
  "Breakthrough":[{l:"Enemy unit destroyed",v:1},{l:"Unit in enemy deployment zone",v:2},{l:"Unit exited enemy table edge",v:3}],
  "Top Secret":[{l:"Intel carried off your edge",v:5},{l:"Holding the intel at end",v:3},{l:"Enemy unit destroyed",v:1}],
  "Demolition":[{l:"Enemy base destroyed",v:5},{l:"Enemy unit destroyed",v:1}],
  "Hold Until Relieved":[{l:"Objective controlled at end",v:5},{l:"Enemy unit destroyed",v:1}],
  "Envelopment":[{l:"Enemy unit destroyed",v:1},{l:"Unit in enemy deployment zone",v:2},{l:"Unit exited enemy table edge",v:3}],
  "Custom / event":[{l:"Enemy unit destroyed",v:1},{l:"Objective held",v:2}] };

// Saved games are kept in one list, most recently opened first, so the menu can offer them again.
function loadGames(){
  const list = store.get("fsc-games", []);
  const shared = store.get("fsc-custom", {});
  list.forEach(g=>{
    // Older games keep the scoring they were played with: their own lines, scored in VP.
    if(!g.rows) g.rows = (shared[g.scen] || LEGACY_ROWS[g.scen] || presetRows("custom")).map(r=>({...r}));
    if(LEGACY[g.scen]) g.scen = LEGACY[g.scen];
    // Old Konflikt '47 games use that system's version of their mission, if it has one.
    if(g.sys==="Konflikt '47" && (!g.scoring || g.legacy) && mission(g.scen)?.system==="Bolt Action" && MISSIONS["k47-"+g.scen])
      g.scen = "k47-"+g.scen;
    // Old games of a matched mission get a one-off offer to switch to the rulebook scoring.
    if(!g.scoring){ g.scoring = "vp"; g.legacy = mission(g.scen)?.kind === "matched"; }
    if(!g.tb) g.tb = {A:0,B:0};
  });
  return list;
}
let games = loadGames();
let S = games[0] || null; // the game open in the calculator

// Another tab changed the saved games: take its copy so saving here doesn't overwrite it.
window.addEventListener("storage", e=>{
  if(e.key!=="fsc-games") return;
  games = loadGames();
  S = games.find(g=>g.id===S?.id) || null;
  // Leave an open Edit game setup alone so unsaved edits survive; saving applies them to the fresh copy.
  if(location.hash==="#edit" && S) return;
  show();
});
