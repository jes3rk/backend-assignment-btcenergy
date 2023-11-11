import { GraphQLFieldResolver } from "graphql";
import { DependencyContainer } from "tsyringe";
import { BlockService } from "../services/block.service";
import { IFindPreviousDaysBlocksArgs } from "../types/args.interface";

export const findPreviousDaysBlocksHandler: GraphQLFieldResolver<
  any,
  DependencyContainer,
  IFindPreviousDaysBlocksArgs
> = async (_, args, ctx) => {
  const now = new Date();

  const rawData = await ctx
    .resolve(BlockService)
    .findPreviousXDaysBlocks(now, args.num_days);

  return {
    blocks: rawData,
  };
};
