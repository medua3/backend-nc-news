const format = require("pg-format");
const db = require("../../connection");

const insertUsers = (userData) => {
  if (userData.length === 0) return Promise.resolve([]);

  const formattedUsers = userData.map((user) => {
    return [user.username, user.name, user.avatar_url];
  });
  const queryStr = format(
    `
    INSERT INTO users
      (username, name, avatar_url)
    VALUES
      %L
    RETURNING *;
    `,
    formattedUsers,
  );
  return db.query(queryStr);
};

const insertTopics = (topicData) => {
  if (topicData.length === 0) return Promise.resolve([]);
  const formattedTopics = topicData.map((topic) => {
    return [topic.slug, topic.description, topic.img_url];
  });
  const queryStr = format(
    `INSERT INTO topics(slug,description,img_url)
    VALUES
    %L RETURNING *`,
    formattedTopics,
  );
  return db.query(queryStr);
};

const insertArticle = (articleData) => {
  if (articleData.length === 0) return Promise.resolve([]);
  const formattedArticles = articleData.map((article) => {
    return [
      article.title,
      article.topic,
      article.author,
      article.body,

      article.article_img_url,
    ];
  });

  const queryStr = format(
    `INSERT INTO articles ( 
      title,
      topic,
      author,
      body,
      article_img_url)
    VALUES
    %L RETURNING *`,
    formattedArticles,
  );
  return db.query(queryStr);
};
const insertComments = (commentData, articleRef) => {
  if (commentData.length === 0) return Promise.resolve([]);
  const formattedComments = commentData.map((comment) => {
    return [articleRef[comment.article_title], comment.body, comment.author];
  });
  const queryStr = format(
    `INSERT INTO comments ( 
      article_id,
      body,
      author)
    VALUES
    %L RETURNING *`,
    formattedComments,
  );
  return db.query(queryStr);
};
const createRef = (data, key, value) => {
  if (data.length === 0) return {};

  return data.reduce((ref, item) => {
    ref[item[key]] = item[value];
    return ref;
  }, {});
};
module.exports = {
  insertUsers,
  insertTopics,
  insertArticle,
  insertComments,
  createRef,
};
