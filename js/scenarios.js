// Mission data from the Bolt Action rulebook (pp.162–180) and the Konflikt '47 rulebook (pp.144–160). Page numbers marked * are inferred; check them against the book.
// scoring: "vp" = total victory points, win by the margin; "majority" = more objectives held wins, otherwise a draw.
// rows are the counters in each army's ledger: l label, v value; max caps it, one = only one side can have it,
// ends = scoring it ends the game immediately. tiebreak adds an "enemy units destroyed" counter for drawn games.
const MISSIONS = {
  "seek-destroy": { name:"Seek and Destroy", system:"Bolt Action", kind:"matched", roll:1, page:"164", scoring:"vp", margin:2,
    rows:[{l:"Enemy unit destroyed",v:1}],
    summary:"1 VP for each enemy unit destroyed. Win by 2 VP or more, otherwise it's a draw.",
    rules:["The standard beginner game: Seek and Destroy, Long Edges and Meeting Engagement."] },
  "key-positions": { name:"Key Positions", system:"Bolt Action", kind:"matched", roll:2, page:"164–165", scoring:"majority", tiebreak:true, total:"Objectives held",
    rows:[{l:"Objectives controlled",v:1,max:7}],
    summary:"Control more objectives than your opponent at the end to win; otherwise it's a draw.",
    rules:["Place D3+4 objectives (25mm markers). Roll off: the high roller places the first, then take turns.",
      "Each objective must be more than 12\" from every other and more than 6\" from any table edge.",
      "Scenery can be used as objectives; agree how it affects line of sight, movement and cover first.",
      "Capture: one of your infantry or artillery units ends its activation within 3\" with no enemy unit of any type within 3\".",
      "An objective stays yours until the enemy captures it back."] },
  "breakthrough": { name:"Breakthrough", system:"Bolt Action", kind:"matched", roll:3, page:"165", scoring:"vp", margin:2, tiebreak:true, noFog:true,
    rows:[{l:"Unit moved off enemy table edge",v:3},{l:"Unit completely in enemy deployment zone",v:1}],
    summary:"3 VP per unit that leaves via the enemy's table edge, 1 VP per unit completely inside the enemy deployment zone at the end. Win by 2.",
    rules:["To leave the table a unit needs a successful Advance or Run order, and every model must reach the enemy's deployment zone edge.",
      "No reserves. If Fog of War is rolled for deployment type, re-roll it."] },
  "top-secret": { name:"Top Secret", system:"Bolt Action", kind:"matched", roll:4, page:"165–166", scoring:"majority", tiebreak:true, total:"Briefcase",
    rows:[{l:"Briefcase carried off the table",v:1,max:1,one:true,ends:true}],
    summary:"Carry the briefcase off your own table edge to win at once; otherwise it's a draw.",
    rules:["The briefcase sits in the centre of the table. It is impassable but has no effect on line of sight or cover.",
      "Seize it: an infantry unit with an Advance or Run order ends its move with a model touching it. That model carries it.",
      "If the carrier dies it passes to another model in the unit. If the whole unit is destroyed, it stays where it was.",
      "If the carrying unit is destroyed in an assault, the winning unit may take the briefcase straight away.",
      "To escape: an Advance or Run order, with every model reaching your own deployment zone edge.",
      "All units, including infiltrators, deploy more than 12\" from the briefcase."] },
  "demolition": { name:"Demolition", system:"Bolt Action", kind:"matched", roll:5, page:"166–167", scoring:"majority", tiebreak:true, total:"Bases destroyed",
    rows:[{l:"Enemy base destroyed",v:1,max:1,ends:true}],
    summary:"Destroy the enemy base to win at once. If neither base or both bases are destroyed, it's a draw.",
    rules:["After deployment is decided, roll off. The loser places their base in their own zone, up to 20\" from the middle line, then the other player does.",
      "At the end of every turn, roll a D6 for each of your infantry or artillery units that is not Down and is within 3\" of the enemy base (enemy units nearby don't stop this). On a 4+ the base is destroyed.",
      "The game ends at the end of the turn in which a base is destroyed.",
      "If the game ends with neither base destroyed, or both destroyed in the same turn, the result is a draw.",
      "All units, including infiltrators, deploy more than 18\" from the enemy base."] },
  "hold-until-relieved": { name:"Hold Until Relieved", system:"Bolt Action", kind:"matched", roll:6, page:"167", scoring:"majority", tiebreak:true, total:"Objective held",
    rows:[{l:"Holding the central objective",v:1,max:1,one:true}],
    summary:"Whoever controls the objective in the centre of the table at the end wins; otherwise it's a draw.",
    rules:["Control: one of your infantry or artillery units ends its activation within 3\" with no enemy unit of any type within 3\".",
      "If scenery is used as the objective, agree its rules before the game."] },
  "grand-tactical": { name:"Grand Tactical (optional)", system:"Bolt Action", kind:"matched", page:"167", scoring:"vp", margin:2,
    rows:[{l:"Enemy unit destroyed",v:1},{l:"Unit in enemy deployment zone",v:1},{l:"Unit moved off enemy table edge",v:3},
      {l:"Key Positions objective controlled",v:3},{l:"Top Secret documents retrieved",v:5,max:1,one:true},
      {l:"Enemy base destroyed",v:5,max:1},{l:"Strategic objective controlled",v:5,max:1,one:true}],
    summary:"All six missions at once, scored in VP. Win by 2.",
    rules:["Set up all six missions together.",
      "The game does not end when a base is destroyed or the briefcase leaves the table.",
      "Reserves may outflank."] },
  "custom": { name:"Custom / event", system:"any", kind:"other", scoring:"vp", margin:1,
    rows:[{l:"Enemy unit destroyed",v:1},{l:"Objective held",v:2}],
    summary:"Your own scoring lines for an event pack. Change them under \"Edit this game's scoring\".", rules:[] },
  // Story missions: kept for a future update and hidden from the dropdowns until then.
  "envelopment":  { name:"Envelopment",  system:"Bolt Action", kind:"story", page:"176*", summary:"Attacker breaks into the defender's zone; VP for kills, units in the zone and units off the far edge.", rules:[] },
  "manhunt":      { name:"Manhunt",      system:"Bolt Action", kind:"story", page:"177",  summary:"Attacker must kill the defender's officer in an assault.", rules:[] },
  "point-defence":{ name:"Point Defence",system:"Bolt Action", kind:"story", page:"178*", summary:"Attacker tries to capture the defender's 3 objectives.", rules:[] },
  "land-grab":    { name:"Land Grab",    system:"Bolt Action", kind:"story", page:"179*", summary:"Both sides push into the neutral and enemy quarters.", rules:[] },
  "surrounded":   { name:"Surrounded!",  system:"Bolt Action", kind:"story", page:"180*", summary:"Destroy the encircled enemy while preserving your own force.", rules:[] },

  // Konflikt '47 (rulebook pp.144–160). Scored the same way as Bolt Action; the rules text differs.
  "k47-seek-destroy": { name:"Seek and Destroy", system:"Konflikt '47", kind:"matched", roll:1, page:"144*", scoring:"vp", margin:2,
    rows:[{l:"Enemy unit destroyed",v:1}],
    summary:"1 VP for each enemy unit destroyed. Win by 2 VP or more, otherwise it's a draw.",
    rules:["First time playing? Try Seek and Destroy with Edges and Meeting Engagement."] },
  "k47-key-positions": { name:"Key Positions", system:"Konflikt '47", kind:"matched", roll:2, page:"145", scoring:"majority", tiebreak:true, total:"Objectives held",
    rows:[{l:"Objectives controlled",v:1,max:7}],
    summary:"Control more objectives than your opponent at the end to win; otherwise it's a draw.",
    rules:["Place D3+4 objectives (1\" markers). Roll off: the high roller places the first, then take turns.",
      "Each objective must be more than 12\" from every other and more than 6\" from any table edge.",
      "If a marker can't be placed legally, put it on top of one already on the table. A doubled-up objective counts as two.",
      "Capture: one of your Infantry or Artillery units ends its movement within 3\" with no enemy unit of any type within 3\".",
      "An objective stays yours until the enemy captures it back."] },
  "k47-breakthrough": { name:"Breakthrough", system:"Konflikt '47", kind:"matched", roll:3, page:"145", scoring:"vp", margin:2, tiebreak:true, noFog:true,
    rows:[{l:"Unit moved off enemy table edge",v:3},{l:"Unit completely in enemy deployment zone",v:1}],
    summary:"3 VP per unit that leaves via the enemy's table edge, 1 VP per unit completely inside the enemy deployment zone at the end. Win by 2.",
    rules:["To leave the table a unit needs a successful Advance or Run order, and all models must reach the enemy's deployment zone edge.",
      "No reserves. If Fog of War is rolled for deployment type, re-roll it."] },
  "k47-top-secret": { name:"Top Secret", system:"Konflikt '47", kind:"matched", roll:4, page:"146", scoring:"majority", tiebreak:true, total:"Intelligence",
    rows:[{l:"Intelligence carried off the table",v:1,max:1,one:true,ends:true}],
    summary:"Carry the Intelligence off your own table edge to win at once; otherwise it's a draw.",
    rules:["The Intelligence Marker (1\") sits in the centre of the table. It is Impassable but has no effect on line of sight or cover.",
      "Seize it: an Infantry unit with an Advance or Run order ends its move with a model touching it. That model carries it.",
      "If the carrier dies it passes to another model in the unit. If the whole unit is destroyed, it is left where the carrying model was.",
      "If the carrying unit is destroyed in an Assault, the winning unit may take it straight away, before its Regroup move.",
      "To escape: an Advance or Run order, with all models reaching your own deployment zone edge.",
      "All units, including Infiltrators, deploy more than 12\" from the marker, except units disembarking from a Transport that has moved close enough, or units with the Fast rule."] },
  "k47-demolition": { name:"Demolition", system:"Konflikt '47", kind:"matched", roll:5, page:"147*", scoring:"majority", tiebreak:true, total:"Bases destroyed",
    rows:[{l:"Enemy base destroyed",v:1,max:1,ends:true}],
    summary:"Destroy the enemy Base to win at once. If neither Base or both Bases are destroyed, it's a draw.",
    rules:["After deployment is decided, roll off. The loser places their Base in their own zone, up to 20\" from the middle line, then the other player does.",
      "All units, including Infiltrators, deploy more than 12\" from the enemy Base.",
      "At the end of any turn, if a model from one of your Infantry or Artillery units is within 3\" of the enemy Base, it is destroyed. No dice roll is needed, and enemy units nearby don't stop it.",
      "The game ends at the end of the turn in which a Base is destroyed.",
      "If the game ends with neither Base destroyed, or both destroyed in the same turn, the result is a draw."] },
  "k47-hold-until-relieved": { name:"Hold Until Relieved", system:"Konflikt '47", kind:"matched", roll:6, page:"147*", scoring:"majority", tiebreak:true, total:"Objective held",
    rows:[{l:"Holding the Strategic Objective",v:1,max:1,one:true}],
    summary:"Whoever controls the Strategic Objective in the centre of the table at the end wins; otherwise it's a draw.",
    rules:["Control: one of your Infantry or Artillery units ends its movement within 3\" with no enemy unit of any type within 3\".",
      "If terrain is used as the objective, agree its rules before the game."] },
  "k47-grand-tactical": { name:"Grand Tactical (optional)", system:"Konflikt '47", kind:"matched", page:"152*", scoring:"vp", margin:2,
    rows:[{l:"Enemy unit destroyed",v:1},{l:"Unit in enemy deployment zone",v:1},{l:"Unit moved off enemy table edge",v:3},
      {l:"Objective controlled",v:3},{l:"Intelligence retrieved",v:5,max:1,one:true},
      {l:"Enemy base destroyed",v:5,max:1},{l:"Strategic Objective controlled",v:5,max:1,one:true}],
    summary:"All six missions at once, scored in VP. Win by 2.",
    rules:["Set up all six missions together.",
      "The game does not end when a Base is destroyed or the Intelligence leaves the table.",
      "Reserves may Outflank."] },
  // Konflikt '47 story missions: hidden until their scoring is added.
  "k47-envelopment":   { name:"Envelopment",   system:"Konflikt '47", kind:"story", page:"155",       summary:"Attacker breaks into the Defender's zone; VP for kills, units in the zone and units off the far edge.", rules:[] },
  "k47-manhunt":       { name:"Manhunt",       system:"Konflikt '47", kind:"story", page:"156*–157*", summary:"Attacker must take out the Defender's Officer in Close Quarters (a Rift unit must be killed).", rules:[] },
  "k47-point-defence": { name:"Point Defence", system:"Konflikt '47", kind:"story", page:"158",       summary:"Attacker tries to capture the Defender's 3 objectives.", rules:[] },
  "k47-land-grab":     { name:"Land Grab",     system:"Konflikt '47", kind:"story", page:"159",       summary:"Both sides push into the neutral and enemy quarters.", rules:[] },
  "k47-surrounded":    { name:"Surrounded!",   system:"Konflikt '47", kind:"story", page:"160*",      summary:"Destroy the encircled enemy while preserving your own force.", rules:[] }
};
// The "All missions" rules shown in every mission briefing, per system.
const GENERAL_RULES = {
  "Bolt Action": { page:"163*, 168", rules:[
    "The game lasts 6 turns. At the end of turn 6 roll a D6: on 4–6 play a 7th turn.",
    "A player whose units are all destroyed loses, whatever the mission.",
    "A reserve unit that has not arrived by the end counts as destroyed.",
    "Drawn game? Count enemy units destroyed: a side 2 or more ahead earns a winning draw."] },
  "Konflikt '47": { page:"153*", rules:[
    "The game lasts 6 turns. At the end of turn 6 roll a D6: on 4–6 play a 7th turn.",
    "A reserve unit that has not arrived by the end counts as destroyed.",
    "Drawn game? Count enemy units destroyed: a side 2 or more ahead earns a Winning Draw.",
    "Table size and terrain aren't covered by these rules notes; check the rulebook."] } };
// The usual game size for each system, filled in when a new game's system is chosen.
const DEFAULT_POINTS = { "Bolt Action":1250, "Konflikt '47":1500 };

const mission = id => MISSIONS[id];
// A fresh, editable copy of a mission's counters, so edits never change the presets themselves.
const presetRows = id => MISSIONS[id].rows.map(r=>({...r}));
const forSystem = (m, sys) => m.system==="any" || m.system===sys;
// Systems with their own rulebook missions.
const hasMissions = sys => Object.values(MISSIONS).some(m=>m.kind==="matched" && m.system===sys);
// The scenario dropdown for a game system: matched missions then custom scoring. Story missions stay hidden
// until they are ready. A game's current mission is always listed, even if it doesn't fit the filter.
function scenarioOptions(selected, sys){
  const opt = (id,m) => `<option value="${id}"${id===selected?" selected":""}>${m.roll?m.roll+" · ":""}${esc(m.name)}</option>`;
  const group = (label,kind) => {
    const items = Object.entries(MISSIONS).filter(([,m])=>m.kind===kind && forSystem(m,sys));
    return items.length ? `<optgroup label="${label}">${items.map(([id,m])=>opt(id,m)).join("")}</optgroup>` : "";
  };
  const cur = MISSIONS[selected];
  const current = cur && (cur.kind==="story" || !forSystem(cur,sys)) ? opt(selected, cur) : "";
  return current + group("Matched missions","matched") + group("Other","other");
}
