export const queries = {
    wpPosts: async function (_: any, {
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
        sticky
    }: {
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
    }, ctx: Context) {
        const {
            clients: { wordpress },
        } = ctx

        const { headers, data } = await wordpress.getPosts(
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
            sticky)
        const posts = data
        const total_count = headers['x-wp-total']
        const result = { posts, total_count }
        return result
    },
    wpPost: async (_: any, { id, password }: { id: number, password: string }, ctx: Context) => {
        const {
            clients: { wordpress },
        } = ctx

        return wordpress.getPost(id, password)
    },
    wpCategories: async (_:any, {
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
        slug
    }:{
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
    }, ctx: Context) => {
        const {
            clients: { wordpress },
        } = ctx

        const { headers, data } = await wordpress.getCategories(
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
            slug)
        const categories = data
        const total_count = headers['x-wp-total']
        const result = { categories, total_count }
        return result
    },
    wpCategory: async (_: any, { id }:{ id: number }, ctx: Context) => {
        const {
            clients: { wordpress },
        } = ctx

        return wordpress.getCategory(id)
    },
    wpTags: async (_:any, {
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
        slug
    }:{
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
    }, ctx: Context) => {
        const {
            clients: { wordpress },
        } = ctx

        const { headers, data } = await wordpress.getTags(
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
            slug)
        const tags = data
        const total_count = headers['x-wp-total']
        const result = { tags, total_count }
        return result
    },
    wpTag: async (_: any, { id }:{ id: number }, ctx: Context) => {
        const {
            clients: { wordpress },
        } = ctx

        return wordpress.getTag(id)
    },
    wpPages: async (_: any, {
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
        status
    }:{
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
    }, ctx: Context) => {
        const {
            clients: { wordpress },
        } = ctx

        const { headers, data } =  await wordpress.getPages(
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
            status
        )
        const pages = data
        const total_count = headers['x-wp-total']
        const result = { pages, total_count }
        return result
    },
    wpPage: async (_: any, { id, password }: { id: number, password: string }, ctx: Context) => {
        const {
            clients: { wordpress },
        } = ctx

        return wordpress.getPage(id, password)
    },
    wpComments: async (_: any, {
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
        password
    }:{
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
    }, ctx: Context) => {
        const {
            clients: { wordpress },
        } = ctx

        const { headers, data } = await wordpress.getComments(
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
            password
        )
        const comments = data
        const total_count = headers['x-wp-total']
        const result = { comments, total_count }
        return result
    },
    wpComment: async (_: any, { id, password }: { id: number, password: string }, ctx: Context) => {
        const {
            clients: { wordpress },
        } = ctx

        return wordpress.getComment(id, password)
    },
    wpTaxonomies: async (_: any, { type }:{ type: string }, ctx: Context) => {
        const {
            clients: { wordpress },
        } = ctx

        return wordpress.getTaxonomies(type)
    },
    wpTaxonomy: async (_: any, { taxonomy }:{ taxonomy: string }, ctx: Context) => {
        const {
            clients: { wordpress },
        } = ctx

        return wordpress.getTaxonomy(taxonomy)
    },
    wpMedia: async (_: any, {
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
        mime_type
    }:{
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
    }, ctx: Context) => {
        const {
            clients: { wordpress },
        } = ctx

        const { headers, data } = await wordpress.getMedia(
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
            mime_type
        )
        const media = data
        const total_count = headers['x-wp-total']
        const result = { media, total_count }
        return result
    },
    wpMediaSingle: async (_: any, { id }:{ id: number }, ctx: Context) => {
        const {
            clients: { wordpress },
        } = ctx

        return wordpress.getMediaSingle(id)
    },
    wpUsers: async (_: any, {
        page,
        per_page,
        search,
        exclude,
        include,
        offset,
        order,
        orderby,
        slug,
        roles
    }:{
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
    }, ctx: Context) => {
        const {
            clients: { wordpress },
        } = ctx

        const { headers, data } = await wordpress.getUsers(
            page,
            per_page,
            search,
            exclude,
            include,
            offset,
            order,
            orderby,
            slug,
            roles
        )
        const users = data
        const total_count = headers['x-wp-total']
        const result = { users, total_count }
        return result
    },
    wpUser: async (_: any, { id }:{ id: number }, ctx: Context) => {
        const {
            clients: { wordpress },
        } = ctx

        return wordpress.getUser(id)
    },
    wpPostTypes: async (_: any, __: any, ctx: Context) => {
        const {
            clients: { wordpress },
        } = ctx

        return wordpress.getPostTypes()
    },
    wpPostType: async (_: any, { type }:{ type: string }, ctx: Context) => {
        const {
            clients: { wordpress },
        } = ctx

        return wordpress.getPostType(type)
    },
    wpPostStatuses: async (_: any, __: any, ctx: Context) => {
        const {
            clients: { wordpress },
        } = ctx

        return wordpress.getPostStatuses()
    },
    wpPostStatus: async (_: any, { status }:{ status: string }, ctx: Context) => {
        const {
            clients: { wordpress },
        } = ctx

        return wordpress.getPostStatus(status)
    },
    wpSettings: async (_: any, __: any, ctx: Context) => {
        const {
            clients: { wordpress },
        } = ctx

        return wordpress.getSettings()
    },
}