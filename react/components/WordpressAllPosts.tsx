/* eslint-disable @typescript-eslint/camelcase */
import { Container } from 'vtex.store-components'
import type { ChangeEvent } from 'react'
import React, { Fragment, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { defineMessages } from 'react-intl'
import { useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import { Spinner, Pagination } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import WordpressTeaser from './WordpressTeaser'
import Settings from '../graphql/Settings.graphql'
import AllPosts from '../graphql/AllPosts.graphql'

const CSS_HANDLES = [
  'listTitle',
  'listContainer',
  'listFlex',
  'listFlexItem',
] as const

interface AllPostsProps {
  customDomain: string
  customDomainSlug: string
}

const WordpressAllPosts: StorefrontFunctionComponent<AllPostsProps> = ({
  customDomain,
  customDomainSlug,
}) => {
  const {
    route: { id, params },
    pages,
    query,
    setQuery,
    navigate,
  } = useRuntime() as any
  const initialPage = params.page ?? query?.page ?? '1'
  const [page, setPage] = useState(parseInt(initialPage, 10))
  const [perPage, setPerPage] = useState(10)
  const handles = useCssHandles(CSS_HANDLES)
  const { loading: loadingS, data: dataS } = useQuery(Settings)
  const { loading, error, data, fetchMore } = useQuery(AllPosts, {
    variables: {
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

  const PaginationComponent = (
    <Pagination
      rowsOptions={[10, 20, 30, 40]}
      currentItemFrom={(page - 1) * perPage + 1}
      currentItemTo={page * perPage}
      textOf="of"
      textShowRows="posts per page"
      totalItems={data?.wpPosts?.total_count ?? 0}
      onRowsChange={({target: {value}}: ChangeEvent<HTMLInputElement> ) => {
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
    <Container
      className={`${handles.listContainer} pt6 pb8`}
      style={{ maxWidth: '90%' }}
    >
      {dataS?.appSettings?.titleTag && (
        <Helmet>
          <title>{dataS.appSettings.titleTag}</title>
        </Helmet>
      )}
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
      {data?.wpPosts ? (
        <Fragment>
          <div className={`${handles.listFlex} mv4 flex flex-row flex-wrap`}>
            {data.wpPosts.posts.map((post: PostData, index: number) => (
              <div
                key={index}
                className={`${handles.listFlexItem} mv3 w-100-s w-50-l ph4`}
              >
                <WordpressTeaser
                  title={post.title.rendered}
                  author={post.author ? post.author.name : ''}
                  category={post.categories[0]?.name ?? ''}
                  categoryId={post.categories[0]?.id ?? undefined}
                  categorySlug={post.categories[0]?.slug ?? ''}
                  excerpt={post.excerpt.rendered}
                  date={post.date}
                  id={post.id}
                  slug={post.slug}
                  link={post.link}
                  customDomainSlug={customDomainSlug}
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
          <div className="ph3 mb7">{PaginationComponent}</div>
        </Fragment>
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

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.wordpressAllPosts.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.wordpressAllPosts.description',
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

WordpressAllPosts.defaultProps = {
  customDomain: undefined,
  customDomainSlug: undefined,
}

WordpressAllPosts.schema = {
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

export default WordpressAllPosts
