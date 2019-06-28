import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'

export default class WordpressProxyDataSource extends ExternalClient {
    constructor(context: IOContext, options?: InstanceOptions) {
        super(`http://wwgolfshops.wpengine.com/wp-json/wp/v2/`, context, options)
    }
    
    buildArgs(wpOptions: any) {
        var returnStr = ""
        var keys = Object.keys(wpOptions)
        var len = keys.length
        for (var i = 0; i < len; i++) {
            if (wpOptions[keys[i]] != undefined) {
                returnStr += (returnStr != "" ? "&" : "") + keys[i] + "=" + wpOptions[keys[i]]
            }
        }
        if (returnStr != "") returnStr = "?" + returnStr
        return returnStr
    }

    public async getPosts(wpOptions?: any) {
        var combinedArgs = ""

        if (wpOptions) {
            combinedArgs = this.buildArgs(wpOptions)
        }
        
        return this.http.getRaw(`posts` + combinedArgs, { metric: 'posts' + combinedArgs })
    }

    public getPost = (id: number, password?: string) => {
        var formattedPassword = ""
        if (password != null) formattedPassword = "?password=" + password
        
        return this.http.get(`posts/` + id + formattedPassword, { metric: 'post' + id + formattedPassword })
    }

    public async getCategories(wpOptions?: any) {
        var combinedArgs = ""
        
        if (wpOptions) {
            combinedArgs = this.buildArgs(wpOptions)
        }
        
        return this.http.getRaw(`categories` + combinedArgs, { metric: 'categories' + combinedArgs })
    }

    public getCategory = (id: number) => {
        return this.http.get(`categories/` + id, { metric: 'category' + id })
    }

    public async getTags(wpOptions?: any) {
        var combinedArgs = ""
        
        if (wpOptions) {
            combinedArgs = this.buildArgs(wpOptions)
        }
        
        return this.http.getRaw(`tags` + combinedArgs, { metric: 'tags' + combinedArgs })
    }

    public getTag = (id: number) => {
        return this.http.get(`tags/` + id, { metric: 'tag' + id })
    }

    public async getPages(wpOptions?: any) {
        var combinedArgs = ""
        
        if (wpOptions) {
            combinedArgs = this.buildArgs(wpOptions)
        }
        
        return this.http.getRaw(`pages` + combinedArgs, { metric: 'pages' + combinedArgs })
    }

    public getPage = (id: number, password?: string) => {
        var formattedPassword = ""
        if (password != null) formattedPassword = "?password=" + password
        
        return this.http.get(`pages/` + id + formattedPassword, { metric: 'page' + id + formattedPassword })
    }

    public async getComments(wpOptions?: any) {
        var combinedArgs = ""
        
        if (wpOptions) {
            combinedArgs = this.buildArgs(wpOptions)
        }
        
        return this.http.getRaw(`comments` + combinedArgs, { metric: 'comments' + combinedArgs })
    }

    public getComment = (id: number, password?: string) => {
        var formattedPassword = ""
        if (password != null) formattedPassword = "?password=" + password
        
        return this.http.get(`comments/` + id + formattedPassword, { metric: 'comment' + id + formattedPassword })
    }

    public getTaxonomies = (type?: string) => {
        var formattedType = ""
        if (type != null) formattedType = "?type=" + type
        return this.http.get(`taxonomies` + formattedType, { metric: 'taxonomies' + formattedType })
    }

    public getTaxonomy = (taxonomy: string) => {
        return this.http.get(`taxonomies/` + taxonomy, { metric: 'taxonomy' + taxonomy })
    }

    public async getMedia(wpOptions?: any) {
        var combinedArgs = ""
        
        if (wpOptions) {
            combinedArgs = this.buildArgs(wpOptions)
        }
        
        return this.http.getRaw(`media` + combinedArgs, { metric: 'media' + combinedArgs })
    }

    public getMediaSingle = (id: number) => {
        return this.http.get(`media/` + id, { metric: 'media-single' + id })
    }

    public async getUsers(wpOptions?: any) {
        var combinedArgs = ""
        
        if (wpOptions) {
            combinedArgs = this.buildArgs(wpOptions)
        }
        
        return this.http.getRaw(`users` + combinedArgs, { metric: 'users' + combinedArgs })
    }

    public getUser = (id: number) => {
        return this.http.get(`users/` + id, { metric: 'user' + id })
    }

    public getPostTypes = () => {
        return this.http.get(`types`, { metric: 'post-types' })
    }

    public getPostType = (type: string) => {
        return this.http.get(`types/` + type, { metric: 'post-type' + type })
    }

    public getPostStatuses = () => {
        return this.http.get(`statuses`, { metric: 'post-statuses' })
    }

    public getPostStatus = (status: string) => {
        return this.http.get(`statuses/` + status, { metric: 'post-status' + status })
    }

    public getSettings = () => {
        return this.http.get(`settings`, { metric: 'settings' })
    }

}