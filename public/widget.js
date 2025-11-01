(function () {
  if (window._eddyWidgetLoaded) return; window._eddyWidgetLoaded = true;

  // Réglages
  const COLOR='#1a3821', SIZE=44, RIGHT=14, BOTTOM=14;
  const PANEL={ w:300, h:260 }; // compact

  // Détection de l'origine du script pour parler à ton backend Vercel
  const ORIGIN = (()=>{ try{ return new URL(document.currentScript.src).origin; }catch(e){ return ''; }})();

  // Styles (anti-zoom iOS + blocage scroll page)
  const css = `
  #edy-bubble{position:fixed;right:${RIGHT}px;bottom:${BOTTOM}px;width:${SIZE}px;height:${SIZE}px;border-radius:50%;
    background:${COLOR};color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;line-height:1;
    cursor:pointer;z-index:2147483647;box-shadow:0 4px 12px rgba(0,0,0,.18);opacity:.95;transition:opacity .15s}
  #edy-bubble:hover{opacity:1}
  #edy-panel{position:fixed;right:${RIGHT}px;bottom:${BOTTOM+SIZE+8}px;width:${PANEL.w}px;height:${PANEL.h}px;max-width:92vw;
    background:#fff;border:1px solid #e8e8e8;border-radius:12px;box-shadow:0 10px 24px rgba(0,0,0,.20);
    display:none;flex-direction:column;overflow:hidden;z-index:2147483647}
  #edy-head{background:${COLOR};color:#fff;padding:8px 12px;font-weight:600;display:flex;align-items:center;justify-content:space-between}
  #edy-title{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #edy-close{background:transparent;border:0;color:#fff;font-size:18px;cursor:pointer;line-height:1;opacity:.9}
  #edy-close:hover{opacity:1}
  #edy-body{flex:1;padding:10px;overflow:auto;font-size:14px;color:#222}
  #edy-inputbar{display:flex;border-top:1px solid #eee}
  #edy-txt{flex:1;border:0;padding:10px;font-size:16px;outline:none;-webkit-text-size-adjust:100%} /* 16px = pas de zoom iOS */
  #edy-send{border:0;background:${COLOR};color:#fff;padding:0 12px;font-size:16px;cursor:pointer}
  @media (max-width:768px){ #edy-panel{width:92vw;height:45vh;right:${RIGHT}px;bottom:${BOTTOM+SIZE+8}px} }
  .edy-lock{ position:fixed; width:100%; }`;
  const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  // UI
  const b=document.createElement('div'); b.id='edy-bubble'; b.textContent='💬';
  const p=document.createElement('div'); p.id='edy-panel';
  p.innerHTML = `
    <div id="edy-head">
      <div id="edy-title">Eddy 🌲 — Pose ta question</div>
      <button id="edy-close" aria-label="Fermer">×</button>
    </div>
    <div id="edy-body">Salut 👋 Pose-moi ta question.</div>
    <div id="edy-inputbar">
      <input id="edy-txt" type="text" inputmode="text" autocomplete="off" autocapitalize="sentences" placeholder="Écris ici…">
      <button id="edy-send" aria-label="Envoyer">→</button>
    </div>`;
  document.body.appendChild(b); document.body.appendChild(p);

  // Blocage scroll page quand panel ouvert (écran figé)
  let scrollTop = 0;
  function lockPage(){ scrollTop = window.scrollY; document.body.classList.add('edy-lock'); document.body.style.top = (-scrollTop)+'px';
    document.addEventListener('touchmove', prevent, {passive:false}); }
  function unlockPage(){ document.body.classList.remove('edy-lock'); document.body.style.top=''; window.scrollTo(0, scrollTop);
    document.removeEventListener('touchmove', prevent); }
  function prevent(e){ e.preventDefault(); }

  // Open/close
  const txt=p.querySelector('#edy-txt'), send=p.querySelector('#edy-send'), body=p.querySelector('#edy-body');
  function toggle(){ const open = p.style.display==='flex'; p.style.display = open ? 'none':'flex'; if(!open){ lockPage(); txt.focus(); } else { unlockPage(); } }
  b.addEventListener('click', toggle);
  p.querySelector('#edy-close').addEventListener('click', ()=>{ p.style.display='none'; unlockPage(); });

  // Utilitaires
  function esc(s){ return s.replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#039;' }[m])); }
  function add(role, txt){ const d=document.createElement('div'); d.style.margin='6px 0';
    d.innerHTML = (role==='me' ? '<b>Vous:</b> ' : '<span style="color:'+COLOR+'"><b>Eddy:</b></span> ') + txt;
    body.appendChild(d); body.scrollTop = body.scrollHeight; }

  // Envoi (Enter + bouton) -> appelle ton backend, sinon fallback
  async function sendMsg(){
    const msg=(txt.value||'').trim(); if(!msg) return;
    add('me', esc(msg)); txt.value='';
    try{
      if(ORIGIN){
        const r = await fetch(ORIGIN + '/api/reply', { method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ message: msg }) });
        const data = await r.json();
        add('bot', esc(data.reply || 'OK.'));
      } else {
        add('bot','OK.'); // cas extrême : pas d’origin détecté
      }
    }catch(e){ add('bot','(petit souci réseau, réessaye)'); }
  }
  txt.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); sendMsg(); }});
  send.addEventListener('click', sendMsg);

  console.log('[EddyWidget] v4 chargé');
})();
