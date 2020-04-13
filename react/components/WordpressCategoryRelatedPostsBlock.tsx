import React from 'react'
import { useQuery } from 'react-apollo'
import { defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'
import Settings from '../graphql/Settings.graphql'
import TagPosts from '../graphql/TagPosts.graphql'
import { Container } from 'vtex.store-components'
import insane from 'insane'

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
    'figure'
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target', 'class'],
    img: ['src', 'alt', 'class'],
    iframe: ['src', 'scrolling', 'frameborder', 'width', 'height', 'id'],
    p: ['class'],
    div: ['class'],
    span: ['class']
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
}

const WordpressCategoryRelatedPostsBlock: StorefrontFunctionComponent<WPCategoryRelatedPostsBlockProps> = ({
  numberOfPosts,
  categoryIdentifier,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const {
    route: { params },
  } = useRuntime()

  if (categoryIdentifier == null || categoryIdentifier == '') {
    categoryIdentifier =
      typeof params.id != 'undefined' && params.id != null && params.id != ''
        ? params.id
        : ''
  }

  const { data: dataS } = useQuery(Settings)
  const { data } = useQuery(TagPosts, {
    skip: !categoryIdentifier,
    variables: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      wp_per_page: numberOfPosts,
      tag: 'category-' + categoryIdentifier,
    },
  })
  if (data?.wpTags?.tags[0]?.wpPosts.posts) {
    let route = dataS?.appSettings?.blogRoute
    if (!route || route == '') route = 'blog'

    return (
      <div className={`${handles.categoryRelatedPostsBlockContainer} pv4 pb9`}>
        {data?.wpTags?.tags[0]?.wpPosts.posts.map(
          (post: PostData, index: number) => (
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
                    __html: insane(post.title.rendered, sanitizerConfig),
                  }}
                />
                
                <div
                  className={`${handles.categoryRelatedPostsBlockBody}`}
                  dangerouslySetInnerHTML={{
                    __html: insane(post.content.rendered, sanitizerConfig),
                  }}
                />
              </Container>
              
            </div>
          )
        )}
      </div>
    )
  } else {
    return null
  }
}

interface WPCategoryRelatedPostsBlockProps {
  categoryIdentifier: string
  numberOfPosts: number
}

WordpressCategoryRelatedPostsBlock.defaultProps = {
  categoryIdentifier: '',
  numberOfPosts: 1,
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
    id: 'admin/editor.wordpressRelatedCategoyNumberOfPosts.title',
  },
  numberOfPostsDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressRelatedCategoryNumberOfPosts.description',
  },
  categoryIdentifierTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressRelatedCategoyIdentifier.title',
  },
  categoryIdentifierDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressRelatedCategoryIdentifier.description',
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
  },
}

export default WordpressCategoryRelatedPostsBlock
