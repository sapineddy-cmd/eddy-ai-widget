<style>
  /* Réglages rapides – change seulement ces 4 valeurs si besoin */
  :root{
    --eddy-color:#1a3821;   /* vert thème */
    --eddy-size:44px;       /* taille bulle */
    --eddy-right:14px;      /* marge droite */
    --eddy-bottom:14px;     /* marge bas */
  }

  /* Bulle très discrète */
  #eddy-bubble{
    width:var(--eddy-size);
    height:var(--eddy-size);
    right:var(--eddy-right)!important;
    bottom:var(--eddy-bottom)!important;
    background:var(--eddy-color)!important;
    font-size:20px!important;
    box-shadow:0 4px 12px rgba(0,0,0,.18)!important;
    opacity:.92!important;
    border: none!important;
  }
  #eddy-bubble:hover{ opacity:1; transform:translateY(-1px); }

  /* Panneau propre et sobre */
  #eddy-panel{
    width:320px; max-width:92vw; height:420px;
    border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,.22);
    border:1px solid #e8e8e8; overflow:hidden;
    right:calc(var(--eddy-right) + 0px)!important;
    bottom:calc(var(--eddy-bottom) + 56px)!important;
  }
  /* En-tête/zone de saisie si présents */
  #eddy-head{ background:var(--eddy-color); color:#fff; font-weight:600; }
  #eddy-input input{ outline:none; }
  @media (max-width:768px){
    :root{ --eddy-size:40px; --eddy-right:12px; --eddy-bottom:12px; }
    #eddy-panel{ width:92vw; height:70vh; right:4vw!important; bottom:calc(var(--eddy-bottom) + 52px)!important; }
  }
</style>
