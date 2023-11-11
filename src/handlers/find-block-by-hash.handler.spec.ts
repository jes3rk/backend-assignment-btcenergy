import { GraphQLResolveInfo } from "graphql";
import { findBlockByHashHandler } from "./find-block-by-hash.handler";

describe("findBlockByHashHandler", () => {
  it("should return the passed hash value", async () => {
    const hash = "12lkjfdksljf";

    expect(
      await findBlockByHashHandler(
        undefined,
        { hash },
        undefined,
        {} as GraphQLResolveInfo,
      ),
    ).toEqual({ hash });
  });
});
