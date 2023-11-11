import { GraphQLFieldResolver } from "graphql";
import { DependencyContainer } from "tsyringe";
import { BlockService } from "../services/block.service";
import { IFindByHashQueryArgs } from "../types/args.interface";
import { IBlock } from "../types/block.interface";

export const findBlockByHashHandler: GraphQLFieldResolver<
  any,
  DependencyContainer,
  IFindByHashQueryArgs
> = (_, args, ctx): Promise<IBlock> => {
  return ctx.resolve(BlockService).findBlockByHash(args.hash);
};
