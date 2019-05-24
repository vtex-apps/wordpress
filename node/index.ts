import { queries } from './resolvers/index'
import {Service} from '@vtex/api'
import { clients } from './clients'

export default new Service({
    clients,
    graphql: {
        resolvers: {
            Query: {
                ...queries,
            },
            WPPost: {
                author: async ({ author }:{ author: number }, _: any, ctx: Context) => {
                    const { clients: { wordpress }} = ctx
                    return wordpress.getUser(author)
                },
                categories: async ({ categories }: { categories: [number] }, _: any, ctx: Context) => {
                    const { clients: { wordpress }} = ctx
                    return categories.map(id => wordpress.getCategory(id))
                },
                featured_media: async ({ featured_media }: { featured_media: number }, _: any, ctx: Context) => {
                    const { clients: { wordpress }} = ctx
                    if (featured_media > 0) {
                        return wordpress.getMediaSingle(featured_media)
                    } else {
                        return null
                    }
                }
            }
        }
    },
})