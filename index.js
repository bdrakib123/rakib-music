const express = require("express");
const app = express();

app.use("/api", require("./api/music"));
app.use("/api", require("./api/video"));

app.get("/", (req, res) => {
  res.send("Music API running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
