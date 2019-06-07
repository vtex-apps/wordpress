import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'

export default class WordpressProxyDataSource extends ExternalClient {
    constructor(context: IOContext, options?: InstanceOptions) {
        super(`http://wwgolfshops.wpengine.com/wp-json/wp/v2/`, context, options)
    }
    
    public async getPosts(wpOptions?: any) {
        var combinedArgs = ""

        if (wpOptions) {
            var keys = Object.keys(wpOptions)
            var len = keys.length
            for (var i = 0; i < len; i++) {
                if (wpOptions[keys[i]] != undefined) {
                    combinedArgs += (combinedArgs != "" ? "&" : "") + keys[i] + "=" + wpOptions[keys[i]]
                }
            }
        }
        
        if (combinedArgs != "") combinedArgs = "?" + combinedArgs
        
        return this.http.getRaw(`posts` + combinedArgs, { metric: 'posts' })
    }

    public getPost = (id: number, password?: string) => {
        var formattedPassword = ""
        if (password != null) formattedPassword = "?password=" + password
        
        return this.http.get(`posts/` + id + formattedPassword, { metric: 'post' })
    }

    public async getCategories(wpOptions?: any) {
        var combinedArgs = ""
        
        if (wpOptions) {
            var keys = Object.keys(wpOptions)
            var len = keys.length
            for (var i = 0; i < len; i++) {
                if (wpOptions[keys[i]] != undefined) {
                    combinedArgs += (combinedArgs != "" ? "&" : "") + keys[i] + "=" + wpOptions[keys[i]]
                }
            }
        }

        if (combinedArgs != "") combinedArgs = "?" + combinedArgs
        
        return this.http.getRaw(`categories` + combinedArgs, { metric: 'categories' })
    }

    public getCategory = (id: number) => {
        return this.http.get(`categories/` + id, { metric: 'category' })
    }

    public async getTags(wpOptions?: any) {
        var combinedArgs = ""
        
        if (wpOptions) {
            var keys = Object.keys(wpOptions)
            var len = keys.length
            for (var i = 0; i < len; i++) {
                if (wpOptions[keys[i]] != undefined) {
                    combinedArgs += (combinedArgs != "" ? "&" : "") + keys[i] + "=" + wpOptions[keys[i]]
                }
            }
        }

        if (combinedArgs != "") combinedArgs = "?" + combinedArgs
        return this.http.getRaw(`tags` + combinedArgs, { metric: 'tags' })
    }

    public getTag = (id: number) => {
        return this.http.get(`tags/` + id, { metric: 'tag' })
    }

    public async getPages(wpOptions?: any) {
        var combinedArgs = ""
        
        if (wpOptions) {
            var keys = Object.keys(wpOptions)
            var len = keys.length
            for (var i = 0; i < len; i++) {
                if (wpOptions[keys[i]] != undefined) {
                    combinedArgs += (combinedArgs != "" ? "&" : "") + keys[i] + "=" + wpOptions[keys[i]]
                }
            }
        }
        
        if (combinedArgs != "") combinedArgs = "?" + combinedArgs
        return this.http.getRaw(`pages` + combinedArgs, { metric: 'pages' })
    }

    public getPage = (id: number, password?: string) => {
        var formattedPassword = ""
        if (password != null) formattedPassword = "?password=" + password
        
        return this.http.get(`pages/` + id + formattedPassword, { metric: 'page' })
    }

    public async getComments(wpOptions?: any) {
        var combinedArgs = ""
        
        if (wpOptions) {
            var keys = Object.keys(wpOptions)
            var len = keys.length
            for (var i = 0; i < len; i++) {
                if (wpOptions[keys[i]] != undefined) {
                    combinedArgs += (combinedArgs != "" ? "&" : "") + keys[i] + "=" + wpOptions[keys[i]]
                }
            }
        }

        if (combinedArgs != "") combinedArgs = "?" + combinedArgs
        return this.http.getRaw(`comments` + combinedArgs, { metric: 'comments' })
    }

    public getComment = (id: number, password?: string) => {
        var formattedPassword = ""
        if (password != null) formattedPassword = "?password=" + password
        
        return this.http.get(`comments/` + id + formattedPassword, { metric: 'comment' })
    }

    public getTaxonomies = (type?: string) => {
        var formattedType = ""
        if (type != null) formattedType = "?type=" + type
        return this.http.get(`taxonomies` + formattedType, { metric: 'taxonomies' })
    }

    public getTaxonomy = (taxonomy: string) => {
        return this.http.get(`taxonomies/` + taxonomy, { metric: 'taxonomy' })
    }

    public async getMedia(wpOptions?: any) {
        var combinedArgs = ""
        
        if (wpOptions) {
            var keys = Object.keys(wpOptions)
            var len = keys.length
            for (var i = 0; i < len; i++) {
                if (wpOptions[keys[i]] != undefined) {
                    combinedArgs += (combinedArgs != "" ? "&" : "") + keys[i] + "=" + wpOptions[keys[i]]
                }
            }
        }

        if (combinedArgs != "") combinedArgs = "?" + combinedArgs
        return this.http.getRaw(`media` + combinedArgs, { metric: 'media' })
    }

    public getMediaSingle = (id: number) => {
        return this.http.get(`media/` + id, { metric: 'media-single' })
    }

    public async getUsers(wpOptions?: any) {
        var combinedArgs = ""
        
        if (wpOptions) {
            var keys = Object.keys(wpOptions)
            var len = keys.length
            for (var i = 0; i < len; i++) {
                if (wpOptions[keys[i]] != undefined) {
                    combinedArgs += (combinedArgs != "" ? "&" : "") + keys[i] + "=" + wpOptions[keys[i]]
                }
            }
        }
        
        if (combinedArgs != "") combinedArgs = "?" + combinedArgs
        return this.http.getRaw(`users` + combinedArgs, { metric: 'users' })
    }

    public getUser = (id: number) => {
        return this.http.get(`users/` + id, { metric: 'user' })
    }

    public getPostTypes = () => {
        return this.http.get(`types`, { metric: 'post-types' })
    }

    public getPostType = (type: string) => {
        return this.http.get(`types/` + type, { metric: 'post-type' })
    }

    public getPostStatuses = () => {
        return this.http.get(`statuses`, { metric: 'post-statuses' })
    }

    public getPostStatus = (status: string) => {
        return this.http.get(`statuses/` + status, { metric: 'post-status' })
    }

    public getSettings = () => {
        return this.http.get(`settings`, { metric: 'settings' })
    }

}