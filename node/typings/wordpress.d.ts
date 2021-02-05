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
  title: any
  content: any
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
  _links: any
}
