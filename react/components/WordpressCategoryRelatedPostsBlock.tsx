import { Container } from 'vtex.store-components'
import React, { FunctionComponent, useMemo } from 'react'
import { useQuery } from 'react-apollo'
import { defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'
import insane from 'insane'

import TagPosts from '../graphql/TagPosts.graphql'

const CSS_HANDLES = [
  'categoryRelatedPostsBlockContainer',
  'categoryRelatedPostsBlockTitle',
  'categoryRelatedPostsBlockFlex',
  'categoryRelatedPostsBlockBody',
  'categoryRelatedPostsBlockMeta',
  'categoryRelatedPostsBlockImage',
] as const

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
    a: ['href', 'name', 'target', 'class'],
    img: ['src', 'alt', 'class'],
    iframe: ['src', 'scrolling', 'frameborder', 'width', 'height', 'id'],
    p: ['class'],
    div: ['class'],
    span: ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
}

const WordpressCategoryRelatedPost: FunctionComponent<{
  post: any
  index: number
}> = props => {
  const { post, index } = props
  const handles = useCssHandles(CSS_HANDLES)
  const sanitizedTitle = useMemo(() => {
    return insane(post.title.rendered, sanitizerConfig)
  }, [post.title.rendered, sanitizerConfig])
  const sanitizedContent = useMemo(() => {
    return insane(post.content.rendered, sanitizerConfig)
  }, [post.content.rendered, sanitizerConfig])
  return (
    <div
      key={index}
      className={`${handles.categoryRelatedPostsBlockContainer} pv4 pb9`}
    >
      <Container
        className={`${handles.categoryRelatedPostsBlockFlex} pt6 pb8 ph3`}
      >
        <h1
          className={`${handles.categoryRelatedPostsBlockTitle} t-heading-1`}
          dangerouslySetInnerHTML={{
            __html: sanitizedTitle,
          }}
        />

        <div
          className={`${handles.categoryRelatedPostsBlockBody}`}
          dangerouslySetInnerHTML={{
            __html: sanitizedContent,
          }}
        />
      </Container>
    </div>
  )
}

const WordpressCategoryRelatedPostsBlock: StorefrontFunctionComponent<WPCategoryRelatedPostsBlockProps> = ({
  numberOfPosts,
  categoryIdentifier,
  customDomain,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const {
    route: { params },
  } = useRuntime() as any

  if (!categoryIdentifier) {
    categoryIdentifier = params.id || ''
  }

  const { data } = useQuery(TagPosts, {
    skip: !categoryIdentifier,
    variables: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      wp_per_page: numberOfPosts,
      tag: `category-${categoryIdentifier}`,
      customDomain,
    },
  })
  if (data?.wpTags?.tags[0]?.wpPosts.posts) {
    return (
      <div className={`${handles.categoryRelatedPostsBlockContainer} pv4 pb9`}>
        {data?.wpTags?.tags[0]?.wpPosts.posts.map(
          (post: PostData, index: number) => {
            return <WordpressCategoryRelatedPost post={post} index={index} />
          }
        )}
      </div>
    )
  }
  return null
}

interface WPCategoryRelatedPostsBlockProps {
  categoryIdentifier: string
  numberOfPosts: number
  customDomain: string
}

WordpressCategoryRelatedPostsBlock.defaultProps = {
  categoryIdentifier: '',
  numberOfPosts: 1,
  customDomain: undefined,
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCategoryRelatedPosts.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCategoryRelatedPosts.description',
  },
  numberOfPostsTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressRelatedCategoryNumberOfPosts.title',
  },
  numberOfPostsDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressRelatedCategoryNumberOfPosts.description',
  },
  categoryIdentifierTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressRelatedCategoryIdentifier.title',
  },
  categoryIdentifierDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressRelatedCategoryIdentifier.description',
  },
  customDomainTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCustomDomain.title',
  },
  customDomainDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCustomDomain.description',
  },
})

WordpressCategoryRelatedPostsBlock.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
  properties: {
    numberOfPosts: {
      title: messages.numberOfPostsTitle.id,
      description: messages.numberOfPostsDescription.id,
      type: 'number',
      isLayout: false,
      default: 3,
    },
    categoryIdentifier: {
      title: messages.categoryIdentifierTitle.id,
      description: messages.categoryIdentifierDescription.id,
      type: 'string',
      isLayout: false,
    },
    customDomain: {
      title: messages.customDomainTitle.id,
      description: messages.customDomainDescription.id,
      type: 'string',
      isLayout: false,
      default: '',
    },
  },
}

export default WordpressCategoryRelatedPostsBlock
