const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const router = express.Router();

/**
 * GET /api/song?query=tum+hi+ho
 */
router.get("/song", (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).send("Missing query");
  }

  const file = `song_${Date.now()}.mp3`;
  const filePath = path.join("/tmp", file);

  const cmd = `yt-dlp "ytsearch1:${query}" -x --audio-format mp3 --audio-quality 0 --no-playlist -o "${filePath}"`;

  exec(cmd, (err) => {
    if (err || !fs.existsSync(filePath)) {
      return res.status(500).send("Download failed");
    }

    // ✅ Content-Length + proper END
    res.sendFile(filePath, () => {
      fs.unlinkSync(filePath);
    });
  });
});

module.exports = router;
