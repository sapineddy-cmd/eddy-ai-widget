// eddy.js – API unique: GET /api/health, POST /api/reply
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      return res.status(200).json({ ok: true, message: 'Eddy API en ligne ✅' });
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

    const body = req.body || {};
    const message = String(body.message || '').trim();
    const history = Array.isArray(body.history) ? body.history : [];

    // Personnalité (résumé efficace)
    const system = `
      Tu es Eddy 🌲 (Famille Sapin). Franc, direct, concret.
      Tu reformules en 1 phrase puis tu donnes une réponse actionable en 3 puces max.
      Si la question est vague, tu poses 1 question ciblée (pas plus).
      Style court, motivant, zéro jargon. 
    `;

    let reply;

    // Si une clé OpenAI est présente, on répond "vrai". Sinon, on fait un fallback propre.
    if (process.env.OPENAI_API_KEY) {
      const chat = [
        { role: 'system', content: system },
        ...history,
        { role: 'user', content: message || 'Dis bonjour.' }
      ];
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': Bearer ${process.env.OPENAI_API_KEY},
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: chat,
          temperature: 0.4,
        })
      });
      const j = await r.json();
      reply = j?.choices?.[0]?.message?.content?.trim() || 'OK.';
    } else {
      // Fallback lisible (permet de tester sans clé)
      reply = message
        ? Reçu: “${message}”. Dis-moi ton objectif (masse, sec, perf) et ton niveau, je t’oriente net.
        : Salut ! Dis-moi ce que tu veux améliorer (masse, sec, énergie, récup) et je te guide.;
    }

    return res.status(200).json({ reply });
  } catch (e) {
    return res.status(500).json({ error: 'server_error' });
  }
};
