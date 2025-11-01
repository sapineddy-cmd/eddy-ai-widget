(() => {
  const chatBubble = document.createElement('div');
  chatBubble.id = 'eddy-ai-bubble';
  chatBubble.textContent = '💬';
  chatBubble.style.cssText = `
    position: fixed;
    bottom: 25px;
    right: 25px;
    background: #1a3821;
    color: white;
    font-size: 28px;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    z-index: 9999;
    transition: 0.3s;
  `;
  document.body.appendChild(chatBubble);

  const panel = document.createElement('div');
  panel.id = 'eddy-panel';
  panel.innerHTML = `
    <div style="background:#1a3821;color:white;padding:10px;">Eddy 🌲 - Coach IA</div>
    <div id="eddy-body" style="height:200px;overflow:auto;padding:10px;">Salut 👋 Pose-moi une question !</div>
    <input id="eddy-input" type="text" placeholder="Écris ici..." style="width:100%;padding:10px;border:none;border-top:1px solid #ccc;">
  `;
  panel.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 25px;
    width: 300px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    display: none;
    flex-direction: column;
    z-index: 9999;
  `;
  document.body.appendChild(panel);

  chatBubble.onclick = () => {
    panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex';
  };
})();
