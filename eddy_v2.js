// eddy_v2.js — API V2 : ta personnalité + cerveau ChatGPT, sans rien casser côté widget.
// Endpoints : GET /api/health-v2  |  POST /api/reply-v2  (JSON: {message})
// Si OPENAI_API_KEY absent ou erreur API -> fallback Eddy (clair, utile, jamais bloqué).

const SYSTEM_PROMPT = `
Tu es Eddy 🌲, 36 ans, Lyon. Pas "coach" : référence du terrain.
— Ton ton : tutoiement, cash, humain, concret. Tu parles comme à un pote.
— Tu simplifies et donnes des actions utilisables tout de suite.
— Tu peux lâcher une punchline légère pour recadrer sans juger.
— Tu termines parfois par "Famille 🌲 — simple et efficace."
— Si c’est flou : tu reformules en 1 phrase et poses 1-2 questions ciblées, puis proposes une piste d’action minimale pour avancer.

Principes rapides :
1) Agir > débattre. 2) Les excuses freinent. 3) Corps = outil, mental = moteur, envie = carburant.
Nutrition : vrai > parfait. Évite sucres/industriel. Explique simplement le "pourquoi".
Entraînement : "Bouge et ça marche". Programme OK si tu l’aimes et tu le fais à fond.

Format de réponse :
- Commence par répondre DIRECT à la question.
- Enchaîne avec 1-3 conseils actionnables (liste courte).
- Si utile, propose une question de précision (une seule).
- Reste court, net, utilisable. Pas de roman.
`;

function send(res, code, data) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(code).end(JSON.stringify(data));
}

// Fallback Eddy si pas d'IA (clé manquante / API down)
function eddyFallback(msg) {
  const m = (msg || '').toLowerCase();

  // Mini-heuristiques utiles, mais sans verrouiller les sujets
  if (m.includes('whey') && m.includes('iso')) {
    return "Whey = polyvalente au quotidien. Iso = plus filtrée, moins de lactose. Choisis selon budget/tolérance. Actions : 1) prends celle que tu tolères, 2) 25-30 g post-training. Famille 🌲.";
  }
  if (m.includes('whey')) {
    return "Whey → simple, efficace. 25-30 g après l’entraînement ou en collation. Besoin : tu vises masse ou sec ?";
  }
  if (/(masse|gainer|prise de masse)/.test(m)) {
    return "Masse propre = surplus léger + vrai solide (riz/œufs/huile d’olive) + whey en appoint. Gainer seulement si le solide ne suffit pas. Teste +200 kcal/j 10 jours. Famille 🌲.";
  }

  // Par défaut : recadrage Eddy + micro-plan d’action
  return "Dis-moi précisément ce que tu veux régler (objectif + contexte actuel). En attendant : 1) 8k pas/j, 2) 3 repas vrais, 3) dors 7 h. On ajuste ensuite. Famille 🌲.";
}

async function askOpenAI(userMsg) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('NO_OPENAI_KEY');

  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': Bearer ${apiKey},
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.6,
      max_tokens: 380,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMsg }
      ]
    })
  });

  if (!r.ok) {
    const t = await r.text().catch(()=>'');
    throw new Error(OPENAI_${r.status}:${t.slice(0,200)});
  }
  const data = await r.json();
  return (data.choices?.[0]?.message?.content || '').trim();
}

module.exports = async (req, res) => {
  try {
    if (req.method === 'OPTIONS') return send(res, 204, { ok: true });
    if (req.method === 'GET')     return send(res, 200, { ok: true, message: 'Eddy API v2 en ligne ✅' });
    if (req.method !== 'POST')    return send(res, 405, { error: 'method_not_allowed' });

    let raw = '';
    await new Promise((done)=>{ req.on('data', c => raw += c); req.on('end', done); });
    const body = JSON.parse(raw || '{}');
    const msg  = String(body.message || '').trim();

    if (!msg) return send(res, 200, { reply: "Formule ta question et je te réponds net. Commence par objectif + contrainte. Famille 🌲." });

    // 1) Essaie l’IA complète (ta personnalité est dans SYSTEM_PROMPT)
    try {
      const ai = await askOpenAI(msg);
      if (ai) return send(res, 200, { reply: ai });
    } catch (e) {
      console.warn('V2 AI error -> fallback', e.message);
    }

    // 2) Fallback Eddy : jamais bloqué
    return send(res, 200, { reply: eddyFallback(msg) });

  } catch (err) {
    return send(res, 500, { error: 'server_error', detail: String(err?.message || err) });
  }
};
