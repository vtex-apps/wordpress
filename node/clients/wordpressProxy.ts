import { ExternalClient, InstanceOptions, IOContext, Apps } from '@vtex/api'

const DEFAULT_API_PATH = 'wp-json/wp/v2/'

export default class WordpressProxyDataSource extends ExternalClient {
  public endpoint?: string

  public constructor(context: IOContext, options?: InstanceOptions) {
    super(``, context, options)
  }

  private getEndpoint= async (vtex: IOContext) => {
    const apps = new Apps(vtex)
    const appId = process.env.VTEX_APP_ID as string
    const settings = await apps.getAppSettings(appId)
    this.endpoint = settings.endpoint || 'http://demo.wp-api.org/'
    return
  }

  private buildArgs(wpOptions: any) {
    let returnStr = ''
    const keys = Object.keys(wpOptions)
    const len = keys.length
    for (var i = 0; i < len; i++) {
      if (wpOptions[keys[i]] && keys[i] !== 'customDomain') {
        returnStr +=
          (returnStr != '' ? '&' : '') + keys[i] + '=' + wpOptions[keys[i]]
      }
    }
    if (returnStr != '') returnStr = '?' + returnStr
    return returnStr
  }

  public getPosts = async (wpOptions?: any) => {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    let combinedArgs = ''
    let endpoint = this.endpoint
    if (wpOptions) {
      combinedArgs = this.buildArgs(wpOptions)
      if (wpOptions.customDomain) endpoint = wpOptions.customDomain
    }

    return this.http.getRaw(
      endpoint + DEFAULT_API_PATH + `posts` + combinedArgs,
      {
        metric: 'posts' + combinedArgs,
      }
    )
  }

  public getPost = async (id: number, password?: string, customDomain?: string) => {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    let endpoint = this.endpoint
    if (customDomain) endpoint = customDomain
    let formattedPassword = ''
    if (password) formattedPassword = '?password=' + password

    return this.http.get(
      endpoint + DEFAULT_API_PATH + `posts/` + id + formattedPassword,
      {
        metric: 'post' + id + formattedPassword,
      }
    )
  }

  public getCategories = async (wpOptions?: any) => {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    let combinedArgs = ''
    let endpoint = this.endpoint
    if (wpOptions) {
      combinedArgs = this.buildArgs(wpOptions)
      if (wpOptions.customDomain) endpoint = wpOptions.customDomain
    }

    return this.http.getRaw(
      endpoint + DEFAULT_API_PATH + `categories` + combinedArgs,
      {
        metric: 'categories' + combinedArgs,
      }
    )
  }

  public getCategory = async (id: number, customDomain?: string) => {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    let endpoint = this.endpoint
    if (customDomain) endpoint = customDomain

    return this.http.get(endpoint + DEFAULT_API_PATH + `categories/` + id, {
      metric: 'category' + id,
    })
  }

  public getTags = async (wpOptions?: any) => {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    let combinedArgs = ''
    let endpoint = this.endpoint
    if (wpOptions) {
      combinedArgs = this.buildArgs(wpOptions)
      if (wpOptions.customDomain) endpoint = wpOptions.customDomain
    }
    return this.http.getRaw(
      endpoint + DEFAULT_API_PATH + `tags` + combinedArgs,
      {
        metric: 'tags' + combinedArgs,
      }
    )
  }

  public async getTag(id: number, customDomain?: string) {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    let endpoint = this.endpoint
    if (customDomain) endpoint = customDomain
    return this.http.get(endpoint + DEFAULT_API_PATH + `tags/` + id, {
      metric: 'tag' + id,
    })
  }

  public getPages= async (wpOptions?: any) => {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    let combinedArgs = ''
    let endpoint = this.endpoint
    if (wpOptions) {
      combinedArgs = this.buildArgs(wpOptions)
      if (wpOptions.customDomain) endpoint = wpOptions.customDomain
    }

    return this.http.getRaw(
      endpoint + DEFAULT_API_PATH + `pages` + combinedArgs,
      {
        metric: 'pages' + combinedArgs,
      }
    )
  }

  public getPage = async (id: number, password?: string, customDomain?: string) => {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    let formattedPassword = ''
    let endpoint = this.endpoint
    if (customDomain) endpoint = customDomain
    if (password) formattedPassword = '?password=' + password

    return this.http.get(
      endpoint + DEFAULT_API_PATH + `pages/` + id + formattedPassword,
      {
        metric: 'page' + id + formattedPassword,
      }
    )
  }

  public getComments = async (wpOptions?: any) => {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    let combinedArgs = ''
    if (wpOptions) {
      combinedArgs = this.buildArgs(wpOptions)
    }

    return this.http.getRaw(
      this.endpoint + DEFAULT_API_PATH + `comments` + combinedArgs,
      {
        metric: 'comments' + combinedArgs,
      }
    )
  }

  public getComment = async (id: number, password?: string) => {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    let formattedPassword = ''
    if (password) formattedPassword = '?password=' + password

    return this.http.get(
      this.endpoint + DEFAULT_API_PATH + `comments/` + id + formattedPassword,
      {
        metric: 'comment' + id + formattedPassword,
      }
    )
  }

  public getTaxonomies = async (type?: string) => {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    let formattedType = ''
    if (type) formattedType = '?type=' + type
    return this.http.get(
      this.endpoint + DEFAULT_API_PATH + `taxonomies` + formattedType,
      {
        metric: 'taxonomies' + formattedType,
      }
    )
  }

  public getTaxonomy = async (taxonomy: string) => {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    return this.http.get(
      this.endpoint + DEFAULT_API_PATH + `taxonomies/` + taxonomy,
      {
        metric: 'taxonomy' + taxonomy,
      }
    )
  }

  public getMedia = async (wpOptions?: any) => {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    let combinedArgs = ''
    if (wpOptions) {
      combinedArgs = this.buildArgs(wpOptions)
    }

    return this.http.getRaw(
      this.endpoint + DEFAULT_API_PATH + `media` + combinedArgs,
      {
        metric: 'media' + combinedArgs,
      }
    )
  }

  public getMediaSingle = async (id: number, customDomain?: string) => {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    let endpoint = this.endpoint
    if (customDomain) endpoint = customDomain
    return this.http.get(endpoint + DEFAULT_API_PATH + `media/` + id, {
      metric: 'media-single' + id,
    })
  }

  public getUsers = async (wpOptions?: any) => {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    let combinedArgs = ''
    if (wpOptions) {
      combinedArgs = this.buildArgs(wpOptions)
    }

    return this.http.getRaw(
      this.endpoint + DEFAULT_API_PATH + `users` + combinedArgs,
      {
        metric: 'users' + combinedArgs,
      }
    )
  }

  public getUser = async (id: number, customDomain?: string) => {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    let endpoint = this.endpoint
    if (customDomain) endpoint = customDomain
    return this.http.get(endpoint + DEFAULT_API_PATH + `users/` + id, {
      metric: 'user' + id,
    })
  }

  public getPostTypes = async () => {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    return this.http.get(this.endpoint + DEFAULT_API_PATH + `types`, {
      metric: 'post-types',
    })
  }

  public getPostType = async (type: string) => {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    return this.http.get(this.endpoint + DEFAULT_API_PATH + `types/` + type, {
      metric: 'post-type' + type,
    })
  }

  public getPostStatuses = async () => {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    return this.http.get(this.endpoint + DEFAULT_API_PATH + `statuses`, {
      metric: 'post-statuses',
    })
  }

  public getPostStatus = async (status: string) => {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    return this.http.get(
      this.endpoint + DEFAULT_API_PATH + `statuses/` + status,
      {
        metric: 'post-status' + status,
      }
    )
  }

  public getSettings = async () => {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    return this.http.get(this.endpoint + DEFAULT_API_PATH + `settings`, {
      metric: 'settings',
    })
  }
}
