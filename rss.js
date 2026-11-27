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

function escapeXml(text = "") {
    return String(text)
      .replaceAll("&", "&" + "amp;")
      .replaceAll("<", "&" + "lt;")
      .replaceAll(">", "&" + "gt;")
      .replaceAll('"', "&" + "quot;")
      .replaceAll("'", "&" + "apos;");
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

function toRssDate(isoDate, createdAt) {
  if (createdAt && !Number.isNaN(Number(createdAt))) {
    return new Date(Number(createdAt)).toUTCString();
  }
  if (isoDate) {
    const parsed = new Date(`${isoDate}T12:00:00Z`);
    if (!Number.isNaN(parsed.getTime())) return parsed.toUTCString();
  }
  return new Date().toUTCString();
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Método não permitido.");
  }

  const host = req.headers["x-forwarded-host"] || req.headers.host || "asonozz.vercel.app";
  const proto = req.headers["x-forwarded-proto"] || "https";
  const origin = `${proto}://${host}`;

  try {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/posts?pageSize=100`;
    const fsRes = await fetch(url);
    const data = fsRes.ok ? await fsRes.json() : { documents: [] };
    const docs = Array.isArray(data.documents) ? data.documents : [];

    const posts = docs
      .map(d => {
        const f = d.fields || {};
        const fallbackId = (d.name || "").split("/").pop();
        return {
          id: readField(f, "id", fallbackId),
          title: readField(f, "title", "Sem título"),
          category: readField(f, "category", "pensamentos"),
          date: readField(f, "date", ""),
          createdAt: readField(f, "createdAt", 0),
          content: readField(f, "content", ""),
          draft: Boolean(readField(f, "draft", false))
        };
      })
      .filter(p => p.id && !p.draft)
      .sort((a, b) => {
        const dateDiff = String(b.date || "").localeCompare(String(a.date || ""));
        if (dateDiff !== 0) return dateDiff;
        return (b.createdAt || 0) - (a.createdAt || 0);
      })
      .slice(0, 30);

    const itemsXml = posts
      .map(p => {
        const link = `${origin}/p/${encodeURIComponent(p.id)}`;
        const plain = stripMarkdown(p.content);
        const excerpt = plain.length > 320 ? `${plain.slice(0, 317)}...` : plain;
        return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <category>${escapeXml(p.category)}</category>
      <pubDate>${escapeXml(toRssDate(p.date, p.createdAt))}</pubDate>
      <description>${escapeXml(excerpt)}</description>
    </item>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>asonozz.</title>
    <link>${escapeXml(origin)}</link>
    <description>um pequeno quarto na internet — noites longas, pensamentos calmos e coisas que ainda estão tomando forma.</description>
    <language>pt-BR</language>
    <atom:link href="${escapeXml(origin)}/rss.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;

    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).send(xml);
  } catch (err) {
    console.error("Erro no /api/rss:", err);
    return res.status(500).send("Erro ao gerar feed RSS.");
  }
};