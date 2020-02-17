import { queries } from './resolvers/index'
import { postResolvers } from './resolvers/postResolvers'
import { titleResolvers } from './resolvers/titleResolvers'
import { categoryResolvers } from './resolvers/categoryResolvers'
import { tagResolvers } from './resolvers/tagResolvers'
import { Service } from '@vtex/api'
import { clients } from './clients'

export default new Service({
  clients,
  graphql: {
    resolvers: {
      Query: {
        ...queries,
      },
      WPPost: {
        ...postResolvers,
      },
      WPTitle: {
        ...titleResolvers,
      },
      WPCategory: {
        ...categoryResolvers,
      },
      WPTag: {
        ...tagResolvers,
      },
    },
  },
})
