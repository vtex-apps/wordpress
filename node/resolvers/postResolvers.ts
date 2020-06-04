/* eslint-disable @typescript-eslint/camelcase */
export const postResolvers = {
  author: async (
    { author }: { author: number },
    { customDomain }: { customDomain: string },
    ctx: Context
  ) => {
    const {
      clients: { wordpressProxy },
    } = ctx
    try {
      return await wordpressProxy.getUser(author, customDomain)
    } catch (e) {
      console.error(e)
    }
    return null
  },
  categories: async (
    { categories }: { categories: [number] },
    { customDomain }: { customDomain: string },
    ctx: Context
  ) => {
    const {
      clients: { wordpressProxy },
    } = ctx
    return categories.map(id => wordpressProxy.getCategory(id, customDomain))
  },
  tags: async (
    { tags }: { tags: [number] },
    { customDomain }: { customDomain: string },
    ctx: Context
  ) => {
    const {
      clients: { wordpressProxy },
    } = ctx
    return tags.map(id => wordpressProxy.getTag(id, customDomain))
  },
  featured_media: async (
    { featured_media }: { featured_media: number },
    { customDomain }: { customDomain: string },
    ctx: Context
  ) => {
    const {
      clients: { wordpressProxy },
    } = ctx
    if (featured_media > 0) {
      try {
        return await wordpressProxy.getMediaSingle(featured_media, customDomain)
      } catch (e) {
        console.error(e)
      }
    }
    return null
  },
}
