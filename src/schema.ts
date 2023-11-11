import { SchemaComposer } from "graphql-compose";
import { ENERGY_COST_PER_BYTE_IN_KWH } from "./constants";
import { findBlockByHashHandler } from "./handlers/find-block-by-hash.handler";
import { IBlock } from "./types/block.interface";
import { ITransaction } from "./types/transaction.interface";

export const schemaComposer = new SchemaComposer();

export const TransactionTC = schemaComposer.createObjectTC<ITransaction>({
  name: "Transaction",
  fields: {
    hash: "String!",
    size: "Int!",
    energy_consumption: {
      type: "Float!",
      description: "Energy cost of the transaction in KwH",
      resolve: (source) => source.size * ENERGY_COST_PER_BYTE_IN_KWH,
    },
  },
});

export const BlockTC = schemaComposer.createObjectTC<IBlock>({
  name: "Block",
  fields: {
    hash: "String!",
    ver: "Int!",
    time: "Int!",
    time_iso: {
      type: "String!",
      description: "Human readable ISO Datetime for the block",
      resolve: (source) => new Date(source.time * 1000).toISOString(),
    },
    size: "Int!",
    energy_consumption: {
      type: "Float!",
      description: "Energy cost of the block in KwH",
      resolve: (source) => source.size * ENERGY_COST_PER_BYTE_IN_KWH,
    },
    tx: [TransactionTC],
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
