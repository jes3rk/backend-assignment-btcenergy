import { container, DependencyContainer } from "tsyringe";
import { IBlock } from "../types/block.interface";
import { BlockCache } from "./block.cache";

describe("BlockCache", () => {
  let ctx: DependencyContainer;
  let cache: BlockCache;

  beforeEach(() => {
    ctx = container.createChildContainer();
    ctx.registerSingleton(BlockCache, BlockCache);

    cache = ctx.resolve(BlockCache);
  });

  afterEach(() => {
    ctx.dispose();
  });

  it("should be defined", () => {
    expect(cache).toBeDefined();
  });
  describe("memoryCache", () => {
    beforeEach(async () => {
      await cache.onInit();
    });

    it("should return undefined if getting a value that doesn't exist", async () => {
      expect(await cache.getBlock("")).toBeUndefined();
    });

    it("should retrieve a set value", async () => {
      const key = "asjhfj";
      const value = {
        hello: "world",
      };

      await cache.setBlock(key, value as unknown as IBlock);
      expect(await cache.getBlock(key)).toEqual(value);
    });
  });
});
