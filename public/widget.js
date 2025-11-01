(() => {
  const API_URL = '/api/eddy';
  const TITLE = 'Pose ta question à 🌲 Eddy';

  const css = `
  :root{--eddy-green:#123f2a;--eddy-shadow:0 10px 25px rgba(0,0,0,.2);
  --eddy-radius:12px;--eddy-size:56px;--eddy-z:2147483000;}
  #eddy-bubble{position:fixed;right:16px;bottom:16px;width:var(--eddy-size);
  height:var(--eddy-size);border-radius:50%;background:var(--eddy-green);
  color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;
  cursor:pointer;box-shadow:var(--eddy-shadow);z-index:var(--eddy-z);}
  #eddy-panel{position:fixed;right:16px;bottom:calc(16px + var(--eddy-size) + 10px);
  width:90vw;max-width:520px;height:55vh;background:#fff;border-radius:var(--eddy-radius);
  box-shadow:var(--eddy-shadow);overflow:hidden;display:none;flex-direction:column;
  z-index:var(--eddy-z);}
  #eddy-head{background:var(--eddy-green);color:#fff;font-weight:600;
  padding:12px 16px;display:flex;justify-content:space-between;align-items:center;}
  #eddy-body{padding:14px;flex:1;overflow-y:auto;font-size:16px;}
  .eddy-me{color:#111;margin-top:6px;}
  .eddy-bot{color:#0e572f;font-weight:600;margin-top:6px;}
  #eddy-input{display:flex;gap:8px;padding:10px;border-top:1px solid #eee;}
  #eddy-input input{flex:1;font-size:16px;padding:12px;border-radius:10px;
  border:1px solid #ddd;outline:none;}
  #eddy-send{width:48px;height:48px;border-radius:10px;border:none;
  background:var(--eddy-green);color:#fff;font-size:18px;}
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const bubble = document.createElement('div');
  bubble.id = 'eddy-bubble';
  bubble.innerHTML = '💬';
  document.body.appendChild(bubble);

  const panel = document.createElement('div');
  panel.id = 'eddy-panel';
  panel.innerHTML = `
    <div id="eddy-head">${TITLE}<button id="eddy-close" style="all:unset;cursor:pointer;font-size:20px;">✕</button></div>
    <div id="eddy-body"><div class="eddy-bot">Salut 👋 Pose-moi ta question.</div></div>
    <div id="eddy-input"><input id="eddy-text" placeholder="Écris ici…" /><button id="eddy-send">➤</button></div>`;
  document.body.appendChild(panel);

  const open = () => panel.style.display = 'flex';
  const close = () => panel.style.display = 'none';
  bubble.onclick = open;
  panel.querySelector('#eddy-close').onclick = close;

  const body = panel.querySelector('#eddy-body');
  const input = panel.querySelector('#eddy-text');
  const sendBtn = panel.querySelector('#eddy-send');

  const appendMe = (t) => { body.insertAdjacentHTML('beforeend', <div class="eddy-me">Vous: ${t}</div>); body.scrollTop = body.scrollHeight; };
  const appendBot = (t) => { body.insertAdjacentHTML('beforeend', <div class="eddy-bot">Eddy: ${t}</div>); body.scrollTop = body.scrollHeight; };

  async function send() {
    const msg = input.value.trim();
    if (!msg) return;
    appendMe(msg);
    input.value = '';
    appendBot('Je réfléchis…');
    try {
      const r = await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: msg})
      });
      const d = await r.json();
      body.lastElementChild.remove();
      appendBot(d.reply || '(pas de réponse)');
    } catch {
      body.lastElementChild.remove();
      appendBot('(réseau capricieux 🌧 — réessaye)');
    }
  }

  sendBtn.onclick = send;
  input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
})();
