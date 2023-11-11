import fetch from "node-fetch";
import { injectable } from "tsyringe";
import { BlockchainApiException } from "../exceptions/blockchain-api.exception";
import { IBlock } from "../types/block.interface";

@injectable()
export class BlockchainApiService {
  private apiRoot = "https://blockchain.info";

  public async findBlockInfoByHash(hash: string): Promise<IBlock> {
    const response = await fetch(`${this.apiRoot}/rawblock/${hash}`);
    if (!response.ok)
      throw new BlockchainApiException(response.status, response.statusText);
    return response.json() as unknown as IBlock;
  }
}
