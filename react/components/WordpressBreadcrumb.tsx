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
  subcategoryUrls: boolean
}

interface CategoryProps {
  categorySlug?: string
  customDomain?: string
  customDomainSlug?: string
  withSubcategory: boolean
}

interface SinglePostProps {
  slug?: string
  customDomain?: string
  customDomainSlug?: string
  withSubcategory: boolean
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
  customDomainSlug,
  withSubcategory,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { data, loading, error } = useQuery(CategorySimpleBySlug, {
    variables: { categorySlug, customDomain },
    skip: !categorySlug,
  })
  if (loading || error) return <Fragment></Fragment>
  if (data?.wpCategories?.categories?.length) {
    const [{ categories }] = data.wpPosts?.posts || [data.wpCategories]
    const category = categories.find((c: any) => c.parent === 0)
    const subcategory =
      withSubcategory &&
      categories.find((sub: any) => sub.parent === category.id)

    return (
      <Container className={`${handles.breadcrumbContainer} pt2 pb8`}>
        <Link
          page="store.blog-home"
          className={`${handles.breadcrumbHomeLink}`}
        >
          Blog Home
        </Link>
        {subcategory?.slug && (
          <Fragment>
            <span className={`${handles.breadcrumbSeparator}`}>
              &nbsp;/&nbsp;
            </span>
            <Link
              page="store.blog-category#subcategory"
              params={{
                categoryslug: category.slug,
                subcategoryslug_id: subcategory.slug,
                customdomainslug: customDomainSlug,
              }}
              className={`${handles.breadcrumbLink}`}
            >
              {subcategory.name}
            </Link>
          </Fragment>
        )}
        <span className={`${handles.breadcrumbSeparator}`}>&nbsp;/&nbsp;</span>
        <span className={`${handles.breadcrumbCurrentPage}`}>
          {data.wpCategories.categories[0].name}
        </span>
      </Container>
    )
  }
  return null
}

const WordpressSinglePostBreadcrumb: FunctionComponent<SinglePostProps> = ({
  slug,
  customDomain,
  customDomainSlug,
  withSubcategory,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { data, loading, error } = useQuery(PostSimpleBySlug, {
    variables: { slug, customDomain },
  })

  if (loading || error) return <Fragment></Fragment>

  if (data?.wpPosts?.posts?.length) {
    const [{ categories }] = data.wpPosts.posts
    const category = categories.find((c: any) => c.parent === 0)
    const subcategory =
      withSubcategory &&
      categories.find((sub: any) => sub.parent === category.id)

    return (
      <Container className={`${handles.breadcrumbContainer} pt2 pb8`}>
        <Link
          page="store.blog-home"
          className={`${handles.breadcrumbHomeLink}`}
        >
          Blog Home
        </Link>
        <span className={`${handles.breadcrumbSeparator}`}>&nbsp;/&nbsp;</span>
        <Link
          page="store.blog-category"
          params={{
            categoryslug: category.slug,
            categoryslug_id: category.slug,
            customdomainslug: customDomainSlug,
          }}
          className={`${handles.breadcrumbLink}`}
        >
          {category.name}
        </Link>
        {subcategory?.slug && (
          <Fragment>
            <span className={`${handles.breadcrumbSeparator}`}>
              &nbsp;/&nbsp;
            </span>
            <Link
              page="store.blog-category#subcategory"
              params={{
                categoryslug: category.slug,
                subcategoryslug_id: subcategory.slug,
                customdomainslug: customDomainSlug,
              }}
              className={`${handles.breadcrumbLink}`}
            >
              {subcategory.name}
            </Link>
          </Fragment>
        )}
        <span className={`${handles.breadcrumbSeparator}`}>&nbsp;/&nbsp;</span>
        <span className={`${handles.breadcrumbCurrentPage}`}>
          {data.wpPosts.posts[0].title.rendered}
        </span>
      </Container>
    )
  }

  return null
}

const WordpressBreadcrumb: StorefrontFunctionComponent<Props> = ({
  customDomains,
  params,
  subcategoryUrls,
}) => {
  const handles = useCssHandles(CSS_HANDLES)

  let parsedCustomDomains = null
  try {
    parsedCustomDomains = customDomains ? JSON.parse(customDomains) : null
  } catch (e) {
    console.error(e)
  }

  const customDomain =
    params?.customdomainslug && parsedCustomDomains
      ? parsedCustomDomains[params?.customdomainslug]
      : undefined

  // if we're on a category page with a slug
  if (params?.categoryslug || params?.categoryslug_id) {
    return (
      <WordpressCategoryBreadcrumb
        categorySlug={params.categoryslug}
        customDomain={customDomain}
        customDomainSlug={params.customdomainslug}
        withSubcategory={subcategoryUrls}
      />
    )
  }

  // if we're on an article search page
  if (params?.term || params?.term_id) {
    return (
      <Container
        className={`${handles.breadcrumbContainer} pt2 pb8`}
        style={{ maxWidth: '90%' }}
      >
        <Link
          page="store.blog-home"
          params={{
            customdomainslug: params.customdomainslug,
          }}
          className={`${handles.breadcrumbHomeLink}`}
        >
          Blog Home
        </Link>
        <span className={`${handles.breadcrumbSeparator}`}>&nbsp;/&nbsp;</span>
        <span className={`${handles.breadcrumbCurrentPage}`}>
          Search results for &quot;{params.term || params.term_id}&quot;
        </span>
      </Container>
    )
  }

  // if we're viewing a single blog post with a slug
  if (params?.slug || params?.slug_id) {
    return (
      <WordpressSinglePostBreadcrumb
        slug={params.slug || params.slug_id}
        customDomain={customDomain}
        customDomainSlug={params.customdomainslug}
        withSubcategory={subcategoryUrls}
      />
    )
  }

  // else
  return (
    <Container className={`${handles.breadcrumbContainer} pt2 pb8`}>
      <Link page="store.blog-home" className={`${handles.breadcrumbHomeLink}`}>
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
  subcategoryUrlsTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressSubcategoryUrls.title',
  },
  subcategoryUrlsDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressSubcategoryUrls.description',
  },
})

WordpressBreadcrumb.defaultProps = {
  customDomains: undefined,
  subcategoryUrls: false,
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
    subcategoryUrls: {
      title: messages.subcategoryUrlsTitle.id,
      description: messages.subcategoryUrlsDescription.id,
      type: 'boolean',
      isLayout: false,
      default: '',
    },
  },
}

export default WordpressBreadcrumb
