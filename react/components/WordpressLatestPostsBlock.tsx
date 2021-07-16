import React, { Fragment } from 'react'
import { useQuery } from 'react-apollo'
import { defineMessages } from 'react-intl'
import { Spinner } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'

import WordpressTeaser from './WordpressTeaser'
import AllPosts from '../graphql/AllPosts.graphql'

const CSS_HANDLES = [
  'latestPostsBlockContainer',
  'latestPostsBlockTitle',
  'latestPostsBlockFlex',
  'latestPostsBlockFlexFirstColumnItem',
  'latestPostsBlockFlexSecondColumn',
  'latestPostsBlockFlexSecondColumnItem',
  'latestPostsBlockFlexItem',
] as const

const WordpressLatestPostsBlock: StorefrontFunctionComponent<WPLatestPostsBlockProps> = ({
  title,
  twoColumns,
  useTextOverlays,
  showCategories,
  showDates,
  showAuthors,
  showExcerpts,
  subcategoryUrls,
  absoluteLinks,
  numberOfPosts,
  tags,
  excludeTags,
  excludeCategories,
  customDomain,
  customDomainSlug,
}) => {
  const { route } = useRuntime()
  const { loading, error, data } = useQuery(AllPosts, {
    // eslint-disable-next-line @typescript-eslint/camelcase
    variables: {
      wp_per_page: numberOfPosts + 1,
      tags: tags?.length ? tags : undefined,
      tags_exclude: excludeTags?.length ? excludeTags : undefined,
      categories_exclude: excludeCategories?.length
        ? excludeCategories
        : undefined,
      customDomain,
    },
  })
  const handles = useCssHandles(CSS_HANDLES)

  const filteredPosts =
    data?.wpPosts?.posts &&
    (data.wpPosts.posts as PostData[]).filter(
      post => post.slug !== route.params.slug
    )

  const posts =
    filteredPosts && filteredPosts.length > numberOfPosts
      ? filteredPosts.slice(0, numberOfPosts)
      : filteredPosts

  return (
    <div className={`${handles.latestPostsBlockContainer} pv4 pb9`}>
      {loading && <Spinner />}
      {error && <span>Error: {error.message}</span>}
      {posts ? (
        <Fragment>
          <h2 className={`${handles.latestPostsBlockTitle} tc t-heading-2`}>
            {title}
          </h2>
          <div
            className={`${handles.latestPostsBlockFlex} mv4 flex flex-row flex-wrap justify-between`}
          >
            {twoColumns ? (
              <Fragment>
                <div
                  key={0}
                  className={`${handles.latestPostsBlockFlexFirstColumnItem} w-two-thirds mv3 ph2 w-100-s`}
                >
                  <WordpressTeaser
                    title={posts[0].title.rendered}
                    date={posts[0].date}
                    id={posts[0].id}
                    slug={posts[0].slug}
                    link={posts[0].link}
                    customDomainSlug={customDomainSlug}
                    author={posts[0].author?.name ?? ''}
                    excerpt={posts[0].excerpt.rendered}
                    categories={posts[0].categories}
                    subcategoryUrls={subcategoryUrls}
                    image={posts[0].featured_media?.source_url ?? ''}
                    altText={posts[0].featured_media?.alt_text ?? ''}
                    mediaType={posts[0].featured_media?.media_type ?? ''}
                    showCategory={showCategories}
                    showDate={showDates}
                    showAuthor={showAuthors}
                    showExcerpt={showExcerpts}
                    absoluteLinks={absoluteLinks}
                    useTextOverlay={useTextOverlays}
                  />
                </div>
                <div
                  className={`${handles.latestPostsBlockFlexSecondColumn} w-third mv3 ph2 w-100-s`}
                >
                  {posts.slice(1).map((post: PostData, index: number) => (
                    <div
                      key={index}
                      className={`${handles.latestPostsBlockFlexSecondColumnItem} mv1 w-100-l w-100-s`}
                    >
                      <WordpressTeaser
                        title={post.title.rendered}
                        date={post.date}
                        id={post.id}
                        slug={post.slug}
                        link={post.link}
                        customDomainSlug={customDomainSlug}
                        author={post.author ? post.author.name : ''}
                        excerpt={post.excerpt.rendered}
                        categories={posts[0].categories}
                        subcategoryUrls={subcategoryUrls}
                        image={post.featured_media?.source_url ?? ''}
                        altText={post.featured_media?.alt_text ?? ''}
                        mediaType={post.featured_media?.media_type ?? ''}
                        showCategory={showCategories}
                        showDate={showDates}
                        showAuthor={showAuthors}
                        showExcerpt={showExcerpts}
                        absoluteLinks={absoluteLinks}
                        useTextOverlay={useTextOverlays}
                      />
                    </div>
                  ))}
                </div>
              </Fragment>
            ) : (
              posts.map((post: PostData, index: number) => (
                <div
                  key={index}
                  className={`${handles.latestPostsBlockFlexItem} mv3 w-33-l ph2 w-100-s`}
                >
                  <WordpressTeaser
                    title={post.title.rendered}
                    date={post.date}
                    id={post.id}
                    slug={post.slug}
                    link={post.link}
                    customDomainSlug={customDomainSlug}
                    author={post.author?.name ?? ''}
                    excerpt={post.excerpt.rendered}
                    categories={posts[0].categories}
                    subcategoryUrls={subcategoryUrls}
                    image={post.featured_media?.source_url ?? ''}
                    altText={post.featured_media?.alt_text ?? ''}
                    mediaType={post.featured_media?.media_type ?? ''}
                    showCategory={showCategories}
                    showDate={showDates}
                    showAuthor={showAuthors}
                    showExcerpt={showExcerpts}
                    absoluteLinks={absoluteLinks}
                    useTextOverlay={useTextOverlays}
                  />
                </div>
              ))
            )}
          </div>
        </Fragment>
      ) : (
        !loading &&
        !error && (
          <div>
            <h3 className="t-heading-3">No posts found.</h3>
          </div>
        )
      )}
    </div>
  )
}

interface WPLatestPostsBlockProps {
  title: string
  twoColumns: boolean
  numberOfPosts: number
  useTextOverlays: boolean
  showCategories: boolean
  showDates: boolean
  showAuthors: boolean
  showExcerpts: boolean
  tags: number[]
  excludeTags: number[]
  excludeCategories: number[]
  subcategoryUrls: boolean
  absoluteLinks: boolean
  customDomain: string
  customDomainSlug: string
}

WordpressLatestPostsBlock.defaultProps = {
  title: '',
  twoColumns: false,
  numberOfPosts: 3,
  useTextOverlays: false,
  showCategories: true,
  showDates: true,
  showAuthors: false,
  showExcerpts: false,
  tags: undefined,
  excludeTags: undefined,
  excludeCategories: undefined,
  customDomain: undefined,
  subcategoryUrls: false,
  absoluteLinks: false,
  customDomainSlug: undefined,
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.wordpressLatestPosts.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.wordpressLatestPosts.description',
  },
  titleTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressLatestPostsTitle.title',
  },
  titleDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressLatestPostsTitle.description',
  },
  twoColumnsTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressTwoColumns.title',
  },
  twoColumnsDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressTwoColumns.description',
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
  absoluteLinksTitle: {
    defaultMessage: '',
    id: 'admin/editor.absoluteLinks.title',
  },
  absoluteLinksDescription: {
    defaultMessage: '',
    id: 'admin/editor.absoluteLinks.description',
  },
  tagsTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressTags.title',
  },
  tagsItem: {
    defaultMessage: '',
    id: 'admin/editor.wordpressTagsItem.title',
  },
  excludeTagsTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressExcludeTags.title',
  },
  excludeCategoriesTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressExcludeCategories.title',
  },
  customDomainTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCustomDomain.title',
  },
  customDomainDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCustomDomain.description',
  },
  customDomainSlugTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCustomDomainSlug.title',
  },
  customDomainSlugDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCustomDomainSlug.description',
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

WordpressLatestPostsBlock.schema = {
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
    twoColumns: {
      title: messages.twoColumnsTitle.id,
      description: messages.twoColumnsDescription.id,
      type: 'boolean',
      isLayout: false,
      default: false,
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
    tags: {
      title: messages.tagsTitle.id,
      type: 'array',
      isLayout: false,
      items: {
        title: messages.tagsItem.id,
        type: 'number',
        isLayout: false,
        default: 0,
      },
    },
    excludeTags: {
      title: messages.excludeTagsTitle.id,
      type: 'array',
      isLayout: false,
      items: {
        title: messages.tagsItem.id,
        type: 'number',
        isLayout: false,
        default: 0,
      },
    },
    excludeCategories: {
      title: messages.excludeCategoriesTitle.id,
      type: 'array',
      isLayout: false,
      items: {
        title: messages.tagsItem.id,
        type: 'number',
        isLayout: false,
        default: 0,
      },
    },
    absoluteLinks: {
      title: messages.absoluteLinksTitle.id,
      description: messages.absoluteLinksDescription.id,
      type: 'boolean',
      isLayout: false,
      default: false,
    },
    customDomain: {
      title: messages.customDomainTitle.id,
      description: messages.customDomainDescription.id,
      type: 'string',
      isLayout: false,
      default: '',
    },
    customDomainSlug: {
      title: messages.customDomainSlugTitle.id,
      description: messages.customDomainSlugDescription.id,
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

export default WordpressLatestPostsBlock
