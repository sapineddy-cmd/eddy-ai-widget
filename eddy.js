// eddy.js – API: GET /api/health, POST /api/reply (CORS OK)
function send(res, code, data) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(code).end(JSON.stringify(data));
}

module.exports = async (req, res) => {
  try {
    if (req.method === 'OPTIONS') return send(res, 204, { ok: true });
    if (req.method === 'GET')     return send(res, 200, { ok: true, message: 'Eddy API en ligne ✅' });
    if (req.method !== 'POST')    return send(res, 405, { error: 'method_not_allowed' });

    const msg = String((req.body && req.body.message) || '').toLowerCase();

    // Réponses simples (la version “qui marchait”)
    if (!msg.trim()) {
      return send(res, 200, { reply: "Dis-moi ce que tu veux comprendre, on va droit. 🌲" });
    }
    if (msg.includes('whey') && msg.includes('iso')) {
      return send(res, 200, { reply: "Whey = polyvalente au quotidien. Iso = plus filtrée, moins de lactose. Choisis selon budget/tolérance. 🌲" });
    }
    if (msg.includes('whey')) {
      return send(res, 200, { reply: "Whey → simple, efficace. Tu vises masse ou sec ?" });
    }
    if (msg.includes('iso')) {
      return send(res, 200, { reply: "Iso → plus clean, moins de lactose. Top si tu es sensible. 💪" });
    }
    if (msg.includes('masse') || msg.includes('mass') || msg.includes('gainer') || msg.includes('prise de masse')) {
      return send(res, 200, { reply: "Masse = surplus propre (riz/œufs/huile d’olive) + Whey pour compléter. Gainer = optionnel. 🌲" });
    }

    return send(res, 200, { reply: "Pose ta question précise et je te réponds net. Famille 🌲." });
  } catch (e) {
    return send(res, 500, { error: 'server_error' });
  }
};
