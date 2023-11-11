import { GraphQLResolveInfo } from "graphql";
import { container, DependencyContainer } from "tsyringe";
import { BlockService } from "../services/block.service";
import { IFindPreviousDaysBlocksArgs } from "../types/args.interface";
import { findPreviousDaysBlocksHandler } from "./find-previous-days-blocks.handler";

describe("findPreviousDaysBlocksHandler", () => {
  let ctx: DependencyContainer;
  let mockBlockService: { [key in keyof BlockService]?: jest.Mock };

  beforeEach(() => {
    mockBlockService = {
      findPreviousXDaysBlocks: jest.fn(),
    };
    ctx = container.createChildContainer();
    ctx.registerInstance(
      BlockService,
      mockBlockService as unknown as BlockService,
    );
  });

  afterEach(() => {
    ctx.dispose();
  });

  it("should call the service", async () => {
    mockBlockService.findPreviousXDaysBlocks!.mockResolvedValue([]);

    const args: IFindPreviousDaysBlocksArgs = {
      num_days: 12,
    };

    expect(
      await findPreviousDaysBlocksHandler(
        undefined,
        args,
        ctx,
        {} as GraphQLResolveInfo,
      ),
    ).toEqual({ blocks: [] });

    expect(mockBlockService.findPreviousXDaysBlocks).toHaveBeenCalledWith(
      expect.any(Date),
      args.num_days,
    );
  });
});
