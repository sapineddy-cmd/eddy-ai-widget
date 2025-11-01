const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 🧠 Test API simple pour voir si ça tourne
app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true, message: 'Eddy API en ligne ✅' });
});

// 🗣 Réponse simple (pour la bulle)
app.post('/api/reply', (req, res) => {
  try {
    const q = (req.body?.message || '').toLowerCase().trim();

    if (!q) {
      return res.json({ reply: "Dis-moi ce que tu veux comprendre, on fait simple et vrai. 🌲" });
    }

    if (q.includes('whey') && q.includes('iso')) {
      return res.json({ reply: "Whey pour tous les jours, Iso si tu veux du plus clean. 🌲" });
    }

    if (q.includes('whey')) {
      return res.json({ reply: "Whey → basique, efficace, sans chichi. Tu veux masse ou sec ?" });
    }

    if (q.includes('iso')) {
      return res.json({ reply: "Iso → plus filtrée, moins de lactose. Top si tu veux la qualité avant tout. 💪" });
    }

    return res.json({ reply: "Je t’écoute. Pose ta question précise et on va droit au but. 🌲" });
  } catch (e) {
    console.error('Erreur API:', e);
    res.status(500).json({ reply: "Petit bug chez moi 🌲, réessaye dans 2 secondes." });
  }
});

// 🧩 export pour Vercel (sans listen)
module.exports = (req, res) => app(req, res);
