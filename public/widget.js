const css = `
#edy-bubble{
  position:fixed;right:${RIGHT}px;bottom:${BOTTOM}px;width:${SIZE}px;height:${SIZE}px;border-radius:50%;
  background:${COLOR};color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;line-height:1;
  cursor:pointer;z-index:2147483647;box-shadow:0 4px 12px rgba(0,0,0,.18)
}
#edy-panel{
  position:fixed;left:50%;transform:translateX(-50%);
  bottom:${BOTTOM + SIZE + 8}px;
  width:${PANEL.w}px;height:${PANEL.h - 40}px; /* -40 pour compacter */
  max-width:92vw;max-height:60vh; /* limite haute visible */
  background:#fff;border:1px solid #e8e8e8;border-radius:12px;
  box-shadow:0 10px 24px rgba(0,0,0,.20);
  display:none;flex-direction:column;overflow:hidden;
  z-index:2147483647;transition:all .2s ease
}
#edy-head{background:${COLOR};color:#fff;padding:6px 10px;font-weight:600;
  display:flex;align-items:center;justify-content:space-between;font-size:15px}
#edy-body{flex:1;padding:8px;overflow:auto;font-size:14px;color:#222}
#edy-inputbar{display:flex;border-top:1px solid #eee}
#edy-txt{flex:1;border:0;padding:10px;font-size:16px;outline:none;-webkit-text-size-adjust:100%}
#edy-send{border:0;background:${COLOR};color:#fff;padding:0 12px;font-size:16px;cursor:pointer}
@media (max-width:768px){
  #edy-panel{
    width:92vw;
    height:34vh;            /* plus petit = entièrement visible */
    bottom:${BOTTOM + SIZE + 4}px;
  }
}
`;
