// eddy.js – API unique: GET /api/health, POST /api/reply (CORS-ok)
function send(res, code, data) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');               // autorise Shopify
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(code).end(JSON.stringify(data));
}

module.exports = async (req, res) => {
  try {
    // Préflight CORS
    if (req.method === 'OPTIONS') return send(res, 204, { ok: true });

    // Ping
    if (req.method === 'GET') return send(res, 200, { ok: true, message: 'Eddy API en ligne ✅' });

    if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' });

    const body = req.body || {};
    const message = String(body.message || '').trim();
    const history = Array.isArray(body.history) ? body.history : [];

    // Personnalité (compacte + efficace)
    const system = `
      Tu es Eddy 🌲 (Famille Sapin). Franc, direct, concret.
      1) Reformule en 1 phrase.
      2) Donne 3 puces actionnables max.
      3) Si la question est floue, pose 1 seule question ciblée.
      Style court, motivant, zéro jargon.
    `;

    let reply;

    if (process.env.OPENAI_API_KEY) {
      // Utilise la fetch native Node 18+ (pas de dépendances)
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': Bearer ${process.env.OPENAI_API_KEY},
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.4,
          messages: [
            { role: 'system', content: system },
            ...history,
            { role: 'user', content: message || 'Dis bonjour.' }
          ]
        })
      });
      const j = await r.json();
      reply = j?.choices?.[0]?.message?.content?.trim() || 'OK.';
    } else {
      // Fallback sans clé (pour tester sans boucle)
      reply = message
        ? Reçu: “${message}”. Dis-moi ton objectif (masse, sec, perf) et ton niveau, je te réponds net.
        : Salut ! Dis-moi ce que tu veux améliorer (masse, sec, énergie, récup) et je te guide.;
    }

    return send(res, 200, { reply, echo: { message, historyLen: history.length } });
  } catch (e) {
    return send(res, 500, { error: 'server_error' });
  }
};
