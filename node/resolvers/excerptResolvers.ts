import he = require('he')

export const excerptResolvers = {
  rendered: async ({ rendered }: { rendered: string }, _: any, __: any) => {
    return he.decode(rendered)
  },
}
