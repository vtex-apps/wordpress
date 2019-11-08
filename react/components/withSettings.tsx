import React, { PureComponent } from 'react'
import appSettings from '../graphql/Settings.graphql'
import { graphql } from 'react-apollo'
import { Spinner } from 'vtex.styleguide'

export default function withSettings(Component: any): any {
  class WithSettings extends PureComponent<any> {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    render() {
      const {
        data: { appSettings },
        ...rest
      } = this.props

      return appSettings ? (
        <Component appSettings={appSettings} {...rest} />
      ) : (
        <span className="mv5 flex justify-center">
          <Spinner />
        </span>
      )
    }
  }

  return graphql(appSettings)(WithSettings)
}
