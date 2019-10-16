import React, { Fragment } from 'react'
import TagPosts from '../graphql/TagPosts.graphql'
import { compose, graphql, DataProps } from 'react-apollo'
import { defineMessages } from 'react-intl'
import WordpressTeaser from './WordpressTeaser'
import withSettingsNoSSR from './withSettingsNoSSR'

import styles from './relatedpostsblock.css'

const WordpressRelatedPostsBlock: StorefrontFunctionComponent<
  DataPropsExtended
> = ({
  productQuery: { product },
  appSettings,
  title,
  useTextOverlays,
  showCategories,
  showDates,
  showAuthors,
  showExcerpts,
  data: { loading, error, wpTags },
}) => {
  return (
    <div className={`${styles.relatedPostsBlockContainer} pv4 pb9`}>
      {loading && <Fragment />}
      {error && <Fragment />}
      {wpTags != null &&
      wpTags.tags[0] != null &&
      wpTags.tags[0].wpPosts != null &&
      'prod-' + product.productReference == wpTags.tags[0].name ? (
        <Fragment>
          <h2 className={`${styles.relatedPostsBlockTitle} t-heading-2`}>
            {title}
          </h2>
          <div
            className={`${styles.relatedPostsBlockFlex} mv4 flex flex-row flex-wrap justify-between`}
          >
            {wpTags.tags[0].wpPosts.posts.map(
              (post: PostData, index: number) => (
                <div
                  key={index}
                  className={`${styles.relatedPostsBlockFlexItem} mv3 w-33-l ph2 w-100-s`}
                >
                  <WordpressTeaser
                    title={post.title.rendered}
                    date={post.date}
                    id={post.id}
                    author={post.author != null ? post.author.name : ''}
                    excerpt={post.excerpt.rendered}
                    category={
                      post.categories[0] != null ? post.categories[0].name : ''
                    }
                    categoryId={
                      post.categories[0] != null
                        ? post.categories[0].id
                        : undefined
                    }
                    image={
                      post.featured_media != null
                        ? post.featured_media.source_url
                        : ''
                    }
                    altText={
                      post.featured_media != null
                        ? post.featured_media.alt_text
                        : ''
                    }
                    mediaType={
                      post.featured_media != null
                        ? post.featured_media.media_type
                        : ''
                    }
                    showCategory={showCategories}
                    showDate={showDates}
                    showAuthor={showAuthors}
                    showExcerpt={showExcerpts}
                    useTextOverlay={useTextOverlays}
                    settings={appSettings}
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
  )
}

const EnhancedWordpressRelatedPostsBlock = compose(
  withSettingsNoSSR,
  graphql(TagPosts, {
    options: (props: DataPropsExtended) => ({
      variables: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        wp_per_page: props.numberOfPosts,
        tag: 'prod-' + props.productQuery.product.productReference,
      },
      errorPolicy: 'all',
      ssr: false,
    }),
  })
)(WordpressRelatedPostsBlock)

interface WPRelatedPostsBlockProps {
  title: string
  numberOfPosts: number
  useTextOverlays: boolean
  showCategories: boolean
  showDates: boolean
  showAuthors: boolean
  showExcerpts: boolean
  appSettings: AppSettings
  productQuery: ProductQuery
}

interface AppSettings {
  titleTag: string
  blogRoute: string
}

interface ProductProperties {
  name: string
  values: [string]
}

interface ProductImage {
  imageId: string
  imageLabel: string
  imageTag: string
  imageUrl: string
  imageText: string
}

interface ProductOffer {
  Installments: [ProductInstallment]
  Price: number
  ListPrice: number
  AvailableQuantity: number
}

interface ProductInstallment {
  Value: number
  InterestRate: number
  TotalValuePlusInterestRate: number
  NumberOfInstallments: number
  Name: string
}

interface ProductSeller {
  sellerId: string
  commertialOffer: ProductOffer
}

interface ProductItem {
  itemId: string
  name: string
  images: [ProductImage]
  sellers: [ProductSeller]
}

interface ProductShape {
  productId: string
  productName: string
  description: string
  properties: [ProductProperties]
  productReference: string
  brand: string
  items: [ProductItem]
  sellers: [ProductSeller]
}

interface ProductQuery {
  product: ProductShape
  loading: boolean
}

type DataPropsExtended = WPRelatedPostsBlockProps & DataProps<any, any>

EnhancedWordpressRelatedPostsBlock.defaultProps = {
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

EnhancedWordpressRelatedPostsBlock.schema = {
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

export default EnhancedWordpressRelatedPostsBlock
