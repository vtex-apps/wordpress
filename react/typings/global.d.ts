/* eslint-disable @typescript-eslint/camelcase */
interface Window extends Window {
  dataLayer: any[]
  __SETTINGS__: {
    titleTag: string
  }
}

interface PostData {
  title: WPTitle
  author: WPUser
  content: WPContent
  date: string
  type: string
  id: number
  slug: string
  link: string
  excerpt: WPExcerpt
  categories: [WPCategory]
  featured_media: WPMedia
  headerTags: HeaderTags
  tags: [WPTag]
}

interface WPTitle {
  raw: string
  rendered: string
}
interface WPContent {
  raw: string
  rendered: string
  protected: bool
}
interface WPUser {
  id: number
  username: string
  name: string
  first_name: string
  last_name: string
  email: string
  url: string
  description: string
  link: string
  locale: string
  nickname: string
  slug: string
  registered_date: string
  roles: [string]
  password: string
  capabilities: [string]
  extra_capabilities: [string]
  avatar_urls: WPAvatarObject
  meta: string
}
interface WPCategory {
  id: number
  slug: string
  count: number
  description: string
  link: string
  name: string
  taxonomy: WPTaxonomyType
  parent: number
  meta: string
}
interface WPExcerpt {
  raw: string
  rendered: string
  protected: bool
}
enum WPTaxonomyType {
  category,
  post_tag,
  nav_menu,
  link_category,
  post_format,
}
interface WPAvatarObject {
  size24: string
  size48: string
  size96: string
}
interface WPMedia {
  date: string
  date_gmt: string
  guid: WPGuid
  id: number
  link: string
  modified: string
  modified_gmt: string
  slug: string
  status: WPStatus
  type: string
  title: WPTitle
  author: number
  comment_status: WPOpenClosed
  ping_status: WPOpenClosed
  meta: string
  template: string
  alt_text: string
  caption: WPContentDescriptor
  description: WPContentDescriptor
  media_type: string
  mime_type: string
  media_details: WPMediaDetails
  post: number
  source_url: string
}
interface WPMediaDetails {
  file: string
  height: number
  image_meta: WPImageMeta
  sizes: [WPMediaSize]
  width: number
}
interface WPImageMeta {
  aperture: string
  camera: string
  caption: string
  copyright: string
  created_timestamp: string
  credit: string
  focal_length: string
  iso: string
  keywords: [string]
  orientation: string
  shutter_speed: string
  title: string
}
interface WPMediaSize {
  file: string
  height: number
  mime_type: string
  slug: string
  source_url: string
  width: number
}
interface WPContentDescriptor {
  raw: string
  rendered: string
  protected: bool
}
enum WPOpenClosed {
  open,
  closed,
}
interface WPGuid {
  raw: string
  rendered: string
}
enum WPStatus {
  publish,
  future,
  draft,
  pending,
  private,
}
interface WPTag {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: WPTaxonomyType
  meta: string
}

interface HeaderTags {
  metaTags: MetaTags[]
  ldJson: string
}

interface MetaTags {
  name: string
  property: string
  content: string
}
