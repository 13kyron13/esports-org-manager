/* Esports Manager Update 19.5 — online league layer.
   Requires a Firebase project with Anonymous Authentication and Realtime Database enabled.
   The user's Firebase config is stored locally; league data is shared through Firebase. */
(() => {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  const cfgKey = "esm195FirebaseConfig";
  let db = null, auth = null, uid = null, activeLeague = null, leagueRef = null, unsubscribe = null;
  const gameNames = ["CS2","Valorant","Overwatch","League of Legends","Rocket League"];
  function orgSnapshot() {
    let state = null;
    try { state = typeof S !== "undefined" ? S : null; } catch (_) {}
    const roster = (state?.roster || []).map(p => ({ name: p.name || "Player", role: p.role || p.position || "Flex", rating: Number(p.rating || p.overall || 50) }));
    return {
      name: state?.me?.name || document.getElementById("orgBrandName")?.textContent || "My Organisation",
      tag: state?.me?.tag || "ORG", game: state?.gameTitle || "CS2",
      year: Number(state?.year || 1), money: Number(state?.money || 0),
      roster: roster.slice(0, 12), rating: Math.round(roster.reduce((a,p)=>a+p.rating,0) / Math.max(1,roster.length)),
      updatedAt: new Date().toISOString()
    };
  }
  function ensurePanel() {
    if ($("multiplayer195")) return;
    const host = document.querySelector('[data-tab="empire"]');
    if (!host) return;
    const card = document.createElement("div");
    card.className = "card"; card.id = "multiplayer195";
    card.innerHTML = '<h2>🌍 Multiplayer League · Update 19.5</h2><p class="note">Create a league and invite friends using its league code. Everyone needs to connect their own Firebase config once. Your existing single-player careers remain local and unchanged.</p><div id="mpStatus" class="note">Not connected to an online league.</div><div id="mpConfigArea"></div><div id="mpLeagueArea"></div>';
    host.prepend(card);
    renderConfig();
  }
  function renderConfig() {
    const area = $("mpConfigArea"); if (!area) return;
    let old = {}; try { old = JSON.parse(localStorage.getItem(cfgKey) || "{}"); } catch (_) {}
    area.innerHTML = '<details id="mpSettings"><summary style="cursor:pointer;font-weight:700;margin:8px 0">Connection settings (one-time setup)</summary><p class="note">Paste the web app config from your Firebase project. It is saved only in this browser.</p><div class="menu-form-grid"><label>API key<input id="mpApiKey" autocomplete="off"></label><label>Auth domain<input id="mpAuthDomain" placeholder="your-project.firebaseapp.com"></label><label>Database URL<input id="mpDatabaseURL" placeholder="https://your-project-default-rtdb.region.firebasedatabase.app"></label><label>Project ID<input id="mpProjectId"></label><label>App ID<input id="mpAppId"></label></div><button class="pri" id="mpConnect">Connect online</button><button id="mpDisconnect">Disconnect</button></details>';
    ["ApiKey","AuthDomain","DatabaseURL","ProjectId","AppId"].forEach(k => { const el = $("mp"+k); if (el) el.value = old[({ApiKey:"apiKey",AuthDomain:"authDomain",DatabaseURL:"databaseURL",ProjectId:"projectId",AppId:"appId"})[k]] || ""; });
    $("mpConnect").onclick = connect;
    $("mpDisconnect").onclick = () => { if (unsubscribe) unsubscribe(); unsubscribe = null; db = null; auth = null; uid = null; activeLeague = null; leagueRef = null; setStatus("Disconnected. Your local career saves are unchanged."); renderLeagueActions(); };
  }
  function setStatus(text) { if ($("mpStatus")) $("mpStatus").textContent = text; }
  function loadScript(src) {
    return new Promise((resolve,reject) => {
      if (document.querySelector('script[data-firebase-src="'+src+'"]')) return resolve();
      const s = document.createElement("script"); s.src = src; s.dataset.firebaseSrc = src; s.onload = resolve; s.onerror = reject; document.head.appendChild(s);
    });
  }
  async function connect() {
    const config = {
      apiKey: $("mpApiKey")?.value.trim(), authDomain: $("mpAuthDomain")?.value.trim(),
      databaseURL: $("mpDatabaseURL")?.value.trim(), projectId: $("mpProjectId")?.value.trim(), appId: $("mpAppId")?.value.trim()
    };
    if (Object.values(config).some(v => !v)) { setStatus("Fill in all five Firebase config fields first."); return; }
    try {
      localStorage.setItem(cfgKey, JSON.stringify(config));
      setStatus("Connecting to Firebase…");
      await loadScript("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
      await loadScript("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js");
      await loadScript("https://www.gstatic.com/firebasejs/10.14.1/firebase-database-compat.js");
      const appName = "esm195";
      let app = firebase.apps.find(a => a.name === appName);
      if (!app) app = firebase.initializeApp(config, appName);
      auth = app.auth(); db = app.database();
      await auth.signInAnonymously(); uid = auth.currentUser.uid;
      setStatus("Connected online. Your multiplayer identity is ready on this browser.");
      renderLeagueActions();
    } catch (e) {
      setStatus("Connection failed: " + (e?.message || "check Firebase config, Anonymous Authentication, database URL and security rules."));
    }
  }
  function renderLeagueActions() {
    const area = $("mpLeagueArea"); if (!area) return;
    if (!db || !uid) {
      area.innerHTML = '<p class="note">Online leagues need a Firebase project. Open Connection settings and connect first. See MULTIPLAYER_SETUP.md in the project repository for setup instructions.</p>'; return;
    }
    area.innerHTML = '<div class="menu-form-grid"><label>League name<input id="mpLeagueName" maxlength="48" placeholder="Friday Night League"></label><label>League code<input id="mpLeagueCode" maxlength="12" placeholder="Enter friend\'s code"></label></div><button class="pri" id="mpCreate">Create league</button><button id="mpJoin">Join league</button><button id="mpRefresh">Publish / refresh my team</button><div id="mpLeagueView"></div>';
    $("mpCreate").onclick = createLeague;
    $("mpJoin").onclick = joinLeague;
    $("mpRefresh").onclick = publishTeam;
    $("mpRefresh").onclick = publishTeam;
    $("mpLeagueCode").addEventListener("input", e => e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,12));
    if (activeLeague) listenLeague(activeLeague.code);
  }
  function makeCode() { return Math.random().toString(36).slice(2,8).toUpperCase(); }
  function makeSchedule(teams) {
    const ids = teams.map(t => t.uid);
    if (ids.length < 2) return [];
    const list = ids.slice(); if (list.length % 2) list.push(null);
    const rounds = [], n = list.length;
    for (let r=0;r<n-1;r++) {
      const fixtures=[];
      for(let i=0;i<n/2;i++){ const a=list[i],b=list[n-1-i]; if(a&&b) fixtures.push({id:"r"+(r+1)+"m"+(i+1),round:r+1,home:a,away:b,homeScore:null,awayScore:null,status:"scheduled"}); }
      rounds.push(...fixtures);
      const fixed=list[0], rest=list.slice(1); rest.unshift(rest.pop()); list.splice(0,list.length,fixed,...rest);
    }
    return rounds;
  }
  async function createLeague() {
    if (!db) return;
    const name = $("mpLeagueName")?.value.trim() || "Friends League";
    try {
      const code = makeCode(), team = orgSnapshot();
      const league = { name, code, owner:uid, createdAt:new Date().toISOString(), status:"regular", teams:{}, fixtures:[], playoffs:null, champion:null, updatedAt:new Date().toISOString() };
      league.teams[uid] = {...team, uid, owner:true};
      await db.ref("leagues/"+code).set(league);
      activeLeague = {code,name}; listenLeague(code);
      setStatus("League created. Share code "+code+" with your friends.");
    } catch(e) { setStatus("Could not create league: "+(e?.message || "check database rules")); }
  }
  async function joinLeague() {
    if (!db) return;
    const code = ($("mpLeagueCode")?.value || "").trim().toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(code)) { setStatus("Enter the six-character league code from your friend."); return; }
    try {
      const ref=db.ref("leagues/"+code), snap=await ref.once("value");
      if(!snap.exists()) { setStatus("League not found. Check the code and try again."); return; }
      const league=snap.val();
      if(league.status==="complete") { setStatus("This league has finished. Ask your friend to create a new season."); return; }
      await ref.child("teams/"+uid).set({...orgSnapshot(),uid,owner:false,joinedAt:new Date().toISOString()});
      activeLeague={code,name:league.name}; listenLeague(code);
      setStatus("Joined "+league.name+". Your team is now in the shared league.");
    } catch(e) { setStatus("Could not join league: "+(e?.message || "check database rules")); }
  }
  function listenLeague(code) {
    if(unsubscribe) unsubscribe();
    leagueRef=db.ref("leagues/"+code);
    const handler=snap => {
      const league=snap.val();
      if(!league) { setStatus("This league no longer exists."); return; }
      activeLeague={code,name:league.name};
      renderLeague(league);
    };
    leagueRef.on("value",handler,e=>setStatus("Live league sync failed: "+e.message));
    unsubscribe=()=>leagueRef.off("value",handler);
  }
  async function publishTeam() {
    if(!db||!activeLeague||!leagueRef) { setStatus("Create or join a league first."); return; }
    try {
      await leagueRef.child("teams/"+uid).update({...orgSnapshot(),uid,updatedAt:new Date().toISOString()});
      setStatus("Team published to the shared league.");
    } catch(e) { setStatus("Could not publish team: "+e.message); }
  }
  async function startSeason(league) {
    if(uid!==league.owner) { setStatus("Only the league creator can start the season."); return; }
    const teams=Object.values(league.teams||{});
    if(teams.length<2) { setStatus("Invite at least one friend before starting the season."); return; }
    const fixtures=makeSchedule(teams);
    await leagueRef.update({fixtures,status:"regular",playoffs:null,champion:null,updatedAt:new Date().toISOString()});
    setStatus("Season started with "+fixtures.length+" round-robin fixtures.");
  }
  function scoreRows(league) {
    const teams=Object.values(league.teams||{}), rows={};
    teams.forEach(t=>rows[t.uid]={uid:t.uid,name:t.name,tag:t.tag||"ORG",played:0,wins:0,losses:0,draws:0,for:0,against:0,points:0,rating:t.rating||0});
    (league.fixtures||[]).forEach(f=>{
      if(f.status!=="played"||f.homeScore==null||f.awayScore==null)return;
      const h=rows[f.home],a=rows[f.away]; if(!h||!a)return;
      h.played++;a.played++;h.for+=f.homeScore;h.against+=f.awayScore;a.for+=f.awayScore;a.against+=f.homeScore;
      if(f.homeScore>f.awayScore){h.wins++;h.points+=3;a.losses++}
      else if(f.awayScore>f.homeScore){a.wins++;a.points+=3;h.losses++}
      else {h.draws++;a.draws++;h.points++;a.points++}
    });
    return Object.values(rows).sort((a,b)=>b.points-a.points||(b.for-b.against)-(a.for-a.against)||b.rating-a.rating);
  }
  async function recordResult(id, homeScore, awayScore, league) {
    const fixture=(league.fixtures||[]).find(f=>f.id===id); if(!fixture)return;
    if(uid!==league.owner) { setStatus("Only the league creator can record official results in this version."); return; }
    const fixtures=league.fixtures.map(f=>f.id===id?{...f,homeScore,awayScore,status:"played",reportedBy:uid,playedAt:new Date().toISOString()}:f);
    await leagueRef.update({fixtures,updatedAt:new Date().toISOString()});
  }
  async function makePlayoffs(league) {
    if(uid!==league.owner){setStatus("Only the league creator can generate playoffs.");return;}
    const table=scoreRows(league);
    if((league.fixtures||[]).some(f=>f.status!=="played")){setStatus("Finish every regular-season fixture before playoffs.");return;}
    const qualified=table.slice(0,Math.min(4,table.length));
    if(qualified.length<2){setStatus("At least two teams are needed for playoffs.");return;}
    await leagueRef.update({status:"playoffs",playoffs:{round:1,qualified:qualified.map(t=>t.uid),matches:qualified.length>=4?[{id:"semi1",home:qualified[0].uid,away:qualified[3].uid,homeScore:null,awayScore:null,status:"scheduled"},{id:"semi2",home:qualified[1].uid,away:qualified[2].uid,homeScore:null,awayScore:null,status:"scheduled"}]:[{id:"final",home:qualified[0].uid,away:qualified[1].uid,homeScore:null,awayScore:null,status:"scheduled"}]},champion:null});
  }
  async function playoffResult(id, hs, as, league) {
    if(uid!==league.owner){setStatus("Only the league creator can record playoff results.");return;}
    const po=league.playoffs; if(!po)return;
    let matches=po.matches.map(m=>m.id===id?{...m,homeScore:hs,awayScore:as,status:"played"}:m);
    if(matches.some(m=>m.status!=="played")) { await leagueRef.child("playoffs").update({matches}); return; }
    const winners=matches.map(m=>m.homeScore>m.awayScore?m.home:m.away);
    if(winners.length===1) { await leagueRef.update({playoffs:{...po,matches},status:"complete",champion:winners[0],updatedAt:new Date().toISOString()}); return; }
    await leagueRef.update({playoffs:{round:2,qualified:po.qualified,matches:[{id:"grandfinal",home:winners[0],away:winners[1],homeScore:null,awayScore:null,status:"scheduled"}]},status:"playoffs",updatedAt:new Date().toISOString()});
  }
  function teamName(league,id){return league.teams?.[id]?.name || "Unknown team";}
  function renderLeague(league) {
    const view=$("mpLeagueView"); if(!view)return;
    const teams=Object.values(league.teams||{}), table=scoreRows(league);
    let html='<div class="decision"><b>'+esc(league.name)+'</b><p class="note">Invite code: <strong>'+esc(league.code)+'</strong> · '+teams.length+' teams · '+esc(league.status)+'</p><button class="sm" id="mpCopyCode">Copy invite code</button> <button class="sm" id="mpStartSeason">Start / reset season</button> <button class="sm" id="mpPublish">Update my team</button></div>';
    html+='<h2>League standings</h2><div class="tw"><table><thead><tr><th>#</th><th>Organisation</th><th>P</th><th>W</th><th>L</th><th>Pts</th><th>+/-</th></tr></thead><tbody>';
    table.forEach((t,i)=>html+='<tr'+(t.uid===uid?' class="me"':'')+'><td>'+(i+1)+'</td><td>'+esc(t.name)+' <span class="note">['+esc(t.tag)+']</span></td><td>'+t.played+'</td><td>'+t.wins+'</td><td>'+t.losses+'</td><td><b>'+t.points+'</b></td><td>'+(t.for-t.against)+'</td></tr>');
    html+='</tbody></table></div>';
    if(!league.fixtures?.length) html+='<p class="note">Start the season when everyone has joined. The game generates a round-robin schedule.</p>';
    else {
      html+='<h2 style="margin-top:12px">Season fixtures</h2><div class="tw"><table><thead><tr><th>Round</th><th>Match</th><th>Score / action</th></tr></thead><tbody>';
      league.fixtures.forEach(f=>{
        const match=esc(teamName(league,f.home))+' vs '+esc(teamName(league,f.away));
        let score=f.status==="played"?f.homeScore+" - "+f.awayScore:"Scheduled";
        if(uid===league.owner&&f.status!=="played") score='<input id="hs_'+f.id+'" type="number" min="0" max="99" value="13" style="width:48px"> - <input id="as_'+f.id+'" type="number" min="0" max="99" value="9" style="width:48px"> <button class="sm" data-result="'+f.id+'">Record</button>';
        html+='<tr><td>'+f.round+'</td><td>'+match+'</td><td>'+score+'</td></tr>';
      });
      html+='</tbody></table></div>';
      if(league.status==="regular"&&uid===league.owner)html+='<button class="pri" id="mpPlayoffs">Generate top-four playoffs</button>';
    }
    if(league.playoffs) {
      html+='<h2 style="margin-top:12px">🏆 Playoffs</h2><div class="tw"><table><thead><tr><th>Match</th><th>Score / action</th></tr></thead><tbody>';
      league.playoffs.matches.forEach(m=>{
        let sc=m.status==="played"?m.homeScore+" - "+m.awayScore:"Scheduled";
        if(uid===league.owner&&m.status!=="played")sc='<input id="phs_'+m.id+'" type="number" min="0" max="99" value="13" style="width:48px"> - <input id="pas_'+m.id+'" type="number" min="0" max="99" value="9" style="width:48px"> <button class="sm" data-playoff="'+m.id+'">Record</button>';
        html+='<tr><td>'+esc(teamName(league,m.home))+' vs '+esc(teamName(league,m.away))+'</td><td>'+sc+'</td></tr>';
      });
      html+='</tbody></table></div>';
    }
    if(league.champion) html+='<div class="decision"><h2>🏆 Season champion</h2><div style="font-size:24px;font-weight:800">'+esc(teamName(league,league.champion))+'</div><p class="note">Congratulations to the champion of '+esc(league.name)+'!</p></div>';
    html+='<p class="note">Shared data syncs live across connected browsers. In this initial online league layer, the league creator records official scores; players still manage their local careers independently.</p>';
    view.innerHTML=html;
    $("mpCopyCode").onclick=()=>navigator.clipboard?.writeText(league.code).then(()=>setStatus("Invite code copied.")).catch(()=>setStatus("Your invite code is "+league.code));
    $("mpStartSeason").onclick=()=>startSeason(league).catch(e=>setStatus(e.message));
    $("mpPublish").onclick=publishTeam;
    view.querySelectorAll("[data-result]").forEach(b=>b.onclick=()=>{
      const id=b.dataset.result,hs=Number($("hs_"+id)?.value),as=Number($("as_"+id)?.value);
      if(!Number.isInteger(hs)||!Number.isInteger(as)||hs<0||as<0||hs===as){setStatus("Enter non-negative integer scores. Draws are allowed only in the regular season.");return}
      recordResult(id,hs,as,league).catch(e=>setStatus(e.message));
    });
    view.querySelectorAll("[data-playoff]").forEach(b=>b.onclick=()=>{
      const id=b.dataset.playoff,hs=Number($("phs_"+id)?.value),as=Number($("pas_"+id)?.value);
      if(!Number.isInteger(hs)||!Number.isInteger(as)||hs<0||as<0||hs===as){setStatus("Playoff matches need a non-tied score.");return}
      playoffResult(id,hs,as,league).catch(e=>setStatus(e.message));
    });
    if($("mpPlayoffs")) $("mpPlayoffs").onclick=()=>makePlayoffs(league).catch(e=>setStatus(e.message));
  }
  function fixNamePersistence() {
    // Save organisation identity immediately on input, not only after leaving the editor.
    document.addEventListener("change", e => {
      if (!["orgNameInput","orgTagInput","editOrgName","editOrgTag"].includes(e.target?.id)) return;
      try {
        if (typeof S !== "undefined" && S?.me) {
          if (e.target.id.includes("Name")) S.me.name = e.target.value.trim().slice(0,32) || "Your Org";
          if (e.target.id.includes("Tag")) S.me.tag = e.target.value.trim().toUpperCase().slice(0,5) || "ORG";
          if (typeof scheduleAutosave === "function") scheduleAutosave();
        }
        const saved = JSON.parse(localStorage.getItem("esm195OrgDraft") || "{}");
        if (e.target.id.includes("Name")) saved.name = e.target.value.trim().slice(0,32);
        if (e.target.id.includes("Tag")) saved.tag = e.target.value.trim().toUpperCase().slice(0,5);
        localStorage.setItem("esm195OrgDraft", JSON.stringify(saved));
      } catch (_) {}
    });
    // Recover the last draft on the new-career form if it was left partially filled.
    document.addEventListener("focusout", e => {
      if (e.target?.id !== "orgNameInput") return;
      try { const d=JSON.parse(localStorage.getItem("esm195OrgDraft")||"{}"); d.name=e.target.value.trim().slice(0,32); localStorage.setItem("esm195OrgDraft",JSON.stringify(d)); } catch (_) {}
    });
  }
  function init() {
    ensurePanel();
    fixNamePersistence();
    const originalShowTab = window.showTab;
    if (typeof originalShowTab === "function") {
      window.showTab = function(tab) { const result=originalShowTab.apply(this,arguments); if(tab==="empire") ensurePanel(); return result; };
    }
    // Expand the existing tutorial with a practical first-match checklist and distinct game-specific decision layers.
    const originalShowMenuPage = window.showMenuPage;
    if (typeof originalShowMenuPage === "function") {
      window.showMenuPage = function(page) {
        const result = originalShowMenuPage.apply(this, arguments);
        if (page === "guide") {
          const host = document.getElementById("menuContent");
          if (host && !document.getElementById("guide195")) {
            const section = document.createElement("div");
            section.id = "guide195";
            section.innerHTML = '<div class="decision"><b>Update 19.5 · Your first match-week checklist</b><ol><li>Check starter roles, contracts and weekly wages.</li><li>Choose training that targets your weakest team stat.</li><li>Scout the opponent, practise the selected map or game mode, and review your strategy.</li><li>Play the match, read the report, then adjust your roster or tactics before the next fixture.</li><li>Check finances before signing players, staff or expanding into another division.</li></ol><p class="note">Tip: do not spend all your cash on one star. A balanced roster, affordable wages and reliable preparation are usually safer over a full season.</p></div><h2>GAME-SPECIFIC STRATEGY</h2><div class="steps"><div class="step"><i>CS</i><b>Counter-Strike 2</b><span>Track round economy, save decisions, map vetoes, starting sides, utility and bomb-site control. A lost round can still be a good buy decision if it protects the next round.</span></div><div class="step"><i>V</i><b>VALORANT</b><span>Balance Duelist, Initiator, Controller and Sentinel roles. Coordinate entry utility, site executes, retakes and ultimate economy instead of judging the roster by aim alone.</span></div><div class="step"><i>OW</i><b>Overwatch</b><span>Build a Tank, Damage and Support composition around the objective. Track ultimate charge, counter-picks, team engagement timing and when to regroup rather than stagger.</span></div><div class="step"><i>LoL</i><b>League of Legends</b><span>Balance lane matchups and jungle pathing with vision, waves and objective setup. Dragons, Baron, towers and gold leads create different win conditions as the game progresses.</span></div><div class="step"><i>RL</i><b>Rocket League</b><span>Balance striker, playmaker, defender and goalkeeper strengths. Rotations, boost management, recoveries, shots and saves matter alongside raw player rating.</span></div></div><p class="note">Online friend leagues are available in the Empire tab. The league creator starts the season and records official results; standings and playoffs sync live for connected players.</p>';
            host.appendChild(section);
          }
        }
        return result;
      };
    }
    // Keep identity edits durable even when the player navigates away quickly.
    const originalSaveOrgIdentity = window.saveOrgIdentity;
    if (typeof originalSaveOrgIdentity === "function") {
      window.saveOrgIdentity = function() {
        const result = originalSaveOrgIdentity.apply(this, arguments);
        try { localStorage.setItem("esm195OrgDraft", JSON.stringify({name:S?.me?.name||"Your Org",tag:S?.me?.tag||"ORG"})); if (typeof scheduleAutosave === "function") scheduleAutosave(); } catch (_) {}
        return result;
      };
    }
    const originalCreateOrganization = window.createOrganization;
    if (typeof originalCreateOrganization === "function") {
      window.createOrganization = function() {
        try { localStorage.setItem("esm195OrgDraft", JSON.stringify({name:document.getElementById("orgNameInput")?.value||"Your Org",tag:document.getElementById("orgTagInput")?.value||"ORG"})); } catch (_) {}
        return originalCreateOrganization.apply(this, arguments);
      };
    }
    // Recreate panel if the game's dynamic UI re-renders.
    const target=document.querySelector(".wrap");
    if(target && window.MutationObserver) new MutationObserver(()=>{if(!$("multiplayer195"))ensurePanel()}).observe(target,{childList:true,subtree:true});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init); else init();
})();