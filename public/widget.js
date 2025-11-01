(() => {
  // ===== Réglages =====
  const API_URL = '/api/eddy';
  const TITLE   = 'Pose ta question à 🌲 Eddy';
  const BRAND   = '#123f2a';   // vert thème
  const Z = 2147483000;

  // ===== Styles compacts + anti-zoom iOS =====
  const css = `
  :root{ --eddy-green:${BRAND}; --eddy-radius:14px; --eddy-size:56px; --eddy-gap:12px; --eddy-shadow:0 10px 25px rgba(0,0,0,.18); }
  #eddy-bubble{
    position:fixed; right:16px; bottom:16px; width:var(--eddy-size); height:var(--eddy-size);
    border-radius:50%; background:var(--eddy-green); color:#fff; display:flex; align-items:center; justify-content:center;
    font-size:22px; box-shadow:var(--eddy-shadow); z-index:${Z}; cursor:pointer; transition:transform .15s ease, opacity .15s ease;
  }
  #eddy-bubble:hover{ opacity:.95; transform:translateY(-1px); }

  #eddy-panel{
    position:fixed; right:16px; bottom:calc(16px + var(--eddy-size) + var(--eddy-gap));
    width:92vw; max-width:560px; height:48vh; background:#fff; border-radius:var(--eddy-radius);
    box-shadow:var(--eddy-shadow); overflow:hidden; display:none; flex-direction:column; z-index:${Z};
  }
  #eddy-head{ background:var(--eddy-green); color:#fff; font-weight:700; padding:14px 16px; display:flex; align-items:center; justify-content:space-between; }
  #eddy-title{ font-size:18px; line-height:1; }
  #eddy-close{ appearance:none; border:0; background:transparent; color:#fff; font-size:22px; line-height:1; cursor:pointer; opacity:.9; }
  #eddy-close:hover{ opacity:1; }

  #eddy-body{ padding:14px; flex:1; overflow-y:auto; font-size:16px; }
  .eddy-me{ color:#111; margin-top:8px; }
  .eddy-bot{ color:#0f5132; font-weight:600; margin-top:8px; }
  .eddy-tip{ color:#666; font-size:14px; margin-top:6px; }

  #eddy-bar{ border-top:1px solid #e8e8e8; display:flex; align-items:center; gap:8px; padding:10px; background:#fff; }
  #eddy-input{
    flex:1; font-size:16px; padding:12px 12px; border-radius:10px; border:1px solid #e0e0e0; outline:none;
  }
  #eddy-send{
    width:52px; height:44px; border-radius:10px; background:var(--eddy-green); color:#fff; border:0; cursor:pointer; font-size:20px;
  }
  /* iOS anti-zoom */
  input,textarea,button{ font-size:16px !important; }
  @media (max-width:768px){
    :root{ --eddy-size:52px; }
    #eddy-panel{ width:94vw; height:52vh; right:3vw; }
  }`;

  // ===== DOM =====
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  const bubble = document.createElement('div');
  bubble.id = 'eddy-bubble';
  bubble.setAttribute('aria-label','Ouvrir Eddy');
  bubble.innerHTML = '💬';
  document.body.appendChild(bubble);

  const panel = document.createElement('div');
  panel.id = 'eddy-panel';
  panel.innerHTML = `
    <div id="eddy-head">
      <div id="eddy-title">${TITLE}</div>
      <button id="eddy-close" aria-label="Fermer">×</button>
    </div>
    <div id="eddy-body">
      <div class="eddy-bot">Salut 👋 Pose-moi ta question.</div>
    </div>
    <div id="eddy-bar">
      <input id="eddy-input" type="text" placeholder="Écris ici..." />
      <button id="eddy-send">➤</button>
    </div>`;
  document.body.appendChild(panel);

  // Ajustement clavier iOS (sans zoom / sans décaler le site)
  const fixForKeyboard = () => {
    const kbOpen = window.visualViewport && window.innerHeight - window.visualViewport.height > 120;
    panel.style.bottom = kbOpen ? '8px' : calc(16px + var(--eddy-size) + var(--eddy-gap));
  };
  if (window.visualViewport){
    window.visualViewport.addEventListener('resize', fixForKeyboard);
    window.visualViewport.addEventListener('scroll', fixForKeyboard);
  }

  // ===== Comportement =====
  const input = panel.querySelector('#eddy-input');
  const send  = panel.querySelector('#eddy-send');
  const close = panel.querySelector('#eddy-close');
  const body  = panel.querySelector('#eddy-body');

  const open  = () => { panel.style.display = 'flex'; fixForKeyboard(); setTimeout(() => input.focus(), 50); };
  const hide  = () => { panel.style.display = 'none'; };
  bubble.addEventListener('click', open);
  close.addEventListener('click', hide);

  const append = (cls, text) => {
    const d = document.createElement('div'); d.className = cls; d.textContent = text; body.appendChild(d); body.scrollTop = body.scrollHeight;
  };

  const ask = async () => {
    const msg = (input.value || '').trim();
    if(!msg) return;
    append('eddy-me', Vous: ${msg});
    input.value='';

    let tries = 0;
    while (tries < 2){
      try{
        const r = await fetch(API_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ message: msg }) });
        if(!r.ok) throw new Error('http '+r.status);
        const data = await r.json();
        append('eddy-bot', Eddy: ${data.reply || '…'});
        return;
      }catch(e){
        tries++;
        if (tries >= 2){
          append('eddy-tip', '(réseau capricieux 🌧 — réessaye)');
        }else{
          await new Promise(res => setTimeout(res, 600));
        }
      }
    }
  };

  send.addEventListener('click', ask);
  input.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); ask(); }});
})();
