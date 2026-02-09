const express = require("express");
const articlesRouter = express.Router();

const {
  getArticles,
  getArticleById,
  getArticleComments,
  postArticleComment,
  patchArticleVotes,
} = require("./articles.controller");

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.get("/:article_id/comments", getArticleComments);
articlesRouter.post("/:article_id/comments", postArticleComment);
articlesRouter.patch("/:article_id/", patchArticleVotes);

module.exports = articlesRouter;
