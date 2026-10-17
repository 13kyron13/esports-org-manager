/* Esports Manager Update 19.5 — shared online league layer.
   The game host configures Firebase once in multiplayer-config.js; players only create or join rooms. */
(() => {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  let db = null, auth = null, uid = null, activeLeague = null, leagueRef = null, unsubscribe = null;
  let lastLeagueSnapshot = null, replayTimer = null;
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
    card.innerHTML = '<h2>🌍 Multiplayer League · Update 19.5</h2><p class="note">Create a room and invite friends using its code. The online service is configured once for the game; players do not need their own Firebase settings. Your existing single-player careers remain local and unchanged.</p><div id="mpStatus" class="note">Not connected to an online league.</div><div id="mpConfigArea"></div><div id="mpLeagueArea"></div>';
    host.prepend(card);
    renderConfig();
  }
  function renderConfig() {
    const area = $("mpConfigArea"); if (!area) return;
    area.innerHTML = '<p class="note">Online rooms are ready to use once the game host has configured the shared online service. You do not need your own Firebase project.</p><button class="pri" id="mpConnect">Connect online</button> <button id="mpDisconnect">Disconnect</button>';
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
    const config = window.ESM195_FIREBASE_CONFIG || {};
    const required = ["apiKey","authDomain","databaseURL","projectId","appId"];
    if (required.some(k => !String(config[k] || "").trim() || String(config[k]).startsWith("PASTE_"))) {
      setStatus("The shared online service has not been configured by the game host yet. Players do not need their own Firebase settings.");
      renderLeagueActions();
      return;
    }
    try {
      setStatus("Connecting online…");
      await loadScript("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
      await loadScript("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js");
      await loadScript("https://www.gstatic.com/firebasejs/10.14.1/firebase-database-compat.js");
      const appName = "esm195";
      let app = firebase.apps.find(a => a.name === appName);
      if (!app) app = firebase.initializeApp(config, appName);
      auth = app.auth(); db = app.database();
      await auth.signInAnonymously(); uid = auth.currentUser.uid;
      setStatus("Connected online. Create a room or join a friend's room with a code.");
      renderLeagueActions();
    } catch (e) {
      setStatus("Could not connect: " + (e?.message || "the shared online service may not be configured yet."));
    }
  }
  function renderLeagueActions() {
    const area = $("mpLeagueArea"); if (!area) return;
    if (!db || !uid) {
      area.innerHTML = '<p class="note">Connect online to create or join a room. If the shared online service is not configured yet, the game host needs to finish the one-time setup.</p>'; return;
    }
    area.innerHTML = '<div class="menu-form-grid"><label>League name<input id="mpLeagueName" maxlength="48" placeholder="Friday Night League"></label><label>League code<input id="mpLeagueCode" maxlength="12" placeholder="Enter friend\'s code"></label></div><button class="pri" id="mpCreate">Create league</button><button id="mpJoin">Join league</button><button id="mpRefresh">Publish / refresh my team</button><div id="mpLeagueView"></div>';
    $("mpCreate").onclick = createLeague;
    $("mpJoin").onclick = joinLeague;
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
      if(league.fixtures?.length) { setStatus("This season has already been prepared. Ask the host to reset it before new teams join."); return; }
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
      lastLeagueSnapshot=league;
      if(uid===league.owner&&league.roundReplay?.status==="live"&&Date.now()>=Number(league.roundReplay.startedAt)+Number(league.roundReplay.durationMs||12000)) finalizeExpiredRound(league).catch(e=>setStatus(e.message));
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
    if(uid!==league.owner) { setStatus("Only the league creator can start or reset the season."); return; }
    const teams=Object.values(league.teams||{});
    if(teams.length<2) { setStatus("Invite at least one friend before starting the season."); return; }
    if(league.fixtures?.some(f=>f.status==="live")) { setStatus("Finish the live round before resetting the season."); return; }
    const fixtures=makeSchedule(teams);
    await leagueRef.update({fixtures,status:"regular",playoffs:null,champion:null,roundReplay:null,seasonNumber:(Number(league.seasonNumber)||0)+1,updatedAt:new Date().toISOString()});
    setStatus("Season ready: "+fixtures.length+" fixtures across "+Math.max(0,...fixtures.map(f=>f.round))+" shared rounds. Start Round 1 when everyone is ready.");
  }
  function stableHash(value) {
    let h=2166136261;
    for(let i=0;i<value.length;i++){h^=value.charCodeAt(i);h=Math.imul(h,16777619);}
    return h>>>0;
  }
  function simulatedResult(f, league) {
    const home=league.teams?.[f.home]||{}, away=league.teams?.[f.away]||{};
    const hr=Number(home.rating)||50, ar=Number(away.rating)||50;
    const seed=stableHash(String(league.code)+":"+(league.seasonNumber||1)+":"+f.id);
    const roll=(seed%10000)/10000;
    const pHome=1/(1+Math.exp(-(hr-ar)/12));
    const homeWins=roll<pHome;
    const winnerRating=homeWins?hr:ar, loserRating=homeWins?ar:hr;
    const noise=((stableHash("score:"+seed)%10000)/10000-.5)*7;
    const loserScore=Math.max(0,Math.min(12,Math.round(6+(loserRating-winnerRating)*.12+noise)));
    const homeScore=homeWins?13:loserScore, awayScore=homeWins?loserScore:13;
    return {fixtureId:f.id,homeScore,awayScore,highlights:[
      "Pistol round: both teams establish their pace",
      "Mid-game swing: economy and utility decide the next fights",
      "Match point: the trailing side tries to force a comeback",
      (homeWins?home.name:away.name)+" closes it out"
    ]};
  }
  async function advanceRound(league) {
    if(!db||!leagueRef||!activeLeague) return;
    if(uid!==league.owner) { setStatus("The league host starts each shared round so every player gets the same results."); return; }
    const now=Date.now();
    const tx=await leagueRef.transaction(current=>{
      if(!current || current.status==="complete") return;
      const live=current.roundReplay;
      if(live?.status==="live") {
        if(now < Number(live.startedAt)+Number(live.durationMs||12000)) return;
        const results=live.results||[];
        current.fixtures=(current.fixtures||[]).map(f=>{
          const r=results.find(x=>x.fixtureId===f.id);
          if(!r||f.status!=="live")return f;
          const next={...f,homeScore:r.homeScore,awayScore:r.awayScore,status:"played",playedAt:new Date().toISOString()};
          delete next.liveHomeScore; delete next.liveAwayScore;
          return next;
        });
        current.roundReplay={...live,status:"complete",completedAt:new Date().toISOString()};
        current.updatedAt=new Date().toISOString();
        return current;
      }
      const pending=(current.fixtures||[]).filter(f=>f.status==="scheduled");
      if(!pending.length) return;
      const round=Math.min(...pending.map(f=>Number(f.round)||1));
      const roundFixtures=pending.filter(f=>Number(f.round)===round);
      const startedAt=Date.now(), durationMs=12000;
      const results=roundFixtures.map(f=>simulatedResult(f,current));
      const byId=Object.fromEntries(results.map(r=>[r.fixtureId,r]));
      current.fixtures=(current.fixtures||[]).map(f=>{
        const r=byId[f.id]; return r?{...f,status:"live",liveHomeScore:r.homeScore,liveAwayScore:r.awayScore,liveStartedAt:startedAt}:f;
      });
      current.roundReplay={round,startedAt,durationMs,status:"live",results};
      current.status="regular"; current.updatedAt=new Date().toISOString();
      return current;
    },undefined,false);
    if(!tx.committed) { setStatus("That round could not start yet. A live round may already be running, or the season may be finished."); return; }
    const updated=tx.snapshot.val();
    if(updated?.roundReplay?.status==="complete") {
      if(!(updated.fixtures||[]).some(f=>f.status==="scheduled")) {
        const table=scoreRows(updated);
        await leagueRef.update({status:"complete",champion:table[0]?.uid||null,updatedAt:new Date().toISOString()});
        setStatus("Season complete! "+(table[0]?.name||"The winner")+" wins the league.");
      } else setStatus("Round "+updated.roundReplay.round+" finalised. Start the next round when ready.");
    } else setStatus("Round "+updated?.roundReplay?.round+" is live for everyone!");
  }
  async function finalizeExpiredRound(league) {
    if(uid!==league.owner||!leagueRef||league.roundReplay?.status!=="live")return;
    if(Date.now()<Number(league.roundReplay.startedAt)+Number(league.roundReplay.durationMs||12000))return;
    const now=Date.now();
    const tx=await leagueRef.transaction(current=>{
      const live=current?.roundReplay;
      if(!current||live?.status!=="live"||now<Number(live.startedAt)+Number(live.durationMs||12000))return;
      const results=live.results||[];
      current.fixtures=(current.fixtures||[]).map(f=>{
        const r=results.find(x=>x.fixtureId===f.id);
        if(!r||f.status!=="live")return f;
        const next={...f,homeScore:r.homeScore,awayScore:r.awayScore,status:"played",playedAt:new Date().toISOString()};
        delete next.liveHomeScore; delete next.liveAwayScore;
        return next;
      });
      current.roundReplay={...live,status:"complete",completedAt:new Date().toISOString()};
      current.updatedAt=new Date().toISOString();
      return current;
    },undefined,false);
    if(!tx.committed)return;
    const updated=tx.snapshot.val();
    if(!(updated.fixtures||[]).some(f=>f.status==="scheduled")) {
      const table=scoreRows(updated);
      await leagueRef.update({status:"complete",champion:table[0]?.uid||null,updatedAt:new Date().toISOString()});
      setStatus("Season complete! "+(table[0]?.name||"The winner")+" wins the league.");
    } else {
      setStatus("Round "+updated.roundReplay.round+" is complete. Start the next round when ready.");
    }
  }
  function scoreDuringReplay(finalScore, progress, winner) {
    if(progress>=1)return finalScore;
    const max=winner?12:finalScore;
    return Math.min(max,Math.floor(finalScore*Math.max(0,progress)));
  }
  function updateReplayUI(league) {
    const area=$("mpLiveReplay"); if(!area)return;
    const replay=league?.roundReplay;
    if(!replay||replay.status!=="live") {
      area.innerHTML="";
      const button=$("mpAdvanceRound");
      if(button) {
        const next=(league?.fixtures||[]).filter(f=>f.status==="scheduled");
        button.disabled=uid!==league?.owner||!next.length||league?.status==="complete";
        button.textContent=next.length?"▶ Play next round automatically":"Season complete";
      }
      return;
    }
    const duration=Math.max(1000,Number(replay.durationMs)||12000);
    const progress=Math.max(0,Math.min(1,(Date.now()-Number(replay.startedAt))/duration));
    const percent=Math.round(progress*100);
    const moments=["Pistol round","First full-buy round","Mid-series swing","Match point"];
    const momentIndex=Math.min(moments.length-1,Math.floor(progress*moments.length));
    let html='<div class="decision"><b>🔴 Round '+replay.round+' is live for everyone</b><p class="note">Every fixture in this round started from the same shared timestamp. Auto-play is showing the important moments only.</p><div class="bar" style="height:8px"><i style="width:'+percent+'%"></i></div><p class="note">'+percent+'% · '+esc(moments[momentIndex])+'</p><div class="tw"><table><thead><tr><th>Match</th><th>Live score</th><th>Moment</th></tr></thead><tbody>';
    (replay.results||[]).forEach(r=>{
      const f=(league.fixtures||[]).find(x=>x.id===r.fixtureId);
      if(!f)return;
      const home=league.teams?.[f.home]||{}, away=league.teams?.[f.away]||{};
      const homeWon=r.homeScore>r.awayScore;
      const hs=scoreDuringReplay(r.homeScore,progress,homeWon), as=scoreDuringReplay(r.awayScore,progress,!homeWon);
      const moment=(r.highlights||[])[Math.min((r.highlights||[]).length-1,Math.floor(progress*4))]||"Round in progress";
      html+='<tr><td>'+esc(home.name||"Home")+' vs '+esc(away.name||"Away")+'</td><td><b>'+hs+' – '+as+'</b></td><td>'+esc(moment)+'</td></tr>';
    });
    html+='</tbody></table></div></div>';
    area.innerHTML=html;
    (replay.results||[]).forEach(r=>{
      const f=(league.fixtures||[]).find(x=>x.id===r.fixtureId);
      const cell=document.querySelector('[data-live-fixture="'+r.fixtureId+'"]');
      if(!f||!cell)return;
      const homeWon=r.homeScore>r.awayScore;
      cell.textContent=scoreDuringReplay(r.homeScore,progress,homeWon)+' – '+scoreDuringReplay(r.awayScore,progress,!homeWon)+' · LIVE';
    });
    const button=$("mpAdvanceRound");
    if(button){button.disabled=true;button.textContent=progress>=1?"Finalising round…":"Round "+replay.round+" live…";}
    if(progress>=1) finalizeExpiredRound(league).catch(e=>setStatus("Could not finalise round: "+e.message));
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
    const owner=uid===league.owner;
    const pending=(league.fixtures||[]).filter(f=>f.status==="scheduled");
    const nextRound=pending.length?Math.min(...pending.map(f=>Number(f.round)||1)):null;
    let html='<div class="decision"><b>'+esc(league.name)+'</b><p class="note">Invite code: <strong>'+esc(league.code)+'</strong> · '+teams.length+' teams · Season '+(Number(league.seasonNumber)||0)+' · '+esc(league.status)+'</p><button class="sm" id="mpCopyCode">Copy invite code</button> <button class="sm" id="mpStartSeason">'+(league.fixtures?.length?'Reset season':'Prepare season')+'</button> <button class="sm" id="mpPublish">Update my team</button></div>';
    html+='<h2>League standings</h2><div class="tw"><table><thead><tr><th>#</th><th>Organisation</th><th>P</th><th>W</th><th>L</th><th>Pts</th><th>+/-</th></tr></thead><tbody>';
    table.forEach((t,i)=>html+='<tr'+(t.uid===uid?' class="me"':'')+'><td>'+(i+1)+'</td><td>'+esc(t.name)+' <span class="note">['+esc(t.tag)+']</span></td><td>'+t.played+'</td><td>'+t.wins+'</td><td>'+t.losses+'</td><td><b>'+t.points+'</b></td><td>'+(t.for-t.against)+'</td></tr>');
    html+='</tbody></table></div><div id="mpLiveReplay"></div>';
    if(!league.fixtures?.length) html+='<p class="note">Everyone should join before the host prepares the season. Each round will auto-play simultaneously across the league.</p>';
    else {
      html+='<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-top:12px"><h2 style="margin:0">Shared season schedule</h2><span class="note">'+(pending.length?pending.length+' fixtures remaining':'All fixtures played')+'</span></div>';
      if(owner) html+='<button class="pri" id="mpAdvanceRound" '+(!pending.length||league.roundReplay?.status==="live"?'disabled':'')+'>'+ (league.roundReplay?.status==="live"?'Round '+league.roundReplay.round+' live…':pending.length?'▶ Play next round automatically':'Season complete')+'</button>';
      else html+='<p class="note">The host starts each round. All matches in a round auto-play together and every player receives the same official scores.</p>';
      html+='<div class="tw"><table><thead><tr><th>Round</th><th>Match</th><th>Score / status</th></tr></thead><tbody>';
      league.fixtures.forEach(f=>{
        const match=esc(teamName(league,f.home))+' vs '+esc(teamName(league,f.away));
        let score='Scheduled';
        if(f.status==="played") score=f.homeScore+' – '+f.awayScore;
        else if(f.status==="live") score='<span data-live-fixture="'+esc(f.id)+'">🔴 LIVE</span>';
        html+='<tr><td>'+f.round+'</td><td>'+match+'</td><td>'+score+'</td></tr>';
      });
      html+='</tbody></table></div>';
    }
    if(league.champion) html+='<div class="decision"><h2>🏆 Season champion</h2><div style="font-size:24px;font-weight:800">'+esc(teamName(league,league.champion))+'</div><p class="note">The shared season has finished. Every connected player sees the same final standings.</p></div>';
    html+='<p class="note">Match outcomes are generated once by the host and stored in the shared league. Results are not independently rolled by each browser, so scores cannot contradict each other.</p>';
    view.innerHTML=html;
    $("mpCopyCode").onclick=()=>navigator.clipboard?.writeText(league.code).then(()=>setStatus("Invite code copied.")).catch(()=>setStatus("Your invite code is "+league.code));
    $("mpStartSeason").onclick=()=>{
      if(league.fixtures?.length&&!confirm("Reset the shared season and clear its results for everyone?"))return;
      startSeason(league).catch(e=>setStatus(e.message));
    };
    $("mpPublish").onclick=publishTeam;
    if($("mpAdvanceRound")) $("mpAdvanceRound").onclick=()=>advanceRound(league).catch(e=>setStatus("Could not start round: "+e.message));
    updateReplayUI(league);
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
  function ensureMenuEntry() {
    const actions=document.querySelector("#menuContent .menu-actions");
    if(!actions||$("mpMenuAction"))return;
    const button=document.createElement("button");
    button.className="menu-action"; button.id="mpMenuAction";
    button.innerHTML="<strong>🌐 Load Multiplayer</strong><span>Join a friends league and play a shared auto-simulated season</span>";
    button.onclick=openMultiplayerMenu;
    actions.appendChild(button);
  }
  function openMultiplayerMenu() {
    const overlay=$("menuOverlay");
    if(overlay)overlay.style.display="none";
    if(typeof window.showTab==="function")window.showTab("empire");
    ensurePanel();
    const panel=$("multiplayer195");
    if(panel)panel.scrollIntoView({behavior:"smooth",block:"start"});
  }
  window.openMultiplayerMenu=openMultiplayerMenu;
  function init() {
    ensurePanel();
    ensureMenuEntry();
    if(!replayTimer) replayTimer=setInterval(()=>{if(lastLeagueSnapshot)updateReplayUI(lastLeagueSnapshot);},500);
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
        ensureMenuEntry();
        if (page === "guide") {
          const host = document.getElementById("menuContent");
          if (host && !document.getElementById("guide195")) {
            const section = document.createElement("div");
            section.id = "guide195";
            section.innerHTML = '<div class="decision"><b>Update 19.5 · Your first match-week checklist</b><ol><li>Check starter roles, contracts and weekly wages.</li><li>Choose training that targets your weakest team stat.</li><li>Scout the opponent, practise the selected map or game mode, and review your strategy.</li><li>Play the match, read the report, then adjust your roster or tactics before the next fixture.</li><li>Check finances before signing players, staff or expanding into another division.</li></ol><p class="note">Tip: do not spend all your cash on one star. A balanced roster, affordable wages and reliable preparation are usually safer over a full season.</p></div><h2>GAME-SPECIFIC STRATEGY</h2><div class="steps"><div class="step"><i>CS</i><b>Counter-Strike 2</b><span>Track round economy, save decisions, map vetoes, starting sides, utility and bomb-site control. A lost round can still be a good buy decision if it protects the next round.</span></div><div class="step"><i>V</i><b>VALORANT</b><span>Balance Duelist, Initiator, Controller and Sentinel roles. Coordinate entry utility, site executes, retakes and ultimate economy instead of judging the roster by aim alone.</span></div><div class="step"><i>OW</i><b>Overwatch</b><span>Build a Tank, Damage and Support composition around the objective. Track ultimate charge, counter-picks, team engagement timing and when to regroup rather than stagger.</span></div><div class="step"><i>LoL</i><b>League of Legends</b><span>Balance lane matchups and jungle pathing with vision, waves and objective setup. Dragons, Baron, towers and gold leads create different win conditions as the game progresses.</span></div><div class="step"><i>RL</i><b>Rocket League</b><span>Balance striker, playmaker, defender and goalkeeper strengths. Rotations, boost management, recoveries, shots and saves matter alongside raw player rating.</span></div></div><p class="note">Load Multiplayer from the main menu. Friends join the same league, then the host starts each shared round. Matches auto-play together and the same final scores and standings sync to everyone.</p>';
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

/* Multiplayer career mode: friends replace AI teams inside the ordinary career hub. */
(() => {
 const $=id=>document.getElementById(id), esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 let app=null,auth=null,db=null,uid=null,roomCode=null,roomRef=null,room=null,off=null,mpCareer=false,aiBackup=null,lastReplay="",syncTimer=null,tickTimer=null,writing=false,restarting=false;
 const ROOM_KEY="esm195_multiplayer_room", AI_NAMES=["Aurora Esports","Titan Forge","Nova Core","Vortex Gaming","Redline","Nightfall","Quantum Five","Iron Wolves"];
 const game=()=>S?.gameTitle||selectedGame||"CS2", stat=t=>{let e=$("mpMenuStatus")||$("mpCareerStatus");if(e)e.textContent=t};
 function addButton(){const old=$("mpMenuAction");if(old)old.remove();const a=document.querySelector("#menuContent .menu-actions");if(!a||$("mpHomeButton"))return;const b=document.createElement("button");b.id="mpHomeButton";b.className="menu-action";b.innerHTML="<strong>🌐 Multiplayer Career</strong><span>Create or join a room before creating your organisation</span>";b.onclick=()=>showMenuPage("multiplayer");a.appendChild(b)}
 function menu(){const h=$("menuContent");if(!h)return;h.innerHTML='<h2>🌐 MULTIPLAYER CAREER</h2><p class="note">Join a room before creating your organisation. The career hub, roster management, contracts, training and finances stay the same as single-player. Friends replace AI teams in the eight-team league.</p><div id="mpMenuStatus" class="note">Connect to the shared online service.</div><div id="mpMenuControls"></div><button data-page="home" onclick="showMenuPage(this.dataset.page)">← Main menu</button>';menuControls()}
 function menuControls(){const a=$("mpMenuControls");if(!a)return;if(!db||!uid){a.innerHTML='<button class="pri" id="mpConnect">Connect online</button>';$("mpConnect").onclick=connect;return}a.innerHTML='<div class="menu-form-grid"><label>Room name<input id="mpRoomName" maxlength="40" placeholder="Friday Night League"></label><label>Room code<input id="mpRoomCode" maxlength="6" placeholder="ABC123"></label></div><button class="pri" id="mpCreate">Create room</button> <button id="mpJoin">Join room</button><p class="note">Everyone joins, creates an organisation, and the host starts the season when all teams are ready. Each match week gives players 30 seconds to manage before every match autoplays round by round.</p>';$("mpCreate").onclick=createRoom;$("mpJoin").onclick=joinRoom;$("mpRoomCode").oninput=e=>e.target.value=e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,6)}
 function loadScript(src){return new Promise((ok,no)=>{if(document.querySelector('script[data-fb="'+src+'"]'))return ok();const s=document.createElement("script");s.src=src;s.dataset.fb=src;s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
 async function connect(){const c=window.ESM195_FIREBASE_CONFIG||{};if(["apiKey","authDomain","databaseURL","projectId","appId"].some(k=>!c[k]||String(c[k]).startsWith("PASTE_"))){stat("The shared online service is not configured.");return}try{stat("Connecting…");await loadScript("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");await loadScript("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js");await loadScript("https://www.gstatic.com/firebasejs/10.14.1/firebase-database-compat.js");app=window.firebase.apps.find(x=>x.name==="esm-mp-career")||window.firebase.initializeApp(c,"esm-mp-career");auth=app.auth();db=app.database();await auth.signInAnonymously();uid=auth.currentUser.uid;menuControls();stat("Connected. Create a room or enter your friend's code.")}catch(e){stat("Connection failed: "+e.message)}}
 function code(){return Math.random().toString(36).slice(2,8).toUpperCase()}
 async function createRoom(){if(!db||!uid)return;const c=code(),r={code:c,name:$("mpRoomName")?.value.trim()||"Friends League",owner:uid,createdAt:Date.now(),phase:"lobby",game:null,teams:{[uid]:{uid,name:"Organisation not created yet",ready:false,joinedAt:Date.now()}},seasonNumber:1,week:0,seasonTeams:null,fixtures:null,standings:null,weekReadyAt:null,replay:null,lastReplay:null,champion:null};try{await db.ref("leagues/"+c).set(r);roomCode=c;localStorage.setItem(ROOM_KEY,c);listen(c);showMenuPage("games")}catch(e){stat("Could not create room: "+e.message)}}
 async function joinRoom(){if(!db||!uid)return;const c=($("mpRoomCode")?.value||"").trim().toUpperCase();if(!/^[A-Z0-9]{6}$/.test(c)){stat("Enter the six-character room code.");return}try{const ref=db.ref("leagues/"+c),s=await ref.once("value");if(!s.exists()){stat("Room not found.");return}const r=s.val();if(r.phase!=="lobby"){stat("This season has already started.");return}if(!r.teams?.[uid]&&Object.keys(r.teams||{}).length>=8){stat("The room already has eight teams.");return}await ref.child("teams/"+uid).update({uid,name:"Organisation not created yet",ready:false,joinedAt:Date.now()});roomCode=c;localStorage.setItem(ROOM_KEY,c);listen(c);showMenuPage("games")}catch(e){stat("Could not join room: "+e.message)}}
 function listen(c){if(off)off();roomCode=c;roomRef=db.ref("leagues/"+c);const handler=s=>{room=s.val();if(!room)return;if(mpCareer){syncLocal();banner();if(typeof render==="function")render();if(uid===room.owner&&room.phase==="complete")restartSeasonIfReady().catch(e=>stat(e.message))}else if($("mpMenuStatus"))$("mpMenuStatus").textContent="Room "+c+" · "+Object.values(room.teams||{}).filter(t=>t.ready).length+" organisation(s) ready."};roomRef.on("value",handler,e=>stat("Room sync failed: "+e.message));off=()=>roomRef.off("value",handler)}
 function chooseGame(g){if(!room)return true;if(room.game&&room.game!==g){alert("This room is playing "+room.game+". All teams must use the same esport.");selectStartingGame(room.game);return false}if(uid===room.owner&&!room.game)roomRef.update({game:g});return true}
 function snapshot(){let p=50;try{p=Math.round(power(S.roster))}catch(_){}return{uid,name:S.me?.name||"My Organisation",tag:S.me?.tag||"ORG",logo:S.me?.logo||"⚡",game:game(),rating:p,power:p,roster:(S.roster||[]).map(x=>({name:x.name,role:x.role,rating:Math.round(((+x.aim||50)+(+x.gs||50)+(+x.men||50))/3)})).slice(0,12),ready:!!room?.teams?.[uid]?.ready,updatedAt:Date.now()}}
 async function publish(){if(!mpCareer||!roomRef||writing)return;const t=snapshot(),sig=JSON.stringify([t.name,t.tag,t.game,t.rating,t.roster]);if(publish.sig===sig)return;publish.sig=sig;writing=true;try{await roomRef.child("teams/"+uid).update({...t,joinedAt:room?.teams?.[uid]?.joinedAt||Date.now()})}catch(e){stat("Team sync failed: "+e.message)}finally{writing=false}}
 async function orgReady(){if(!roomRef||!room)return;mpCareer=true;aiBackup=(S.ai||[]).slice();if(!room.game&&uid===room.owner)await roomRef.update({game:game()});banner();await publish();if(!syncTimer)syncTimer=setInterval(publish,2500);if(!tickTimer)tickTimer=setInterval(tick,250)}
 function fixtures(teams){const ids=teams.map(t=>t.id),a=ids.slice();if(a.length%2)a.push(null);const out=[],n=a.length;for(let r=0;r<n-1;r++){const row=[];for(let i=0;i<n/2;i++){const x=a[i],y=a[n-1-i];if(x&&y)row.push({id:"w"+(r+1)+"m"+(i+1),week:r,round:r+1,a:x,b:y})}out.push(row);const first=a[0],rest=a.slice(1);rest.unshift(rest.pop());a.splice(0,a.length,first,...rest)}return out}
 async function launch(){if(uid!==room.owner)return;const humans=Object.values(room.teams||{}).filter(t=>t.ready);if(humans.length<2||humans.length!==Object.keys(room.teams||{}).length){stat("At least two players are required, and everyone must create an organisation first.");return}if(humans.some(t=>t.game!==room.game)){stat("Every team must use "+room.game+".");return}const teams=humans.map(t=>({id:t.uid,uid:t.uid,name:t.name,tag:t.tag||"",rating:+(t.rating||t.power)||50,power:+(t.rating||t.power)||50,human:true,game:t.game,logo:t.logo||"⚡"}));for(let i=0;i<8-teams.length;i++){const t=(aiBackup||S.ai||[])[i]||{};teams.push({id:"ai:"+i,name:t.name||AI_NAMES[i],rating:+t.power||50,power:+t.power||50,human:false,game:room.game,logo:"🤖"})}const standings={};teams.forEach(t=>standings[t.id]={id:t.id,w:0,l:0,pts:0,rf:0,ra:0});await roomRef.update({phase:"management",seasonNumber:room.seasonNumber||1,week:0,seasonTeams:teams,fixtures:fixtures(teams),standings,weekReadyAt:Date.now()+30000,replay:null,lastReplay:null,champion:null})}
 function rng(seed){let x=2166136261;for(let i=0;i<seed.length;i++){x^=seed.charCodeAt(i);x=Math.imul(x,16777619)}return()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
 function makeMatch(f,teams,r){const by=Object.fromEntries(teams.map(t=>[t.id,t])),a=by[f.a],b=by[f.b],rand=rng(r.code+":"+r.seasonNumber+":"+r.week+":"+f.id),p=1/(1+Math.exp(-((+a.rating||50)-(+b.rating||50))/11));let x=0,y=0,n=0,rounds=[];while(n++<24&&!(x>=13&&x-y>=2)&&!(y>=13&&y-x>=2)){if(rand()<p)x++;else y++;rounds.push({round:n,a:x,b:y,event:rand()<.15?"Clutch round":"Round "+n+" complete"})}return{id:f.id,a:f.a,b:f.b,rounds,scoreA:x,scoreB:y,winner:x>y?f.a:f.b}}
 async function startReplay(){if(uid!==room.owner||room.phase!=="management")return;const now=Date.now();const tx=await roomRef.transaction(r=>{if(!r||r.phase!=="management"||now<r.weekReadyAt)return;const fs=r.fixtures?.[r.week]||[];if(!fs.length)return;const teams=(r.seasonTeams||[]).map(t=>{if(!t.human)return t;const u=r.teams?.[t.uid]||{};return{...t,name:u.name||t.name,rating:+(u.rating||u.power)||t.rating,power:+(u.rating||u.power)||t.power,roster:u.roster||t.roster}});const matches=fs.map(f=>makeMatch(f,teams,r)),max=Math.max(...matches.map(m=>m.rounds.length));r.seasonTeams=teams;r.phase="live";r.replay={week:r.week,startedAt:now,roundMs:750,durationMs:max*750,maxRounds:max,matches,status:"live"};return r},undefined,false);if(tx.committed)stat("Week "+(tx.snapshot.val().week+1)+" is live for everyone.")}
 async function finishReplay(){if(uid!==room.owner||room.phase!=="live")return;const now=Date.now();const tx=await roomRef.transaction(r=>{if(!r||r.phase!=="live"||!r.replay||now<r.replay.startedAt+r.replay.durationMs)return;const st=r.standings;r.replay.matches.forEach(m=>{const a=st[m.a],b=st[m.b];a.rf+=m.scoreA;a.ra+=m.scoreB;b.rf+=m.scoreB;b.ra+=m.scoreA;if(m.winner===m.a){a.w++;a.pts+=3;b.l++}else{b.w++;b.pts+=3;a.l++}});r.lastReplay={...r.replay,status:"complete",completedAt:now};r.week++;r.replay=null;if(r.week>=r.fixtures.length){r.phase="complete";r.champion=Object.values(st).sort((a,b)=>b.pts-a.pts||((b.rf-b.ra)-(a.rf-a.ra))||a.id.localeCompare(b.id))[0]?.id||null;r.weekReadyAt=null}else{r.phase="management";r.weekReadyAt=now+30000}return r},undefined,false);if(tx.committed)stat(tx.snapshot.val().phase==="complete"?"Season complete!":"Next management window started.")}
 async function restartSeasonIfReady(){
  if(restarting||!roomRef||!room||uid!==room.owner||room.phase!=="complete")return;
  const members=Object.values(room.teams||{});
  if(members.length<2||!members.every(t=>t.nextYearReady))return;
  restarting=true;
  try{
   const teams=members.map(t=>({id:t.uid,uid:t.uid,name:t.name,tag:t.tag||"",rating:+(t.rating||t.power)||50,power:+(t.rating||t.power)||50,human:true,game:t.game,logo:t.logo||"⚡"}));
   const oldAI=(room.seasonTeams||[]).filter(t=>!t.human);
   for(let i=0;i<8-teams.length;i++){const t=oldAI[i]||{};teams.push({id:"ai:"+i,name:t.name||AI_NAMES[i],rating:Math.min(99,(+t.rating||50)+1),power:Math.min(99,(+t.rating||50)+1),human:false,game:room.game,logo:"🤖"})}
   const standings={};teams.forEach(t=>standings[t.id]={id:t.id,w:0,l:0,pts:0,rf:0,ra:0});
   const nextTeams={};members.forEach(t=>nextTeams[t.uid]={...t,nextYearReady:false});
   await roomRef.update({teams:nextTeams,phase:"management",seasonNumber:(+room.seasonNumber||1)+1,week:0,seasonTeams:teams,fixtures:fixtures(teams),standings,weekReadyAt:Date.now()+30000,replay:null,lastReplay:null,champion:null});
   if(S)S._mpNextYearReady=false;
  }finally{restarting=false}
 }
 async function tick(){if(!mpCareer||!room)return;if(uid===room.owner){if(room.phase==="management"&&Date.now()>=room.weekReadyAt)startReplay().catch(e=>stat(e.message));if(room.phase==="live"&&room.replay&&Date.now()>=room.replay.startedAt+room.replay.durationMs)finishReplay().catch(e=>stat(e.message))}if(room.phase==="management"||room.phase==="live")banner()}
 function ownFixture(){return(room?.fixtures?.[room.week]||[]).find(f=>f.a===uid||f.b===uid)}
 function syncLocal(){
  if(!mpCareer||!room?.seasonTeams||!room.standings)return;
  const own=room.seasonTeams.find(t=>t.id===uid);if(!own)return;
  const others=room.seasonTeams.filter(t=>t.id!==uid).map(t=>({uid:t.id,id:t.id,name:t.name,power:+t.rating||50,me:false,human:!!t.human,tag:t.tag||""}));
  S.ai=[...others,(aiBackup||[]).slice(7)].flat();S.lg=S.lg||{r:0,rounds:[],t:[]};S.lg.rounds=rr(8);S.lg.t=[{t:S.me,uid,id:uid,w:0,l:0,pts:0},...others.map(t=>({t,uid:t.uid,id:t.id,w:0,l:0,pts:0}))];
  S.lg.t.forEach(x=>{const v=room.standings[x.id]||{};x.w=+v.w||0;x.l=+v.l||0;x.pts=+v.pts||0});
  S.lg.r=Math.min(room.week||0,7);S.phase=room.phase==="complete"?"off":"league";if(room.phase!=="complete")S._mpNextYearReady=false;S.me.uid=uid;
  if(room.phase==="complete"){const sorted=Object.values(room.standings).sort((a,b)=>b.pts-a.pts||((b.rf-b.ra)-(a.rf-a.ra))||a.id.localeCompare(b.id)),rank=sorted.findIndex(x=>x.id===uid),key=room.code+":"+room.seasonNumber;if(S._mpReward!==key){const prize=[15000,8000,4000,2000][rank]||0;S.money+=prize;if(rank===0)S.trophies++;S._mpReward=key;news("Multiplayer season finished "+(rank+1)+(rank===0?" · Champions!":"")+(prize?" · Prize $"+prize.toLocaleString():"")+".")}}
  processReplay();
 }
 function processReplay(){const r=room?.lastReplay;if(!r||r.status!=="complete")return;const key=room.code+":"+room.seasonNumber+":"+r.week;let saved=null;try{saved=localStorage.getItem("esm_mp_processed_"+room.code+"_"+room.seasonNumber)}catch(_){}if(lastReplay===key||saved===key)return;lastReplay=key;const f=r.matches.find(m=>m.a===uid||m.b===uid);if(!f)return;const won=f.winner===uid,oppId=f.a===uid?f.b:f.a,opp=room.seasonTeams.find(t=>t.id===oppId);try{if(S&&!S.match){if(typeof gameKey==="function"&&gameKey(S.gameTitle)!=="cs2"&&typeof closeOtherReport==="function"){const report={game:S.gameTitle,opponent:opp?.name||"Opponent",label:"Multiplayer League · Week "+(r.week+1),won,score:won?"1–0":"0–1",mvp:S.roster?.[0]?.name||"Team MVP",players:(S.roster||[]).map(p=>({name:p.name,role:p.role,rating:Math.round(((+p.aim||50)+(+p.gs||50)+(+p.men||50))/3),mvps:0}))};S.otherMatchReport=report;S.lastMatchReport=report;closeOtherReport()}else if(typeof endSeries==="function"){S.match={opp:{name:opp?.name||"Opponent",power:+opp?.rating||50},sw:won?1:0,sl:won?0:1,label:"Multiplayer League · Week "+(r.week+1),mapName:activeMapPool()[0]?.name||"Mirage",bo:1};endSeries(won)}}news("Official result: "+(room.seasonTeams.find(t=>t.id===f.a)?.name||f.a)+" "+f.scoreA+"–"+f.scoreB+" "+(room.seasonTeams.find(t=>t.id===f.b)?.name||f.b)+".");try{localStorage.setItem("esm_mp_processed_"+room.code+"_"+room.seasonNumber,key)}catch(_){}}catch(e){console.error(e)}}
 function banner(){
  if(!mpCareer||!room||!document.querySelector(".wrap"))return;const legacy=$("multiplayer195");if(legacy)legacy.style.display="none";let b=$("mpCareerBanner");if(!b){b=document.createElement("section");b.id="mpCareerBanner";b.className="card";b.style.cssText="margin:10px auto;max-width:1400px;border:1px solid var(--acc)";const w=document.querySelector(".wrap");w.insertBefore(b,$("tabs")||w.firstChild)}
  const humans=Object.values(room.teams||{}),ready=humans.filter(t=>t.ready).length,host=uid===room.owner;let h='<h2 style="margin:0">🌐 Multiplayer Career · '+esc(room.name)+'</h2><p class="note">Room '+esc(room.code)+' · '+esc(room.game||game())+' · Season '+(room.seasonNumber||1)+' · 8-team league</p>';
   if(room.phase==="lobby"){const mine=room.teams?.[uid];h+='<p class="note">'+ready+"/"+humans.length+" organisations ready. Finish creating your organisation, then click Ready when your team is prepared.</p>";if(mine&&S?.me)h+='<button class="'+(mine.ready?"":"pri")+'" id="mpReadyToggle">'+(mine.ready?"✓ Ready — click to unready":"Ready up")+"</button>";if(host)h+=' <button class="pri" id="mpLaunch" '+(ready<2||ready!==humans.length?"disabled":"")+ '>Start 8-team season</button>'}
  else if(room.phase==="management"){const left=Math.max(0,Math.ceil((room.weekReadyAt-Date.now())/1000));h+='<p class="note"><b>Week '+(room.week+1)+'/7 · Management window</b> — autoplay starts in '+left+' seconds. Manage your roster, contracts, training and finances normally.</p><div class="bar" style="height:8px"><i style="width:'+Math.max(0,Math.min(100,100-left/30*100))+'%"></i></div>';if(room.lastReplay)h+=finalScores(room,room.lastReplay)}
  else if(room.phase==="live"&&room.replay){const r=room.replay,n=Math.min(r.maxRounds,Math.floor((Date.now()-r.startedAt)/r.roundMs));h+='<p class="note"><b>🔴 Week '+(r.week+1)+'/7 live · Round '+Math.max(1,n+1)+'</b> — all matches autoplay together, round by round.</p><div class="tw"><table><thead><tr><th>Match</th><th>Live score</th><th>Round</th></tr></thead><tbody>';r.matches.forEach(m=>{let a=0,bv=0;for(const x of m.rounds){if(x.round>n)break;a=x.a;bv=x.b}const ta=room.seasonTeams.find(t=>t.id===m.a),tb=room.seasonTeams.find(t=>t.id===m.b);h+='<tr><td>'+esc(ta?.name||m.a)+' vs '+esc(tb?.name||m.b)+'</td><td><b>'+a+' – '+bv+'</b></td><td>'+esc(m.rounds[Math.min(Math.max(n-1,0),m.rounds.length-1)]?.event||"Preparing")+'</td></tr>'});h+='</tbody></table></div>'}
  else if(room.phase==="complete"){const sorted=Object.values(room.standings||{}).sort((a,b)=>b.pts-a.pts||((b.rf-b.ra)-(a.rf-a.ra))||a.id.localeCompare(b.id));h+='<h3>🏆 Champion: '+esc(room.seasonTeams.find(t=>t.id===room.champion)?.name||"—")+'</h3><div class="tw"><table><thead><tr><th>#</th><th>Team</th><th>W</th><th>L</th><th>Pts</th><th>Round +/-</th></tr></thead><tbody>';sorted.forEach((x,i)=>{const t=room.seasonTeams.find(y=>y.id===x.id);h+='<tr><td>'+(i+1)+'</td><td>'+esc(t?.name||x.id)+'</td><td>'+x.w+'</td><td>'+x.l+'</td><td>'+x.pts+'</td><td>'+(x.rf-x.ra)+'</td></tr>'});h+='</tbody></table></div><p class="note">Your normal career remains loaded; only the league opponents and shared match results are multiplayer.</p>'+(S._mpNextYearReady?'<p class="note">Ready for the next season. Waiting for the other players.</p>':'<button class="pri" id="mpNextYear">Start Year '+(S.year+1)+'</button>')}
  b.innerHTML=h;if($("mpReadyToggle"))$("mpReadyToggle").onclick=async()=>{try{const mine=room.teams?.[uid];if(!mine||!S?.me){stat("Create your organisation before readying up.");return}await roomRef.child("teams/"+uid).update({ready:!mine.ready});stat(mine.ready?"You are no longer ready.":"You are ready for the season.")}catch(e){stat("Could not update ready status: "+e.message)}};if($("mpLaunch"))$("mpLaunch").onclick=()=>launch().catch(e=>stat(e.message));if($("mpNextYear"))$("mpNextYear").onclick=()=>{if(typeof newYear==="function")newYear()};if(room.standings)sharedTable();
  const tb=$("trainBtns");if(tb&&mpCareer){const opts=[["aim","Aim drills"],["gs","Game sense (VOD review)"],["men","Mental coaching"],["rest","Rest & team bonding"]];if(!tb.querySelector("[data-focus]"))tb.innerHTML=opts.map(x=>'<button class="'+(S.focus===x[0]?"sel":"")+'" onclick="setFocus(this.dataset.focus)" data-focus="'+x[0]+'">'+x[1]+'</button>').join("")+'<div class="decision" style="margin-top:8px"><b>Multiplayer autoplay</b><p class="note">Matches start automatically after the shared management window. Every round and final score is identical for all players.</p></div>';tb.querySelectorAll("[data-focus]").forEach(b=>{b.classList.toggle("sel",S.focus===b.dataset.focus);b.disabled=!!S.match||!!S.over})}
 }
 function finalScores(r,last){let h='<h3>Previous week · Final scores</h3><div class="tw"><table><thead><tr><th>Match</th><th>Final score</th></tr></thead><tbody>';last.matches.forEach(m=>{const a=r.seasonTeams.find(t=>t.id===m.a),b=r.seasonTeams.find(t=>t.id===m.b);h+='<tr><td>'+esc(a?.name||m.a)+' vs '+esc(b?.name||m.b)+'</td><td><b>'+m.scoreA+' – '+m.scoreB+'</b></td></tr>'});return h+'</tbody></table></div>'}
 function sharedTable(){const target=$("sched");if(!target||!room?.standings)return;const rows=Object.values(room.standings).sort((a,b)=>b.pts-a.pts||((b.rf-b.ra)-(a.rf-a.ra))||a.id.localeCompare(b.id));target.innerHTML='<tr><th>#</th><th>Shared league table</th><th>W</th><th>L</th><th>Pts</th></tr>'+rows.map((x,i)=>'<tr class="'+(x.id===uid?"me":"")+'"><td>'+(i+1)+'</td><td>'+esc(room.seasonTeams.find(t=>t.id===x.id)?.name||x.id)+'</td><td>'+x.w+'</td><td>'+x.l+'</td><td>'+x.pts+'</td></tr>').join("")}
 function hooks(){
  const show=window.showMenuPage;if(show)window.showMenuPage=function(p){if(p==="multiplayer"){menu();return}const r=show.apply(this,arguments);if(p==="home")addButton();return r};
  const select=window.selectStartingGame;if(select)window.selectStartingGame=function(g){if(room&&!chooseGame(g))return;return select.apply(this,arguments)};
  const create=window.createOrganization;if(create)window.createOrganization=function(){if(room?.game&&selectedGame!==room.game){alert("Select "+room.game+" for this room.");return}const r=create.apply(this,arguments);if(roomCode&&roomRef&&room)setTimeout(()=>orgReady().catch(e=>stat(e.message)),0);return r};
  const render=window.render;if(render)window.render=function(){const r=render.apply(this,arguments);if(mpCareer){syncLocal();banner()}return r};
  const adv=window.advance;if(adv)window.advance=function(w){if(mpCareer)return;return adv.apply(this,arguments)};
  const veto=window.beginVeto;if(veto)window.beginVeto=function(){if(mpCareer){stat("Multiplayer matches autoplay after the shared management window.");return}return veto.apply(this,arguments)};
  const next=window.nextFix;if(next)window.nextFix=function(){if(mpCareer&&room?.seasonTeams){const f=ownFixture(),id=f?(f.a===uid?f.b:f.a):null,t=room.seasonTeams.find(x=>x.id===id);if(t)return{opp:{name:t.name,power:t.rating||50},bo:1,label:"Multiplayer Week "+((room.week||0)+1)}}return next.apply(this,arguments)};
  const sched=window.sched;if(sched)window.sched=function(){const r=sched.apply(this,arguments);if(mpCareer)sharedTable();return r};
  const oldYear=window.newYear;if(oldYear)window.newYear=function(){
    if(mpCareer&&room?.phase==="complete"){
      if(S._mpNextYearReady){stat("Waiting for the other players to start the next season.");return}
      const result=oldYear.apply(this,arguments);S._mpNextYearReady=true;
      roomRef.child("teams/"+uid).update({...snapshot(),nextYearReady:true}).then(()=>{stat("You are ready. Waiting for every other organisation.");if(uid===room.owner)restartSeasonIfReady()}).catch(e=>stat("Could not mark next-season readiness: "+e.message));
      banner();return result;
    }
    return oldYear.apply(this,arguments)
  };
 }
 function init(){hooks();addButton()}
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();