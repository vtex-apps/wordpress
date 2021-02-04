/* eslint-disable @typescript-eslint/camelcase */
import { LogLevel, method } from '@vtex/api'
import { queries } from './index'

const API_MAX_QUANTITY = 100

export const routes = {
  postsSitemap: method({
    GET: async (ctx: any) => {
      const { blogPath = 'blog' } = await queries.appSettings(null, null, ctx)
      const quantity = API_MAX_QUANTITY
      let page = 1
      let total = 0
      let offset = 0

      const sitemapContent = []

      try {
        do {
          // eslint-disable-next-line no-await-in-loop
          const response = await queries.wpPosts(
            null,
            {
              page,
              per_page: quantity,
              order: 'desc',
              orderby: 'date',
              status: ['publish'],
            },
            ctx
          )

          const lastMod = new Date().toISOString()
          const entries = response.posts?.map(post => {
            return `<url>
          <loc>https://${ctx.vtex.host}/${blogPath}/post/${post.slug}</loc>
          <lastmod>${lastMod}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.7</priority>
       </url>`
          })

          if (entries) {
            sitemapContent.push(...entries)
          }

          total = parseInt(response?.total_count, 10) || 0
          offset += API_MAX_QUANTITY
        } while (total > offset)

        const sitemap = `
          <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
           ${sitemapContent.join('')}</urlset>`

        ctx.set('Content-Type', 'text/xml')
        ctx.body = sitemap
        ctx.status = 200
      } catch (err) {
        ctx.vtex.logger.log(err, LogLevel.Error)
        ctx.body = err
        ctx.status = 500
      }
    },
  }),
  categoriesSitemap: method({
    GET: async (ctx: any) => {
      const { blogPath = 'blog' } = await queries.appSettings(null, null, ctx)
      const quantity = API_MAX_QUANTITY
      let page = 1
      let total = 0
      let offset = 0

      const sitemapContent = []

      try {
        do {
          // eslint-disable-next-line no-await-in-loop
          const response = await queries.wpCategories(
            null,
            {
              page,
              per_page: quantity,
              order: 'desc',
              orderby: 'name',
              hide_empty: true,
            },
            ctx
          )

          const lastMod = new Date().toISOString()
          const entries = response.categories?.map((category: any) => {
            return `<url>
          <loc>https://${ctx.vtex.host}/${blogPath}/category/${category.slug}</loc>
          <lastmod>${lastMod}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.7</priority>
       </url>`
          })

          if (entries) {
            sitemapContent.push(...entries)
          }

          total = parseInt(response?.total_count, 10) || 0
          offset += API_MAX_QUANTITY
        } while (total > offset)

        const sitemap = `
          <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
           ${sitemapContent.join('')}</urlset>`

        ctx.set('Content-Type', 'text/xml')
        ctx.body = sitemap
        ctx.status = 200
      } catch (err) {
        ctx.vtex.logger.log(err, LogLevel.Error)
        ctx.body = err
        ctx.status = 500
      }
    },
  }),
}
