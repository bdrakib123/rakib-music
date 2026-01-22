const express = require("express");
const { spawn } = require("child_process");
const router = express.Router();

/**
 * GET /api/song?query=tum+hi+ho
 */
router.get("/song", (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).send("Missing query");
  }

  res.setHeader("Content-Type", "audio/mpeg");

  const ytdlp = spawn("yt-dlp", [
    `ytsearch1:${query}`,
    "-x",
    "--audio-format", "mp3",
    "--audio-quality", "0",
    "-o", "-" // stdout stream
  ]);

  ytdlp.stdout.pipe(res);

  ytdlp.stderr.on("data", () => {});
  ytdlp.on("close", () => res.end());
});

module.exports = router;
