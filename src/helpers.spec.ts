import { getBeginningOfDayInMillis } from "./helpers";

describe("helpers", () => {
  describe("getBeginningOfDayInMillis", () => {
    it("should return the provided date rounded to the previous day", () => {
      const dayOnly = new Date("2023-11-11");
      const fullDate = new Date(dayOnly.getTime());
      fullDate.setHours(3, 24);

      expect(getBeginningOfDayInMillis(fullDate)).toEqual(dayOnly.getTime());
    });
  });
});
