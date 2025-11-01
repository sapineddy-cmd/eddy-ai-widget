export default async function handler(req, res) {
  try{
    if (req.method === 'GET') {
      return res.status(200).json({ ok:true, message:'Eddy API en ligne ✅' });
    }
    if (req.method !== 'POST') {
      return res.status(405).json({ ok:false, error:'Method Not Allowed' });
    }

    const { message } = req.body || {};
    const userMsg = String(message || '').slice(0, 1000);

    // --- Si tu as une clé OpenAI sur Vercel (Environment Variables) ---
    const KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_1;
    if (KEY) {
      const system = `
Tu es Eddy 🌲 (36 ans, Lyon), voix du terrain de Famille Sapin.
Style: franc, humain, direct; tu tutoies; concret; punchlines si besoin; jamais médical.
Principes: faire simple, efficace, régulier. Pas d'excuses. Tu clarifies quand c'est flou.
Nutrition: vrai/clair (riz, oeufs, huile d'olive), éviter boissons sucrées/sauces; expliquer avec images simples.
Training: "Bouge et ça marche"; mieux vaut fait que parfait.
Termine parfois par "Famille 🌲 — on fait simple, mais on le fait bien.".
Tu as accès à tout le savoir général (comme ChatGPT) pour répondre utilement et complet.`;

      const payload = {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: userMsg }
        ],
        temperature: 0.5
      };

      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": Bearer ${KEY} },
        body: JSON.stringify(payload)
      });

      if (!r.ok) throw new Error('OpenAI '+r.status);
      const j = await r.json();
      const reply = j.choices?.[0]?.message?.content?.trim() || "Je te réponds juste après.";
      return res.status(200).json({ ok:true, reply });
    }

    // --- Fallback local (sans clé) : règles simples mais utiles ---
    const q = userMsg.toLowerCase();
    let reply = "Pose ta question précise et je te réponds net. Famille 🌲.";

    if (q.match(/whey/) || q.match(/\biso\b/)) {
      reply = "Whey → polyvalente au quotidien. Iso → plus filtrée, moins de lactose. Choisis selon budget/tolérance. 🌲";
    } else if (q.includes('masse') || q.includes('prise de masse')) {
      reply = "Masse = surplus propre (riz/oeufs/huile d’olive) + Whey pour compléter. Gainer = optionnel. Bouge fort. 🌲";
    } else if (q.includes('seche') || q.includes('sèche')) {
      reply = "Sèche = léger déficit + protéines hautes + fibres + eau + sommeil. Pas de miracles, régularité. 🌲";
    } else if (q.includes('programme') || q.includes('entrainement') || q.includes("entraînement")) {
      reply = "Fais simple: 3–4 séances/semaine, polyarticulaires, progressif. Note tes charges, repose 1–2min. Le reste c’est du bruit. 🌲";
    }

    return res.status(200).json({ ok:true, reply });
  }catch(e){
    return res.status(500).json({ ok:false, error:'SERVER_ERROR' });
  }
}
