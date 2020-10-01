import React from 'react'
import { QueryResult } from 'react-apollo'

interface WPPostContainerContextInterface {
  query: QueryResult<
    any,
    {
      slug: any
      customDomain: any
    }
  > | null
  params: { slug?: string; customdomainslug?: string }
}

export const WPPostContainerContext = React.createContext<
  WPPostContainerContextInterface
>({
  query: null,
  params: {},
})
