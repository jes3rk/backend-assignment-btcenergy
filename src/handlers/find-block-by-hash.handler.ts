import { GraphQLFieldResolver } from "graphql";
import { IFindByHashQueryArgs } from "../types/args.interface";
import { IBlock } from "../types/block.interface";

export const findBlockByHashHandler: GraphQLFieldResolver<
  any,
  any,
  IFindByHashQueryArgs
> = async (_, args): Promise<IBlock> => {
  return {
    hash: args.hash,
  };
};
