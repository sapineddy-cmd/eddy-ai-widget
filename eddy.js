const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // autorise Shopify à appeler l’API
app.use(express.json());
app.use(express.static('public')); // sert /widget.js

// 🧠 Personnalité (ton texte)
const system = Eddy 🌲, … (ton texte perso complet que tu as collé plus tôt) ...;

// Healthcheck pour test rapide dans le navigateur
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Eddy API up' });
});

// Réponses simples (anti-boucle)
app.post('/api/reply', async (req, res) => {
  const q = String((req.body?.message || '')).trim().toLowerCase();

  if (!q) return res.json({ reply: "Dis-moi ce que tu veux comprendre, on fait simple et vrai. 🌲" });

  if (q.includes('whey') && q.includes('iso')) {
    return res.json({ reply: "Whey pour le quotidien, Iso si tu veux du très propre (moins de lactose). Choisis selon ton objectif et ton budget. 🌲" });
  }
  if (q.includes('whey')) {
    return res.json({ reply: "Whey → polyvalente, efficace après l’entraînement. Tu vises masse ou sec ?" });
  }
  if (q.includes('iso')) {
    return res.json({ reply: "Iso → plus filtrée, plus clean. Top si tu veux minimiser le lactose." });
  }

  // défaut (style Eddy)
  return res.json({ reply: "Je t’écoute. Pose ta question précise et j’y vais droit. 🌲" });
});

// ⛔ IMPORTANT : pas de app.listen ici
// Vercel attend un handler (fonction) :
module.exports = (req, res) => app(req, res);
