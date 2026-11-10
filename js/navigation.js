// Screens are switched with the address hash, so the phone's back button steps back through them.
const SCREENS = ["menu","new","games","setup","edit","game"];
function go(s){ if(location.hash==="#"+s) show(); else location.hash=s; }
function show(){
  let s = location.hash.slice(1) || "menu";
  if(!SCREENS.includes(s) || ((s==="game"||s==="edit") && !games.includes(S))) s = "menu";
  const screen = s==="edit" ? "setup" : s;   // editing a game uses the setup page
  document.querySelectorAll("[data-screen]").forEach(el=>el.hidden = el.dataset.screen!==screen);
  if(s==="games") renderGames();
  if(s==="setup") startSetup(false);
  if(s==="edit") startSetup(true);
  if(s==="game"){ renderSetup(); renderBriefs(); renderEditor(); renderLines(); }
  window.scrollTo(0,0);
}
window.addEventListener("hashchange", show);
document.addEventListener("click", e=>{
  const t=e.target.closest("button[data-go]"); if(t) go(t.dataset.go);
});
