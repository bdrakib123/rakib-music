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

  // 🔥 SoundCloud search + download
  const cmd = `yt-dlp "scsearch1:${query}" -x --audio-format mp3 -o "${filePath}"`;

  exec(cmd, (err) => {
    if (err || !fs.existsSync(filePath)) {
      return res.status(500).send("SoundCloud download failed");
    }

    res.sendFile(filePath, () => {
      fs.unlinkSync(filePath);
    });
  });
});

module.exports = router;
