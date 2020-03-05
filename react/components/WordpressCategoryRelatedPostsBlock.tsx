import React from 'react'
import { useQuery } from 'react-apollo'
import { defineMessages } from 'react-intl'
import { Spinner } from 'vtex.styleguide'
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
  'categoryRelatedPostsBlockImage'
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
    'figure',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    img: ['src', 'alt'],
    iframe: ['src', 'scrolling', 'frameborder', 'width', 'height', 'id'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
}

const WordpressCategoryRelatedPostsBlock: StorefrontFunctionComponent<WPCategoryRelatedPostsBlockProps> = ({
  numberOfPosts,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const {
    route: { params },
  } = useRuntime()

  let categoryIdentifier =  typeof params.id != "undefined" && params.id != null && params.id != "" ? params.id : params.department;

  const { loading: loadingS, data: dataS } = useQuery(Settings)
  const { loading, data } = useQuery(TagPosts, {
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

    return categoryIdentifier ? (
      <div className={`${handles.categoryRelatedPostsBlockContainer} pv4 pb9`}>
      {(loading || loadingS) && <Spinner />}
      {data?.wpTags?.tags[0]?.wpPosts &&
      'category-' + categoryIdentifier ==
        data.wpTags.tags[0].name ? (
          data?.wpTags?.tags[0]?.wpPosts.posts.map(
            (post:PostData,index: number)=>(
      <div key={index} className={`${handles.categoryRelatedPostsBlockContainer} pv4 pb9`}>        
      <Container className={`${handles.categoryRelatedPostsBlockFlex} pt6 pb8 ph3`}>
        <div className={`${handles.categoryRelatedPostsBlockContainer} ph3`}>
          <h1
            className={`${handles.categoryRelatedPostsBlockTitle} t-heading-1`}
            dangerouslySetInnerHTML={{ __html: insane(post.title.rendered, sanitizerConfig) }}
          />
          )}
          <div
            className={`${handles.categoryRelatedPostsBlockBody}`}
            dangerouslySetInnerHTML={{ __html: insane(post.content.rendered, sanitizerConfig) }}
          />
        </div>
      </Container>
      ) : null}
      </div>
      )
      )
        ): null}
      </div>
    ):null
  } else {
    return (
      <div>
        <h2>No post found.</h2>
      </div>
    )
  }
}

interface WPCategoryRelatedPostsBlockProps {
  title: string
  numberOfPosts: number
  useTextOverlays: boolean
  showCategories: boolean
  showDates: boolean
  showAuthors: boolean
  showExcerpts: boolean
}

WordpressCategoryRelatedPostsBlock.defaultProps = {
  title: 'Related Articles',
  numberOfPosts: 1,
  useTextOverlays: false,
  showCategories: true,
  showDates: true,
  showAuthors: false,
  showExcerpts: false,
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.wordpressRelatedPosts.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.wordpressRelatedPosts.description',
  },
  numberOfPostsTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressNumberOfPosts.title',
  },
  numberOfPostsDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressNumberOfPosts.description',
  }
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
  },
}

export default WordpressCategoryRelatedPostsBlock
