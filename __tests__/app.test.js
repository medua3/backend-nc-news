const db = require("../db/connection");
const app = require("../db/app.js");
const request = require("supertest");
afterAll(() => db.end());
describe("GET /api/topics", () => {
  it("the route should respond with 200 :responds with an object that has  key of topics containing a value of arrays", () => {
    return request(app)
      .get("/api/topics/")
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("topics");
        expect(Array.isArray(res.body.topics)).toBe(true);
      });
  });
  it("the route should respond with 200 :topic has an array of objects with a slug and description key", () => {
    return request(app)
      .get("/api/topics/")
      .expect(200)
      .then((res) => {
        expect(res.body.topics[0]).toHaveProperty("slug");
        expect(res.body.topics[0]).toHaveProperty("description");
      });
  });
});

describe("GET /api/articles", () => {
  it("the route should respond with 200 :responds with an object that has  key of articles containing a value of arrays", () => {
    return request(app)
      .get("/api/articles/")
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("articles");
        expect(Array.isArray(res.body.articles)).toBe(true);
      });
  });
});
it("the route should respond with 200 :responds with all the correct properties", () => {
  return request(app)
    .get("/api/articles")
    .expect(200)
    .then((res) => {
      res.body.articles.forEach((article) => {
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        });
      });
    });
});
it("responds with the correct comment_count", () => {
  return request(app)
    .get("/api/articles")
    .expect(200)
    .then((res) => {
      const article = res.body.articles.find(
        (article) => article.article_id === 1,
      );
      return db
        .query(
          `
        SELECT COUNT(*)::INT AS count
        FROM comments
        WHERE article_id = 1;
      `,
        )
        .then(({ rows }) => {
          expect(article.comment_count).toBe(rows[0].count);
        });
    });
});
it("responds with articles sorted by date in a desecending order ", () => {
  return request(app)
    .get("/api/articles")
    .expect(200)
    .then((res) => {
      const timestamps = res.body.articles.map((article) =>
        new Date(article.created_at).getTime(),
      );
      for (let i = 0; i < timestamps.length - 1; i++) {
        expect(timestamps[i]).toBeGreaterThanOrEqual(timestamps[i + 1]);
      }
    });
});
it("responds with articles without a body property", () => {
  return request(app)
    .get("/api/articles")
    .expect(200)
    .then((res) => {
      res.body.articles.forEach((article) => {
        expect(article).not.toHaveProperty("body");
      });
    });
});
