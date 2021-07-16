/* eslint-disable @typescript-eslint/camelcase */
import React, { Fragment } from 'react'
import { Link, useRuntime } from 'vtex.render-runtime'
import { useQuery } from 'react-apollo'
import { defineMessages } from 'react-intl'
import { Spinner, Button } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import WordpressTeaser from './WordpressTeaser'
import CategoryPosts from '../graphql/CategoryPosts.graphql'
import linkParams from '../utils/categoryLinkParams'

const CSS_HANDLES = [
  'categoryBlockContainer',
  'categoryBlockTitle',
  'categoryBlockDescription',
  'categoryBlockFlex',
  'categoryBlockFlexItem',
  'categoryBlockLink',
] as const

const WordpressCategoryBlock: StorefrontFunctionComponent<WPCategoryBlockProps> = ({
  category: categoryId,
  title,
  description,
  useTextOverlays,
  showDates,
  showAuthors,
  showExcerpts,
  subcategoryUrls,
  absoluteLinks,
  customLinkText,
  customLinkTarget,
  numberOfPosts,
  customDomain,
  customDomainSlug,
}) => {
  const { route } = useRuntime()
  const { loading, error, data } = useQuery(CategoryPosts, {
    variables: {
      category: categoryId,
      wp_per_page: numberOfPosts + 1,
      customDomain,
    },
  })
  const handles = useCssHandles(CSS_HANDLES)

  const category = data?.wpCategory
  const postCategories =
    subcategoryUrls &&
    category?.parent !== 0 &&
    data?.wpCategory?.wpPosts?.posts[0]?.categories
  const parentCategory = postCategories
    ? postCategories?.find((cat: WPCategory) => cat.id === category.parent)
    : null

  const filteredPosts =
    data?.wpCategory?.wpPosts?.posts &&
    (data.wpCategory.wpPosts.posts as PostData[]).filter(post => {
      return post.slug !== route?.params?.slug
    })

  const posts =
    filteredPosts && filteredPosts.length > numberOfPosts
      ? filteredPosts.slice(0, numberOfPosts)
      : filteredPosts

  return (
    <div className={`${handles.categoryBlockContainer} pv4 pb9`}>
      {loading && <Spinner />}
      {error && <span>Error: {error.message}</span>}
      {category?.name ? (
        <Fragment>
          <h2 className={`${handles.categoryBlockTitle} tc t-heading-2`}>
            {title || category.name}
          </h2>
          {description && (
            <h4
              className={`${handles.categoryBlockDescription} tc t-heading-4`}
            >
              {description}
            </h4>
          )}
          <div
            className={`${handles.categoryBlockFlex} mv4 flex flex-row flex-wrap justify-between`}
          >
            {posts?.map((post: PostData, index: number) => (
              <div
                key={index}
                className={`${handles.categoryBlockFlexItem} mv3 w-33-l ph2 w-100-s`}
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
                  image={post.featured_media?.source_url ?? ''}
                  altText={post.featured_media?.alt_text ?? ''}
                  mediaType={post.featured_media?.media_type ?? ''}
                  showCategory={false}
                  showDate={showDates}
                  showAuthor={showAuthors}
                  showExcerpt={showExcerpts}
                  useTextOverlay={useTextOverlays}
                  absoluteLinks={absoluteLinks}
                />
              </div>
            ))}
          </div>
          {customLinkTarget ? (
            <Link
              to={customLinkTarget}
              className={`${handles.categoryBlockLink}`}
            >
              <Button variation="secondary" block>
                {customLinkText || `All ${category.name} Posts >`}
              </Button>
            </Link>
          ) : (
            <Link
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
              className={`${handles.categoryBlockLink}`}
            >
              <Button variation="secondary" block>
                {customLinkText || `All ${data.wpCategory.name} Posts >`}
              </Button>
            </Link>
          )}
        </Fragment>
      ) : (
        !loading &&
        !error && (
          <div>
            <h3 className="t-heading-3 tc">No posts found.</h3>
          </div>
        )
      )}
    </div>
  )
}

interface WPCategoryBlockProps {
  category: number
  title: string
  description: string
  customLinkText: string
  customLinkTarget: string
  numberOfPosts: number
  useTextOverlays: boolean
  showDates: boolean
  showAuthors: boolean
  showExcerpts: boolean
  subcategoryUrls: boolean
  absoluteLinks: boolean
  customDomain: string
  customDomainSlug: string
}

WordpressCategoryBlock.defaultProps = {
  category: 1,
  title: '',
  description: '',
  customLinkText: '',
  customLinkTarget: '',
  numberOfPosts: 3,
  useTextOverlays: false,
  showDates: true,
  showAuthors: false,
  showExcerpts: false,
  absoluteLinks: false,
  subcategoryUrls: false,
  customDomain: undefined,
  customDomainSlug: undefined,
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCategoryBlock.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCategoryBlock.description',
  },
  titleTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCategoryBlockTitle.title',
  },
  titleDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCategoryBlockTitle.description',
  },
  descriptionTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCategoryBlockDescription.title',
  },
  descriptionDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCategoryBlockDescription.description',
  },
  categoryTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCategoryBlockCategory.title',
  },
  categoryDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCategoryBlockCategory.description',
  },
  customLinkTextTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCategoryBlockCustomLinkText.title',
  },
  customLinkTextDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCategoryBlockCustomLinkText.description',
  },
  customLinkTargetTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCategoryBlockCustomLinkTarget.title',
  },
  customLinkTargetDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCategoryBlockCustomLinkTarget.description',
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

WordpressCategoryBlock.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
  properties: {
    category: {
      title: messages.categoryTitle.id,
      description: messages.categoryDescription.id,
      type: 'number',
      isLayout: false,
      default: 1,
    },
    title: {
      title: messages.titleTitle.id,
      description: messages.titleDescription.id,
      type: 'string',
      isLayout: false,
      default: '',
    },
    description: {
      title: messages.descriptionTitle.id,
      description: messages.descriptionDescription.id,
      type: 'string',
      isLayout: false,
      default: '',
    },
    customLinkText: {
      title: messages.customLinkTextTitle.id,
      description: messages.customLinkTextDescription.id,
      type: 'string',
      isLayout: false,
      default: '',
    },
    customLinkTarget: {
      title: messages.customLinkTargetTitle.id,
      description: messages.customLinkTargetDescription.id,
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

export default WordpressCategoryBlock
