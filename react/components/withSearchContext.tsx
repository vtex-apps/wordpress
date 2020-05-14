import { SearchPageContext } from 'vtex.search-page-context/SearchPageContext'

import React, { ComponentType } from 'react'

function withSearchContext(WrappedComponent: ComponentType<any>) {
  return function(props: any) {
    return (
      <SearchPageContext.Consumer>
        {({ searchQuery }: { searchQuery: any }) => (
          <WrappedComponent {...props} searchQuery={searchQuery} />
        )}
      </SearchPageContext.Consumer>
    )
  }
}

export default withSearchContext
