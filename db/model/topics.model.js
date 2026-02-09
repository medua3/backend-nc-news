const db = require("../connection");
exports.fetchTopics = () => {
  return db
    .query(
      `
    SELECT slug, description
    FROM topics;
  `,
    )
    .then(({ rows }) => rows);
};
