import { SchemaComposer } from "graphql-compose";
import { findBlockByHashHandler } from "./handlers/find-block-by-hash.handler";
import { IBlock } from "./types/block.interface";
import { ITransaction } from "./types/transaction.interface";

export const schemaComposer = new SchemaComposer();

export const TransactionTC = schemaComposer.createObjectTC<ITransaction>({
  name: "Transaction",
  fields: {
    hash: "String!",
  },
});

export const BlockTC = schemaComposer.createObjectTC<IBlock>({
  name: "Block",
  fields: {
    hash: "String!",
  },
});

schemaComposer.Query.addFields({
  hello: {
    type: () => "String!",
    resolve: () => "Hi there, good luck with the assignment!",
  },
  findBlockByHash: {
    type: () => BlockTC,
    args: {
      hash: "String!",
    },
    resolve: findBlockByHashHandler,
  },
});
