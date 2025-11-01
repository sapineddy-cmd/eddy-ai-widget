:root{
  /* espace à laisser pour ne pas manger le header du site */
  --eddy-header-gap: 76px;      /* ajuste à 64–100px si besoin */
  --eddy-gap: 12px;              /* marge extérieure */
  --eddy-size: 56px;             /* diamètre de la bulle */
  --eddy-right: 14px;            /* position bulle/panneau à droite */
  --eddy-radius: 14px;           /* arrondi boîte */
  --kb: 0px;                     /* hauteur clavier (JS mettra à jour) */
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}

/* Bulle flottante (en bas à droite) */
#eddy-bubble{
  position: fixed; z-index: 9999;
  right: calc(var(--eddy-right));
  bottom: calc(var(--eddy-gap) + var(--safe-bottom));
  width: var(--eddy-size); height: var(--eddy-size);
  border-radius: 50%; display: grid; place-items: center;
  background:#173e2b; color:#fff; box-shadow: 0 8px 28px rgba(0,0,0,.22);
  cursor: pointer; user-select:none; -webkit-tap-highlight-color: transparent;
  transition: transform .2s ease, opacity .2s ease;
}
#eddy-bubble:hover{ transform: translateY(-1px); }

/* Panneau de dialogue */
#eddy-panel{
  position: fixed; z-index: 10000;
  right: calc(var(--eddy-right));
  /* colle en bas, mais remonte automatiquement si clavier ouvert */
  bottom: calc(max(var(--eddy-gap) + var(--safe-bottom), var(--kb) + 8px));
  width: min(92vw, 720px);
  /* HAUTEUR : on laisse TOUJOURS visible le titre du site */
  max-height: calc(100vh - var(--eddy-header-gap) - var(--eddy-gap) - var(--safe-top));
  border-radius: var(--eddy-radius); overflow: hidden;
  background:#fff; box-shadow: 0 18px 40px rgba(0,0,0,.25);
  display: none; flex-direction: column;
}

/* Titre du panneau */
#eddy-head{
  background:#173e2b; color:#fff; font-weight:700;
  padding:14px 16px; display:flex; align-items:center; gap:10px;
  font-size: 18px;
}
#eddy-head .eddy-title{ flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
#eddy-head button{
  background:transparent; border:0; color:#fff; font-size:22px; line-height:1; cursor:pointer;
}

/* Corps de discussion */
#eddy-body{
  padding:16px; height: 38vh;      /* hauteur de base */
  overflow:auto; font-size:16px; line-height:1.45; color:#101010;
}

/* Zone de saisie */
#eddy-input-wrap{
  display:flex; gap:0; align-items:center; border-top:1px solid #e7e7e7;
  background:#fff;
}
#eddy-input{
  flex:1; font-size:16px; padding:14px 14px; border:0; outline:none; background:#fff;
}
#eddy-send{
  width:56px; height:56px; border:0; background:#173e2b; color:#fff;
  font-size:20px; display:grid; place-items:center; cursor:pointer;
  border-top-left-radius:10px;
}

/* Ajustements mobiles */
@media (max-width: 768px){
  #eddy-panel{
    width: calc(100vw - 2*var(--eddy-gap));
    right: var(--eddy-gap);
    /* Quand le clavier s’ouvre, la hauteur suit la viewport sans dépasser le header */
    max-height: calc(100vh - var(--eddy-header-gap) - var(--safe-top));
  }
  #eddy-body{
    /* occupe l’espace restant pour coller au clavier */
    height: auto;
    max-height: calc(100vh - var(--eddy-header-gap) - 56px /head/ - 56px /input/ - 2*var(--eddy-gap) - var(--safe-top) - var(--safe-bottom) - var(--kb));
  }
}

/* Anti-zoom iOS */
input, textarea { font-size:16px !important; }
