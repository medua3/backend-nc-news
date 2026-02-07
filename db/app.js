const express = require("express");
const { getTopics } = require("./topics.controller");
const { getArticles } = require("./articles.controller");
const app = express();

app.get("/api/topics/", getTopics);
app.get("/api/articles", getArticles);

app.use((err, req, res, next) => {
  console.log(err); // 👈 important while debugging
  res.status(500).send({ msg: "Internal Server Error" });
});
module.exports = app;
