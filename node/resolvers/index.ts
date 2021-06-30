import { LogLevel } from '@vtex/api'

import { addCSShandles, addHeaderTags } from '../utils/jsdom'

/* eslint-disable @typescript-eslint/camelcase */
export const queries = {
  wpPosts: async (
    _: any,
    {
      page,
      per_page,
      search,
      after,
      author,
      author_exclude,
      before,
      exclude,
      include,
      offset,
      order,
      orderby,
      slug,
      status,
      categories,
      categories_exclude,
      tags,
      tags_exclude,
      sticky,
      customDomain,
    }: {
      page: number
      per_page: number
      search?: string
      after?: string
      author?: [number]
      author_exclude?: [number]
      before?: string
      exclude?: [number]
      include?: [number]
      offset?: number
      order: string
      orderby: string
      slug?: [string]
      status: [string]
      categories?: [number]
      categories_exclude?: [number]
      tags?: [number]
      tags_exclude?: [number]
      sticky?: boolean
      customDomain?: string
    },
    ctx: Context
  ): Promise<{ posts: WpPost[]; total_count: string }> => {
    const {
      clients: { wordpressProxy, sitemap },
      vtex: { logger },
    } = ctx

    try {
      const hasSitemap = await sitemap.hasSitemap(ctx)

      if (!hasSitemap) {
        sitemap.saveIndex(ctx)
      }
    } catch (err) {
      logger.log(err, LogLevel.Error)
    }

    const options = {
      page,
      per_page,
      search,
      after,
      author,
      author_exclude,
      before,
      exclude,
      include,
      offset,
      order,
      orderby,
      slug,
      status,
      categories,
      categories_exclude,
      tags,
      tags_exclude,
      sticky,
      customDomain,
    }
    const { headers, data } = await wordpressProxy.getPosts(options)
    const posts = data
    if (data.length) {
      posts[0].content.rendered = addCSShandles(data[0].content.rendered)
      posts[0].headerTags = addHeaderTags(data[0])
    }
    const total_count = headers['x-wp-total']
    const result = { posts, total_count }
    return result
  },
  wpPost: async (
    _: any,
    { id, password }: { id: number; password: string },
    ctx: Context
  ) => {
    const {
      clients: { wordpressProxy },
    } = ctx

    return wordpressProxy.getPost(id, password)
  },
  wpCategories: async (
    _: any,
    {
      page,
      per_page,
      search,
      exclude,
      include,
      order,
      orderby,
      hide_empty,
      parent,
      post,
      slug,
      customDomain,
    }: {
      page: number
      per_page: number
      search?: string
      exclude?: [number]
      include?: [number]
      order?: string
      orderby?: string
      hide_empty?: boolean
      parent?: number
      post?: number
      slug?: [string]
      customDomain?: string
    },
    ctx: Context
  ) => {
    const {
      clients: { wordpressProxy },
    } = ctx

    const options = {
      page,
      per_page,
      search,
      exclude,
      include,
      order,
      orderby,
      hide_empty,
      parent,
      post,
      slug,
      customDomain,
    }

    const { headers, data } = await wordpressProxy.getCategories(options)
    const categories = data
    const total_count = headers['x-wp-total']
    const result = { categories, total_count }
    return result
  },
  wpCategory: async (
    _: any,
    { id, customDomain }: { id: number; customDomain: string },
    ctx: Context
  ) => {
    const {
      clients: { wordpressProxy },
    } = ctx
    try {
      const result = await wordpressProxy.getCategory(id, customDomain)
      if (!result) return null
      return result
    } catch (e) {
      console.error(e)
    }
    return null
  },
  wpTags: async (
    _: any,
    {
      page,
      per_page,
      search,
      exclude,
      include,
      offset,
      order,
      orderby,
      hide_empty,
      post,
      slug,
      customDomain,
    }: {
      page: number
      per_page: number
      search?: string
      exclude?: [number]
      include?: [number]
      offset?: number
      order?: string
      orderby?: string
      hide_empty?: boolean
      post?: number
      slug?: [string]
      customDomain?: string
    },
    ctx: Context
  ) => {
    const {
      clients: { wordpressProxy },
    } = ctx

    const options = {
      page,
      per_page,
      search,
      exclude,
      include,
      offset,
      order,
      orderby,
      hide_empty,
      post,
      slug,
      customDomain,
    }
    const { headers, data } = await wordpressProxy.getTags(options)
    const tags = data
    const total_count = headers['x-wp-total']
    const result = { tags, total_count }
    return result
  },
  wpTag: async (_: any, { id }: { id: number }, ctx: Context) => {
    const {
      clients: { wordpressProxy },
    } = ctx

    return wordpressProxy.getTag(id)
  },
  wpPages: async (
    _: any,
    {
      page,
      per_page,
      search,
      after,
      author,
      author_exclude,
      before,
      exclude,
      include,
      menu_order,
      offset,
      order,
      orderby,
      parent,
      parent_exclude,
      slug,
      status,
      customDomain,
    }: {
      page: number
      per_page: number
      search: string
      after: string
      author: [number]
      author_exclude: [number]
      before: string
      exclude: [number]
      include: [number]
      menu_order: number
      offset: number
      order: string
      orderby: string
      parent: [string]
      parent_exclude: [string]
      slug: [string]
      status: [string]
      customDomain: string
    },
    ctx: Context
  ) => {
    const {
      clients: { wordpressProxy },
    } = ctx

    const options = {
      page,
      per_page,
      search,
      after,
      author,
      author_exclude,
      before,
      exclude,
      include,
      menu_order,
      offset,
      order,
      orderby,
      parent,
      parent_exclude,
      slug,
      status,
      customDomain,
    }

    const { headers, data } = await wordpressProxy.getPages(options)
    const pages = data
    if (data.length) {
      pages[0].content.rendered = addCSShandles(data[0].content.rendered)
      pages[0].headerTags = addHeaderTags(data[0])
    }
    const total_count = headers['x-wp-total']
    const result = { pages, total_count }
    return result
  },
  wpPage: async (
    _: any,
    { id, password }: { id: number; password: string },
    ctx: Context
  ) => {
    const {
      clients: { wordpressProxy },
    } = ctx

    return wordpressProxy.getPage(id, password)
  },
  wpComments: async (
    _: any,
    {
      page,
      per_page,
      search,
      after,
      author,
      author_exclude,
      author_email,
      before,
      exclude,
      include,
      offset,
      order,
      orderby,
      parent,
      parent_exclude,
      post,
      slug,
      status,
      type,
      password,
    }: {
      page: number
      per_page: number
      search: string
      after: string
      author: [number]
      author_exclude: [number]
      author_email: string
      before: string
      exclude: [number]
      include: [number]
      offset: number
      order: string
      orderby: string
      parent: [string]
      parent_exclude: [string]
      post: [number]
      slug: [string]
      status: string
      type: string
      password: string
    },
    ctx: Context
  ) => {
    const {
      clients: { wordpressProxy },
    } = ctx

    const options = {
      page,
      per_page,
      search,
      after,
      author,
      author_exclude,
      author_email,
      before,
      exclude,
      include,
      offset,
      order,
      orderby,
      parent,
      parent_exclude,
      post,
      slug,
      status,
      type,
      password,
    }

    const { headers, data } = await wordpressProxy.getComments(options)
    const comments = data
    const total_count = headers['x-wp-total']
    const result = { comments, total_count }
    return result
  },
  wpComment: async (
    _: any,
    { id, password }: { id: number; password: string },
    ctx: Context
  ) => {
    const {
      clients: { wordpressProxy },
    } = ctx

    return wordpressProxy.getComment(id, password)
  },
  wpTaxonomies: async (_: any, { type }: { type: string }, ctx: Context) => {
    const {
      clients: { wordpressProxy },
    } = ctx

    return wordpressProxy.getTaxonomies(type)
  },
  wpTaxonomy: async (
    _: any,
    { taxonomy }: { taxonomy: string },
    ctx: Context
  ) => {
    const {
      clients: { wordpressProxy },
    } = ctx

    return wordpressProxy.getTaxonomy(taxonomy)
  },
  wpMedia: async (
    _: any,
    {
      page,
      per_page,
      search,
      after,
      author,
      author_exclude,
      before,
      exclude,
      include,
      order,
      orderby,
      parent,
      parent_exclude,
      slug,
      status,
      media_type,
      mime_type,
    }: {
      page: number
      per_page: number
      search: string
      after: string
      author: [number]
      author_exclude: [number]
      before: string
      exclude: [number]
      include: [number]
      order: string
      orderby: string
      parent: [string]
      parent_exclude: [string]
      slug: [string]
      status: string
      media_type: string
      mime_type: string
    },
    ctx: Context
  ) => {
    const {
      clients: { wordpressProxy },
    } = ctx

    const options = {
      page,
      per_page,
      search,
      after,
      author,
      author_exclude,
      before,
      exclude,
      include,
      order,
      orderby,
      parent,
      parent_exclude,
      slug,
      status,
      media_type,
      mime_type,
    }

    const { headers, data } = await wordpressProxy.getMedia(options)
    const media = data
    const total_count = headers['x-wp-total']
    const result = { media, total_count }
    return result
  },
  wpMediaSingle: async (_: any, { id }: { id: number }, ctx: Context) => {
    const {
      clients: { wordpressProxy },
    } = ctx

    return wordpressProxy.getMediaSingle(id)
  },
  wpUsers: async (
    _: any,
    {
      page,
      per_page,
      search,
      exclude,
      include,
      offset,
      order,
      orderby,
      slug,
      roles,
    }: {
      page: number
      per_page: number
      search: string
      exclude: [number]
      include: [number]
      offset: number
      order: string
      orderby: string
      slug: [string]
      roles: [string]
    },
    ctx: Context
  ) => {
    const {
      clients: { wordpressProxy },
    } = ctx

    const options = {
      page,
      per_page,
      search,
      exclude,
      include,
      offset,
      order,
      orderby,
      slug,
      roles,
    }

    const { headers, data } = await wordpressProxy.getUsers(options)
    const users = data
    const total_count = headers['x-wp-total']
    const result = { users, total_count }
    return result
  },
  wpUser: async (_: any, { id }: { id: number }, ctx: Context) => {
    const {
      clients: { wordpressProxy },
    } = ctx

    return wordpressProxy.getUser(id)
  },
  wpPostTypes: async (_: any, __: any, ctx: Context) => {
    const {
      clients: { wordpressProxy },
    } = ctx

    return wordpressProxy.getPostTypes()
  },
  wpPostType: async (_: any, { type }: { type: string }, ctx: Context) => {
    const {
      clients: { wordpressProxy },
    } = ctx

    return wordpressProxy.getPostType(type)
  },
  wpPostStatuses: async (_: any, __: any, ctx: Context) => {
    const {
      clients: { wordpressProxy },
    } = ctx

    return wordpressProxy.getPostStatuses()
  },
  wpPostStatus: async (
    _: any,
    { status }: { status: string },
    ctx: Context
  ) => {
    const {
      clients: { wordpressProxy },
    } = ctx

    return wordpressProxy.getPostStatus(status)
  },
  wpSettings: async (_: any, __: any, ctx: Context) => {
    const {
      clients: { wordpressProxy },
    } = ctx

    return wordpressProxy.getSettings()
  },
  appSettings: async (_: any, __: any, ctx: Context) => {
    const appId = process.env.VTEX_APP_ID as string
    const settings = await ctx.clients.apps.getAppSettings(appId)
    return settings
  },
}
