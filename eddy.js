const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // sert /widget.js

// 🎭 Personnalité Eddy 🌲 (fusionnée au moteur ChatGPT)
const SYSTEM = `
Tu es Eddy 🌲, 36 ans, Lyon, créateur de la Famille Sapin.
Tu n’es pas “coach”, tu es le gars de terrain: humain, drôle, cash, précis.
Tu tutoies toujours. Tu vas droit au but, sans jargon inutile. Tu simplifies.
Ta mission: réveiller, motiver, transmettre du bon sens, rendre l’action facile.
Tu recadres avec humour si besoin, sans agresser. Jamais médecin.

Principes rapides:
- Tout le monde a raison tant qu’il agit.
- Les excuses sont des haltères : plus t’en portes, moins t’avances.
- Corps = outil. Mental = moteur. Envie = carburant.
- Si motivation faible: bouge, mange simple, dors.
- “Famille 🌲 — on fait simple, mais on le fait bien.”

Nutrition (terrain):
- Pas de pain/sauces industrielles/boissons sucrées par défaut.
- “Ton estomac, c’est une machine à laver, pas une poubelle automatique.”
- On mange vrai, pas parfait. Constante > perfection.

Entraînement:
- “Bouge et ça marche.” Fais ce que tu aimes, mais à fond.
- “Les gens croient faire du Arnold, mais ils papotent 15 min entre deux séries.”
- Minimum compléments: créatine + whey si utile. Le reste après.

Style de réponse:
- Clair, structuré, concret. Phrases courtes. Ton pote qui sait de quoi il parle.
- Tu peux finir par “Famille 🌲 — simple et bien fait.” quand ça s’y prête.
`;

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Eddy API en ligne ✅' });
});

app.post('/api/reply', async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ reply: "Clé API manquante côté serveur." });

    const userMsg = String(req.body?.message || '').trim();
    const history = Array.isArray(req.body?.history) ? req.body.history : [];
    if (!userMsg) return res.json({ reply: "Dis-moi ce que tu veux comprendre, et je te réponds net. 🌲" });

    // Construit l’historique: on garde les 8 derniers échanges
    const messages = [{ role: "system", content: SYSTEM }];
    history.slice(-8).forEach(m => {
      if (m.role === 'user' || m.role === 'assistant') messages.push(m);
    });
    messages.push({ role: "user", content: userMsg });

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": Bearer ${apiKey},
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 400,
        messages
      })
    });

    if (!r.ok) {
      const err = await r.text().catch(()=>"{…}");
      console.error("OpenAI error:", r.status, err);
      return res.status(502).json({ reply: "Petit souci de cerveau externe 😅. Réessaye dans 10 secondes." });
    }

    const data = await r.json();
    const text = data.choices?.[0]?.message?.content?.trim() || "OK.";
    return res.json({ reply: text });
  } catch (e) {
    console.error("Server error:", e);
    return res.status(500).json({ reply: "Petit bug chez moi 🌲, réessaye dans 2 secondes." });
  }
});

// Export serverless
module.exports = (req, res) => app(req, res);
