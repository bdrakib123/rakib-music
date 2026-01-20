const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const API_KEY = "rakib69";
const YTDLP = "/usr/local/bin/yt-dlp";
const COOKIES = path.join(process.cwd(), "cookies.txt");

router.get("/song", (req, res) => {
  if (req.query.apikey !== API_KEY) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  const q = req.query.query;
  if (!q) {
    return res.status(400).json({ error: "Missing query" });
  }

  const file = `song_${Date.now()}.mp3`;

  const cmd = `${YTDLP} --cookies "${COOKIES}" "ytsearch1:${q}" -x --audio-format mp3 --audio-quality 0 --no-playlist -o "${file}"`;

  exec(cmd, (err, stdout, stderr) => {
    console.log("STDOUT:", stdout);
    console.log("STDERR:", stderr);

    if (err) {
      return res.status(500).json({
        error: "yt-dlp failed",
        details: stderr
      });
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
