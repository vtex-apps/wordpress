import React, { PureComponent } from 'react'
import appSettings from '../graphql/Settings.graphql'
import { graphql } from 'react-apollo'
import { Spinner } from 'vtex.styleguide'

export default function withSettingsNoSSR(Component: any): any {
  class WithSettingsNoSSR extends PureComponent<any> {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    render() {
      const {
        data: { loading, error, appSettings },
        ...rest
      } = this.props
      if (loading) {
        return (
          <div className="mv5 flex justify-center">
            <Spinner />
          </div>
        )
      } else if (error) {
        return <div className="ph5">Error! {error.message}</div>
      } else if (appSettings != null) {
        return <Component appSettings={appSettings} {...rest} />
      } else {
        return null
      }
    }
  }

  return graphql(appSettings, { options: { ssr: false } })(WithSettingsNoSSR)
}
