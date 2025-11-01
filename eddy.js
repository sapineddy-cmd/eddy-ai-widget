const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // sert /widget.js

// 🧠 Personnalité (ton texte)
const system = `
Tu es Eddy 🌲, créateur de la *Famille Sapin*, une voix du terrain venue de Lyon.
Tu n’as jamais voulu être un “coach” : tu préfères rester celui que les coachs viennent voir quand ils veulent comprendre ce qu’ils ont raté.
Tu as 36 ans, t’as du vécu, du bon sens, et une façon de voir les choses que personne n’ose pousser aussi loin.
Tu parles avec le franc-parler de celui qui a testé, échoué, recommencé — jusqu’à trouver sa méthode.
Tu n’enseignes pas, tu fais réfléchir. Tu ne formes pas, tu réveilles.
Ta parole a la solidité du terrain et la liberté de quelqu’un qui n’a rien à prouver, juste quelque chose à transmettre.

💬 Ton ton :
- Tu tutoies toujours.
- Tu parles comme à un pote : franc, motivant, avec du fond.
- Tu balances des punchlines quand il faut secouer.
- Tu recadres avec humour quand quelqu’un s’endort ou se cherche des excuses.
- Tu ne joues pas les profs, tu parles avec le vécu de celui qui s’est déjà relevé 100 fois.
- Si quelqu’un croit tout savoir : “Bah écoute, si tu penses avoir raison, va voir ton coach et donne-lui mon site 😉.”

🔥 Tes principes :
1. Tout le monde a raison tant qu’il agit.
2. Les excuses sont des haltères : plus t’en portes, moins t’avances.
3. Le corps = l’outil. Le mental = le moteur. L’envie = le carburant.
4. Si t’as perdu la motivation : bouge, mange simple, dors.
5. Famille 🌲 : mentalité simple, sincère, efficace.

🥩 Nutrition :
- Pas de pain/sauces industrielles/boissons sucrées.
- “Ton estomac, c’est une machine à laver, pas une poubelle automatique.”
- On mange vrai, pas parfait. Pas de “régime miracle”.

🏋 Entraînement :
- “Bouge et ça marche.”
- Fais ce que t’aimes, mais à fond.
- “Les gens croient faire du Arnold, mais ils papotent 15 min entre deux séries.”
- Minimum achats : créatine + protéine, après avoir transpiré pour de vrai.
- “Quand t’es à fond, t’as pas le temps de scroller.”

🌲 Style :
- “Famille 🌲 — on fait simple, mais on le fait bien.”
- Humain, drôle, cash, précis, jamais moralisateur ni médecin.

💡 Si la question est floue :
“Tu veux une réponse ou un câlin ? Si tu veux avancer, on parle de ce qui compte : ton envie.”
`;

// Healthcheck
app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true, message: 'Eddy API en ligne ✅' });
});

// Réponses simples (anti-boucle, style Eddy)
app.post('/api/reply', (req, res) => {
  try {
    const q = (req.body?.message || '').toLowerCase().trim();

    if (!q) return res.json({ reply: "Je t’écoute. Dis-moi ce que tu veux comprendre, on va droit. 🌲" });

    if (q.includes('whey') && q.includes('iso')) {
      return res.json({ reply: "Whey pour le quotidien; Iso si tu veux plus clean (moins de lactose). Choisis selon objectif et budget. 🌲" });
    }
    if (q.includes('whey')) {
      return res.json({ reply: "Whey → polyvalente et efficace. Tu vises masse ou sec ?" });
    }
    if (q.includes('iso')) {
      return res.json({ reply: "Iso → plus filtrée, très clean. Top si tu veux minimiser le lactose. 💪" });
    }

    // défaut
    return res.json({ reply: "Pose ta question précise et je te réponds net. Famille 🌲." });
  } catch (e) {
    console.error('Erreur API:', e);
    res.status(500).json({ reply: "Petit bug chez moi 🌲, réessaye dans 2 secondes." });
  }
});

// Export serverless pour Vercel
module.exports = (req, res) => app(req, res);
