/* eslint-disable @typescript-eslint/camelcase */
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import AllPosts from '../graphql/AllPosts.graphql'
import withSettings from './withSettings'
import { compose, graphql, DataProps } from 'react-apollo'
import { Spinner, Pagination } from 'vtex.styleguide'
import { Container } from 'vtex.store-components'
import WordpressTeaser from './WordpressTeaser'
import styles from './list.css'

interface OtherProps {
  appSettings: AppSettings
}

interface AppSettings {
  titleTag: string
  blogRoute: string
}

type DataPropsExtended = OtherProps & DataProps<any, any>

class WordpressAllPosts extends Component<DataPropsExtended> {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  state = {
    page: 1,
    per_page: 10,
  }
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  render() {
    const {
      appSettings,
      appSettings: { titleTag },
      data: { fetchMore, loading, error, wpPosts },
    } = this.props
    return (
      <Container className={`${styles.listContainer} pt6 pb8`}>
        <Helmet>
          <title>{titleTag}</title>
        </Helmet>
        <div className="ph3">
          <Pagination
            rowsOptions={[10, 20, 30, 40]}
            currentItemFrom={
              this.state.page * this.state.per_page - this.state.per_page + 1
            }
            currentItemTo={this.state.page * this.state.per_page}
            textOf="of"
            textShowRows="posts per page"
            totalItems={wpPosts != null ? wpPosts.total_count : 0}
            onRowsChange={(event: any) => {
              const firstPage = 1
              const perPage = event.target.value
              this.setState({ per_page: event.target.value, page: 1 })
              fetchMore({
                variables: {
                  wp_page: firstPage,
                  wp_per_page: perPage,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult) return prev
                  return fetchMoreResult
                },
              })
            }}
            onPrevClick={() => {
              if (this.state.page > 1) {
                const prevPage = this.state.page - 1
                this.setState({ page: this.state.page - 1 })
                fetchMore({
                  variables: {
                    wp_page: prevPage,
                    wp_per_page: this.state.per_page,
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev
                    return fetchMoreResult
                  },
                })
              }
            }}
            onNextClick={() => {
              const nextPage = this.state.page + 1
              this.setState({ page: this.state.page + 1 })
              fetchMore({
                variables: {
                  wp_page: nextPage,
                  wp_per_page: this.state.per_page,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult) return prev
                  return fetchMoreResult
                },
              })
            }}
          />
        </div>
        {loading && (
          <div className="mv5 flex justify-center" style={{ minHeight: 800 }}>
            <Spinner />
          </div>
        )}
        {error && (
          <div className="ph5" style={{ minHeight: 800 }}>
            Error: {error.message}
          </div>
        )}
        {wpPosts != null ? (
          <div className={`${styles.listFlex} mv4 flex flex-row flex-wrap`}>
            {wpPosts.posts.map((post: PostData, index: number) => (
              <div
                key={index}
                className={`${styles.listFlexItem} mv3 w-100-s w-50-l ph4`}
              >
                <WordpressTeaser
                  title={post.title.rendered}
                  author={post.author != null ? post.author.name : ''}
                  category={
                    post.categories[0] != null ? post.categories[0].name : ''
                  }
                  categoryId={
                    post.categories[0] != null
                      ? post.categories[0].id
                      : undefined
                  }
                  excerpt={post.excerpt.rendered}
                  date={post.date}
                  id={post.id}
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
                  showAuthor={false}
                  showCategory
                  showDate
                  showExcerpt
                  useTextOverlay={false}
                  settings={appSettings}
                />
              </div>
            ))}
          </div>
        ) : (
          !loading &&
          !error && (
            <div>
              <h2>No posts found.</h2>
            </div>
          )
        )}
      </Container>
    )
  }
}

export default compose(
  withSettings,
  graphql(AllPosts, {
    options: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
      ssr: false,
    },
  })
)(WordpressAllPosts)
