module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  const username = (process.env.LASTFM_USERNAME || "").trim();
  const apiKey = (process.env.LASTFM_API_KEY || "").trim();

  if (!username || !apiKey) {
    return res.status(200).json({ configured: false });
  }

  try {
    const endpoint =
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks` +
      `&user=${encodeURIComponent(username)}` +
      `&api_key=${encodeURIComponent(apiKey)}` +
      `&format=json&limit=1`;

    const response = await fetch(endpoint, {
      headers: { "User-Agent": "blog-asonozz/1.0" }
    });

    if (!response.ok) {
      return res.status(502).json({ configured: true, error: "Falha ao consultar o Last.fm." });
    }

    const data = await response.json();
    const rawTracks = data?.recenttracks?.track;
    const track = Array.isArray(rawTracks) ? rawTracks[0] : rawTracks;

    if (!track) {
      return res.status(200).json({ configured: true, track: null, username });
    }

    const images = Array.isArray(track.image) ? track.image : [];
    const pickedImg =
      images.find(i => i.size === "extralarge")?.["#text"] ||
      images.find(i => i.size === "large")?.["#text"] ||
      images[images.length - 1]?.["#text"] ||
      "";

    // Ignora a imagem genérica de estrela cinza do Last.fm para usar o vinil com selo 愛
    const cleanCover = pickedImg.includes("2a96cbd8b46e442fc41c2b86b821562f") ? "" : pickedImg;

    res.setHeader("Cache-Control", "s-maxage=15, stale-while-revalidate=30");
    return res.status(200).json({
      configured: true,
      username,
      profileUrl: `https://www.last.fm/user/${encodeURIComponent(username)}`,
      track: {
        name: track.name || "Sem título",
        artist: track.artist?.["#text"] || "Artista desconhecido",
        album: track.album?.["#text"] || "",
        cover: cleanCover,
        url: track.url || `https://www.last.fm/user/${encodeURIComponent(username)}`,
        nowPlaying: track["@attr"]?.nowplaying === "true",
        playedAt: track.date?.uts ? Number(track.date.uts) : null
      }
    });
  } catch (err) {
    console.error("Erro no /api/lastfm:", err);
    return res.status(500).json({ configured: true, error: "Erro interno ao carregar música." });
  }
};