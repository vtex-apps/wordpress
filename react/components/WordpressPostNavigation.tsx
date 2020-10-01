import { Container } from 'vtex.store-components'

import React, { useContext } from 'react'
import { useQuery } from 'react-apollo'
import { defineMessages } from 'react-intl'
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

interface WPPostNavigationProps {
  customPrevText?: string
  customNextText?: string
}

const WordpressPostNavigation: StorefrontFunctionComponent<WPPostNavigationProps> = ({
  customPrevText,
  customNextText,
}) => {
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
              <div>{customPrevText || `< Previous Article`}</div>
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
              <div>{customNextText || `Next Article >`}</div>
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
  customPrevTextTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressPostNavigationCustomPrevText.title',
  },
  customPrevTextDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressPostNavigationCustomPrevText.description',
  },
  customNextTextTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressPostNavigationCustomNextText.title',
  },
  customNextTextDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressPostNavigationCustomNextText.description',
  },
})

WordpressPostNavigation.defaultProps = {
  customPrevText: '',
  customNextText: '',
}

WordpressPostNavigation.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
  properties: {
    customPrevText: {
      title: messages.customPrevTextTitle.id,
      description: messages.customPrevTextDescription.id,
      type: 'string',
      isLayout: false,
      default: '',
    },
    customNextText: {
      title: messages.customNextTextTitle.id,
      description: messages.customNextTextDescription.id,
      type: 'string',
      isLayout: false,
      default: '',
    },
  },
}

export default WordpressPostNavigation
