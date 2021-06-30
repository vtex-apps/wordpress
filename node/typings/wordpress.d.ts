interface WpPost {
  id: number
  date: string
  date_gmt: string
  guid: any
  modified: string
  modified_gmt: string
  slug: string
  status: 'publish'
  type: 'post'
  link: string
  title: Title
  content: Content
  excerpt: any
  author: number
  featured_media: number
  comment_status: 'open'
  ping_status: 'open'
  sticky: boolean
  template: string
  format: 'standard'
  meta: string[]
  categories: string[]
  tags: string[]
  yoast_head?: string
  headerTags?: HeaderTags | null
  _links: any
}

interface Title {
  rendered: string
  protected: boolean
}

interface Content {
  rendered: string
  protected: boolean
}

interface WpTag {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: string
  meta: Meta
}

interface WpCategory extends WpTag {
  parent: number
}

interface Meta {
  [key: string]: string
}

interface HeaderTags {
  metaTags: MetaTag[]
  ldJson: string
}

interface MetaTag {
  name: string
  property: string
  content: string
}
