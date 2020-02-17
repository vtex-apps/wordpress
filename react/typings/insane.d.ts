// Insane is based on the sanitize-html package.
// So its types are extremely close to it.

declare function insane(dirty: string, options?: insaneNS.Options): string

declare namespace insaneNS {
  interface Options {
    allowedTags?: string[] | boolean
    allowedAttributes?: { [index: string]: string[] } | boolean
    allowedStyles?: { [index: string]: { [index: string]: RegExp[] } }
    allowedClasses?: { [index: string]: string[] } | boolean
  }
}

declare module 'insane' {
  export = insane
}
