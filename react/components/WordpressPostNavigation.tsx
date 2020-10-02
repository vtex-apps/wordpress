import { Container } from 'vtex.store-components'

import React, { useContext } from 'react'
import { useQuery } from 'react-apollo'
import { defineMessages, FormattedMessage } from 'react-intl'
import { Link } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'

import { WPPostContainerContext } from '../contexts/WordpressPostContainer'
import SinglePostAfterDate from '../graphql/SinglePostAfterDate.graphql'
import SinglePostBeforeDate from '../graphql/SinglePostBeforeDate.graphql'

const CSS_HANDLES = [
  'postNavigationContainer',
  'postNavigationFlex',
  'postNavigationFlexItem',
  'postNavigationLink',
] as const

const WordpressPostNavigation: StorefrontFunctionComponent = () => {
  const { query } = useContext(WPPostContainerContext)

  if (!query || query.loading || query.error) {
    return null
  }

  const customDomain = query.variables.customDomain
  const date = query.data?.wpPosts?.posts[0]?.date

  const { data: dataNext } = useQuery(SinglePostAfterDate, {
    variables: { date, customDomain },
  })
  const { data: dataPrev } = useQuery(SinglePostBeforeDate, {
    variables: { date, customDomain },
  })
  const slugPrev = dataPrev?.wpPosts?.posts[0]?.slug
  const slugNext = dataNext?.wpPosts?.posts[0]?.slug

  const handles = useCssHandles(CSS_HANDLES)

  return (
    <Container className={`${handles.postNavigationContainer} ph3 pv8`}>
      <div
        className={`${handles.postNavigationFlex} flex flex-row flex-wrap justify-between`}
      >
        <div className={`${handles.postNavigationFlexItem}`}>
          {slugPrev && (
            <div>
              <div>
                <FormattedMessage id="store/wordpress-integration.wordpressPostNavigation.previous" />
              </div>
              <div>
                <Link
                  page="store.blog-post"
                  params={{ slug: slugPrev }}
                  className={`${handles.postNavigationLink}`}
                >
                  {dataPrev?.wpPosts?.posts[0]?.title.rendered}
                </Link>
              </div>
            </div>
          )}
        </div>
        <div
          className={`${handles.postNavigationFlexItem}`}
          style={{
            textAlign: 'right',
          }}
        >
          {slugNext && (
            <div>
              <div>
                <FormattedMessage id="store/wordpress-integration.wordpressPostNavigation.next" />
              </div>
              <div>
                <Link
                  page="store.blog-post"
                  params={{ slug: slugNext }}
                  className={`${handles.postNavigationLink}`}
                >
                  {dataNext?.wpPosts?.posts[0]?.title.rendered}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.wordpressPostNavigation.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.wordpressPostNavigation.description',
  },
})

WordpressPostNavigation.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
}

export default WordpressPostNavigation
