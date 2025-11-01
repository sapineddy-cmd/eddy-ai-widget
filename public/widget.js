(function () {
  if (window.__eddyWidgetLoaded) return;
  window.__eddyWidgetLoaded = true;

  // ====== Réglages sûrs ======
  const API_ORIGIN = 'https://eddy-ai-widget.vercel.app'; // fixe, pas de currentScript
  const COLOR = '#1a3821', SIZE = 44, RIGHT = 14, BOTTOM = 14;
  const PANEL_W = 300, PANEL_H = 220; // compact + visible
  const Z = 2147483647;

  // ====== Styles ======
  const css = `
  #edy-bubble{position:fixed;right:${RIGHT}px;bottom:${BOTTOM}px;width:${SIZE}px;height:${SIZE}px;border-radius:50%;
    background:${COLOR};color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;cursor:pointer;
    z-index:${Z};box-shadow:0 4px 12px rgba(0,0,0,.18)}
  #edy-panel{position:fixed;left:50%;transform:translateX(-50%);
    bottom:calc(env(safe-area-inset-bottom,0) + ${BOTTOM + SIZE + 6}px);
    width:${PANEL_W}px;height:${PANEL_H}px;max-width:92vw;max-height:50vh;background:#fff;border:1px solid #e8e8e8;
    border-radius:12px;box-shadow:0 10px 24px rgba(0,0,0,.20);display:none;flex-direction:column;overflow:hidden;z-index:${Z}}
  #edy-head{background:${COLOR};color:#fff;padding:6px 10px;font-weight:600;display:flex;align-items:center;justify-content:space-between;font-size:15px}
  #edy-body{flex:1;padding:8px;overflow:auto;font-size:14px;color:#222}
  #edy-inputbar{display:flex;border-top:1px solid #eee}
  #edy-txt{flex:1;border:0;padding:10px;font-size:16px;outline:none;-webkit-text-size-adjust:100%}
  #edy-send{border:0;background:${COLOR};color:#fff;padding:0 12px;font-size:16px;cursor:pointer}
  @media (max-width:768px){ #edy-panel{width:92vw;height:30vh} }
  `;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // ====== UI ======
  const bubble = document.createElement('div'); bubble.id = 'edy-bubble'; bubble.textContent = '💬';
  const panel = document.createElement('div'); panel.id = 'edy-panel';
  panel.innerHTML = `
    <div id="edy-head">
      <div>Eddy 🌲 — Pose ta question</div>
      <button id="edy-x" aria-label="Fermer" style="background:transparent;border:0;color:#fff;font-size:18px;cursor:pointer">×</button>
    </div>
    <div id="edy-body">Salut 👋 Pose-moi ta question.</div>
    <div id="edy-inputbar">
      <input id="edy-txt" type="text" autocomplete="off" placeholder="Écris ici…">
      <button id="edy-send">→</button>
    </div>`;
  document.body.appendChild(bubble); document.body.appendChild(panel);

  const txt = panel.querySelector('#edy-txt'), send = panel.querySelector('#edy-send'), body = panel.querySelector('#edy-body');

  // Ouverture/fermeture — sans bouger l’écran
  bubble.addEventListener('click', () => { panel.style.display = 'flex'; txt.blur(); setTimeout(()=>txt.focus(), 0); });
  panel.querySelector('#edy-x').addEventListener('click', () => { panel.style.display = 'none'; });

  // Utils
  const esc = s => (s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const add = (who, html) => { const d=document.createElement('div'); d.style.margin='6px 0';
    d.innerHTML = (who==='me' ? '<b>Vous:</b> ' : '<span style="color:'+COLOR+'"><b>Eddy:</b></span> ') + html;
    body.appendChild(d); body.scrollTop=body.scrollHeight; };

  // Historique + envoi
  window._edy_hist = window._edy_hist || [];

  const fetchWithTimeout = (url, opt={}) => {
    const ctrl = new AbortController(), t = setTimeout(()=>ctrl.abort(), opt.timeout||9000);
    return fetch(url, { ...opt, signal: ctrl.signal }).finally(()=>clearTimeout(t));
  };

  async function sendMsg(){
    const msg = (txt.value||'').trim(); if(!msg) return;
    add('me', esc(msg)); txt.value='';
    const payload = { message: msg, history: window.__edy_hist };
    const call = () => fetchWithTimeout(API_ORIGIN + '/api/reply', {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload), timeout:9000
    });
    try{
      let r = await call(); if(!r.ok){ await new Promise(rz=>setTimeout(rz,700)); r = await call(); }
      if(!r.ok) throw new Error('HTTP '+r.status);
      const data = await r.json(); const reply = data.reply || 'OK.';
      add('bot', esc(reply));
      window._edy_hist.push({role:'user',content:msg}); window._edy_hist.push({role:'assistant',content:reply});
    }catch(e){
      const msgErr = /401/.test(e) ? 'clé API (401)' : /404/.test(e) ? 'route introuvable (404)' :
                     /500/.test(e) ? 'erreur serveur (500)' : 'réseau capricieux';
      add('bot', (${msgErr} — réessaye));
    }
  }
  txt.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); sendMsg(); }});
  send.addEventListener('click', sendMsg);
})();
