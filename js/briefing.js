// Briefings: a one-line summary on show, with the fuller rules folded away until asked for.
// Works for missions, deployment zones and deployment types; extra holds a further titled rules list.
const pageRef = p => p ? `p.${p}` : "";
function renderBriefing(el, entry, title, extra){
  if(!entry){ el.innerHTML = ""; return; }
  const list = rules => `<ul>${rules.map(r=>`<li>${esc(r)}</li>`).join("")}</ul>`;
  el.innerHTML = `<p class="note">${esc(entry.summary)}</p>
    <details class="brief"><summary>${title} <span class="page">${pageRef(entry.page)}</span></summary>
      ${entry.rules && entry.rules.length ? list(entry.rules) : ""}
      ${extra ? `<p class="label">${extra.label} <span class="page">${pageRef(extra.page)}</span></p>${list(extra.rules)}` : ""}
      <p class="note">Rules are summarised. Page numbers marked * are not printed in the source photos; check them against your rulebook.</p>
    </details>`;
}
// The three briefings a game can show. The "All missions" and "Reserves" sections follow the game's system.
const briefMission = (el,id,sys) => renderBriefing(el, mission(id), "Mission briefing", GENERAL_RULES[sys] && {label:"All missions", ...GENERAL_RULES[sys]});
const briefZones   = (el,id) => renderBriefing(el, DEPLOY_ZONES[id], "Deployment zones briefing");
const briefType    = (el,id) => renderBriefing(el, DEPLOY_TYPES[id], "Deployment type briefing", {label:"Reserves", ...RESERVE_RULES[DEPLOY_TYPES[id]?.system]});
