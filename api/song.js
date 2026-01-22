const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const yts = require("yt-search");

const router = express.Router();

router.get("/song", async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).send("Missing query");

  // 🔍 Step 1: search via yt-search (NO yt-dlp)
  const search = await yts(query);
  if (!search.videos.length) {
    return res.status(404).send("No video found");
  }

  const videoUrl = search.videos[0].url;

  const file = `song_${Date.now()}.mp3`;
  const filePath = path.join(process.cwd(), file);

  // 🎯 Step 2: direct URL download (NO ytsearch)
  const cmd = `
yt-dlp \
"${videoUrl}" \
-x --audio-format mp3 --audio-quality 0 \
--no-playlist \
-o "${filePath}"
  `;

  exec(cmd, (err, stdout, stderr) => {
    console.log(stderr);

    if (err || !fs.existsSync(filePath)) {
      return res.status(500).json({
        error: "yt-dlp failed",
        details: stderr
      });
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${file}"`
    );

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

    stream.on("close", () => fs.unlinkSync(filePath));
  });
});

module.exports = router;
