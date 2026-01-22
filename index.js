const express = require("express");
const app = express();

app.use("/api", require("./api/scsong"));

app.get("/", (req, res) => {
  res.send("SoundCloud Music API running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
