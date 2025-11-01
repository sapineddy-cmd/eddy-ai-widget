(function () {
  if (window.__eddyWidgetLoaded) return; 
  window.__eddyWidgetLoaded = true;

  // Réglages visuels
  const COLOR = '#1a3821', SIZE = 44, RIGHT = 14, BOTTOM = 14;
  const PANEL = { w: 300, h: 260 };

  // Origine du script (pour appeler ton API sur Vercel)
  const ORIGIN = (() => { 
    try { return new URL(document.currentScript.src).origin; } 
    catch (e) { return ''; } 
  })();

  // 💅 STYLE COMPLET
  const css = `
  #edy-bubble {
    position: fixed;
    right: ${RIGHT}px;
    bottom: ${BOTTOM}px;
    width: ${SIZE}px;
    height: ${SIZE}px;
    border-radius: 50%;
    background: ${COLOR};
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    line-height: 1;
    cursor: pointer;
    z-index: 2147483647;
    box-shadow: 0 4px 12px rgba(0,0,0,.18);
  }
  #edy-panel {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: ${BOTTOM + SIZE + 8}px;
    width: ${PANEL.w}px;
    height: ${PANEL.h}px;
    max-width: 92vw;
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 12px;
    box-shadow: 0 10px 24px rgba(0,0,0,.20);
    display: none;
    flex-direction: column;
    overflow: hidden;
    z-index: 2147483647;
    transition: all .25s ease;
  }
  #edy-head {
    background: ${COLOR};
    color: #fff;
    padding: 8px 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }
  #edy-body {
    flex: 1;
    padding: 10px;
    overflow: auto;
    font-size: 14px;
    color: #222;
  }
  #edy-inputbar {
    display: flex;
    border-top: 1px solid #eee;
  }
  #edy-txt {
    flex: 1;
    border: 0;
    padding: 10px;
    font-size: 16px;
    outline: none;
    -webkit-text-size-adjust: 100%;
  }
  #edy-send {
    border: 0;
    background: ${COLOR};
    color: #fff;
    padding: 0 12px;
    font-size: 16px;
    cursor: pointer;
  }
  @media (max-width:768px){
    #edy-panel{
      width:92vw;
      height:38vh; /* plus petit pour être visible au-dessus du clavier */
      bottom:${BOTTOM + SIZE + 4}px;
    }
  }`;
  
  const st = document.createElement('style'); 
  st.textContent = css; 
  document.head.appendChild(st);

  // 💬 INTERFACE
  const b = document.createElement('div'); 
  b.id = 'edy-bubble'; 
  b.textContent = '💬';

  const p = document.createElement('div'); 
  p.id = 'edy-panel';
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
  document.body.appendChild(b); 
  document.body.appendChild(p);

  // 🧭 GESTION OUVERTURE / FERMETURE
  const txt = p.querySelector('#edy-txt');
  const send = p.querySelector('#edy-send');
  const body = p.querySelector('#edy-body');

  function toggle() {
    p.style.display = (p.style.display === 'flex' ? 'none' : 'flex');
    if (p.style.display === 'flex') txt.focus();
  }
  b.addEventListener('click', toggle);
  p.querySelector('#edy-close').addEventListener('click', () => { p.style.display = 'none'; });

  // ✏ ANTI-ZOOM ET AJUSTEMENT CLAVIER MOBILE
  window.addEventListener('resize', () => {
    const h = window.innerHeight;
    if (h < 600) {
      // clavier ouvert → remonte légèrement
      p.style.bottom = '30vh';
    } else {
      // clavier fermé → revient normal
      p.style.bottom = (BOTTOM + SIZE + 8) + 'px';
    }
  });

  // ⚙ OUTILS
  function esc(s){return (s||'').replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  function add(role, txt){
    const d=document.createElement('div');
    d.style.margin='6px 0';
    d.innerHTML=(role==='me' ? '<b>Vous:</b> ' : '<span style="color:'+COLOR+'"><b>Eddy:</b></span> ')+txt;
    body.appendChild(d); 
    body.scrollTop=body.scrollHeight;
  }

  // 💾 HISTORIQUE LOCAL
  window._edy_hist = window._edy_hist || [];

  // 🚀 ENVOI / RÉPONSE
  async function sendMsg(){
    const msg = (txt.value || '').trim();
    if(!msg) return;
    add('me', esc(msg)); 
    txt.value = '';
    try{
      const payload = { message: msg, history: window.__edy_hist };
      const r = await fetch(ORIGIN + '/api/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await r.json();
      const reply = data.reply || 'OK.';
      add('bot', esc(reply));
      window.__edy_hist.push({ role:'user', content: msg });
      window.__edy_hist.push({ role:'assistant', content: reply });
    }catch(e){
      add('bot','(petit souci réseau, réessaye)');
    }
  }

  // ⌨ ENVOI VIA “Entrée” OU BOUTON
  txt.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); sendMsg(); }});
  send.addEventListener('click', sendMsg);
})();
