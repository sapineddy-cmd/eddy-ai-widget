export default async function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ ok: true, message: 'Eddy API en ligne ✅' });
    return;
  }

  const { message } = req.body || {};
  const user = (message || '').toLowerCase();

  let reply = '';
  if (!user) reply = "Pose ta question claire et je te réponds net. 🌲";
  else if (user.includes('whey')) reply = "Whey = protéine rapide et polyvalente. 🌲";
  else if (user.includes('iso')) reply = "Iso = plus filtrée, meilleure digestion. 🌲";
  else if (user.includes('masse')) reply = "Mange plus que tu ne brûles (riz, œufs, huile d’olive) + Whey. 🌲";
  else reply = "Je t’écoute : sport, nutrition ou produits ? Donne ton but précis. 🌲";

  res.status(200).json({ reply });
}
