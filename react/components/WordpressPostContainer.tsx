import React from 'react'
import { defineMessages } from 'react-intl'
import { useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

import { WPPostContainerContext } from '../contexts/WordpressPostContainer'
import SinglePostBySlug from '../graphql/SinglePostBySlug.graphql'

interface PostProps {
  customDomains: string
}

const WordpressPostContainer: StorefrontFunctionComponent<PostProps> = props => {
  const { customDomains } = props
  const {
    route: { params },
  } = useRuntime() as any
  let parsedCustomDomains = null
  try {
    parsedCustomDomains = customDomains ? JSON.parse(customDomains) : null
  } catch (e) {
    console.error(e)
  }

  const customDomain: string =
    params.customdomainslug && parsedCustomDomains
      ? parsedCustomDomains[params.customdomainslug]
      : undefined

  const query = useQuery(SinglePostBySlug, {
    variables: { slug: params.slug, customDomain },
  })

  return (
    <WPPostContainerContext.Provider value={{ query }}>
      <div>{props.children}</div>
    </WPPostContainerContext.Provider>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.wordpressPostContainer.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.wordpressPostContainer.description',
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

WordpressPostContainer.defaultProps = {
  customDomains: undefined,
}

WordpressPostContainer.schema = {
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

export default WordpressPostContainer
