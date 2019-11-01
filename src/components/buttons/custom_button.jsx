import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

class CustomButton extends Component {
  render () {
    const { onClick, spanClass = '', label, disabled } = this.props
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className='custom-button form-button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only'
      >
        <span className={spanClass}>
          <FormattedMessage id={label} className='ui-button-text ui-c' />
        </span>
      </button>
    )
  }
}

export default CustomButton
