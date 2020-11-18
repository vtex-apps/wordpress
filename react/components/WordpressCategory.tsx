/* eslint-disable @typescript-eslint/camelcase */
import { Container } from 'vtex.store-components'

import React, { Fragment, useState } from 'react'
import { useQuery } from 'react-apollo'
import { defineMessages } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import { Spinner, Pagination } from 'vtex.styleguide'
import Helmet from 'react-helmet'
import { useCssHandles } from 'vtex.css-handles'

import WordpressTeaser from './WordpressTeaser'
import CategoryPostsBySlug from '../graphql/CategoryPostsBySlug.graphql'
import Settings from '../graphql/Settings.graphql'

interface CategoryProps {
  customDomains: string
}

const CSS_HANDLES = [
  'listTitle',
  'listContainer',
  'listFlex',
  'listFlexItem',
] as const

const initialPageVars = {
  wp_page: 1,
  wp_per_page: 10,
}

const WordpressCategory: StorefrontFunctionComponent<CategoryProps> = ({
  customDomains,
}) => {
  const {
    route: { id, params },
    pages,
    query,
    setQuery,
    navigate,
  } = useRuntime()

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
  const categoryVariable = {
    categorySlug: params.categoryslug || params.categoryslug_id,
  }
  const handles = useCssHandles(CSS_HANDLES)
  const { loading: loadingS, data: dataS } = useQuery(Settings)
  const { loading, error, data, fetchMore } = useQuery(CategoryPostsBySlug, {
    variables: { ...categoryVariable, ...initialPageVars, customDomain },
  })

  const PaginationComponent = (
    <Pagination
      rowsOptions={[10, 20, 30, 40]}
      currentItemFrom={(page - 1) * perPage + 1}
      currentItemTo={page * perPage}
      textOf="of"
      textShowRows="posts per page"
      totalItems={data?.wpCategories?.categories[0]?.wpPosts?.total_count ?? 0}
      onRowsChange={(event: any) => {
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
        setPerPage(event.target.value)
        fetchMore({
          variables: {
            wp_page: 1,
            wp_per_page: event.target.value,
            customDomain,
            ...categoryVariable,
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
            customDomain,
            ...categoryVariable,
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
            customDomain,
            ...categoryVariable,
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
      {dataS && data?.wpCategories?.categories?.length > 0 && (
        <Fragment>
          <Helmet>
            <title>
              {dataS?.appSettings?.titleTag
                ? `${data.wpCategories.categories[0].name} | ${dataS.appSettings.titleTag}`
                : data.wpCategories.categories[0].name}
            </title>
          </Helmet>
          <h2 className={`${handles.listTitle} t-heading-2 tc`}>
            {data.wpCategories.categories[0].name}
          </h2>
        </Fragment>
      )}
      <Container
        className={`${handles.listContainer} pt2 pb8`}
        style={{ maxWidth: '90%' }}
      >
        <div className="ph3">{PaginationComponent}</div>
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
        {data?.wpCategories?.categories?.length ? (
          <Fragment>
            <div className={`${handles.listFlex} mv4 flex flex-row flex-wrap`}>
              {data.wpCategories.categories[0].wpPosts.posts.map(
                (post: PostData, index: number) => (
                  <div
                    key={index}
                    className={`${handles.listFlexItem} mv3 w-100-s w-50-l ph4`}
                  >
                    <WordpressTeaser
                      title={post.title.rendered}
                      author={post.author.name}
                      excerpt={post.excerpt.rendered}
                      date={post.date}
                      id={post.id}
                      slug={post.slug}
                      link={post.link}
                      customDomainSlug={params.customdomainslug}
                      image={post.featured_media?.source_url ?? ''}
                      altText={post.featured_media?.alt_text ?? ''}
                      mediaType={post.featured_media?.media_type ?? ''}
                      showAuthor={false}
                      showCategory={false}
                      showDate
                      showExcerpt
                      useTextOverlay={false}
                      absoluteLinks={false}
                    />
                  </div>
                )
              )}
            </div>
            <div className="ph3 mb7">{PaginationComponent}</div>
          </Fragment>
        ) : (
          !loading &&
          !loadingS &&
          !error && (
            <div>
              <h2>No posts found.</h2>
            </div>
          )
        )}
      </Container>
    </Fragment>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCategory.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCategory.description',
  },
  customDomainsTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCustomDomain.title',
  },
  customDomainsDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCustomDomain.description',
  },
})

WordpressCategory.defaultProps = {
  customDomains: undefined,
}

WordpressCategory.schema = {
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

export default WordpressCategory
