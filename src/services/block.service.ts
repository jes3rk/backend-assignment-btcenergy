import { injectable } from "tsyringe";
import { IBlock } from "../types/block.interface";

@injectable()
export class BlockService {
  public async findBlockByHash(hash: string): Promise<IBlock> {
    return {
      hash,
    };
  }
}
