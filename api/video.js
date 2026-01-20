const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const router = express.Router();

const API_KEY = "rakib69";

router.get("/video", (req, res) => {
  if (req.query.apikey !== API_KEY) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  const q = req.query.query;
  if (!q) return res.status(400).json({ error: "Missing query" });

  const file = `video_${Date.now()}.mp4`;
  const cmd = `yt-dlp "ytsearch1:${q}" -f "mp4[filesize_approx<=25M]/mp4" --no-playlist -o ${file}`;

  exec(cmd, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "yt-dlp failed" });
    }

    if (!fs.existsSync(file)) {
      return res.status(500).json({ error: "File not created" });
    }

    res.sendFile(process.cwd() + "/" + file, () => {
      fs.unlinkSync(file);
    });
  });
});

module.exports = router;
