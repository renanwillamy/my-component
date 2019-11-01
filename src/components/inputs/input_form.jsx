import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Dropdown } from 'primereact/dropdown'
import './inputs.css'

class BaseInput extends Component {
  render () {
    let { id, style, label, required, errorMessage } = this.props
    let errorClass = errorMessage ? 'text-field-error' : ''

    return (
      <div className={errorClass} style={style}>
        {label && (
          <label
            id={`${id}_label`}
            name={`${id}_label`}
            className='ui-outputlabel'
          >
            <FormattedMessage id={label} defaultMessage={label} />
          </label>
        )}
        {required && <span className='wms-required-field'> *</span>}
        {this.generateInput()}
        {errorMessage && (
          <div className={'ui-message-error ui-widget ui-corner-all'}>
            <span id={`${id}_error`} className={'ui-message-error-detail'}>
              <FormattedMessage id={errorMessage} />
            </span>
          </div>
        )}
      </div>
    )
  }
}

class Input extends BaseInput {
  generateInput () {
    let { type, id, value, disabled, clazzName, handleChange, hint } = this.props
    let disabledClass = disabled ? 'text-field-disabled' : ''

    return (
      <React.Fragment>
        <input
          type={type}
          id={`${id}_value`}
          disabled={disabled}
          value={value || ''}
          onChange={({ currentTarget: input }) => handleChange(input.value)}
          className={clazzName + ' text-field ' + disabledClass}
          style={{ display: 'block' }}
          placeholder={hint || ''}
        />
      </React.Fragment>
    )
  }
}

class CheckBox extends BaseInput {
  generateInput () {
    let { id, value, disabled, clazzName, handleChange } = this.props
    let disabledClass = disabled ? 'text-field-disabled' : ''

    return (
      <React.Fragment>
        <input
          type='checkbox'
          id={`${id}_value`}
          disabled={disabled}
          checked={value || false}
          onChange={({ currentTarget: input }) => handleChange(input.checked)}
          className={clazzName + ' check-box text-field ' + disabledClass}

        />
      </React.Fragment>
    )
  }
}

class Select extends BaseInput {
  generateInput () {
    const { value, options, placeholder, handleChange } = this.props
    return (
      <React.Fragment>
        <br />
        <Dropdown value={value} options={options} onChange={handleChange}
          placeholder={placeholder} />
        <br />
      </React.Fragment>
    )
  }

  renderSelectOptions (option) {
    const { id } = this.props
    if (typeof option === 'string') {
      option = { value: option, label: option }
    }

    return (
      <option key={`${id}_${option.value}`} value={option.value}>
        {option.label}
      </option>
    )
  }
}

export { Input, CheckBox, Select }
