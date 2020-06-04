/* eslint-disable @typescript-eslint/camelcase */
export const pageResolvers = {
  author: async (
    { author, customDomain }: { author: number; customDomain: string },
    _: any,
    ctx: Context
  ) => {
    const {
      clients: { wordpressProxy },
    } = ctx
    return wordpressProxy.getUser(author, customDomain)
  },
  featured_media: async (
    {
      featured_media,
      customDomain,
    }: { featured_media: number; customDomain: string },
    _: any,
    ctx: Context
  ) => {
    const {
      clients: { wordpressProxy },
    } = ctx
    if (featured_media === 0) {
      return null
    }
    return wordpressProxy.getMediaSingle(featured_media, customDomain)
  },
}
