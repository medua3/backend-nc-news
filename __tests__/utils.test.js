const { createRef } = require("../db/seeds/utils/seed-utils");

describe("createRef", () => {
  test("returns empty obj when passed empty obj", () => {
    expect(createRef([], "name", "age")).toEqual({});
  });
  test("returns obj with single k-v pair when passed single obj", () => {
    expect(
      createRef(
        [{ name: "Rose", favFood: "peanut butter", age: 35 }],
        "name",
        "age",
      ),
    ).toEqual({ Rose: 35 });
  });
  test("returns obj with multiple k-v pairs when passed multiple objects", () => {
    const inputObj = [
      { name: "Rose", age: 35, danceMove: "hustle" },
      { name: "Jim", age: 38, danceMove: "macarena" },
      { name: "David", age: 31, danceMove: "oops-upside-your-head" },
    ];
    expect(createRef(inputObj, "danceMove", "age")).toEqual({
      hustle: 35,
      macarena: 38,
      "oops-upside-your-head": 31,
    });
  });
});
