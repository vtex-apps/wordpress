import { queries } from './resolvers/index'
import { postResolvers } from './resolvers/postResolvers'
import { pageResolvers } from './resolvers/pageResolvers'
import { titleResolvers } from './resolvers/titleResolvers'
import { excerptResolvers } from './resolvers/excerptResolvers'
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
      WPPage: {
        ...pageResolvers,
      },
      WPTitle: {
        ...titleResolvers,
      },
      WPExcerpt: {
        ...excerptResolvers,
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
