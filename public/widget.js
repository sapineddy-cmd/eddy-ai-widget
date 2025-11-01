(() => {
  if (window._eddyWidgetLoaded) return; window._eddyWidgetLoaded = true;

  // --- Réglages fiables
  const API_URL = '/api/eddy';            // relatif au domaine Vercel
  const TITLE   = 'Pose ta question à 🌲 Eddy';
  const THEME   = '#143C26';              // vert thème
  const Z       = 2147483647;

  // --- Styles compacts (anti-zoom iOS)
  const css = `
    :root{ --g:${THEME}; --size:56px; --radius:12px; --shadow:0 10px 25px rgba(0,0,0,.20); --z:${Z}; }
    #eddy-bubble{
      position:fixed; right:16px; bottom:16px; width:var(--size); height:var(--size);
      border-radius:50%; background:var(--g); color:#fff; display:flex; align-items:center; justify-content:center;
      font-size:22px; box-shadow:var(--shadow); cursor:pointer; z-index:var(--z)!important;
    }
    #eddy-panel{
      position:fixed; left:50%; transform:translateX(-50%);
      bottom:calc(16px + var(--size) + 10px);
      width:92vw; max-width:560px; height:38vh; max-height:380px;
      background:#fff; color:#111; border:1px solid #e8e8e8; border-radius:var(--radius);
      box-shadow:var(--shadow); display:none; flex-direction:column; z-index:var(--z)!important; overflow:hidden;
    }
    #eddy-head{ background:var(--g); color:#fff; padding:10px 14px; font-weight:700; display:flex; align-items:center; gap:10px }
    #eddy-close{ margin-left:auto; background:transparent; border:0; color:#fff; font-size:18px; cursor:pointer }
    #eddy-body{ padding:12px 14px; flex:1; overflow:auto; line-height:1.5; font-size:16px }
    #eddy-inputbar{ display:flex; gap:10px; align-items:center; padding:10px; border-top:1px solid #eee; background:#fafafa }
    #eddy-input{ flex:1; border:none; background:#fff; border-radius:10px; padding:10px 12px; font-size:16px; outline:none }
    #eddy-send{ width:48px; height:42px; border-radius:10px; border:none; background:var(--g); color:#fff; cursor:pointer }
    input,textarea{ font-size:16px !important; } /* anti-zoom iOS */
  `;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const el = (t, a={}, c=[]) => { const e=document.createElement(t);
    Object.entries(a).forEach(([k,v]) => k==='style' ? Object.assign(e.style,v) : e.setAttribute(k,v));
    (Array.isArray(c)?c:[c]).filter(Boolean).forEach(x=>e.append(x)); return e; };

  const bubble = el('div', { id:'eddy-bubble', title:'Parler à Eddy' }, '💬');
  const panel  = el('div', { id:'eddy-panel' });
  const head   = el('div', { id:'eddy-head' }, [ TITLE, el('button',{id:'eddy-close'}, '✕') ]);
  const body   = el('div', { id:'eddy-body' }, 'Salut 👋 Pose-moi ta question.');
  const bar    = el('div', { id:'eddy-inputbar' });
  const input  = el('input', { id:'eddy-input', autocomplete:'off', placeholder:'Écris ici…' });
  const send   = el('button', { id:'eddy-send' }, '➜');

  bar.append(input, send); panel.append(head, body, bar);
  document.addEventListener('DOMContentLoaded', () => { document.body.append(bubble, panel); });

  const open  = () => { panel.style.display='flex'; setTimeout(()=>input.focus(), 30); };
  const close = () => { panel.style.display='none'; };
  bubble.addEventListener('click', open); head.querySelector('#eddy-close').addEventListener('click', close);

  const line = (who, txt) => { const row=el('div',{},[el('b',{},who+': '), txt]); body.append(row); body.scrollTop=body.scrollHeight; };

  async function ask(){
    const msg=(input.value||'').trim(); if(!msg) return;
    input.value=''; line('Vous', msg);
    const thinking = el('div',{},'Eddy réfléchit…'); body.append(thinking); body.scrollTop=body.scrollHeight;
    try{
      const r = await fetch(API_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ message: msg }) });
      if (!r.ok) throw new Error('status_'+r.status);
      const j = await r.json(); thinking.remove();
      line('Eddy', j.reply || 'OK.');
    }catch(e){
      thinking.remove(); line('Eddy','(réseau capricieux 🌧 — réessaye)');
    }
  }
  send.addEventListener('click', ask);
  input.addEventListener('keydown', e => { if (e.key==='Enter'){ e.preventDefault(); ask(); }});
})();
