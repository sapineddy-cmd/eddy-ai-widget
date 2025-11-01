(function () {
  if (window.__eddyWidgetLoaded) return;
  window.__eddyWidgetLoaded = true;

  // Styles
  var style = document.createElement('style');
  style.textContent =
    '#eddy-bubble{position:fixed;bottom:20px;right:20px;width:56px;height:56px;border-radius:50%;background:#1a3821;color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;cursor:pointer;z-index:999999;box-shadow:0 6px 20px rgba(0,0,0,.2)}' +
    '#eddy-panel{position:fixed;bottom:90px;right:20px;width:320px;max-width:90vw;height:420px;background:#fff;border:1px solid #ddd;border-radius:12px;display:none;flex-direction:column;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.2);z-index:999999}' +
    '#eddy-head{padding:10px 12px;background:#1a3821;color:#fff;font-weight:600}' +
    '#eddy-body{padding:10px;flex:1;overflow:auto;font-size:14px}' +
    '#eddy-input{display:flex;border-top:1px solid #eee}' +
    '#eddy-input input{flex:1;border:0;padding:10px;font-size:14px}' +
    '#eddy-input button{border:0;padding:0 14px;background:#1a3821;color:#fff}';
  document.head.appendChild(style);

  // UI
  var b = document.createElement('div');
  b.id = 'eddy-bubble';
  b.textContent = '💬';

  var p = document.createElement('div');
  p.id = 'eddy-panel';
  p.innerHTML =
    '<div id="eddy-head">Eddy – Assistant IA</div>' +
    '<div id="eddy-body">Dis-moi ce dont tu as besoin 👋</div>' +
    '<div id="eddy-input"><input id="eddy-txt" placeholder="Pose ta question…"/><button id="eddy-send">→</button></div>';

  document.body.appendChild(b);
  document.body.appendChild(p);

  b.addEventListener('click', function () {
    p.style.display = p.style.display === 'flex' ? 'none' : 'flex';
    if (p.style.display === 'flex') document.getElementById('eddy-txt').focus();
  });

  document.getElementById('eddy-send').addEventListener('click', send);
  document.getElementById('eddy-txt').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') send();
  });

  function send() {
    var txt = document.getElementById('eddy-txt');
    var msg = (txt.value || '').trim();
    if (!msg) return;
    var body = document.getElementById('eddy-body');
    body.innerHTML += '<div><b>Vous:</b> ' + esc(msg) + '</div>';
    txt.value = '';
    // Réponse placeholder pour valider l’intégration
    setTimeout(function () {
      body.innerHTML += '<div style="color:#1a3821"><b>Eddy:</b> Je suis opérationnel ✅</div>';
      body.scrollTop = body.scrollHeight;
    }, 400);
  }

  function esc(s) {
    return s.replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }
})();
