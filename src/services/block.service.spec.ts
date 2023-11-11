import { container, DependencyContainer } from "tsyringe";
import { getBeginningOfDayInMillis } from "../helpers";
import { IBlock } from "../types/block.interface";
import { IBlocksByTimeResponseElement } from "../types/blocks-by-time-response.interface";
import { BlockService } from "./block.service";
import { BlockchainApiService } from "./blockchain-api.service";

describe("BlockService", () => {
  let service: BlockService;
  let ctx: DependencyContainer;
  let mockApiClient: { [key in keyof BlockchainApiService]?: jest.Mock };

  beforeEach(() => {
    mockApiClient = {
      findBlockInfoByHash: jest.fn(),
      findBlocksInDay: jest.fn(),
    };
    ctx = container.createChildContainer();

    ctx.register(BlockService, BlockService);
    ctx.registerInstance(
      BlockchainApiService,
      mockApiClient as unknown as BlockchainApiService,
    );

    service = ctx.resolve(BlockService);
  });

  afterEach(() => {
    ctx.dispose();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findBlockByHash", () => {
    let response: IBlock;

    beforeEach(() => {
      response = {
        bits: 12354843,
        hash: "asssssdkjhdfjksdlsadkfj",
        next_block: [],
        prev_block: "ksjhfdkjsdhflaksdjh",
        size: 12345,
        time: Date.now(),
        tx: [],
        version: 1233,
      };
    });

    it("should return the response from the api", async () => {
      mockApiClient.findBlockInfoByHash?.mockResolvedValue(response);

      expect(await service.findBlockByHash(response.hash)).toEqual(response);
      expect(mockApiClient.findBlockInfoByHash).toHaveBeenCalledWith(
        response.hash,
      );
    });
  });

  describe("findPreviousXDaysBlocks", () => {
    let response: IBlocksByTimeResponseElement[];

    beforeEach(() => {
      response = [];
    });

    it("should make one api call if given one day", async () => {
      response.push({
        hash: "ashddfhjjdklasdf",
      });
      const date = new Date();

      mockApiClient.findBlocksInDay!.mockResolvedValue([response[0]]);
      mockApiClient.findBlockInfoByHash!.mockImplementation((hash) =>
        response.find((b) => b.hash === hash),
      );

      expect(await service.findPreviousXDaysBlocks(date, 1)).toEqual([
        { hash: response[0].hash },
      ]);

      expect(mockApiClient.findBlocksInDay).toHaveBeenCalledTimes(1);
      expect(mockApiClient.findBlocksInDay).toHaveBeenCalledWith(
        getBeginningOfDayInMillis(date),
      );
    });

    it("should make multiple api calls if given multiple days", async () => {
      const count = 5;

      response.push(
        ...Array(count)
          .fill(undefined)
          .map((_, idx) => ({
            hash: (idx * Math.random() + Date.now()).toString(),
          })),
      );

      const date = new Date();

      response.forEach((res) =>
        mockApiClient.findBlocksInDay!.mockResolvedValueOnce([res]),
      );
      mockApiClient.findBlockInfoByHash!.mockImplementation((hash) =>
        response.find((b) => b.hash === hash),
      );

      expect(await service.findPreviousXDaysBlocks(date, count)).toEqual(
        response,
      );

      expect(mockApiClient.findBlocksInDay).toHaveBeenCalledTimes(count);
    });
  });
});
