import { ExternalClient, InstanceOptions, IOContext, Apps } from '@vtex/api'

const DEFAULT_API_PATH = 'wp-json/wp/v2/'

export default class WordpressProxyDataSource extends ExternalClient {
  public endpoint?: string
  public apiPath?: string

  constructor(context: IOContext, options?: InstanceOptions) {
    super(``, context, options)
  }

  private async getEndpoint(vtex: IOContext) {
    const apps = new Apps(vtex)
    const appId = process.env.VTEX_APP_ID as string
    const settings = await apps.getAppSettings(appId)
    const endpoint = settings.endpoint || 'http://demo.wp-api.org/'
    this.endpoint = endpoint.replace('https://', 'http://')
  }

  private async getApiPath(vtex: IOContext) {
    const apps = new Apps(vtex)
    const appId = process.env.VTEX_APP_ID as string
    const settings = await apps.getAppSettings(appId)
    const apiPath = settings.apiPath || DEFAULT_API_PATH
    this.apiPath = apiPath
  }

  private async buildArgs(wpOptions: any) {
    if (!this.apiPath) {
      await this.getApiPath(this.context)
    }
    let returnStr = ''
    const keys = Object.keys(wpOptions)
    const len = keys.length
    for (let i = 0; i < len; i++) {
      if (wpOptions[keys[i]] && keys[i] !== 'customDomain') {
        returnStr += `${(returnStr ? '&' : '') + keys[i]}=${wpOptions[keys[i]]}`
      }
    }
    if (returnStr) {
      if (this.apiPath && this.apiPath.indexOf('?') >= 0) {
        returnStr = `&${returnStr}`
      } else {
        returnStr = `?${returnStr}`
      }
    }
    return returnStr
  }

  public async getPosts(wpOptions?: any) {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    if (!this.apiPath) {
      await this.getApiPath(this.context)
    }
    let combinedArgs = ''
    let { endpoint } = this
    if (wpOptions) {
      combinedArgs = await this.buildArgs(wpOptions)
      if (wpOptions.customDomain) endpoint = wpOptions.customDomain
    }

    return this.http.getRaw(`${endpoint}${this.apiPath}posts${combinedArgs}`, {
      metric: `posts${combinedArgs}`,
    })
  }

  public async getPost(id: number, password?: string, customDomain?: string) {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    if (!this.apiPath) {
      await this.getApiPath(this.context)
    }
    let { endpoint } = this
    if (customDomain) endpoint = customDomain
    let formattedPassword = ''
    if (password) {
      if (this.apiPath && this.apiPath.indexOf('?') >= 0) {
        formattedPassword = `&password=${password}`
      } else {
        formattedPassword = `?password=${password}`
      }
    }

    return this.http.get(
      `${endpoint}${this.apiPath}posts/${id}${formattedPassword}`,
      {
        metric: `post${id}${formattedPassword}`,
      }
    )
  }

  public async getCategories(wpOptions?: any) {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    if (!this.apiPath) {
      await this.getApiPath(this.context)
    }
    let combinedArgs = ''
    let { endpoint } = this
    if (wpOptions) {
      combinedArgs = await this.buildArgs(wpOptions)
      if (wpOptions.customDomain) endpoint = wpOptions.customDomain
    }

    return this.http.getRaw<WpCategory[]>(
      `${endpoint}${this.apiPath}categories${combinedArgs}`,
      {
        metric: `categories${combinedArgs}`,
      }
    )
  }

  public async getCategory(id: number, customDomain?: string) {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    if (!this.apiPath) {
      await this.getApiPath(this.context)
    }
    let { endpoint } = this
    if (customDomain) endpoint = customDomain
    return this.http.get(`${endpoint}${this.apiPath}categories/${id}`, {
      metric: `category${id}`,
    })
  }

  public async getTags(wpOptions?: any) {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    if (!this.apiPath) {
      await this.getApiPath(this.context)
    }
    let combinedArgs = ''
    let { endpoint } = this
    if (wpOptions) {
      combinedArgs = await this.buildArgs(wpOptions)
      if (wpOptions.customDomain) endpoint = wpOptions.customDomain
    }

    return this.http.getRaw<WpTag[]>(
      `${endpoint}${this.apiPath}tags${combinedArgs}`,
      {
        metric: `tags${combinedArgs}`,
      }
    )
  }

  public async getTag(id: number, customDomain?: string) {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    if (!this.apiPath) {
      await this.getApiPath(this.context)
    }
    let { endpoint } = this
    if (customDomain) endpoint = customDomain
    return this.http.get(`${endpoint}${this.apiPath}tags/${id}`, {
      metric: `tag${id}`,
    })
  }

  public async getPages(wpOptions?: any) {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    if (!this.apiPath) {
      await this.getApiPath(this.context)
    }
    let combinedArgs = ''
    let { endpoint } = this
    if (wpOptions) {
      combinedArgs = await this.buildArgs(wpOptions)
      if (wpOptions.customDomain) endpoint = wpOptions.customDomain
    }

    return this.http.getRaw(`${endpoint}${this.apiPath}pages${combinedArgs}`, {
      metric: `pages${combinedArgs}`,
    })
  }

  public async getPage(id: number, password?: string, customDomain?: string) {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    if (!this.apiPath) {
      await this.getApiPath(this.context)
    }
    let formattedPassword = ''
    let { endpoint } = this
    if (customDomain) endpoint = customDomain
    if (password) {
      if (this.apiPath && this.apiPath.indexOf('?') >= 0) {
        formattedPassword = `&password=${password}`
      } else {
        formattedPassword = `?password=${password}`
      }
    }

    return this.http.get(
      `${endpoint}${this.apiPath}pages/${id}${formattedPassword}`,
      {
        metric: `page${id}${formattedPassword}`,
      }
    )
  }

  public async getComments(wpOptions?: any) {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    if (!this.apiPath) {
      await this.getApiPath(this.context)
    }
    let combinedArgs = ''
    if (wpOptions) {
      combinedArgs = await this.buildArgs(wpOptions)
    }

    return this.http.getRaw(
      `${this.endpoint}${this.apiPath}comments${combinedArgs}`,
      {
        metric: `comments${combinedArgs}`,
      }
    )
  }

  public async getComment(id: number, password?: string) {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    if (!this.apiPath) {
      await this.getApiPath(this.context)
    }
    let formattedPassword = ''
    if (password) {
      if (this.apiPath && this.apiPath.indexOf('?') >= 0) {
        formattedPassword = `&password=${password}`
      } else {
        formattedPassword = `?password=${password}`
      }
    }

    return this.http.get(
      `${this.endpoint}${this.apiPath}comments/${id}${formattedPassword}`,
      {
        metric: `comment${id}${formattedPassword}`,
      }
    )
  }

  public async getTaxonomies(type?: string) {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    if (!this.apiPath) {
      await this.getApiPath(this.context)
    }
    let formattedType = ''
    if (type) {
      if (this.apiPath && this.apiPath.indexOf('?') >= 0) {
        formattedType = `&type=${type}`
      } else {
        formattedType = `?type=${type}`
      }
    }
    return this.http.get(
      `${this.endpoint}${this.apiPath}taxonomies${formattedType}`,
      {
        metric: `taxonomies${formattedType}`,
      }
    )
  }

  public async getTaxonomy(taxonomy: string) {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    if (!this.apiPath) {
      await this.getApiPath(this.context)
    }
    return this.http.get(
      `${this.endpoint}${this.apiPath}taxonomies/${taxonomy}`,
      {
        metric: `taxonomy${taxonomy}`,
      }
    )
  }

  public async getMedia(wpOptions?: any) {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    if (!this.apiPath) {
      await this.getApiPath(this.context)
    }
    let combinedArgs = ''
    if (wpOptions) {
      combinedArgs = await this.buildArgs(wpOptions)
    }

    return this.http.getRaw(
      `${this.endpoint}${this.apiPath}media${combinedArgs}`,
      {
        metric: `media${combinedArgs}`,
      }
    )
  }

  public async getMediaSingle(id: number, customDomain?: string) {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    if (!this.apiPath) {
      await this.getApiPath(this.context)
    }
    let { endpoint } = this
    if (customDomain) endpoint = customDomain
    return this.http.get(`${endpoint}${this.apiPath}media/${id}`, {
      metric: `media-single${id}`,
    })
  }

  public async getUsers(wpOptions?: any) {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    if (!this.apiPath) {
      await this.getApiPath(this.context)
    }
    let combinedArgs = ''
    if (wpOptions) {
      combinedArgs = await this.buildArgs(wpOptions)
    }

    return this.http.getRaw(
      `${this.endpoint}${this.apiPath}users${combinedArgs}`,
      {
        metric: `users${combinedArgs}`,
      }
    )
  }

  public async getUser(id: number, customDomain?: string) {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    if (!this.apiPath) {
      await this.getApiPath(this.context)
    }
    let { endpoint } = this
    if (customDomain) endpoint = customDomain
    return this.http.get(`${endpoint}${this.apiPath}users/${id}`, {
      metric: `user${id}`,
    })
  }

  public async getPostTypes() {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    if (!this.apiPath) {
      await this.getApiPath(this.context)
    }
    return this.http.get(`${this.endpoint}${this.apiPath}types`, {
      metric: 'post-types',
    })
  }

  public async getPostType(type: string) {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    if (!this.apiPath) {
      await this.getApiPath(this.context)
    }
    return this.http.get(`${this.endpoint}${this.apiPath}types/${type}`, {
      metric: `post-type${type}`,
    })
  }

  public async getPostStatuses() {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    if (!this.apiPath) {
      await this.getApiPath(this.context)
    }
    return this.http.get(`${this.endpoint}${this.apiPath}statuses`, {
      metric: 'post-statuses',
    })
  }

  public async getPostStatus(status: string) {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    if (!this.apiPath) {
      await this.getApiPath(this.context)
    }
    return this.http.get(`${this.endpoint}${this.apiPath}statuses/${status}`, {
      metric: `post-status${status}`,
    })
  }

  public async getSettings() {
    if (!this.endpoint) {
      await this.getEndpoint(this.context)
    }
    if (!this.apiPath) {
      await this.getApiPath(this.context)
    }
    return this.http.get(`${this.endpoint}${this.apiPath}settings`, {
      metric: 'settings',
    })
  }
}
