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
    const base = "https://ws.audioscrobbler.com/2.0/";
    const recentUrl =
      `${base}?method=user.getrecenttracks&user=${encodeURIComponent(username)}` +
      `&api_key=${encodeURIComponent(apiKey)}&format=json&limit=1`;
    const topUrl =
      `${base}?method=user.gettoptracks&user=${encodeURIComponent(username)}` +
      `&api_key=${encodeURIComponent(apiKey)}&period=7day&format=json&limit=5`;

    const headers = { "User-Agent": "blog-asonozz/1.0" };
    const [recentRes, topRes] = await Promise.all([
      fetch(recentUrl, { headers }),
      fetch(topUrl, { headers }).catch(() => null)
    ]);

    if (!recentRes.ok) {
      return res.status(502).json({ configured: true, error: "Falha ao consultar o Last.fm." });
    }

    const recentData = await recentRes.json();
    const rawTracks = recentData?.recenttracks?.track;
    const track = Array.isArray(rawTracks) ? rawTracks[0] : rawTracks;

    let topTracks = [];
    if (topRes && topRes.ok) {
      const topData = await topRes.json().catch(() => null);
      const rawTop = topData?.toptracks?.track;
      const list = Array.isArray(rawTop) ? rawTop : rawTop ? [rawTop] : [];
      topTracks = list.slice(0, 5).map(item => ({
        name: item.name || "Sem título",
        artist: item.artist?.name || "Artista desconhecido",
        playcount: Number(item.playcount || 0),
        url: item.url || `https://www.last.fm/user/${encodeURIComponent(username)}`
      }));
    }

    const profileUrl = `https://www.last.fm/user/${encodeURIComponent(username)}`;

    if (!track) {
      res.setHeader("Cache-Control", "s-maxage=20, stale-while-revalidate=40");
      return res.status(200).json({ configured: true, username, profileUrl, track: null, topTracks });
    }

    const images = Array.isArray(track.image) ? track.image : [];
    const pickedImg =
      images.find(i => i.size === "extralarge")?.["#text"] ||
      images.find(i => i.size === "large")?.["#text"] ||
      images[images.length - 1]?.["#text"] ||
      "";

    const cleanCover = pickedImg.includes("2a96cbd8b46e442fc41c2b86b821562f") ? "" : pickedImg;

    res.setHeader("Cache-Control", "s-maxage=15, stale-while-revalidate=30");
    return res.status(200).json({
      configured: true,
      username,
      profileUrl,
      track: {
        name: track.name || "Sem título",
        artist: track.artist?.["#text"] || "Artista desconhecido",
        album: track.album?.["#text"] || "",
        cover: cleanCover,
        url: track.url || profileUrl,
        nowPlaying: track["@attr"]?.nowplaying === "true",
        playedAt: track.date?.uts ? Number(track.date.uts) : null
      },
      topTracks
    });
  } catch (err) {
    console.error("Erro no /api/lastfm:", err);
    return res.status(500).json({ configured: true, error: "Erro interno ao carregar música." });
  }
};