(() => {
  // -------- CONFIG MIN --------
  const API_URL = '/api/eddy'; // même domaine Vercel
  const TITLE   = 'Pose ta question à 🌲 Eddy';

  // -------- CSS / UI ----------
  const css = `
  :root{
    --eddy-green:#123f2a;
    --eddy-shadow:0 10px 30px rgba(0,0,0,.18);
    --eddy-radius:14px;
    --eddy-gap:12px;
    --eddy-size:56px;
    --eddy-z:2147483000;
  }
  #eddy-bubble{
    position:fixed; right:16px; bottom:16px; width:var(--eddy-size); height:var(--eddy-size);
    border-radius:50%; background:var(--eddy-green); color:#fff; box-shadow:var(--eddy-shadow);
    display:flex; align-items:center; justify-content:center; font-size:22px; cursor:pointer;
    z-index:var(--eddy-z);
  }
  #eddy-panel{
    position:fixed; right:16px; bottom:calc(16px + var(--eddy-size) + 10px);
    width:92vw; max-width:560px; height:50vh; max-height:520px; min-height:360px;
    background:#fff; border-radius:var(--eddy-radius); box-shadow:var(--eddy-shadow);
    overflow:hidden; display:none; flex-direction:column; z-index:var(--eddy-z);
  }
  #eddy-head{
    background:var(--eddy-green); color:#fff; font-weight:700; padding:14px 16px; 
    display:flex; align-items:center; justify-content:space-between;
  }
  #eddy-title{font-size:18px}
  #eddy-close{cursor:pointer; font-size:20px; line-height:1}
  #eddy-body{padding:14px; flex:1; overflow:auto; font-size:16px;}
  .eddy-me{color:#111; margin-top:8px}
  .eddy-bot{color:#0f5132; font-weight:700; margin-top:8px}
  #eddy-input{display:flex; gap:10px; align-items:center; padding:12px; border-top:1px solid #e8e8e8;}
  #eddy-text{flex:1; font-size:16px !important; border:1px solid #ddd; border-radius:10px; padding:10px 12px; outline:none;}
  #eddy-send{width:48px; height:44px; border-radius:10px; border:none; background:var(--eddy-green); color:#fff; font-size:18px; cursor:pointer}
  /* empêche le zoom iOS */
  input, textarea { font-size:16px !important; }
  @media (max-width:768px){
    #eddy-panel{width:92vw; right:4vw; height:46vh; bottom:calc(16px + var(--eddy-size) + 10px);}
  }
  `;
  const style = document.createElement('style'); style.innerHTML = css; document.head.appendChild(style);

  // -------- DOM ---------------
  const bubble = document.createElement('div');
  bubble.id='eddy-bubble';
  bubble.setAttribute('aria-label','Ouvrir Eddy');
  bubble.innerHTML='…';
  document.body.appendChild(bubble);

  const panel = document.createElement('div');
  panel.id='eddy-panel';
  panel.innerHTML = `
    <div id="eddy-head">
      <div id="eddy-title">${TITLE}</div>
      <div id="eddy-close">✕</div>
    </div>
    <div id="eddy-body">
      <div class="eddy-bot">Salut 👋 Pose-moi ta question.</div>
    </div>
    <div id="eddy-input">
      <input id="eddy-text" type="text" placeholder="Écris ici…" autocomplete="off" />
      <button id="eddy-send">➤</button>
    </div>`;
  document.body.appendChild(panel);

  // bulle icône après insertion des nodes (emoji stable)
  bubble.innerHTML = '💬';

  const body  = panel.querySelector('#eddy-body');
  const text  = panel.querySelector('#eddy-text');
  const send  = panel.querySelector('#eddy-send');
  const close = panel.querySelector('#eddy-close');

  // -------- Helpers ----------
  const open = () => { panel.style.display='flex'; setTimeout(()=>text.focus(),30); };
  const hide = () => { panel.style.display='none'; };
  const addUser = (msg) => { body.insertAdjacentHTML('beforeend', <div class="eddy-me"><b>Vous:</b> ${escapeHtml(msg)}</div>); body.scrollTop = body.scrollHeight; };
  const addBot  = (msg) => { body.insertAdjacentHTML('beforeend', <div class="eddy-bot">Eddy: ${msg}</div>); body.scrollTop = body.scrollHeight; };

  function escapeHtml(s){ return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

  async function ask(msg){
    addUser(msg);
    addBot('Je réfléchis…');
    try{
      const r = await fetch(API_URL, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message: msg })});
      if(!r.ok) throw new Error('bad status');
      const data = await r.json();
      // remplace la dernière bulle "je réfléchis…"
      const last = body.querySelector('.eddy-bot:last-child');
      if(last) last.remove();
      addBot(escapeHtml(data.reply || 'Réponse vide.'));
    }catch(e){
      const last = body.querySelector('.eddy-bot:last-child'); if(last) last.remove();
      addBot('(réseau capricieux 🌧 — réessaye)');
    }
  }

  // -------- Events -----------
  bubble.addEventListener('click', open);
  close.addEventListener('click', hide);
  send.addEventListener('click', () => { const v = text.value.trim(); if(!v) return; text.value=''; ask(v); });
  text.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); send.click(); }});

  // évite que le panneau “monte” sur iOS quand le clavier s’ouvre : on reste fixé au bas
  const kbHandler = () => {
    // recolle le bas après apparition clavier
    panel.style.bottom = calc(16px + var(--eddy-size) + 10px);
  };
  window.addEventListener('focusin', kbHandler);
  window.addEventListener('resize', kbHandler);
})();
