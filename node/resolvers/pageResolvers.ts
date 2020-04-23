/* eslint-disable @typescript-eslint/camelcase */
export const pageResolvers = {
  author: async ({ author }: { author: number }, _: any, ctx: Context) => {
    const {
      clients: { wordpressProxy },
    } = ctx
    return wordpressProxy.getUser(author)
  },
  featured_media: async (
    { featured_media }: { featured_media: number },
    _: any,
    ctx: Context
  ) => {
    const {
      clients: { wordpressProxy },
    } = ctx
    if (featured_media > 0) {
      return wordpressProxy.getMediaSingle(featured_media)
    } else {
      return null
    }
  }
}
