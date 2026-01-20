const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const app = express();

const API_KEY = "rakib69";

app.get("/", (_, res) => res.send("Music API running"));

app.get("/song", (req, res) => {
  if (req.query.apikey !== API_KEY)
    return res.status(403).json({ error: "Invalid API key" });

  const q = req.query.query;
  if (!q) return res.status(400).json({ error: "Missing query" });

  const file = "song.mp3";
  const cmd = `yt-dlp "ytsearch1:${q}" -x --audio-format mp3 --audio-quality 0 -o ${file}`;

  exec(cmd, () => {
    if (!fs.existsSync(file))
      return res.status(500).json({ error: "Download failed" });

    res.sendFile(__dirname + "/" + file, () => fs.unlinkSync(file));
  });
});

app.get("/video", (req, res) => {
  if (req.query.apikey !== API_KEY)
    return res.status(403).json({ error: "Invalid API key" });

  const q = req.query.query;
  if (!q) return res.status(400).json({ error: "Missing query" });

  const file = "video.mp4";
  const cmd = `yt-dlp "ytsearch1:${q}" -f "mp4[filesize_approx<=25M]/mp4" -o ${file}`;

  exec(cmd, () => {
    if (!fs.existsSync(file))
      return res.status(500).json({ error: "Download failed" });

    res.sendFile(__dirname + "/" + file, () => fs.unlinkSync(file));
  });
});

app.listen(3000, () => console.log("API running on 3000"));
