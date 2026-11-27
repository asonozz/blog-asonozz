const PROJECT_ID = "blog-asonozz";

function readField(fields, key, fallback = "") {
  const f = fields?.[key];
  if (!f) return fallback;
  if ("stringValue" in f) return f.stringValue;
  if ("booleanValue" in f) return f.booleanValue;
  if ("integerValue" in f) return Number(f.integerValue);
  if ("doubleValue" in f) return Number(f.doubleValue);
  return fallback;
}

function escapeAttr(text = "") {
    return String(text)
      .replaceAll("&", "&" + "amp;")
      .replaceAll("<", "&" + "lt;")
      .replaceAll(">", "&" + "gt;")
      .replaceAll('"', "&" + "quot;")
      .replaceAll("'", "&" + "#39;");
  }

function stripMarkdown(text = "") {
  return String(text)
    .replace(/`{3}[\s\S]*?`{3}/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^#{1,4}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = async function handler(req, res) {
  const id = String(req.query?.id || "").trim();
  const host = req.headers["x-forwarded-host"] || req.headers.host || "asonozz.vercel.app";
  const proto = req.headers["x-forwarded-proto"] || "https";
  const origin = `${proto}://${host}`;

  let title = "asonozz. — um pequeno quarto na internet";
  let description = "noites longas, pensamentos calmos e coisas que ainda estão tomando forma.";
  let image = `${origin}/favicon.png`;
  let cardType = "summary";
  let targetUrl = `${origin}/`;
  let canonicalUrl = `${origin}/`;

  if (id) {
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/posts/${encodeURIComponent(id)}`;
      const docRes = await fetch(url);

      if (docRes.ok) {
        const data = await docRes.json();
        const fields = data?.fields || {};
        const isDraft = Boolean(readField(fields, "draft", false));

        if (!isDraft) {
          const postTitle = readField(fields, "title", "");
          const content = readField(fields, "content", "");
          const category = readField(fields, "category", "");
          const postImg = readField(fields, "image", "");

          if (postTitle) {
            title = `${postTitle} — asonozz.`;
          }
          const cleanText = stripMarkdown(content);
          if (cleanText) {
            const excerpt = cleanText.length > 180 ? `${cleanText.slice(0, 177)}...` : cleanText;
            description = category ? `[${category}] ${excerpt}` : excerpt;
          }
          if (/^https?:\/\//i.test(postImg)) {
            image = postImg;
            cardType = "summary_large_image";
          }

          targetUrl = `${origin}/#post=${encodeURIComponent(id)}`;
          canonicalUrl = `${origin}/p/${encodeURIComponent(id)}`;
        }
      }
    } catch (err) {
      console.error("Erro no /api/share:", err);
    }
  }

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeAttr(title)}</title>
  <meta name="description" content="${escapeAttr(description)}">
  <meta name="theme-color" content="#b81d27">
  <link rel="canonical" href="${escapeAttr(canonicalUrl)}">

  <meta property="og:type" content="article">
  <meta property="og:site_name" content="asonozz.">
  <meta property="og:title" content="${escapeAttr(title)}">
  <meta property="og:description" content="${escapeAttr(description)}">
  <meta property="og:url" content="${escapeAttr(canonicalUrl)}">
  <meta property="og:image" content="${escapeAttr(image)}">

  <meta name="twitter:card" content="${cardType}">
  <meta name="twitter:title" content="${escapeAttr(title)}">
  <meta name="twitter:description" content="${escapeAttr(description)}">
  <meta name="twitter:image" content="${escapeAttr(image)}">

  <meta http-equiv="refresh" content="0;url=${escapeAttr(targetUrl)}">
</head>
<body style="background:#130f10;color:#f7f1f1;font-family:sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;">
  <p>Abrindo página no caderno... <a href="${escapeAttr(targetUrl)}" style="color:#e33d48;">clique aqui</a></p>
  <script>window.location.replace(${JSON.stringify(targetUrl)});</script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
  return res.status(200).send(html);
};