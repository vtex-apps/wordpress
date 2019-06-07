export const captionResolvers = {
    rendered: async ({ rendered }:{ rendered: string }, _: any, __: any) => {
        var sanitizeHtml = require('sanitize-html')
        return sanitizeHtml(rendered, { allowedTags: []})
    },
}