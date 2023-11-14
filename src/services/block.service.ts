import { inject, injectable } from "tsyringe";
import { BlockCache } from "../caches/block.cache";
import { NUM_MILLISECONDS_IN_DAY } from "../constants";
import { getBeginningOfDayInMillis } from "../helpers";
import { IBlock } from "../types/block.interface";
import { IBlocksByTimeResponseElement } from "../types/blocks-by-time-response.interface";
import { BlockchainApiService } from "./blockchain-api.service";

@injectable()
export class BlockService {
  constructor(
    @inject(BlockchainApiService)
    private readonly blockchainApi: BlockchainApiService,
    @inject(BlockCache) private readonly blockCache: BlockCache,
  ) {}

  public async findBlockByHash(hash: string): Promise<IBlock> {
    const cachedResult = await this.blockCache.getBlock(hash);
    if (cachedResult) return cachedResult;

    const liveResult = await this.blockchainApi.findBlockInfoByHash(hash);
    await this.blockCache.setBlock(hash, liveResult);
    return liveResult;
  }

  public async findPreviousXDaysBlocks(
    fromDate: Date,
    numDays: number,
  ): Promise<IBlock[]> {
    const startMillis = getBeginningOfDayInMillis(fromDate);

    const allDays = Array(numDays)
      .fill(0)
      .map((_, idx) => startMillis - NUM_MILLISECONDS_IN_DAY * idx);

    return (
      await Promise.all(allDays.map((day) => this.findOneDayOfBlocks(day)))
    ).flat();
  }

  public async findOneDayOfBlocks(millis: number): Promise<IBlock[]> {
    const rawData = new Array<IBlocksByTimeResponseElement>();
    const cacheData = await this.blockCache.getBlockHashesByMillis(millis);
    if (cacheData) {
      rawData.push(...cacheData);
    } else {
      const apiData = await this.blockchainApi.findBlocksInDay(millis);
      await this.blockCache.setBlockHashesByMillis(millis, apiData);
      rawData.push(...apiData);
    }

    const allBlockHashes = new Set(rawData.map((d) => d.hash));
    const manyBlocks = await this.blockCache.getManyBlocks([...allBlockHashes]);

    const cacheMap = new Map(
      manyBlocks.filter((c) => !!c).map((c) => [c!.hash, c]),
    );

    return Promise.all(
      [...allBlockHashes].map((hash) =>
        cacheMap.has(hash)
          ? (cacheMap.get(hash) as IBlock)
          : this.findBlockByHash(hash),
      ),
    );
  }
}
