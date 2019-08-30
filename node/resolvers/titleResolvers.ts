export const titleResolvers = {
    rendered: async ({ rendered }:{ rendered: string }, _: any, __: any) => {
        var he = require('he')
        return he.decode(rendered)
    },
}