import { inject, injectable } from "tsyringe";
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
}
