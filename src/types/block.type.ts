import { schemaComposer } from "graphql-compose";

export const BlockTC = schemaComposer.createObjectTC({
  name: 'Block',
  fields: {
    hash: 'String!',
    size: 'Int!',
    energy_consumption: {
      type: 'Float!',
      resolve: (source) => {
        return source.size * 4.62
      }
    }
  }
})