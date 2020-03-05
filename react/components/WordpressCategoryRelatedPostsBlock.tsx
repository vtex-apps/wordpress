import React, { Fragment } from 'react'
import { useQuery } from 'react-apollo'
import { defineMessages } from 'react-intl'
import { Spinner } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'
import WordpressTeaser from './WordpressTeaser'
import Settings from '../graphql/Settings.graphql'
import TagPosts from '../graphql/TagPosts.graphql'

const CSS_HANDLES = [
  'categoryRelatedPostsBlockContainer',
  'categoryRelatedPostsBlockTitle',
  'categoryRelatedPostsBlockFlex',
  'categoryRelatedPostsBlockFlexItem',
] as const

const WordpressCategoryRelatedPostsBlock: StorefrontFunctionComponent<WPCategoryRelatedPostsBlockProps> = ({
  title,
  useTextOverlays,
  showCategories,
  showDates,
  showAuthors,
  showExcerpts,
  numberOfPosts,
}) => {
  
const {
  route: { params },
} = useRuntime()

let categoryIdentifier =  params.id != null && params.id != "" && params.id != undefined ? params.id : params.department;

  const { loading: loadingS, data: dataS } = useQuery(Settings)
  const { loading, error, data } = useQuery(TagPosts, {
    skip: !categoryIdentifier,
    variables: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      wp_per_page: numberOfPosts,
      tag: 'category-' + categoryIdentifier,
    },
  })
  const handles = useCssHandles(CSS_HANDLES)
  return categoryIdentifier ? (
    <div className={`${handles.categoryRelatedPostsBlockContainer} pv4 pb9`}>
      {(loading || loadingS) && <Spinner />}
      {error && <Fragment />}
      {data?.wpTags?.tags[0]?.wpPosts &&
      'category-' + categoryIdentifier ==
        data.wpTags.tags[0].name ? (
        <Fragment>
          <h2 className={`${handles.categoryRelatedPostsBlockTitle} tc t-heading-2`}>
            {title}
          </h2>
          <div
            className={`${handles.categoryRelatedPostsBlockFlex} mv4 flex flex-row flex-wrap justify-between`}
          >
            {data.wpTags.tags[0].wpPosts.posts.map(
              (post: PostData, index: number) => (
                <div
                  key={index}
                  className={`${handles.categoryRelatedPostsBlockFlexItem} mv3 w-33-l ph2 w-100-s`}
                >
                  <WordpressTeaser
                    title={post.title.rendered}
                    date={post.date}
                    id={post.id}
                    slug={post.slug}
                    author={post.author ? post.author.name : ''}
                    excerpt={post.excerpt.rendered}
                    category={post.categories[0]?.name ?? ''}
                    categoryId={post.categories[0]?.id ?? undefined}
                    categorySlug={post.categories[0]?.slug ?? ''}
                    image={post.featured_media?.source_url ?? ''}
                    altText={post.featured_media?.alt_text ?? ''}
                    mediaType={post.featured_media?.media_type ?? ''}
                    showCategory={showCategories}
                    showDate={showDates}
                    showAuthor={showAuthors}
                    showExcerpt={showExcerpts}
                    useTextOverlay={useTextOverlays}
                    settings={dataS.appSettings}
                  />
                </div>
              )
            )}
          </div>
        </Fragment>
      ) : (
        <Fragment />
      )}
    </div>
  ) : null
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
  numberOfPosts: 3,
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
  titleTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressRelatedPostsTitle.title',
  },
  titleDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressRelatedPostsTitle.description',
  },
  numberOfPostsTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressNumberOfPosts.title',
  },
  numberOfPostsDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressNumberOfPosts.description',
  },
  useTextOverlaysTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressOverlays.title',
  },
  useTextOverlaysDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressOverlays.description',
  },
  showCategoriesTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCategories.title',
  },
  showCategoriesDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCategories.description',
  },
  showDatesTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressDates.title',
  },
  showDatesDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressDates.description',
  },
  showAuthorsTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressAuthors.title',
  },
  showAuthorsDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressAuthors.description',
  },
  showExcerptsTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressExcerpts.title',
  },
  showExcerptsDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressExcerpts.description',
  },
})

WordpressCategoryRelatedPostsBlock.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
  properties: {
    title: {
      title: messages.titleTitle.id,
      description: messages.titleDescription.id,
      type: 'string',
      isLayout: false,
      default: '',
    },
    numberOfPosts: {
      title: messages.numberOfPostsTitle.id,
      description: messages.numberOfPostsDescription.id,
      type: 'number',
      isLayout: false,
      default: 3,
    },
    useTextOverlays: {
      title: messages.useTextOverlaysTitle.id,
      description: messages.useTextOverlaysDescription.id,
      type: 'boolean',
      isLayout: false,
      default: false,
    },
    showCategories: {
      title: messages.showCategoriesTitle.id,
      description: messages.showCategoriesDescription.id,
      type: 'boolean',
      isLayout: false,
      default: true,
    },
    showDates: {
      title: messages.showDatesTitle.id,
      description: messages.showDatesDescription.id,
      type: 'boolean',
      isLayout: false,
      default: true,
    },
    showAuthors: {
      title: messages.showAuthorsTitle.id,
      description: messages.showAuthorsDescription.id,
      type: 'boolean',
      isLayout: false,
      default: false,
    },
    showExcerpts: {
      title: messages.showExcerptsTitle.id,
      description: messages.showExcerptsDescription.id,
      type: 'boolean',
      isLayout: false,
      default: false,
    },
  },
}

export default WordpressCategoryRelatedPostsBlock
