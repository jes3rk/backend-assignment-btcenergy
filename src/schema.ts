import { SchemaComposer } from 'graphql-compose'
import { BlockTC } from './types/block.type'

export const schemaComposer = new SchemaComposer()

schemaComposer.Query.addFields({
  hello: {
    type: () => 'String!',
    resolve: () => 'Hi there, good luck with the assignment!',
  },
  findBlockByHash: {
    type: () => BlockTC,
    resolve: () => ({
      hash: '1234',
      size: 1243,
    })
  }
})
