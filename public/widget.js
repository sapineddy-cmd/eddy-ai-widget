(() => {
  // ===== Réglages simples et stables =====
  const API_URL = '/api/eddy';
  const TITLE   = 'Pose ta question à 🌲 Eddy';

  // CSS compact + anti-zoom iOS
  const css = `
  :root{
    --eddy-green:#123f2a; --eddy-shadow:0 10px 25px rgba(0,0,0,.2);
    --eddy-radius:12px; --eddy-size:56px; --eddy-z:2147483000;
  }
  #eddy-bubble{
    position:fixed; right:16px; bottom:16px; width:var(--eddy-size); height:var(--eddy-size);
    border-radius:50%; background:var(--eddy-green); color:#fff; display:flex;
    align-items:center; justify-content:center; font-size:22px; cursor:pointer;
    box-shadow:var(--eddy-shadow); z-index:var(--eddy-z);
  }
  #eddy-panel{
    position:fixed; right:16px; bottom:calc(16px + var(--eddy-size) + 10px);
    width:90vw; max-width:520px; height:50vh; background:#fff; border-radius:var(--eddy-radius);
    box-shadow:var(--eddy-shadow); overflow:hidden; display:none; flex-direction:column; z-index:var(--eddy-z);
  }
  #eddy-head{ background:var(--eddy-green); color:#fff; font-weight:600; padding:12px 16px;
    display:flex; justify-content:space-between; align-items:center; }
  #eddy-body{ padding:14px; flex:1; overflow-y:auto; font-size:16px; }
  .eddy-me{ color:#111; margin-top:6px; }
  .eddy-bot{ color:#0f5132; font-weight:700; margin-top:6px; }
  #eddy-input{ display:flex; padding:10px; border-top:1px solid #ddd; align-items:center; gap:10px; }
  #eddy-text{ flex:1; font-size:16px; border:1px solid #ddd; border-radius:8px; padding:8px 10px; outline:none; }
  #eddy-send{ width:48px; height:42px; border:none; background:var(--eddy-green); color:#fff; border-radius:8px; font-size:18px; cursor:pointer; }
  input,textarea{ font-size:16px !important; } /* anti-zoom iOS */
  `;
  const style = document.createElement('style'); style.innerHTML = css; document.head.appendChild(style);

  // Bulle
  const bubble = document.createElement('div');
  bubble.id = 'eddy-bubble'; bubble.textContent = '💬';
  document.body.appendChild(bubble);

  // Panneau
  const panel = document.createElement('div');
  panel.id = 'eddy-panel';
  panel.innerHTML = `
    <div id="eddy-head">
      <div>${TITLE}</div>
      <div id="eddy-close" style="cursor:pointer;font-size:20px;">✕</div>
    </div>
    <div id="eddy-body"><div class="eddy-bot">Salut 👋 Pose-moi ta question.</div></div>
    <div id="eddy-input">
      <input id="eddy-text" type="text" placeholder="Écris ici…" autocomplete="off" />
      <button id="eddy-send">➤</button>
    </div>`;
  document.body.appendChild(panel);

  const body  = panel.querySelector('#eddy-body');
  const text  = panel.querySelector('#eddy-text');
  const send  = panel.querySelector('#eddy-send');
  const close = panel.querySelector('#eddy-close');

  // Ouverture/fermeture
  const open = () => { panel.style.display='flex'; setTimeout(() => text.focus(), 30); };
  const hide = () => { panel.style.display='none'; };
  bubble.addEventListener('click', open);
  close.addEventListener('click', hide);

  // Affichage messages
  const addUser = m => body.insertAdjacentHTML('beforeend', <div class="eddy-me"><b>Vous:</b> ${m}</div>);
  const addBot  = m => body.insertAdjacentHTML('beforeend', <div class="eddy-bot">Eddy: ${m}</div>);
  const thinking = () => { addBot('Je réfléchis…'); return body.lastElementChild; };

  // Envoi
  async function ask(msg){
    addUser(msg);
    const waitNode = thinking();
    try{
      const r = await fetch(API_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({message:msg}) });
      if(!r.ok) throw new Error('bad status');
      const data = await r.json();
      waitNode.remove(); addBot(data.reply || '(pas de réponse)');
    }catch(_){
      waitNode.remove(); addBot('(réseau capricieux 🌧 — réessaye)');
    }
    body.scrollTop = body.scrollHeight;
  }
  send.addEventListener('click', () => { const v = text.value.trim(); if(!v) return; text.value=''; ask(v); });
  text.addEventListener('keydown', e => { if(e.key==='Enter'){ e.preventDefault(); send.click(); } });
})();
