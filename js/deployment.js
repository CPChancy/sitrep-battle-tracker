// Deployment for matched games: zones and type are each rolled on a D6, or agreed.
// Bolt Action rulebook pp.169–172; Konflikt '47 rulebook pp.148–151. Each entry records its system.
const DEPLOY_ZONES = {
  "long-edges": { name:"Long Edges", system:"Bolt Action", rolls:[1,2,3], page:"169",
    summary:"Each side deploys from its own long table edge up to 12\" from the middle line, leaving a 24\" gap.",
    rules:["The table is split in half along its length.",
      "Each zone runs from its long edge to 12\" from the middle line.",
      "Roll off: the high roller picks a zone and the opponent takes the opposite one."] },
  "quarters": { name:"Quarters", system:"Bolt Action", rolls:[4,5,6], page:"169",
    summary:"Players take diagonally opposite table quarters; nobody deploys within 12\" of the centre.",
    rules:["The table is split into four quarters.",
      "No deployment within 12\" of the table centre.",
      "Roll off: the high roller picks a quarter and the opponent takes the diagonally opposite one."] },
  "k47-edges": { name:"Edges", system:"Konflikt '47", rolls:[1,2,3], page:"148",
    summary:"Each side deploys from its own table edge up to 12\" from the middle line, leaving a 24\" gap.",
    rules:["The table is split into two halves.",
      "Each zone runs from its table edge to 12\" from the middle line.",
      "Roll off: the high roller picks a zone and the opponent takes the opposite one.",
      "Smaller tables: reduce the distance in proportion, e.g. 9\" on a 3' x 3' table."] },
  "k47-quarters": { name:"Quarters", system:"Konflikt '47", rolls:[4,5,6], page:"148",
    summary:"Opposite table quarters, each with a chosen table edge; nobody deploys within 12\" of the centre.",
    rules:["The table is split into four quarters. No deployment within 12\" of the table centre.",
      "Roll off: the high roller picks a quarter and one adjoining table side as their table edge. The opponent gets the opposite quarter and edge.",
      "Smaller tables: reduce the distance in proportion, e.g. 9\" on a 3' x 3' table."] }
};
const DEPLOY_TYPES = {
  "meeting-engagement": { name:"Meeting Engagement", system:"Bolt Action", rolls:[1,2,3], page:"170",
    summary:"Nothing starts on the table except infiltrators; the first wave moves on in turn 1.",
    rules:["Roll off: the high roller declares reserves (up to half the army, rounding down), infiltrators and who rides in which transport, then the other player does.",
      "Every unit not in reserve forms the first wave.",
      "In turn 1 the first wave enters from your table edge with a Run or Advance order. No order test is needed, and units can't assault as they enter."] },
  "prepared-positions": { name:"Prepared Positions", system:"Bolt Action", rolls:[4,5], page:"170",
    summary:"Units not in reserve are set up in your zone one at a time, drawn from the dice bag.",
    rules:["Declare reserves, infiltrators and transports as for Meeting Engagement (reserves up to half, rounding down).",
      "Put an order die in the bag for each unit not in reserve, in a transport or infiltrating.",
      "Draw dice one at a time; the owner deploys one unit entirely inside their zone. Repeat until the bag is empty."] },
  "fog-of-war": { name:"Fog of War", system:"Bolt Action", rolls:[6], page:"170", fog:true,
    summary:"As Prepared Positions, but at least half the army starts in reserve and may arrive from any table edge.",
    rules:["Set up as Prepared Positions, except reserves must be at least half the army, rounding up.",
      "No outflanking. Instead, reserves may enter from any point on any table edge."] },
  "k47-meeting-engagement": { name:"Meeting Engagement", system:"Konflikt '47", rolls:[1,2,3], page:"149*",
    summary:"Nothing starts on the table except Infiltrators; both First Waves move on in turn 1.",
    rules:["Both players roll a die; the lowest scorer declares first: reserves (up to half the army, rounding down), Infiltrators and who rides in which Transport. Then the other player does.",
      "Every unit not in reserve forms the First Wave.",
      "In turn 1 both players bring their First Wave on from their own table edge with Run or Advance. No order test is needed, and units can't Assault as they enter."] },
  "k47-prepared-positions": { name:"Prepared Positions", system:"Konflikt '47", rolls:[4,5], page:"149*",
    summary:"Units not in reserve are set up in your zone one at a time, drawn from the dice bag.",
    rules:["Declare as for Meeting Engagement (lowest roller first; reserves up to half, rounding down).",
      "Put an order die in the bag for each unit not in reserve, in a Transport or using the Infiltrators rule.",
      "Draw dice one at a time; the owner deploys one unit entirely inside their zone. Repeat until the bag is empty."] },
  "k47-fog-of-war": { name:"Fog of War", system:"Konflikt '47", rolls:[6], page:"149*", fog:true,
    summary:"As Prepared Positions, but reserves may arrive from almost any table edge.",
    rules:["Deploy as for Prepared Positions. Reserves follow the normal limit: up to half, rounding down.",
      "No Outflanking. Instead, reserves may enter from any point on any table edge, except the edge the last enemy reserve used that turn. At the start of the next turn, the first reserve may use any edge."] }
};
// The reserves rules shown in the deployment type briefing, per system.
const RESERVE_RULES = {
  "Bolt Action": { page:"172", rules:[
    "Reserves can't act in turn 1, but their dice still go in the bag; the only order they may take is Down.",
    "From turn 2 a reserve enters with Advance or Run, needing an order test at −1 (FUBAR just counts as a fail).",
    "A unit can stay in reserve by taking a Down order. One that never arrives counts as destroyed.",
    "Reserves enter from anywhere on your own table edge, can't leave the table the turn they arrive, and can't assault as they enter.",
    "Outflanking: tell your opponent which reserves outflank and secretly note left or right. They take Down in turns 1–2, may enter from turn 3 (order test at −1) on your long edge or the noted short edge, but not in the enemy zone until turn 5."] },
  "Konflikt '47": { page:"150–151", rules:[
    "Reserves can't act in turn 1 except to be ordered Down.",
    "From turn 2 a reserve enters with Advance or Run, needing an order test at −1. Fearless units and units without a morale value still test, rolling as Veterans.",
    "A unit can stay in reserve by taking a Down order. One that never arrives counts as destroyed.",
    "Reserves enter from anywhere on your own table edge and can't Assault as they enter. The book also says they can't leave the table; check whether that means only the turn they arrive.",
    "Outflanking: tell your opponent which reserves outflank and secretly note left or right. They take Down in turns 1–2, may enter from turn 3 (order test at −1) on your table edge or the noted side edge, but not in the enemy zone until turn 5."] } };

// A fair D6: random bytes of 252 or more are thrown away so every face is equally likely.
function d6(){ const b=new Uint8Array(1); do crypto.getRandomValues(b); while(b[0]>=252); return b[0]%6+1; }
const byRoll = (table, n, sys) => Object.keys(table).find(k=>table[k].system===sys && table[k].rolls.includes(n));
// Rolls a whole matched game for a system: mission, deployment zones and deployment type, with the dice that produced them.
function rollMatched(sys){
  const dice = { mission:d6(), zones:d6(), type:[d6()] };
  const scen = Object.keys(MISSIONS).find(id=>MISSIONS[id].roll===dice.mission && MISSIONS[id].system===sys);
  let type = byRoll(DEPLOY_TYPES, dice.type[0], sys);
  // Breakthrough allows no reserves: re-roll Fog of War until something else comes up.
  while(MISSIONS[scen].noFog && DEPLOY_TYPES[type].fog){ const n=d6(); dice.type.push(n); type=byRoll(DEPLOY_TYPES, n, sys); }
  return { scen, zones:byRoll(DEPLOY_ZONES, dice.zones, sys), deploy:type, dice };
}
// Dropdown options for a system's deployment table, each showing its roll range, with "Not decided yet" first.
const rollRange = r => r.length>1 ? `${r[0]}–${r[r.length-1]}` : `${r[0]}`;
const deployOptions = (table, selected, sys) => `<option value="">Not decided yet</option>` +
  Object.entries(table).filter(([,d])=>d.system===sys)
    .map(([id,d])=>`<option value="${id}"${id===selected?" selected":""}>${rollRange(d.rolls)} · ${esc(d.name)}</option>`).join("");
// Breakthrough allows no reserves, so Fog of War needs re-rolling.
const fogWarning = (scen, deploy) => mission(scen)?.noFog && DEPLOY_TYPES[deploy]?.fog ? `${mission(scen).name} doesn't allow Fog of War: re-roll the deployment type.` : "";
