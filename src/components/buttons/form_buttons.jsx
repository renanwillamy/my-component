import React, { Component } from 'react'
import CustomButton from './custom_button.jsx'

class FormButtons extends Component {
  render () {
    const {
      negativeSpan = 'wms-cancel3',
      positiveSpan = 'wms-enter3',
      negativeLabel = 'common.btn.cancel',
      registerLabel = 'common.btn.register',
      enableSubmit = true,
      onRegister,
      onCancel
    } = this.props
    return (
      <React.Fragment>
        <CustomButton
          onClick={onRegister}
          disabled={!enableSubmit}
          spanClass={`ui-button-text ui-c ng-binding ${positiveSpan}`}
          label={registerLabel}
        />
        <CustomButton
          onClick={onCancel}
          spanClass={`ui-button-text ui-c ng-binding ${negativeSpan}`}
          label={negativeLabel}
        />
      </React.Fragment>
    )
  }
}

export default FormButtons
