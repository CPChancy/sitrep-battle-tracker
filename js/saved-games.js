// The saved games screen: listing, opening and deleting games.
function openGame(id){
  const i = games.findIndex(g=>g.id===id); if(i<0) return;
  games.unshift(games.splice(i,1)[0]); S = games[0]; store.set("fsc-games", games);
  go("game");
}
function renderGames(){
  const when = t => new Date(t).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
  $("gameList").innerHTML = games.length ? games.map(g=>`<div class="saved">
      <button type="button" class="choice" data-open="${g.id}">
        <b>${esc(g.nameA)} v ${esc(g.nameB)}</b>
        <span class="score">${total("A",g)} – ${total("B",g)}</span>
        <small>${[g.playerA,g.playerB].some(Boolean) ? esc(`${g.playerA||"?"} v ${g.playerB||"?"}`)+" · " : ""}${esc(g.sys)} · ${esc(mission(g.scen)?.name || g.scen)} · ${g.pts} pts · turn ${g.turn} · last played ${when(g.updated)}</small>
      </button>
      <button type="button" class="btn ghost" data-remove="${g.id}" aria-label="Delete ${esc(g.nameA)} v ${esc(g.nameB)}">Delete</button>
    </div>`).join("")
    : `<p class="note">No saved games on this device yet.</p><div class="btns"><button type="button" class="btn" data-go="setup">Create new game</button></div>`;
}
document.addEventListener("click", e=>{
  const t=e.target.closest("button"); if(!t) return;
  if(t.dataset.open){ openGame(t.dataset.open); }
  else if(t.dataset.remove){
    if(t.dataset.armed){ const i=games.findIndex(g=>g.id===t.dataset.remove); if(i>=0) games.splice(i,1); store.set("fsc-games",games); renderGames(); }
    else { t.dataset.armed="1"; t.textContent="Confirm delete";
      setTimeout(()=>{ if(t.isConnected){ delete t.dataset.armed; t.textContent="Delete"; } },3000); }
  }
});
