(() => {
  // ====== CONFIG ======
  const API_URL = "https://eddy-ai-widget.vercel.app/api/eddy"; // ton endpoint Vercel
  const HEADER_TITLE = "Pose ta question à 🌲 Eddy";
  const THEME = {
    green: "#123C21", // vert foncé thème
    bg: "#ffffff",
    text: "#0f172a"
  };

  // ====== STYLES ======
  const css = `
  :root{
    --eddy-size:56px;
    --eddy-right:16px;
    --eddy-bottom:16px;
    --eddy-kb:0px; /* compensation clavier */
    --eddy-radius:14px;
    --eddy-shadow:0 10px 30px rgba(0,0,0,.22);
  }

  /* Bulle */
  #eddy-bubble{
    position:fixed; right:var(--eddy-right); bottom:calc(var(--eddy-bottom) + var(--eddy-kb));
    width:var(--eddy-size); height:var(--eddy-size);
    border-radius:999px; background:${THEME.green}; color:#fff;
    display:flex; align-items:center; justify-content:center;
    box-shadow:var(--eddy-shadow); cursor:pointer; z-index:2147483000;
    transition:transform .15s ease, opacity .2s ease;
  }
  #eddy-bubble:hover{ transform:translateY(-2px); opacity:.95; }
  #eddy-bubble svg{ width:26px; height:26px; fill:#fff; }

  /* Panneau */
  #eddy-panel{
    position:fixed; right:12px;
    bottom:calc(var(--eddy-bottom) + var(--eddy-kb));
    width:min(92vw, 560px);
    background:${THEME.bg}; color:${THEME.text};
    border-radius:var(--eddy-radius);
    box-shadow:var(--eddy-shadow);
    overflow:hidden; z-index:2147483001; display:none;
  }
  /* Taille adaptée mobile et clavier */
  @media (max-width:768px){
    #eddy-panel{ left:12px; right:12px; width:auto; }
  }

  #eddy-head{
    background:${THEME.green}; color:#fff;
    font-weight:700; padding:14px 16px; letter-spacing:.2px;
    display:flex; align-items:center; justify-content:space-between;
  }
  #eddy-close{ cursor:pointer; opacity:.9; }
  #eddy-close:hover{ opacity:1; }

  #eddy-body{
    padding:16px; max-height:46vh; overflow:auto; line-height:1.5;
  }
  /* Quand clavier iOS s’ouvre: on gagne de la place sans zoom */
  @media (max-width:768px){
    #eddy-body{ max-height:58vh; }
  }

  .eddy-row{ margin:10px 0; }
  .eddy-me{ color:#0f172a; font-weight:700; }
  .eddy-bot{ color:${THEME.text}; }
  .eddy-hint{ color:#64748b; font-style:italic; }

  #eddy-input-bar{
    display:flex; gap:0; align-items:center; border-top:1px solid #e5e7eb;
  }
  #eddy-input{
    width:100%; border:none; padding:14px 12px; font-size:16px; outline:none;
  }
  /* Anti-zoom iOS */
  input, textarea{ font-size:16px !important; }

  #eddy-send{
    width:58px; height:48px; background:${THEME.green}; color:#fff; border:none;
    display:flex; align-items:center; justify-content:center; cursor:pointer;
  }
  #eddy-send svg{ width:20px; height:20px; fill:#fff; }
  `;

  // ====== DOM ======
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const bubble = document.createElement("div");
  bubble.id = "eddy-bubble";
  bubble.setAttribute("aria-label", "Ouvrir l’assistant Eddy");
  bubble.innerHTML = <svg viewBox="0 0 24 24"><path d="M12 3C7.03 3 3 6.58 3 11c0 2.12 1.01 4.04 2.66 5.5L5 21l4.03-2.15c.93.26 1.93.41 2.97.41 4.97 0 9-3.58 9-8s-4.03-8-9-8z"/></svg>;

  const panel = document.createElement("div");
  panel.id = "eddy-panel";
  panel.innerHTML = `
    <div id="eddy-head">
      <span>${HEADER_TITLE}</span>
      <span id="eddy-close" aria-label="Fermer">✖</span>
    </div>
    <div id="eddy-body">
      <div class="eddy-row eddy-bot">Salut 👋 Pose-moi ta question.</div>
    </div>
    <div id="eddy-input-bar">
      <input id="eddy-input" type="text" placeholder="Écris ici..." autocomplete="off" />
      <button id="eddy-send" aria-label="Envoyer">
        <svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
      </button>
    </div>
  `;

  document.body.appendChild(bubble);
  document.body.appendChild(panel);

  const body = document.getElementById("eddy-body");
  const input = document.getElementById("eddy-input");
  const btnSend = document.getElementById("eddy-send");
  const btnClose = document.getElementById("eddy-close");

  // ====== OUVERTURE / FERMETURE ======
  const open = () => { panel.style.display = "block"; input.focus(); scrollBottom(); };
  const close = () => { panel.style.display = "none"; };
  bubble.addEventListener("click", open);
  btnClose.addEventListener("click", close);

  // ====== CLAVIER MOBILE (VisualViewport) ======
  const vv = window.visualViewport;
  function adjustForKeyboard(){
    if (!vv) return;
    // espace pris par le clavier = (innerHeight - viewportHeight - offsetTop)
    const taken = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
    document.documentElement.style.setProperty("--eddy-kb", taken ? (taken + 6) + "px" : "0px");
  }
  if (vv){
    vv.addEventListener("resize", adjustForKeyboard);
    vv.addEventListener("scroll", adjustForKeyboard);
    adjustForKeyboard();
  }

  // ====== OUTILS UI ======
  function addUser(text){
    const d = document.createElement("div");
    d.className = "eddy-row eddy-me";
    d.textContent = Vous: ${text};
    body.appendChild(d);
  }
  function addBot(text, asHint=false){
    const d = document.createElement("div");
    d.className = "eddy-row " + (asHint ? "eddy-hint" : "eddy-bot");
    d.textContent = Eddy: ${text};
    body.appendChild(d);
  }
  function scrollBottom(){ body.scrollTop = body.scrollHeight; }

  // ====== ENVOI ======
  async function ask(msg){
    addUser(msg);
    addBot("…", true); // typing
    scrollBottom();

    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 12000);

    try{
      const r = await fetch(API_URL, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ message: msg }),
        signal:controller.signal
      });
      clearTimeout(t);

      if(!r.ok) throw new Error("HTTP " + r.status);
      const data = await r.json();
      // remplace le "…"
      body.lastElementChild.remove();
      addBot(data.reply || "(pas de réponse)");
    }catch(e){
      // remplace le "…"
      body.lastElementChild.remove();
      addBot("(réseau capricieux 🌧 — réessaie)", true);
    }finally{
      scrollBottom();
    }
  }

  function send(){
    const v = (input.value || "").trim();
    if(!v) return;
    input.value = "";
    ask(v);
  }

  btnSend.addEventListener("click", send);
  input.addEventListener("keydown", (e)=>{ if(e.key==="Enter"){ e.preventDefault(); send(); }});

  // Ouverture douce si hash ?assistant
  if (location.hash.includes("assistant")) open();
})();
