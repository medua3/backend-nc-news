const express = require("express");
const articlesRouter = require("./articles.router");
const { getTopics } = require("./topics.controller");
const { getUsers } = require("./users.controller");
const app = express();
app.use(express.json());

app.get("/api/topics/", getTopics);
app.use("/api/articles", articlesRouter);
app.get("/api/users", getUsers);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    return res.status(err.status).send({ msg: err.msg });
  }

  if (err.code === "22P02") {
    return res.status(400).send({ msg: "Bad request" });
  }

  if (err.code === "23503") {
    return res.status(404).send({ msg: "Not found" });
  }

  next(err);
});
module.exports = app;
