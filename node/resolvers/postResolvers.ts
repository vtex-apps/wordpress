/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/camelcase */
const API_MAX_RETURN = 100

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

    let page = 1
    let returned = 0
    const allCategories: WpCategory[] = []

    try {
      do {
        const { data } = await wordpressProxy.getCategories({
          customDomain,
          page,
          per_page: API_MAX_RETURN,
          include: categories,
        })

        if (data) {
          allCategories.push(...data)
        }

        returned = data?.length || 0
        page += 1
      } while (returned === API_MAX_RETURN)
    } catch (err) {
      return []
    }
    return allCategories
  },
  tags: async (
    { tags }: { tags: [number] },
    { customDomain }: { customDomain: string },
    ctx: Context
  ) => {
    const {
      clients: { wordpressProxy },
    } = ctx

    let page = 1
    let returned = 0
    const allTags: WpTag[] = []

    try {
      do {
        const { data } = await wordpressProxy.getTags({
          customDomain,
          page,
          per_page: API_MAX_RETURN,
          include: tags,
        })

        if (data) {
          allTags.push(...data)
        }

        returned = data?.length || 0
        page += 1
      } while (returned === API_MAX_RETURN)
    } catch (err) {
      return []
    }
    return allTags
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
