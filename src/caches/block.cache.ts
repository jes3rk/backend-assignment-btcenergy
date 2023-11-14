import { Cache, caching, MultiCache, multiCaching } from "cache-manager";
import { singleton } from "tsyringe";
import { IBlock } from "../types/block.interface";
import { ioRedisStore } from "@tirke/node-cache-manager-ioredis";
import { RedisOptions } from "ioredis";
import { IBlocksByTimeResponseElement } from "../types/blocks-by-time-response.interface";

@singleton()
export class BlockCache {
  private _cache: MultiCache | undefined;

  public async onInit(redisConfig?: RedisOptions) {
    if (this._cache) return;
    const caches: Cache[] = [
      await caching("memory", {
        max: 8,
      }),
    ];
    if (redisConfig)
      caches.push(
        await caching(ioRedisStore, {
          ...redisConfig,
          ttl: 60 * 60 * 24 * 60,
        }),
      );
    this._cache = multiCaching(caches);
  }

  private getNamespaceKey(hash: string): string {
    return `blocks:${hash}`;
  }

  private getMillisNamespaceKey(millis: number): string {
    return `blocks_by_millis:${millis}`;
  }

  public getBlock(hash: string): Promise<IBlock | undefined> {
    return this._cache!.get(this.getNamespaceKey(hash));
  }

  public setBlock(hash: string, block: IBlock): Promise<void> {
    return this._cache!.set(this.getNamespaceKey(hash), block);
  }

  public getBlockHashesByMillis(
    millis: number,
  ): Promise<IBlocksByTimeResponseElement[] | undefined> {
    return this._cache!.get(this.getMillisNamespaceKey(millis));
  }
  public async setBlockHashesByMillis(
    millis: number,
    hashes: IBlocksByTimeResponseElement[],
  ): Promise<void> {
    return this._cache!.set(this.getMillisNamespaceKey(millis), hashes);
  }

  public getManyBlocks(hashes: string[]): Promise<(IBlock | undefined)[]> {
    return this._cache!.mget(
      ...hashes.map((hash) => this.getNamespaceKey(hash)),
    ) as Promise<(IBlock | undefined)[]>;
  }
}
