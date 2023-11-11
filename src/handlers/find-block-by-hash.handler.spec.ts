import { GraphQLResolveInfo } from "graphql";
import { container, DependencyContainer } from "tsyringe";
import { BlockService } from "../services/block.service";
import { findBlockByHashHandler } from "./find-block-by-hash.handler";

describe("findBlockByHashHandler", () => {
  let ctx: DependencyContainer;
  let mockBlockService: { [key in keyof BlockService]?: jest.Mock };

  beforeEach(() => {
    mockBlockService = {
      findBlockByHash: jest.fn(),
    };
    ctx = container.createChildContainer();
    ctx.registerInstance(BlockService, mockBlockService as BlockService);
  });

  afterEach(() => {
    ctx.dispose();
  });

  it("should call the blockService.findBlockByHash method", async () => {
    const hash = "alskfjdlk2lkf";

    mockBlockService.findBlockByHash!.mockResolvedValue({ hash });
    expect(
      await findBlockByHashHandler(
        undefined,
        { hash },
        ctx,
        {} as GraphQLResolveInfo,
      ),
    ).toEqual({ hash });

    expect(mockBlockService.findBlockByHash).toHaveBeenCalledWith(hash);
  });
});
