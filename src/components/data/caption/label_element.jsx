import React, { Component } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'

class LabelElement extends Component {
  render () {
    const { iconClass, idMessage } = this.props.data
    return (
      <div>
        <span className={iconClass}>
          <FormattedMessage
            id={idMessage}
            defaultMessage='Message ID not found'
          />
        </span>
      </div>
    )
  }
}

export default injectIntl(LabelElement)
