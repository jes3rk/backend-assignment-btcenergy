import { inject, injectable } from "tsyringe";
import { NUM_MILLISECONDS_IN_DAY } from "../constants";
import { getBeginningOfDayInMillis } from "../helpers";
import { IBlock } from "../types/block.interface";
import { BlockchainApiService } from "./blockchain-api.service";

@injectable()
export class BlockService {
  constructor(
    @inject(BlockchainApiService)
    private readonly blockchainApi: BlockchainApiService,
  ) {}

  public async findBlockByHash(hash: string): Promise<IBlock> {
    return this.blockchainApi.findBlockInfoByHash(hash) as Promise<IBlock>;
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
    const rawData = await this.blockchainApi.findBlocksInDay(millis);

    const allBlockHashes = new Set(rawData.map((d) => d.hash));

    return Promise.all(
      [...allBlockHashes].map((hash) => this.findBlockByHash(hash)),
    );
  }
}
