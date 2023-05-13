import {greet} from "../src/app/services/game-logic.service.ts";

describe("greet", () => {
  it("should greet by name & surname", () => {
    expect(greet("Lorem", "Ipsum")).toEqual("Hello Lorem Ipsum!");
  });
});