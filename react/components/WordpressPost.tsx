/* eslint-disable @typescript-eslint/camelcase */
import { Container } from 'vtex.store-components'
import React, { FunctionComponent, useMemo } from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'
import { useQuery } from 'react-apollo'
import { Link, useRuntime } from 'vtex.render-runtime'
import { Spinner } from 'vtex.styleguide'
import insane from 'insane'
import { useCssHandles } from 'vtex.css-handles'

import { WPRelatedProductsContext } from '../contexts/WordpressRelatedProducts'
import SinglePostBySlug from '../graphql/SinglePostBySlug.graphql'
import Settings from '../graphql/Settings.graphql'
import linkParams from '../utils/categoryLinkParams'
import WordpressPostHeader from './WordpressPostHeader'

interface PostProps {
  customDomains: string
  subcategoryUrls: boolean
}

const allowClass = ['class']
const sanitizerConfig = {
  allowedTags: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'blockquote',
    'p',
    'a',
    'ul',
    'ol',
    'nl',
    'li',
    'b',
    'i',
    'strong',
    'section',
    'em',
    'strike',
    'code',
    'hr',
    'br',
    'div',
    'span',
    'table',
    'thead',
    'caption',
    'tbody',
    'tr',
    'th',
    'td',
    'pre',
    'img',
    'iframe',
    'figure',
  ],
  allowedAttributes: {
    h1: allowClass,
    h2: allowClass,
    h3: allowClass,
    h4: allowClass,
    h5: allowClass,
    h6: allowClass,
    blockquote: allowClass,
    p: allowClass,
    a: ['class', 'href', 'name', 'target', 'rel'],
    ul: allowClass,
    ol: allowClass,
    nl: allowClass,
    li: allowClass,
    b: allowClass,
    i: allowClass,
    strong: allowClass,
    section: allowClass,
    em: allowClass,
    strike: allowClass,
    code: allowClass,
    hr: allowClass,
    br: allowClass,
    div: allowClass,
    table: allowClass,
    thead: allowClass,
    caption: allowClass,
    tbody: allowClass,
    tr: allowClass,
    th: allowClass,
    td: allowClass,
    pre: allowClass,
    img: ['class', 'src', 'alt'],
    iframe: [
      'class',
      'src',
      'scrolling',
      'frameborder',
      'width',
      'height',
      'id',
    ],
    figure: allowClass,
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
}

const sanitizerConfigStripAll = {
  allowedAttributes: false,
  allowedTags: false,
  allowedSchemes: [],
}

const CSS_HANDLES = [
  'postFlex',
  'postContainer',
  'postTitle',
  'postMeta',
  'postMetaDate',
  'postMetaCategory',
  'postMetaAuthor',
  'postFeaturedImage',
  'postFeaturedImageContainer',
  'postBody',
  'postChildrenContainer',
  'postCategoryLink',
] as const

interface PostCategoryLinkProps {
  props: WordpressPostInnerProps
  classNames: string
  category: WPCategory
  categories: WPCategory[]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PostCategoryLink: FunctionComponent<PostCategoryLinkProps> = ({
  props,
  classNames,
  category,
  categories,
}: PostCategoryLinkProps) => {
  const { subcategoryUrls, customDomainSlug } = props
  const parentCategory =
    subcategoryUrls &&
    category.parent !== 0 &&
    categories.find(c => c.id === category.parent)

  return (
    <Link
      className={classNames}
      page={
        parentCategory
          ? 'store.blog-category#subcategory'
          : 'store.blog-category'
      }
      params={
        parentCategory
          ? linkParams(customDomainSlug, parentCategory, category)
          : linkParams(customDomainSlug, category)
      }
    >
      {category.name}
    </Link>
  )
}

export interface WordpressPostInnerProps {
  postData: PostData
  customDomainSlug?: string
  subcategoryUrls?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WordpressPostInner: FunctionComponent<WordpressPostInnerProps> = props => {
  const handles = useCssHandles(CSS_HANDLES)
  const {
    culture: { locale },
  } = useRuntime()

  const { loading: loadingS, data: dataS } = useQuery(Settings)

  if (!props.postData) {
    return (
      <div className={`${handles.postContainer} ph3`}>
        <h2>No post found.</h2>
      </div>
    )
  }

  const {
    title,
    date,
    author,
    categories,
    content,
    featured_media,
    tags,
  } = props.postData

  const dateObj = new Date(date)
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  const formattedDate = dateObj.toLocaleDateString(locale, dateOptions)

  const productIds = tags
    .filter((tag: WPTag) => tag.name && tag.name.includes('prod-'))
    .map((tag: WPTag) => tag.name.replace('prod-', ''))

  const titleHtml = useMemo(() => {
    return insane(title.rendered, sanitizerConfig)
  }, [title.rendered, sanitizerConfig])
  const captionHtml = useMemo(() => {
    return featured_media?.caption?.rendered
      ? insane(featured_media.caption.rendered, sanitizerConfigStripAll)
      : null
  }, [featured_media?.caption?.rendered, sanitizerConfigStripAll])
  const bodyHtml = useMemo(() => {
    return insane(content.rendered, sanitizerConfig)
  }, [content.rendered, sanitizerConfig])

  if (loadingS)
    return (
      <div className="mv5 flex justify-center" style={{ minHeight: 800 }}>
        <Spinner />
      </div>
    )

  return (
    <Container className={`${handles.postFlex} pt6 pb8 ph3`}>
      <WordpressPostHeader postData={props.postData} dataS={dataS} />
      <div className={`${handles.postContainer} ph3`}>
        <h1
          className={`${handles.postTitle} t-heading-1`}
          dangerouslySetInnerHTML={{ __html: titleHtml }}
        />
        <p className={`${handles.postMeta} t-small mw9 c-muted-1`}>
          <span className={`${handles.postMetaDate}`}>
            <FormattedMessage
              id="store/wordpress-integration.wordpressPost.postedIn"
              defaultMessage="Posted {formattedDate} in "
              values={{
                formattedDate,
              }}
            />
          </span>
          {categories
            .sort((a, b) => b.parent - a.parent)
            .map((category, index) => (
              <span className={`${handles.postMetaCategory}`} key={index}>
                <PostCategoryLink
                  props={props}
                  classNames={handles.postCategoryLink}
                  category={category}
                  categories={categories}
                />
                {index + 1 === categories.length ? '' : ', '}
              </span>
            ))}
          {author && (
            <span className={`${handles.postMetaAuthor}`}>
              <FormattedMessage
                id="store/wordpress-integration.wordpressPost.byAuthor"
                defaultMessage=" by {name}"
                values={{
                  name: author.name,
                }}
              />
            </span>
          )}
        </p>
        {featured_media && featured_media.media_type === 'image' && (
          <div className={`${handles.postFeaturedImageContainer} mw9 pb8`}>
            <img
              className={`${handles.postFeaturedImage}`}
              src={featured_media.source_url}
              alt={featured_media.alt_text}
            />
            {captionHtml && (
              <span dangerouslySetInnerHTML={{ __html: captionHtml }} />
            )}
          </div>
        )}
        <div
          className={`${handles.postBody}`}
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </div>

      <WPRelatedProductsContext.Provider value={{ productIds }}>
        <div className={`${handles.postChildrenContainer}`}>
          {props.children}
        </div>
      </WPRelatedProductsContext.Provider>
    </Container>
  )
}

const WordpressPost: StorefrontFunctionComponent<PostProps> = ({
  children,
  customDomains,
  subcategoryUrls,
}) => {
  const {
    route: { params },
  } = useRuntime() as any

  let parsedCustomDomains = null
  try {
    parsedCustomDomains = customDomains ? JSON.parse(customDomains) : null
  } catch (e) {
    console.error(e)
  }

  const customDomain =
    params.customdomainslug && parsedCustomDomains
      ? parsedCustomDomains[params.customdomainslug]
      : undefined

  const { loading, error, data } = useQuery(SinglePostBySlug, {
    variables: { slug: params.slug || params.slug_id, customDomain },
  })

  if (loading) {
    return (
      <div className="mv5 flex justify-center" style={{ minHeight: 800 }}>
        <Spinner />
      </div>
    )
  }
  if (error) {
    return (
      <div className="ph5" style={{ minHeight: 800 }}>
        Error! {error.message}
      </div>
    )
  }
  if (data?.wpPosts?.posts) {
    return (
      <WordpressPostInner
        children={children}
        postData={data.wpPosts.posts[0]}
        customDomainSlug={params.customdomainslug}
        subcategoryUrls={subcategoryUrls}
      />
    )
  }
  return (
    <div>
      <h2>No post found.</h2>
    </div>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.wordpressPost.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.wordpressPost.description',
  },
  customDomainsTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCustomDomains.title',
  },
  customDomainsDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCustomDomains.description',
  },
  subcategoryUrlsTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressSubcategoryUrls.title',
  },
  subcategoryUrlsDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressSubcategoryUrls.description',
  },
})

WordpressPost.defaultProps = {
  customDomains: undefined,
  subcategoryUrls: false,
}

WordpressPost.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
  properties: {
    customDomains: {
      title: messages.customDomainsTitle.id,
      description: messages.customDomainsDescription.id,
      type: 'string',
      isLayout: false,
      default: '',
    },
    subcategoryUrls: {
      title: messages.subcategoryUrlsTitle.id,
      description: messages.subcategoryUrlsDescription.id,
      type: 'boolean',
      isLayout: false,
      default: '',
    },
  },
}

export default WordpressPost
