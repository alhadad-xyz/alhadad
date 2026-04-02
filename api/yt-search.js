// api/yt-search.js
export default async function handler(req, res) {
  const { query } = req.query;
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "YouTube API key not configured" });
  }

  if (!query) {
    return res.status(400).json({ error: "Missing query" });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
        query
      )}&type=video&key=${apiKey}`
    );
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const videoId = data.items[0].id.videoId;
      res.status(200).json({ videoId });
    } else {
      res.status(404).json({ error: "No video found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from YouTube" });
  }
}
