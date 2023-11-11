import { SchemaComposer } from "graphql-compose";

export const schemaComposer = new SchemaComposer();

export const TransactionTC = schemaComposer.createObjectTC({
  name: "Transaction",
  fields: {
    hash: "String!",
    size: "Int!",
    energy_consumption: {
      type: "Float!",
      resolve: (source) => source.size * 4.62,
    },
  },
});

export const BlockTC = schemaComposer.createObjectTC({
  name: "Block",
  fields: {
    hash: "String!",
    size: "Int!",
    energy_consumption: {
      type: "Float!",
      resolve: (source) => {
        return source.size * 4.62;
      },
    },
    tx: {
      type: () => [TransactionTC],
      resolve: () => [],
    },
  },
});

schemaComposer.Query.addFields({
  hello: {
    type: () => "String!",
    resolve: () => "Hi there, good luck with the assignment!",
  },
  findBlockByHash: {
    type: () => BlockTC,
    resolve: () => ({
      hash: "1234",
      size: 1243,
      tx: [],
    }),
  },
});
