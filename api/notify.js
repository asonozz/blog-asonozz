const FIREBASE_WEB_API_KEY = "AIzaSyCEqUzJpfX4l4hSjHpOUr9n2o8F4anRsVA";
const SITE_URL = "https://asonozz.vercel.app";

module.exports = async function handler(req, res) {
  const appId = (process.env.ONESIGNAL_APP_ID || "").trim();
  const apiKey = (process.env.ONESIGNAL_API_KEY || "").trim();

  // GET devolve apenas o App ID público para o navegador iniciar o OneSignal
  if (req.method === "GET") {
    return res.status(200).json({ appId });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  if (!appId || !apiKey) {
    return res.status(500).json({ error: "Variáveis ONESIGNAL_APP_ID ou ONESIGNAL_API_KEY não configuradas na Vercel." });
  }

  // Confirma que quem está a disparar o aviso é o dono autenticado no Firebase
  const authHeader = req.headers.authorization || "";
  const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  if (!idToken) {
    return res.status(401).json({ error: "Acesso não autorizado." });
  }

  try {
    const verifyRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_WEB_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      }
    );

    if (!verifyRes.ok) {
      return res.status(401).json({ error: "Sessão do dono inválida ou expirada." });
    }

    const verifyData = await verifyRes.json();
    if (!Array.isArray(verifyData.users) || verifyData.users.length === 0) {
      return res.status(401).json({ error: "Utilizador não encontrado." });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const heading = String(body.heading || "asonozz. — novo texto no caderno").slice(0, 90);
    const message = String(body.message || "Um novo texto acabou de ser publicado.").slice(0, 180);
    const targetUrl = String(body.url || SITE_URL);

    const oneSignalAuth = apiKey.startsWith("os_v2_") ? `Key ${apiKey}` : `Basic ${apiKey}`;

    const pushRes = await fetch("https://api.onesignal.com/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: oneSignalAuth
      },
      body: JSON.stringify({
        app_id: appId,
        target_channel: "push",
        included_segments: ["Total Subscriptions"],
        headings: { en: heading, pt: heading },
        contents: { en: message, pt: message },
        url: targetUrl,
        chrome_web_icon: `${SITE_URL}/favicon.png`
      })
    });

    const pushData = await pushRes.json();
    if (!pushRes.ok) {
      return res.status(pushRes.status).json({
        error: "O OneSignal recusou o envio.",
        details: pushData
      });
    }

    return res.status(200).json({ ok: true, id: pushData.id || null });
  } catch (err) {
    console.error("Erro ao enviar notificação:", err);
    return res.status(500).json({ error: "Erro interno ao enviar notificação." });
  }
};
