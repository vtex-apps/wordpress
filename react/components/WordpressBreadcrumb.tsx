import React, { FunctionComponent, Fragment } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Container } from 'vtex.store-components'
import { Link } from 'vtex.render-runtime'
import { useQuery } from 'react-apollo'

import PostSimple from '../graphql/PostSimple.graphql'
import Settings from '../graphql/Settings.graphql'
import CategorySimple from '../graphql/CategorySimple.graphql'

interface Props {
  params: any
}

interface CategoryProps {
  categoryId: string
  route: string
}

interface SinglePostProps {
  id: string
  route: string
}

const CSS_HANDLES = [
  'breadcrumbContainer',
  'breadcrumbHomeLink',
  'breadcrumbLink',
  'breadcrumbSeparator',
  'breadcrumbCurrentPage',
] as const

const WordpressCategoryBreadcrumb: FunctionComponent<CategoryProps> = props => {
  const handles = useCssHandles(CSS_HANDLES)
  const { data, loading, error } = useQuery(CategorySimple, {
    variables: {
      category: props.categoryId,
    },
  })
  if (loading || error) return <Fragment></Fragment>
  if (data?.wpCategory)
    return (
      <Container className={`${handles.breadcrumbContainer} pt2 pb8`}>
        <Link
          to={'/' + props.route}
          className={`${handles.breadcrumbHomeLink}`}
        >
          Blog Home
        </Link>
        <span className={`${handles.breadcrumbSeparator}`}>&nbsp;/&nbsp;</span>
        <span className={`${handles.breadcrumbCurrentPage}`}>
          {data.wpCategory.name}
        </span>
      </Container>
    )
  return null
}

const WordpressSinglePostBreadcrumb: FunctionComponent<SinglePostProps> = props => {
  const handles = useCssHandles(CSS_HANDLES)
  const { data, loading, error } = useQuery(PostSimple, {
    variables: {
      id: props.id,
    },
  })

  if (loading || error) return <Fragment></Fragment>
  if (data?.wpPost)
    return (
      <Container className={`${handles.breadcrumbContainer} pt2 pb8`}>
        <Link
          to={'/' + props.route}
          className={`${handles.breadcrumbHomeLink}`}
        >
          Blog Home
        </Link>
        <span className={`${handles.breadcrumbSeparator}`}>&nbsp;/&nbsp;</span>
        <Link
          to={'/' + props.route + '/category/' + data.wpPost.categories[0].id}
          className={`${handles.breadcrumbLink}`}
        >
          {data.wpPost.categories[0].name}
        </Link>
        <span className={`${handles.breadcrumbSeparator}`}>&nbsp;/&nbsp;</span>
        <span className={`${handles.breadcrumbCurrentPage}`}>
          {data.wpPost.title.rendered}
        </span>
      </Container>
    )
  return null
}

const WordpressBreadcrumb: FunctionComponent<Props> = props => {
  const handles = useCssHandles(CSS_HANDLES)
  const { loading: loadingS, data: dataS } = useQuery(Settings)
  let route = dataS?.appSettings?.blogRoute
  if (!route || route == '') route = 'blog'

  if (loadingS) return null

  // if we're on a category page
  if (props.params?.categoryid) {
    ;<WordpressCategoryBreadcrumb
      categoryId={props.params.categoryid}
      route={route}
    />
  }

  // if we're on an article search page
  if (props.params?.terms) {
    return (
      <Container
        className={`${handles.breadcrumbContainer} pt2 pb8`}
        style={{ maxWidth: '90%' }}
      >
        <Link to={'/' + route} className={`${handles.breadcrumbHomeLink}`}>
          Blog Home
        </Link>
        <span className={`${handles.breadcrumbSeparator}`}>&nbsp;/&nbsp;</span>
        <span className={`${handles.breadcrumbCurrentPage}`}>
          Search results for &quot;{props.params.terms}&quot;
        </span>
      </Container>
    )
  }

  // if we're viewing a single blog post
  if (props.params?.id) {
    return <WordpressSinglePostBreadcrumb id={props.params.id} route={route} />
  }

  // else
  return (
    <Container className={`${handles.breadcrumbContainer} pt2 pb8`}>
      <Link to={'/' + route} className={`${handles.breadcrumbHomeLink}`}>
        Blog Home
      </Link>
    </Container>
  )
}

export default WordpressBreadcrumb
