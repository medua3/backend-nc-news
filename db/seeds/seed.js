const {
  insertUsers,
  insertTopics,
  insertArticle,
  insertComments,
} = require("./utils/seed-utils");
const db = require("../connection");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`);
    })
    .then(() => {
      return db.query(
        ` CREATE TABLE users(
   username VARCHAR(50) PRIMARY KEY,
  name VARCHAR(40),
  avatar_url VARCHAR(1000));`,
      );
    })

    .then(() => {
      return db
        .query(
          `
        CREATE TABLE topics(
        slug VARCHAR(50) PRIMARY KEY,
        description VARCHAR(40),
        img_url VARCHAR(1000))`,
        )
        .then(() => {
          console.log("hello");
          return db
            .query(
              `
        CREATE TABLE articles(
        article_id SERIAL PRIMARY KEY ,
        title VARCHAR(250),
         topic VARCHAR(50),
    FOREIGN KEY (topic) REFERENCES topics(slug),
    author VARCHAR(50),
    FOREIGN KEY (author) REFERENCES users(username),
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000));`,
            )
            .then(() => {
              return db
                .query(
                  `CREATE TABLE comments (
  comment_id SERIAL PRIMARY KEY,
  article_id INT NOT NULL  REFERENCES articles(article_id),
  body TEXT NOT NULL,
  votes INT DEFAULT 0,
  author VARCHAR(50) REFERENCES users(username),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
                )
                .then(() => {
                  return insertUsers(userData);
                })
                .then(() => {
                  return insertTopics(topicData);
                })
                .then(() => {
                  return insertArticle(articleData);
                })
                .then((articles) => {
                  const articleRef = articles.rows.reduce((ref, article) => {
                    ref[article.title] = article.article_id;
                    return ref;
                  }, {});

                  return insertComments(commentData, articleRef);
                });
            });
        });
    });
}; //<< write your first query in here.
module.exports = seed;
