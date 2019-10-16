import React, { Fragment } from 'react'
import SearchPosts from '../graphql/SearchPosts.graphql'
import { compose, graphql, DataProps } from 'react-apollo'
import { Spinner, Button } from 'vtex.styleguide'
import WordpressTeaser from './WordpressTeaser'
import withSettingsNoSSR from './withSettingsNoSSR'
import withSearchContext from './withSearchContext'
import { defineMessages } from 'react-intl'

import styles from './searchresultblock.css'

const WordpressSearchResultBlock: StorefrontFunctionComponent<
  DataPropsExtended
> = ({
  appSettings,
  appSettings: { blogRoute },
  searchQuery,
  useTextOverlays,
  showCategories,
  showDates,
  showAuthors,
  showExcerpts,
  data: { loading, error, wpPosts },
}) => {
  const route = blogRoute && blogRoute !== '' ? blogRoute : 'blog'

  return (
    <div className={`${styles.searchResultBlockContainer} pv4 pb9`}>
      {loading && <Spinner />}
      {error && <span>Error: {error.message}</span>}
      {searchQuery && searchQuery.productSearch && wpPosts ? (
        <Fragment>
          <h4 className={`${styles.searchResultBlockTitle} t-heading-2`}>
            {wpPosts.total_count} articles found for &quot;
            {searchQuery.productSearch.titleTag}&quot;:
          </h4>
          <div
            className={`${styles.searchResultBlockFlex} mv4 flex flex-row flex-wrap justify-between`}
          >
            {wpPosts.posts.map((post: PostData, index: number) => (
              <div
                key={index}
                className={`${styles.searchResultBlockFlexItem} mv3 w-33-l ph2 w-100-s`}
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
            ))}
          </div>
          <a
            href={'/' + route + '/search/' + searchQuery.productSearch.titleTag}
            className={`${styles.searchResultBlockLink}`}
          >
            <Button variation="secondary" block>
              View all article results for &quot;
              {searchQuery.productSearch.titleTag}
              &quot; &gt;
            </Button>
          </a>
        </Fragment>
      ) : (
        !loading && !error && <Fragment />
      )}
    </div>
  )
}

const EnhancedWordpressSearchResultBlock = compose(
  withSearchContext,
  withSettingsNoSSR,
  graphql(SearchPosts, {
    options: (props: WPSearchResultBlockProps) => ({
      variables: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        wp_per_page: props.numberOfPosts,
        terms:
          props.searchQuery && props.searchQuery.productSearch
            ? props.searchQuery.productSearch.titleTag
            : null,
      },
      errorPolicy: 'all',
      ssr: false,
    }),
  })
)(WordpressSearchResultBlock)

interface WPSearchResultBlockProps {
  numberOfPosts: number
  useTextOverlays: boolean
  showCategories: boolean
  showDates: boolean
  showAuthors: boolean
  showExcerpts: boolean
  searchQuery: any
  appSettings: AppSettings
}

interface AppSettings {
  titleTag: string
  blogRoute: string
}

type DataPropsExtended = WPSearchResultBlockProps & DataProps<any, any>

EnhancedWordpressSearchResultBlock.defaultProps = {
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
    id: 'admin/editor.wordpressSearchResultBlock.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.wordpressSearchResultBlock.description',
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

EnhancedWordpressSearchResultBlock.schema = {
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

export default EnhancedWordpressSearchResultBlock
