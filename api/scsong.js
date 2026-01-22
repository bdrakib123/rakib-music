const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const router = express.Router();

/**
 * GET /api/scsong?query=believer
 */
router.get("/scsong", (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).send("Missing query");

  const file = `sc_${Date.now()}.mp3`;
  const filePath = path.join("/tmp", file);

  /**
   * 🔥 KEY CHANGE:
   * Use SoundCloud search via normal URL
   * NOT scsearch1:
   */
  const cmd =
    `yt-dlp "https://soundcloud.com/search?q=${encodeURIComponent(query)}" ` +
    `-x --audio-format mp3 --audio-quality 0 --no-playlist -o "${filePath}"`;

  exec(cmd, (err) => {
    if (err || !fs.existsSync(filePath)) {
      console.error(err);
      return res.status(500).send("SoundCloud download failed");
    }

    res.sendFile(filePath, () => {
      fs.unlinkSync(filePath);
    });
  });
});

module.exports = router;
