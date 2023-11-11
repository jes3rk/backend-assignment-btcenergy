import { Cache, caching, MultiCache, multiCaching } from "cache-manager";
import { singleton } from "tsyringe";
import { IBlock } from "../types/block.interface";
import { ioRedisStore } from "@tirke/node-cache-manager-ioredis";
import { RedisOptions } from "ioredis";

@singleton()
export class BlockCache {
  private _cache: MultiCache | undefined;

  public async onInit(redisConfig?: RedisOptions) {
    if (this._cache) return;
    const caches: Cache[] = [
      await caching("memory", {
        ttl: 1000 * 60,
      }),
    ];
    if (redisConfig)
      caches.push(
        await caching(ioRedisStore, {
          ...redisConfig,
          ttl: 1000 * 60 * 60 * 24 * 60,
        }),
      );
    this._cache = multiCaching(caches);
  }

  private getNamespaceKey(hash: string): string {
    return `blocks:${hash}`;
  }

  public async getBlock(hash: string): Promise<IBlock | undefined> {
    const res = await this._cache!.get<string>(this.getNamespaceKey(hash));
    if (!res) return undefined;
    return JSON.parse(res);
  }

  public setBlock(hash: string, block: IBlock): Promise<void> {
    return this._cache!.set(this.getNamespaceKey(hash), JSON.stringify(block));
  }
}
