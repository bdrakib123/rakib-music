const express = require("express");
const { spawn } = require("child_process");
const router = express.Router();

router.get("/video", (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).send("Missing query");
  }

  res.setHeader("Content-Type", "video/mp4");

  const ytdlp = spawn("yt-dlp", [
    `ytsearch1:${query}`,
    "-f",
    "mp4[filesize_approx<=25M]/mp4",
    "-o",
    "-"
  ]);

  ytdlp.stdout.pipe(res);

  ytdlp.stderr.on("data", () => {});
  ytdlp.on("close", () => res.end());
});

module.exports = router;
