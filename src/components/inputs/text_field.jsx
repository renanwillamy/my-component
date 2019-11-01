import React from 'react'
import './inputs.css'
const TextField = ({ value, label, errorMessage, required, handleOnChange, clazzName, disabled = false }) => {
  clazzName = clazzName || 'ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all'
  let showError = !!errorMessage
  let errorClass = showError ? 'text-field-error' : ''
  let disabledClass = disabled ? 'text-field-disabled' : ''
  return (
    <div className={errorClass}>
      <label className='ui-outputlabel'>{label}</label>
      <span hidden={!required} className='wms-required-field'> *</span><br />
      <input onChange={handleOnChange} value={value} disabled={disabled}
        className={clazzName + ' text-field ' + disabledClass} /><br />
      <div hidden={!showError} className={'ui-message-error ui-widget ui-corner-all'}>
        <span className={'ui-message-error-detail'} >{errorMessage}</span>
      </div>
    </div>
  )
}

export default TextField
