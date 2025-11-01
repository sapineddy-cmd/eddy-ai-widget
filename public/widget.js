(() => {
  // Evite double injection
  if (window._eddyWidgetLoaded) return; window._eddyWidgetLoaded = true;

  // URL API fixe (le site pilote tout via Vercel)
  const API = 'https://eddy-ai-widget.vercel.app/api/reply';

  // Styles robustes (z-index max, anti-conflit thème)
  const css = `
    :root{
      --eddy-green:#143C26; --eddy-bg:#fff; --eddy-shadow:0 10px 30px rgba(0,0,0,.18);
      --eddy-radius:14px; --eddy-size:54px; --eddy-z:2147483647;
    }
    #eddy-bubble{
      position:fixed; right:16px; bottom:16px; width:var(--eddy-size); height:var(--eddy-size);
      border-radius:50%; background:var(--eddy-green); color:#fff; display:flex; align-items:center; justify-content:center;
      box-shadow:var(--eddy-shadow); cursor:pointer; z-index:var(--eddy-z) !important;
    }
    #eddy-bubble svg{ width:26px; height:26px; fill:#fff }
    #eddy-panel{
      position:fixed; right:12px; bottom:calc(16px + var(--eddy-size) + 10px);
      width: 90vw; max-width: 580px; height: 44vh; max-height: 420px;
      background:var(--eddy-bg); color:#111; border-radius:var(--eddy-radius);
      border:1px solid #e8e8e8; box-shadow:var(--eddy-shadow); overflow:hidden; z-index:var(--eddy-z) !important;
      display:none; flex-direction:column;
    }
    #eddy-head{
      background:var(--eddy-green); color:#fff; padding:12px 16px; font-weight:700; display:flex; align-items:center; gap:10px;
    }
    #eddy-close{ margin-left:auto; cursor:pointer; opacity:.9 }
    #eddy-body{ padding:14px 16px; flex:1; overflow:auto; line-height:1.5 }
    #eddy-body b{ color:#1a3821 }
    #eddy-inputbar{ display:flex; gap:10px; align-items:center; padding:10px; border-top:1px solid #eee; background:#fafafa }
    #eddy-input{
      flex:1; border:none; background:#fff; border-radius:10px; padding:10px 12px; font-size:16px; outline:none;
    }
    #eddy-send{
      width:48px; height:42px; border-radius:10px; border:none; background:var(--eddy-green); color:#fff; cursor:pointer;
    }
    @media (max-width:768px){
      #eddy-panel{ width:94vw; right:3vw; height:38vh; max-height:360px; }
      :root{ --eddy-size:52px; }
    }
    input, textarea { font-size:16px !important; } /* anti-zoom iOS */
  `;

  // Helpers
  const el = (tag, attrs={}, children=[]) => {
    const e = document.createElement(tag);
    Object.entries(attrs).forEach(([k,v]) => k==='style' ? Object.assign(e.style, v) : e.setAttribute(k,v));
    (Array.isArray(children)?children:[children]).filter(Boolean).forEach(c => e.append(c));
    return e;
  };

  const boot = () => {
    if (document.getElementById('eddy-bubble')) return;

    document.head.appendChild(el('style', {}, css));

    const bubble = el('div', { id:'eddy-bubble', title:'Parler à Eddy' },
      el('svg', { viewBox:'0 0 24 24' }, [ el('path', { d:'M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z' }) ])
    );

    const panel = el('div', { id:'eddy-panel' });

    // Titre demandé : "Pose ta question à 🌲 Eddy"
    const head  = el('div', { id:'eddy-head' }, [
      'Pose ta question à 🌲 Eddy',
      el('span', { id:'eddy-close' }, '✕')
    ]);

    const body  = el('div', { id:'eddy-body' });
    const bar   = el('div', { id:'eddy-inputbar' });
    const input = el('input', { id:'eddy-input', placeholder:'Écris ici…', autocomplete:'off' });
    const send  = el('button', { id:'eddy-send' }, '➜');

    bar.append(input, send);
    panel.append(head, body, bar);
    document.body.append(bubble, panel);

    // Intro
    body.append(el('div', {}, 'Salut 👋 Pose-moi ta question.'));
    const history = [];

    const open = () => { panel.style.display='flex'; setTimeout(()=>input.focus(),30); };
    const close = () => { panel.style.display='none'; };
    const toggle = () => panel.style.display==='flex' ? close() : open();

    bubble.addEventListener('click', toggle);
    head.querySelector('#eddy-close').addEventListener('click', close);

    const addLine = (who, text) => {
      body.append(el('div', {}, [ el('b', {}, who+': '), text ]));
      body.scrollTop = body.scrollHeight;
    };

    async function ask() {
      const msg = input.value.trim();
      if (!msg) return;
      input.value = '';
      addLine('Vous', msg);
      history.push({ role:'user', content: msg });

      const thinking = el('div', {}, 'Eddy réfléchit…');
      body.append(thinking); body.scrollTop = body.scrollHeight;

      try {
        const r = await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: msg, history })
        });
        if (!r.ok) throw new Error('bad_status_'+r.status);
        const j = await r.json();
        thinking.remove();
        const rep = (j && j.reply) ? j.reply : 'OK.';
        addLine('Eddy', rep);
        history.push({ role:'assistant', content: rep });
      } catch (e) {
        thinking.remove();
        addLine('Eddy', '(réseau capricieux 🌧 — réessaie)');
      }
    }

    send.addEventListener('click', ask);
    input.addEventListener('keydown', (e)=>{ if (e.key === 'Enter') ask(); });

    // Garder la fenêtre visible quand l’écran bouge (mobile)
    const fix = () => { panel.style.bottom = calc(16px + var(--eddy-size) + 10px); };
    window.addEventListener('resize', fix); fix();
  };

  (document.readyState === 'loading')
    ? document.addEventListener('DOMContentLoaded', boot)
    : boot();
})();
