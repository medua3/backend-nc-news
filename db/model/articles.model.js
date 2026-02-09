const db = require("../connection");
exports.fetchArticles = () => {
  return db
    .query(
      `
    SELECT 
      articles.article_id,
      articles.author,
      articles.title,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments
      ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
  `,
    )
    .then(({ rows }) => rows);
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `
      SELECT 
        article_id,
        author,
        title,
        body,
        topic,
        created_at,
        votes,
        article_img_url
      FROM articles
      WHERE article_id = $1;
      `,
      [article_id],
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }

      return rows[0];
    });
};
exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `
      SELECT * FROM articles
      WHERE article_id = $1;
      `,
      [article_id],
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }

      return db.query(
        `
        SELECT
          comment_id,
          votes,
          created_at,
          author,
          body,
          article_id
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;
        `,
        [article_id],
      );
    })
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertComment = (article_id, username, body) => {
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(
      `
      INSERT INTO comments
        (author, body, article_id)
      VALUES
        ($1, $2, $3)
      RETURNING
        comment_id,
        votes,
        created_at,
        author,
        body,
        article_id;
      `,
      [username, body, article_id],
    )

    .then(({ rows }) => rows[0]);
};

exports.updateVote = (article_id, inc_votes) => {
  if (inc_votes === undefined) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(
      `
      UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;
      `,
      [inc_votes, article_id],
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
};
