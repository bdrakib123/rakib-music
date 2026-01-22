const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/song", (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).send("Missing query");

  const file = `song_${Date.now()}.mp3`;
  const filePath = path.join(process.cwd(), file);

  const cmd = `
yt-dlp \
--cookies cookies.txt \
--user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
--add-header "Accept-Language:en-US,en;q=0.9" \
--extractor-args "youtube:player_client=android" \
"ytsearch1:${query}" \
-x --audio-format mp3 --audio-quality 0 \
--no-playlist \
-o "${filePath}"
  `;

  exec(cmd, (err, stdout, stderr) => {
    console.log(stderr);

    if (err || !fs.existsSync(filePath)) {
      return res.status(500).json({
        error: "yt-dlp error",
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
