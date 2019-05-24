import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'

export default class WordpressDataSource extends ExternalClient {
    constructor(context: IOContext, options?: InstanceOptions) {
        super(`http://wwgolfshops.wpengine.com/wp-json/wp/v2/`, context, options)
    }
    
    public async getPosts(
        page: number,
        per_page: number,
        search: string,
        after: string,
        author: [number],
        author_exclude: [number],
        before: string,
        exclude: [number],
        include: [number],
        offset: number,
        order: string,
        orderby: string,
        slug: [string],
        status: [string],
        categories: [number],
        categories_exclude: [number],
        tags: [number],
        tags_exclude: [number],
        sticky: boolean
    ) {
        var combinedArgs = ""
        if (page != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "page=" + page }
        if (per_page != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "per_page=" + per_page }
        if (search != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "search=" + search }
        if (after != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "after=" + after }
        if (author != undefined && author.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "author=" + author }
        if (author_exclude != undefined && author_exclude.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "author_exclude=" + author_exclude }
        if (before != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "before=" + before }
        if (exclude != undefined && exclude.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "exclude=" + exclude }
        if (include != undefined && include.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "include=" + include }
        if (offset != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "offset=" + offset }
        if (order != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "order=" + order }
        if (orderby != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "orderby=" + orderby }
        if (slug != undefined && slug.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "slug=" + slug }
        if (status != undefined && status.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "status=" + status }
        if (categories != undefined && categories.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "categories=" + categories }
        if (categories_exclude != undefined && categories_exclude.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "categories_exclude=" + categories_exclude }
        if (tags != undefined && tags.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "tags=" + tags }
        if (tags_exclude != undefined && tags_exclude.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "tags_exclude=" + tags_exclude }
        if (sticky != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "sticky=" + sticky }
        if (combinedArgs != "") combinedArgs = "?" + combinedArgs
        return this.http.getRaw(`posts` + combinedArgs, { metric: 'posts' })
    }

    public getPost = (id: number, password: string) => {
        var formattedPassword = ""
        if (password != null) formattedPassword = "?password=" + password
        
        return this.http.get(`posts/` + id + formattedPassword, { metric: 'post' })
    }

    public async getCategories(
        page: number,
        per_page: number,
        search: string,
        exclude: [number],
        include: [number],
        order: string,
        orderby: string,
        hide_empty: boolean,
        parent: number,
        post: number,
        slug: [string]
    ) {
        var combinedArgs = ""
        if (page != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "page=" + page }
        if (per_page != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "per_page=" + per_page }
        if (search != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "search=" + search }
        if (exclude != undefined && exclude.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "exclude=" + exclude }
        if (include != undefined && include.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "include=" + include }
        if (order != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "order=" + order }
        if (orderby != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "orderby=" + orderby }
        if (hide_empty != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "hide_empty=" + hide_empty }
        if (parent != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "parent=" + parent }
        if (post != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "post=" + post }
        if (slug != undefined && slug.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "slug=" + slug }
        if (combinedArgs != "") combinedArgs = "?" + combinedArgs
        return this.http.getRaw(`categories` + combinedArgs, { metric: 'categories' })
    }

    public getCategory = (id: number) => {
        return this.http.get(`categories/` + id, { metric: 'category' })
    }

    public async getTags(
        page: number,
        per_page: number,
        search: string,
        exclude: [number],
        include: [number],
        offset: number,
        order: string,
        orderby: string,
        hide_empty: boolean,
        post: number,
        slug: [string]
    ) {
        var combinedArgs = ""
        if (page != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "page=" + page }
        if (per_page != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "per_page=" + per_page }
        if (search != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "search=" + search }
        if (exclude != undefined && exclude.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "exclude=" + exclude }
        if (include != undefined && include.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "include=" + include }
        if (offset != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "offset=" + offset }        
        if (order != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "order=" + order }
        if (orderby != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "orderby=" + orderby }
        if (hide_empty != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "hide_empty=" + hide_empty }
        if (post != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "post=" + post }
        if (slug != undefined && slug.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "slug=" + slug }
        if (combinedArgs != "") combinedArgs = "?" + combinedArgs
        return this.http.getRaw(`tags` + combinedArgs, { metric: 'tags' })
    }

    public getTag = (id: number) => {
        return this.http.get(`tags/` + id, { metric: 'tag' })
    }

    public async getPages(
        page: number,
        per_page: number,
        search: string,
        after: string,
        author: [number],
        author_exclude: [number],
        before: string,
        exclude: [number],
        include: [number],
        menu_order: number,
        offset: number,
        order: string,
        orderby: string,
        parent: [string],
        parent_exclude: [string],
        slug: [string],
        status: [string]
    ) {
        var combinedArgs = ""
        if (page != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "page=" + page }
        if (per_page != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "per_page=" + per_page }
        if (search != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "search=" + search }
        if (after != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "after=" + after }
        if (author != undefined && author.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "author=" + author }
        if (author_exclude != undefined && author_exclude.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "author_exclude=" + author_exclude }
        if (before != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "before=" + before }
        if (exclude != undefined && exclude.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "exclude=" + exclude }
        if (include != undefined && include.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "include=" + include }
        if (menu_order != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "menu_order=" + menu_order }
        if (offset != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "offset=" + offset }
        if (order != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "order=" + order }
        if (orderby != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "orderby=" + orderby }
        if (parent != undefined && parent.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "parent=" + parent }
        if (parent_exclude != undefined && parent_exclude.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "parent_exclude=" + parent_exclude }
        if (slug != undefined && slug.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "slug=" + slug }
        if (status != undefined && status.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "status=" + status }
        if (combinedArgs != "") combinedArgs = "?" + combinedArgs
        return this.http.getRaw(`pages` + combinedArgs, { metric: 'pages' })
    }

    public getPage = (id: number, password: string) => {
        var formattedPassword = ""
        if (password != null) formattedPassword = "?password=" + password
        
        return this.http.get(`pages/` + id + formattedPassword, { metric: 'page' })
    }

    public async getComments(
        page: number,
        per_page: number,
        search: string,
        after: string,
        author: [number],
        author_exclude: [number],
        author_email: string,
        before: string,
        exclude: [number],
        include: [number],
        offset: number,
        order: string,
        orderby: string,
        parent: [string],
        parent_exclude: [string],
        post: [number],
        slug: [string],
        status: string,
        type: string,
        password: string
    ) {
        var combinedArgs = ""
        if (page != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "page=" + page }
        if (per_page != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "per_page=" + per_page }
        if (search != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "search=" + search }
        if (after != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "after=" + after }
        if (author != undefined && author.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "author=" + author }
        if (author_exclude != undefined && author_exclude.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "author_exclude=" + author_exclude }
        if (author_email != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "author_email=" + author_email }
        if (before != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "before=" + before }
        if (exclude != undefined && exclude.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "exclude=" + exclude }
        if (include != undefined && include.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "include=" + include }
        if (offset != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "offset=" + offset }
        if (order != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "order=" + order }
        if (orderby != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "orderby=" + orderby }
        if (parent != undefined && parent.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "parent=" + parent }
        if (parent_exclude != undefined && parent_exclude.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "parent_exclude=" + parent_exclude }
        if (post != undefined && post.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "post=" + post }              
        if (slug != undefined && slug.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "slug=" + slug }
        if (status != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "status=" + status }
        if (type != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "type=" + type }
        if (password != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "password=" + password }
        
        if (combinedArgs != "") combinedArgs = "?" + combinedArgs
        return this.http.getRaw(`comments` + combinedArgs, { metric: 'comments' })
    }

    public getComment = (id: number, password: string) => {
        var formattedPassword = ""
        if (password != null) formattedPassword = "?password=" + password
        
        return this.http.get(`comments/` + id + formattedPassword, { metric: 'comment' })
    }

    public getTaxonomies = (type: string) => {
        var formattedType = ""
        if (type != null) formattedType = "?type=" + type
        return this.http.get(`taxonomies` + formattedType, { metric: 'taxonomies' })
    }

    public getTaxonomy = (taxonomy: string) => {
        return this.http.get(`taxonomies/` + taxonomy, { metric: 'taxonomy' })
    }

    public async getMedia(
        page: number,
        per_page: number,
        search: string,
        after: string,
        author: [number],
        author_exclude: [number],
        before: string,
        exclude: [number],
        include: [number],
        order: string,
        orderby: string,
        parent: [string],
        parent_exclude: [string],
        slug: [string],
        status: string,
        media_type: string,
        mime_type: string
    ) {
        var combinedArgs = ""
        if (page != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "page=" + page }
        if (per_page != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "per_page=" + per_page }
        if (search != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "search=" + search }
        if (after != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "after=" + after }
        if (author != undefined && author.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "author=" + author }
        if (author_exclude != undefined && author_exclude.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "author_exclude=" + author_exclude }
        if (before != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "before=" + before }
        if (exclude != undefined && exclude.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "exclude=" + exclude }
        if (include != undefined && include.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "include=" + include }
        if (order != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "order=" + order }
        if (orderby != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "orderby=" + orderby }
        if (parent != undefined && parent.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "parent=" + parent }
        if (parent_exclude != undefined && parent_exclude.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "parent_exclude=" + parent_exclude }
        if (slug != undefined && slug.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "slug=" + slug }
        if (status != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "status=" + status }
        if (media_type != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "media_type=" + media_type }
        if (mime_type != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "mime_type=" + mime_type }
        
        if (combinedArgs != "") combinedArgs = "?" + combinedArgs
        return this.http.getRaw(`media` + combinedArgs, { metric: 'media' })
    }

    public getMediaSingle = (id: number) => {
        return this.http.get(`media/` + id, { metric: 'media-single' })
    }

    public async getUsers(
        page: number,
        per_page: number,
        search: string,
        exclude: [number],
        include: [number],
        offset: number,
        order: string,
        orderby: string,
        slug: [string],
        roles: [string]
    ) {
        var combinedArgs = ""
        if (page != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "page=" + page }
        if (per_page != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "per_page=" + per_page }
        if (search != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "search=" + search }
        if (exclude != undefined && exclude.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "exclude=" + exclude }
        if (include != undefined && include.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "include=" + include }
        if (offset != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "offset=" + offset }
        if (order != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "order=" + order }
        if (orderby != null) { combinedArgs += (combinedArgs != "" ? "&" : "") + "orderby=" + orderby }
        if (slug != undefined && slug.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "slug=" + slug }
        if (roles != undefined && roles.length > 0) { combinedArgs += (combinedArgs != "" ? "&" : "") + "roles=" + roles }
        
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