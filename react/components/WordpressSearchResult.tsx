/* eslint-disable @typescript-eslint/camelcase */
import { Container } from 'vtex.store-components'
import React, { ChangeEvent, Fragment, useState, useEffect } from 'react'
import { useQuery } from 'react-apollo'
import { defineMessages } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import { Spinner, Pagination } from 'vtex.styleguide'
import Helmet from 'react-helmet'
import { useCssHandles } from 'vtex.css-handles'

import WordpressTeaser from './WordpressTeaser'
import SearchPosts from '../graphql/SearchPosts.graphql'
import Settings from '../graphql/Settings.graphql'

interface SearchProps {
  customDomains: string
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

const WordpressSearchResult: StorefrontFunctionComponent<SearchProps> = ({
  customDomains,
}) => {
  const {
    route: { id, params },
    pages,
    query,
    setQuery,
    navigate,
  } = useRuntime() as any

  let parsedCustomDomains = null
  try {
    parsedCustomDomains = customDomains ? JSON.parse(customDomains) : null
  } catch (e) {
    console.error(e)
  }
  const customDomain =
    params.customdomainslug && parsedCustomDomains
      ? parsedCustomDomains[params.customdomainslug]
      : undefined

  const initialPage = params.page ?? query?.page ?? '1'
  const [page, setPage] = useState(parseInt(initialPage, 10))
  const [perPage, setPerPage] = useState(10)
  const handles = useCssHandles(CSS_HANDLES)
  const { loading: loadingS, data: dataS } = useQuery(Settings)
  const { loading, error, data, fetchMore } = useQuery(SearchPosts, {
    skip: !params,
    variables: {
      terms: params.term || params.term_id,
      wp_page: 1,
      wp_per_page: 10,
      customDomain,
    },
  })

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [page])

  if (!params?.term && !params?.term_id) return null

  const term = params.term || params.term_id

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
        if (pages[id].path.indexOf(':page') > 0) {
          params.page = '1'
          navigate({
            page: id,
            params,
            scrollOptions: false,
          })
        } else {
          setQuery({ page: '1' })
        }
        setPerPage(+value)
        fetchMore({
          variables: {
            wp_page: 1,
            wp_per_page: +value,
            terms: term,
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
        setPage(prevPage)
        if (pages[id].path.indexOf(':page') > 0) {
          params.page = prevPage.toString()
          navigate({
            page: id,
            params,
            scrollOptions: false,
          })
        } else {
          setQuery({ page: prevPage.toString() })
        }
        fetchMore({
          variables: {
            wp_page: prevPage,
            wp_per_page: perPage,
            terms: term,
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
        setPage(nextPage)
        if (pages[id].path.indexOf(':page') > 0) {
          params.page = nextPage.toString()
          navigate({
            page: id,
            params,
            scrollOptions: false,
          })
        } else {
          setQuery({ page: nextPage.toString() })
        }
        fetchMore({
          variables: {
            wp_page: nextPage,
            wp_per_page: perPage,
            terms: term,
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
  return (
    <Fragment>
      <Helmet>
        <title>
          {dataS?.appSettings?.titleTag
            ? `Article search results for ${decodeURIComponent(term)} | ${
                dataS.appSettings.titleTag
              }`
            : `Article search results for ${decodeURIComponent(term)}`}
        </title>
      </Helmet>
      <h2
        className={`${handles.listTitle} ${handles.searchListTitle} t-heading-2 tc`}
      >
        Article search results for &quot;{decodeURIComponent(term)}
        &quot;
      </h2>

      <Container
        className={`${handles.listContainer} ${handles.searchListContainer} pt2 pb8`}
        style={{ maxWidth: '90%' }}
      >
        <div className="ph3">{paginationComponent}</div>
        {(loading || loadingS) && (
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
                    customDomainSlug={params.customdomainslug}
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
                    absoluteLinks={false}
                    useTextOverlay={false}
                  />
                </div>
              ))}
            </div>
            <div className="ph3 mb7">{paginationComponent}</div>
          </Fragment>
        ) : (
          <div>
            <h2>No posts found.</h2>
          </div>
        )}
      </Container>
    </Fragment>
  )
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
  customDomainsTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCustomDomains.title',
  },
  customDomainsDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCustomDomains.description',
  },
})

WordpressSearchResult.defaultProps = {
  customDomains: undefined,
}

WordpressSearchResult.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
  properties: {
    customDomains: {
      title: messages.customDomainsTitle.id,
      description: messages.customDomainsDescription.id,
      type: 'string',
      isLayout: false,
      default: '',
    },
  },
}

export default WordpressSearchResult
