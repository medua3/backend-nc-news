const db = require("../db/connection");
const app = require("../db/app.js");
const request = require("supertest");
require("jest-sorted");
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

describe("GET /api/users", () => {
  it("responds the route should respond with 200 :responds with an object that has  key of users containing a value of arrays", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("users");
        expect(Array.isArray(res.body.users)).toBe(true);
      });
  });
  it("responds with the correct properties for each object inside the user array", () => {
    return request(app)
      .get("/api/users")
      .then((res) => {
        res.body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  it("responds with status 200 and an article object with all required properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("article");

        const article = res.body.article;

        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 1,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  it("should get an article by its id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        expect(res.body.article.article_id).toBe(1);
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  it("responds with 404 when the article does not exist", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({
          msg: "Article not found",
        });
      });
  });
  it("responds with 400 when article_id is invalid", () => {
    return request(app)
      .get("/api/articles/bannana")
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({
          msg: "Bad request",
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("200: responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("comments");
        expect(Array.isArray(res.body.comments)).toBe(true);
      });
  });
  it("200: each comment has the correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        res.body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        });
      });
  });
  it("200: comments are sorted by most recent first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        const dates = res.body.comments.map((comment) =>
          new Date(comment.created_at).getTime(),
        );
        expect(dates).toBeSorted({ descending: true });
      });
  });
  it("404: article does not exist", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Article not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("201: responds with the posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a test comment",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((res) => {
        expect(res.body.comment).toMatchObject({
          comment_id: expect.any(Number),
          author: "butter_bridge",
          body: "This is a test comment",
          article_id: 1,
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  it("400: missing required fields", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it("200:updates the article votes and responds with the update article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then((res) => {
        expect(res.body.article).toMatchObject({
          article_id: 1,
          votes: expect.any(Number),
        });
      });
  });
  it("400: responds with bad request when body is missing inc_votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  it("404: responds with not found when article does not exist", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  it("400: responds with bad request when votes is a string ", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "colePalmer" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  it("400: responds with bad request for invalid article_id", () => {
    return request(app)
      .patch("/api/articles/not-a-number")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  it("200: increments votes by 1", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then((res) => {
        expect(res.body.article.votes).toBe(2);
      });
  });
  it("200: decrements votes by 100", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -100 })
      .expect(200)
      .then((res) => {
        expect(res.body.article.votes).toBe(-98);
      });
  });
});
