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
