(()=> {
  // Evite double-injection
  if (window._eddyWidgetLoaded) return; window._eddyWidgetLoaded = true;

  // Styles minimaux (anti-conflits avec le thème)
  const css = `
  #eddy-bubble{position:fixed;right:16px;bottom:16px;width:56px;height:56px;border-radius:50%;
    background:#143C26;color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;cursor:pointer;
    z-index:2147483647 !important; box-shadow:0 6px 18px rgba(0,0,0,.2)}
  #eddy-panel{position:fixed;left:50%;transform:translateX(-50%);bottom:90px;width:300px;height:220px;max-width:92vw;
    background:#fff;border:1px solid #e8e8e8;border-radius:12px;box-shadow:0 10px 24px rgba(0,0,0,.2);
    display:none;flex-direction:column;overflow:hidden;z-index:2147483647 !important}
  #eddy-head{background:#143C26;color:#fff;padding:10px 12px;font-weight:700;display:flex;align-items:center;justify-content:space-between}
  #eddy-body{flex:1;padding:12px;font-size:14px;color:#222}
  #eddy-x{background:transparent;border:0;color:#fff;font-size:18px;cursor:pointer}
  `;
  const st=document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // Attendre que le body soit prêt
  function ready(fn){ document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn):fn(); }

  ready(()=> {
    // Si déjà présent, ne pas dupliquer
    if (document.getElementById('eddy-bubble')) return;

    // Bulle
    const bubble = document.createElement('div');
    bubble.id='eddy-bubble';
    bubble.setAttribute('aria-label','Ouvrir le chat Eddy');
    bubble.textContent='💬';

    // Panneau test
    const panel = document.createElement('div'); panel.id='eddy-panel';
    panel.innerHTML = `
      <div id="eddy-head">
        <div>Pose ta question à 🌲 Eddy</div>
        <button id="eddy-x">×</button>
      </div>
      <div id="eddy-body">✅ Widget OK. Cette vue est un test fumée. Si tu la vois, tout est bon côté <em>widget.js</em>.<br><br>
      Étape suivante : on remet la version complète (IA).</div>
    `;

    document.body.appendChild(bubble);
    document.body.appendChild(panel);

    // Ouverture / fermeture
    bubble.addEventListener('click', ()=> { panel.style.display='flex'; });
    panel.querySelector('#eddy-x').addEventListener('click', ()=> { panel.style.display='none'; });

    // Petit log pour vérifier le chargement
    console.log('[EddyWidget] smoke test loaded');
  });
})();
