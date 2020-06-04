import { Container } from 'vtex.store-components'

import React, { FunctionComponent, Fragment } from 'react'
import { defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { Link } from 'vtex.render-runtime'
import { useQuery } from 'react-apollo'

import PostSimpleBySlug from '../graphql/PostSimpleBySlug.graphql'
import CategorySimpleBySlug from '../graphql/CategorySimpleBySlug.graphql'

interface Props {
  params: any
  customDomains: string
}

interface CategoryProps {
  categorySlug?: string
  customDomain?: string
}

interface SinglePostProps {
  slug?: string
  customDomain?: string
  customDomainSlug?: string
}

const CSS_HANDLES = [
  'breadcrumbContainer',
  'breadcrumbHomeLink',
  'breadcrumbLink',
  'breadcrumbSeparator',
  'breadcrumbCurrentPage',
] as const

const WordpressCategoryBreadcrumb: FunctionComponent<CategoryProps> = ({
  categorySlug,
  customDomain,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { data, loading, error } = useQuery(CategorySimpleBySlug, {
    variables: { categorySlug, customDomain },
  })
  if (loading || error) return <Fragment></Fragment>
  if (data?.wpCategories?.categories?.length)
    return (
      <Container className={`${handles.breadcrumbContainer} pt2 pb8`}>
        <Link
          page="store.blog-home"
          params={{ page: '1' }}
          className={`${handles.breadcrumbHomeLink}`}
        >
          Blog Home
        </Link>
        <span className={`${handles.breadcrumbSeparator}`}>&nbsp;/&nbsp;</span>
        <span className={`${handles.breadcrumbCurrentPage}`}>
          {data.wpCategories.categories[0].name}
        </span>
      </Container>
    )
  return null
}

const WordpressSinglePostBreadcrumb: FunctionComponent<SinglePostProps> = ({
  slug,
  customDomain,
  customDomainSlug,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { data, loading, error } = useQuery(PostSimpleBySlug, {
    variables: { slug, customDomain },
  })

  if (loading || error) return <Fragment></Fragment>
  if (data?.wpPosts?.posts?.length)
    return (
      <Container className={`${handles.breadcrumbContainer} pt2 pb8`}>
        <Link
          page="store.blog-home"
          params={{ page: '1' }}
          className={`${handles.breadcrumbHomeLink}`}
        >
          Blog Home
        </Link>
        <span className={`${handles.breadcrumbSeparator}`}>&nbsp;/&nbsp;</span>
        <Link
          page="store.blog-category"
          params={{
            categoryslug: data.wpPosts.posts[0].categories[0].slug,
            page: '1',
            customdomainslug: customDomainSlug,
          }}
          className={`${handles.breadcrumbLink}`}
        >
          {data.wpPosts.posts[0].categories[0].name}
        </Link>
        <span className={`${handles.breadcrumbSeparator}`}>&nbsp;/&nbsp;</span>
        <span className={`${handles.breadcrumbCurrentPage}`}>
          {data.wpPosts.posts[0].title.rendered}
        </span>
      </Container>
    )
  return null
}

const WordpressBreadcrumb: StorefrontFunctionComponent<Props> = ({
  customDomains,
  params,
}) => {
  const handles = useCssHandles(CSS_HANDLES)

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

  // if we're on a category page with a slug
  if (params?.categoryslug) {
    return (
      <WordpressCategoryBreadcrumb
        categorySlug={params.categoryslug}
        customDomain={customDomain}
      />
    )
  }

  // if we're on an article search page
  if (params?.term) {
    return (
      <Container
        className={`${handles.breadcrumbContainer} pt2 pb8`}
        style={{ maxWidth: '90%' }}
      >
        <Link
          page="store.blog-home"
          params={{
            page: '1',
            customdomainslug: params.customdomainslug,
          }}
          className={`${handles.breadcrumbHomeLink}`}
        >
          Blog Home
        </Link>
        <span className={`${handles.breadcrumbSeparator}`}>&nbsp;/&nbsp;</span>
        <span className={`${handles.breadcrumbCurrentPage}`}>
          Search results for &quot;{params.term}&quot;
        </span>
      </Container>
    )
  }

  // if we're viewing a single blog post with a slug
  if (params?.slug) {
    return (
      <WordpressSinglePostBreadcrumb
        slug={params.slug}
        customDomain={customDomain}
        customDomainSlug={params.customdomainslug}
      />
    )
  }

  // else
  return (
    <Container className={`${handles.breadcrumbContainer} pt2 pb8`}>
      <Link
        page="store.blog-home"
        params={{ page: '1' }}
        className={`${handles.breadcrumbHomeLink}`}
      >
        Blog Home
      </Link>
    </Container>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.wordpressBreadcrumb.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.wordpressBreadcrumb.description',
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

WordpressBreadcrumb.defaultProps = {
  customDomains: undefined,
}

WordpressBreadcrumb.schema = {
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

export default WordpressBreadcrumb
