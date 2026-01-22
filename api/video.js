const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/video", (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).send("Missing query");
  }

  const file = `video_${Date.now()}.mp4`;
  const filePath = path.join(__dirname, "..", file);

  const cmd = `yt-dlp "ytsearch1:${query}" -f "mp4[filesize_approx<=25M]/mp4" --no-playlist -o "${filePath}"`;

  exec(cmd, (err) => {
    if (err || !fs.existsSync(filePath)) {
      return res.status(500).send("Download failed");
    }

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${file}"`
    );

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

    stream.on("close", () => {
      fs.unlinkSync(filePath);
    });
  });
});

module.exports = router;
