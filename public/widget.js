(function () {
  // anti-doublon
  if (window._eddyWidgetLoaded) return; window._eddyWidgetLoaded = true;

  // Nettoyage d'anciens éléments (es-*)
  ['es-fab','es-panel'].forEach(id => { var n=document.getElementById(id); if(n) n.remove(); });

  // Réglages rapides
  var COLOR  = '#1a3821';  // vert thème
  var SIZE   = 44;         // taille bulle
  var RIGHT  = 14;         // marge droite
  var BOTTOM = 14;         // marge bas

  // Styles (pas de zoom iOS, haute priorité)
  var css = `
  #edy-bubble{
    position:fixed; right:${RIGHT}px; bottom:${BOTTOM}px; width:${SIZE}px; height:${SIZE}px;
    border-radius:50%; background:${COLOR}; color:#fff; display:flex; align-items:center; justify-content:center;
    font-size:20px; line-height:1; cursor:pointer; z-index:2147483647; box-shadow:0 4px 12px rgba(0,0,0,.18); opacity:.95;
    transition:opacity .15s;
  }
  #edy-bubble:hover{opacity:1}
  #edy-panel{
    position:fixed; right:${RIGHT}px; bottom:${BOTTOM + SIZE + 10}px; width:340px; max-width:92vw; height:460px;
    background:#fff; border:1px solid #e8e8e8; border-radius:14px; box-shadow:0 12px 30px rgba(0,0,0,.22);
    display:none; flex-direction:column; overflow:hidden; z-index:2147483647;
  }
  #edy-head{ background:${COLOR}; color:#fff; padding:10px 12px; font-weight:600 }
  #edy-body{ flex:1; padding:12px; overflow:auto; font-size:15px; color:#222 }
  #edy-inputbar{ display:flex; border-top:1px solid #eee }
  #edy-txt{
    flex:1; border:0; padding:12px; font-size:16px; outline:none; -webkit-text-size-adjust:100%;
  }
  #edy-send{ border:0; background:${COLOR}; color:#fff; padding:0 14px; font-size:16px; cursor:pointer }
  @media (max-width:768px){
    #edy-panel{ width:92vw; height:70vh; right:${RIGHT}px; bottom:${BOTTOM + SIZE + 8}px }
  }`;
  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  // UI
  var b=document.createElement('div'); b.id='edy-bubble'; b.setAttribute('title','Discuter'); b.textContent='💬';
  var p=document.createElement('div'); p.id='edy-panel';
  p.innerHTML = `
    <div id="edy-head">Eddy 🌲 – Coach IA</div>
    <div id="edy-body">Salut 👋 Pose-moi une question !</div>
    <div id="edy-inputbar">
      <input id="edy-txt" type="text" inputmode="text" autocapitalize="sentences" autocomplete="off" placeholder="Écris ici…">
      <button id="edy-send" aria-label="Envoyer">→</button>
    </div>`;
  document.body.appendChild(b); document.body.appendChild(p);

  // Ouverture / fermeture
  function toggle(){ p.style.display = (p.style.display==='flex' ? 'none' : 'flex'); if(p.style.display==='flex') t.focus(); }
  b.addEventListener('click', toggle);

  // Logique d’envoi (Enter + bouton)
  var t=p.querySelector('#edy-txt'), send=p.querySelector('#edy-send'), body=p.querySelector('#edy-body');
  function esc(s){return s.replace(/[&<>"']/g,m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#039;' }[m]));}
  function add(role, txt, color){ var d=document.createElement('div'); d.style.margin='8px 0';
    d.innerHTML=(role==='me' ? '<b>Vous:</b> ' : '<span style="color:'+COLOR+'"><b>Eddy:</b></span> ')+txt; if(color) d.style.color=color;
    body.appendChild(d); body.scrollTop=body.scrollHeight; }

  async function sendMsg(){
    var msg=(t.value||'').trim(); if(!msg) return; add('me', esc(msg)); t.value='';
    // Placeholder : branchement IA à venir
    setTimeout(()=>add('bot','Je suis opérationnel ✅'),200);
  }
  t.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); sendMsg(); }});
  send.addEventListener('click', sendMsg);

  // trace pour debug si besoin
  console.log('[EddyWidget] chargé');
})();
