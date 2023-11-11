import { caching, MultiCache, multiCaching } from "cache-manager";
import { singleton } from "tsyringe";
import { IBlock } from "../types/block.interface";

@singleton()
export class BlockCache {
  private _cache: MultiCache | undefined;

  constructor() {
    console.log("Init BlockCache");
  }

  public async onInit() {
    if (this._cache) return;
    this._cache = multiCaching([
      await caching("memory", {
        ttl: 1000 * 60 * 60,
      }),
    ]);
  }

  public async getBlock(hash: string): Promise<IBlock | undefined> {
    const res = await this._cache!.get<string>(hash);
    if (!res) return undefined;
    return JSON.parse(res);
  }

  public setBlock(hash: string, block: IBlock): Promise<void> {
    return this._cache!.set(hash, JSON.stringify(block));
  }
}
