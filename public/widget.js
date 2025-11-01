(function () {
  if (window.__eddyWidgetLoaded) return;
  window.__eddyWidgetLoaded = true;

  // Réglages visuels
  const COLOR = '#1a3821', SIZE = 44, RIGHT = 14, BOTTOM = 14;
  const PANEL = { w: 300, h: 260 };

  // Origine (domaine Vercel du widget)
  const ORIGIN = (() => {
    try { return new URL(document.currentScript.src).origin; }
    catch (e) { return ''; }
  })();

  // STYLE — panneau compact, collé en bas, centré
  const css = `
  #edy-bubble{
    position:fixed;right:${RIGHT}px;bottom:${BOTTOM}px;width:${SIZE}px;height:${SIZE}px;border-radius:50%;
    background:${COLOR};color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;
    cursor:pointer;z-index:2147483647;box-shadow:0 4px 12px rgba(0,0,0,.18)
  }
  #edy-panel{
    position:fixed;left:50%;transform:translateX(-50%);
    bottom:calc(env(safe-area-inset-bottom,0) + ${BOTTOM + SIZE + 6}px);
    width:${PANEL.w}px;height:${PANEL.h - 40}px;
    max-width:92vw;max-height:50vh; /* visible en entier */
    background:#fff;border:1px solid #e8e8e8;border-radius:12px;
    box-shadow:0 10px 24px rgba(0,0,0,.20);
    display:none;flex-direction:column;overflow:hidden;
    z-index:2147483647;transition:transform .15s ease, bottom .15s ease
  }
  #edy-head{background:${COLOR};color:#fff;padding:6px 10px;font-weight:600;
    display:flex;align-items:center;justify-content:space-between;font-size:15px}
  #edy-body{flex:1;padding:8px;overflow:auto;font-size:14px;color:#222}
  #edy-inputbar{display:flex;border-top:1px solid #eee}
  #edy-txt{flex:1;border:0;padding:10px;font-size:16px;outline:none;-webkit-text-size-adjust:100%}
  #edy-send{border:0;background:${COLOR};color:#fff;padding:0 12px;font-size:16px;cursor:pointer}
  @media (max-width:768px){
    #edy-panel{ width:92vw; height:32vh; } /* un peu plus petit = toujours cadré */
  }`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // UI
  const b = document.createElement('div'); b.id = 'edy-bubble'; b.textContent = '💬';
  const p = document.createElement('div'); p.id = 'edy-panel';
  p.innerHTML = `
    <div id="edy-head">
      <div>Eddy 🌲 — Pose ta question</div>
      <button id="edy-close" aria-label="Fermer" style="background:transparent;border:0;color:#fff;font-size:18px;cursor:pointer">×</button>
    </div>
    <div id="edy-body">Salut 👋 Pose-moi ta question.</div>
    <div id="edy-inputbar">
      <input id="edy-txt" type="text" inputmode="text" autocomplete="off" autocapitalize="sentences" placeholder="Écris ici…">
      <button id="edy-send" aria-label="Envoyer">→</button>
    </div>`;
  document.body.appendChild(b); document.body.appendChild(p);

  // Ouvrir / fermer (focus sans bouger l’écran)
  const txt = p.querySelector('#edy-txt'), send = p.querySelector('#edy-send'), body = p.querySelector('#edy-body');
  b.addEventListener('click', () => { p.style.display = 'flex'; txt.blur(); setTimeout(()=>txt.focus(), 0); });
  p.querySelector('#edy-close').addEventListener('click', () => { p.style.display = 'none'; });

  // Utilitaires
  function esc(s){return (s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  function add(role, txtHtml){
    const d=document.createElement('div'); d.style.margin='6px 0';
    d.innerHTML=(role==='me' ? '<b>Vous:</b> ' : '<span style="color:'+COLOR+'"><b>Eddy:</b></span> ') + txtHtml;
    body.appendChild(d); body.scrollTop=body.scrollHeight;
  }

  // Historique
  window._edy_hist = window._edy_hist || [];

  // fetch avec timeout + retry + message d’erreur clair
  async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 8000 } = options;
    const ctrl = new AbortController();
    const id = setTimeout(() => ctrl.abort(), timeout);
    try { return await fetch(resource, { ...options, signal: ctrl.signal }); }
    finally { clearTimeout(id); }
  }

  async function sendMsg(){
    const msg = (txt.value || '').trim(); if(!msg) return;
    add('me', esc(msg)); txt.value = '';
    const payload = { message: msg, history: window.__edy_hist };
    const url = ORIGIN + '/api/reply';

    const call = () => fetchWithTimeout(url, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload),
      timeout: 9000
    });

    try{
      let r = await call();
      if (!r.ok) { await new Promise(rz=>setTimeout(rz,700)); r = await call(); }
      if (!r.ok) throw new Error('HTTP '+r.status);
      const data = await r.json();
      const reply = data.reply || 'OK.';
      add('bot', esc(reply));
      window.__edy_hist.push({ role:'user', content: msg });
      window.__edy_hist.push({ role:'assistant', content: reply });
    }catch(e){
      const txtErr = /HTTP 401/.test(String(e)) ? 'clé API invalide (401)'
                  : /HTTP 404/.test(String(e)) ? 'route API introuvable (404)'
                  : /HTTP 500/.test(String(e)) ? 'erreur serveur (500)'
                  : 'réseau capricieux';
      add('bot', (${txtErr} — réessaie));
    }
  }

  txt.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); sendMsg(); }});
  send.addEventListener('click', sendMsg);
})();
