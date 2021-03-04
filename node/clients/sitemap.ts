import { InstanceOptions, IOContext } from '@vtex/api'
import { AppGraphQLClient } from '@vtex/api'

const saveIndexMutation = `mutation SaveIndex($index: String!) {
    saveIndex(index: $index)
}`

const STOREFRONT = 'vtex-storefront'

export default class Sitemap extends AppGraphQLClient {
  constructor(ctx: IOContext, opts?: InstanceOptions) {
    super('vtex.store-sitemap@2.x', ctx, opts)
  }

  public async hasSitemap(ctx: Context) {
    const {
      clients: { apps },
    } = ctx

    const appId = process.env.VTEX_APP_ID

    if (!appId) {
      return true
    }

    const settings = await apps.getAppSettings(appId)

    if (settings.initializeSitemap) {
      settings.initializeSitemap = false
      await apps.saveAppSettings(appId, settings)

      return false
    }

    return true
  }

  public async saveIndex(ctx: Context) {
    const { tenant } = ctx.clients
    const tenantInfo = await tenant.info()
    const options = {
      headers: {
        ...this.options?.headers,
        'Proxy-Authorization': this.context.authToken,
        VtexIdclientAutCookie: this.context.authToken,
      },
      metric: 'wordpress-save-root-index',
    }

    const requests = []

    for (const bindingInfo of tenantInfo.bindings) {
      if (bindingInfo.targetProduct === STOREFRONT) {
        const binding = bindingInfo.id || ''

        requests.push(
          this.graphql.mutate(
            {
              mutate: saveIndexMutation,
              variables: { index: 'blog-posts', binding },
            },
            options
          )
        )

        requests.push(
          this.graphql.mutate(
            {
              mutate: saveIndexMutation,
              variables: { index: 'blog-categories', binding },
            },
            options
          )
        )
      }
    }

    await Promise.all(requests)
  }
}
