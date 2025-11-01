export default async function handler(req, res) {
  // Santé rapide
  if (req.method === 'GET' && (req.query.health || req.query.ping)) {
    return res.status(200).json({ ok:true, message:'Eddy API en ligne ✅' });
  }

  if (req.method !== 'POST') return res.status(405).json({ error:'Method not allowed' });

  try{
    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error:'Message manquant' });
    }

    const system = `
Tu es Eddy 🌲 (Famille Sapin, Lyon, 36 ans). Franc, cash, humain.
Tu réponds court, utile, actionnable. Tu tutoies. Si c’est flou, tu reformules et proposes 1 question claire.
Nutrition: simple et réel (riz/oeufs/huile d’olive, éviter sucres/sauces). Entraînement: "bouge et ça marche".
Tu peux motiver, recadrer avec humour. Termine parfois par "Famille 🌲".
`;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // Fallback lisible si la clé manque
      return res.status(200).json({ reply: "Je suis prêt, ajoute juste la clé OPENAI_API_KEY sur Vercel pour répondre à fond. Famille 🌲" });
    }

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'Authorization':Bearer ${apiKey} },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.5,
        max_tokens: 220,
        messages: [
          { role:'system', content: system },
          { role:'user', content: message }
        ]
      })
    });

    if (!r.ok) {
      const t = await r.text().catch(()=> '');
      return res.status(200).json({ reply: "Petit souci réseau 🌧 — réessaye." , detail:t });
    }

    const data = await r.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || "OK.";
    return res.status(200).json({ reply });
  }catch(e){
    return res.status(200).json({ reply: "Petit souci réseau 🌧 — réessaye." });
  }
}
