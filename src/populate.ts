import "reflect-metadata";
import { argv } from "process";
import { container } from "tsyringe";
import { BlockCache } from "./caches/block.cache";
import { BlockService } from "./services/block.service";

const range = (n: number) => [...Array(n).keys()];

async function populateCache(days: number) {
  console.log(`Finding block data for the past ${days} day(s)`);
  await container.resolve(BlockCache).onInit({
    host: process.env.REDIS_HOST,
    port: +(process.env.REDIS_PORT || "6379"),
  });

  const svc = container.resolve(BlockService);
  for (const day of range(days)) {
    await svc.findPreviousXDaysBlocks(new Date(), day + 1);
    console.log(`Found data for ${day}`);
  }
  console.log("Done");
  process.exit(0);
}

const days = argv.find((arg) => arg.match("--days="))?.split("=")[1];
if (!days) process.exit(1);
populateCache(+days);
