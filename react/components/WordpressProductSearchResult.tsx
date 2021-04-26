/* eslint-disable @typescript-eslint/camelcase */
import { Container } from 'vtex.store-components'
import React, { ChangeEvent, Fragment, useState, useEffect, useRef } from 'react'
import { defineMessages } from 'react-intl'
import { useQuery } from 'react-apollo'
import { Spinner, Pagination } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import WordpressTeaser from './WordpressTeaser'
import withSearchContext from './withSearchContext'
import SearchPosts from '../graphql/SearchPosts.graphql'

interface Props {
  searchQuery: any
  customDomain: string
  customDomainSlug: string
}

const CSS_HANDLES = [
  'listTitle',
  'searchListTitle',
  'listContainer',
  'searchListContainer',
  'listFlex',
  'searchListFlex',
  'listFlexItem',
  'searchListFlexItem',
] as const

const WordpressSearchResult: StorefrontFunctionComponent<Props> = ({
  searchQuery,
  customDomain,
  customDomainSlug,
}) => {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const handles = useCssHandles(CSS_HANDLES)
  const { loading, error, data, fetchMore } = useQuery(SearchPosts, {
    skip: !searchQuery,
    variables: {
      terms: searchQuery?.data?.searchMetadata?.titleTag ?? null,
      wp_page: 1,
      wp_per_page: 10,
      customDomain,
    },
  })

  const containerRef = useRef<null | HTMLElement>(null)
  const initialPageLoad = useRef(true)

  useEffect(() => {
    if (initialPageLoad.current) {
      initialPageLoad.current = false

      return
    }
    if (containerRef.current) {
      window.scrollTo({
        top: containerRef.current.getBoundingClientRect().top + window.pageYOffset, 
        behavior: 'smooth'
      });
    }
  }, [page])

  const paginationComponent = (
    <Pagination
      rowsOptions={[10, 20, 30, 40]}
      currentItemFrom={(page - 1) * perPage + 1}
      currentItemTo={page * perPage}
      textOf="of"
      textShowRows="posts per page"
      totalItems={data?.wpPosts?.total_count ?? 0}
      onRowsChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        setPage(1)
        setPerPage(+value)
        fetchMore({
          variables: {
            wp_page: 1,
            wp_per_page: +value,
            terms: searchQuery.data.searchMetadata.titleTag,
            customDomain,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev
            return fetchMoreResult
          },
        })
      }}
      onPrevClick={() => {
        if (page <= 1) return
        const prevPage = page - 1
        setPage(page - 1)
        fetchMore({
          variables: {
            wp_page: prevPage,
            wp_per_page: perPage,
            terms: searchQuery.data.searchMetadata.titleTag,
            customDomain,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev
            return fetchMoreResult
          },
        })
      }}
      onNextClick={() => {
        const nextPage = page + 1
        setPage(page + 1)
        fetchMore({
          variables: {
            wp_page: nextPage,
            wp_per_page: perPage,
            terms: searchQuery.data.searchMetadata.titleTag,
            customDomain,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev
            return fetchMoreResult
          },
        })
      }}
    />
  )
  return searchQuery?.data?.searchMetadata?.titleTag ? (
    <Fragment>
      <h2
        className={`${handles.listTitle} ${handles.searchListTitle} t-heading-2 tc`}
      >
        Article search results for &quot;
        {searchQuery?.data?.searchMetadata?.titleTag}
        &quot;
      </h2>

      <Container
        className={`${handles.listContainer} ${handles.searchListContainer} pt2 pb8`}
        style={{ maxWidth: '90%' }}
        ref={containerRef}
      >
        <div className="ph3">{paginationComponent}</div>
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
        {data?.wpPosts ? (
          <Fragment>
            <div
              className={`${handles.listFlex} ${handles.searchListFlex} mv4 flex flex-row flex-wrap`}
            >
              {data.wpPosts.posts.map((post: PostData, index: number) => (
                <div
                  key={index}
                  className={`${handles.listFlexItem} ${handles.searchListFlexItem} mv3 w-100-s w-50-l ph4`}
                >
                  <WordpressTeaser
                    title={post.title.rendered}
                    author={post.author.name}
                    category={post.categories[0]?.name ?? ''}
                    categoryId={post.categories[0]?.id ?? undefined}
                    categorySlug={post.categories[0]?.slug ?? ''}
                    customDomainSlug={customDomainSlug}
                    excerpt={post.excerpt.rendered}
                    date={post.date}
                    id={post.id}
                    slug={post.slug}
                    link={post.link}
                    image={post.featured_media?.source_url ?? ''}
                    altText={post.featured_media?.alt_text ?? ''}
                    mediaType={post.featured_media?.media_type ?? ''}
                    showAuthor={false}
                    showCategory
                    showDate
                    showExcerpt
                    useTextOverlay={false}
                    absoluteLinks={false}
                  />
                </div>
              ))}
            </div>
            <div className="ph3">{paginationComponent}</div>
          </Fragment>
        ) : (
          <div>
            <h2>No posts found.</h2>
          </div>
        )}
      </Container>
    </Fragment>
  ) : null
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.wordpressSearchResult.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.wordpressSearchResult.description',
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
})

WordpressSearchResult.defaultProps = {
  customDomain: undefined,
  customDomainSlug: undefined,
}

WordpressSearchResult.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
  properties: {
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
  },
}

export default withSearchContext(WordpressSearchResult)
