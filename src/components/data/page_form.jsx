import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Growl } from 'primereact/growl'
import LoadingModal from '../modals/loading_modal.jsx'
import DialogModal from '../modals/dialog_modal.jsx'
import PageHeader from '../data/page_header.jsx'
import { Input, CheckBox, Select } from '../inputs/input_form.jsx'
import { handleExpectedErrors } from '../../utils/general_utils.jsx'

class PageForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      modal: undefined,
      errors: {}
    }

    this.handleUnexpectedErrors = this.handleUnexpectedErrors.bind(this)
    this.handleBadRequest = this.handleBadRequest.bind(this)
    this.validateProperty = this.validateProperty.bind(this)
  }

  componentDidMount () {
    if (this.isEdit()) this.fetchViewObject()
  }

  isEdit () {
    return this.props.match.params.id !== 'new'
  }

  toViewObject (obj) {
    return obj
  }

  fetchViewObject () {
    const toViewObject = result => {
      return { data: this.toViewObject(result.parameters.data) }
    }

    this.fetchData(this.fetchViewObjectPromise(), toViewObject)
  }

  getResultData (result) {
    return result.parameters.data
  }

  handleBadRequest (request) {
    return request.json().then(({ violations }) => {
      let { error, errorID, value } = violations
      let msgId = `${error}.${errorID}`

      let errorMsg = value
        ? this.props.intl.formatMessage({ id: msgId }, { value })
        : this.props.intl.formatMessage({ id: msgId })
      this.showError('', errorMsg)
      return Promise.reject(errorMsg)
    })
  }

  handleUnexpectedErrors (response) {
    if (response.status === 400) {
      this.handleBadRequest(response)
    }

    let { revertState } = this.state
    let state = { isLoading: false, ...revertState, revertState: undefined }
    // Revertendo para estado anterior a falha
    this.setState(state)
  }

  fetchData (fetchPromise, toViewObjectList) {
    fetchPromise
      .then(handleExpectedErrors)
      .then(result => result.json())
      .then(result => toViewObjectList(result))
      .then(viewObjects => this.setState(viewObjects))
      .catch(this.handleUnexpectedErrors)
  }

  renderInput (field, fieldObj) {
    if (!fieldObj) {
      fieldObj = this.getFieldsObject()[field]
    }

    let {
      path,
      label,
      type = 'text',
      required = false,
      disabled = false,
      hint = ''
    } = fieldObj

    const { data, errors } = this.state

    return (
      <Input
        type={type}
        label={label}
        value={data[path]}
        id={`form_${path}`}
        required={required}
        disabled={disabled}
        errorMessage={errors[path]}
        hint={
          hint &&
          this.props.intl.formatMessage({
            id: hint
          })
        }
        handleChange={nValue => this.handleFieldChange(nValue, fieldObj)}
      />
    )
  }

  renderCheckbox (field) {
    let fieldObj = this.getFieldsObject()[field]
    let { path, label, required = false, disabled = false } = fieldObj
    const { data, errors } = this.state

    return (
      <CheckBox
        label={label}
        value={data[path]}
        id={`form_${path}`}
        required={required}
        disabled={disabled}
        errorMessage={errors[path]}
        handleChange={nValue => this.handleFieldChange(nValue, fieldObj)}
      />
    )
  }

  renderSelect (field) {
    let fieldObj = this.getFieldsObject()[field]
    let { path, label, options = [], required = false, disabled = false } = fieldObj
    const { data, errors } = this.state

    return (
      <Select
        label={label}
        options={options}
        value={data[path]}
        id={`form_${path}`}
        required={required}
        disabled={disabled}
        errorMessage={errors[path]}
        handleChange={nValue => this.handleFieldChange(nValue.value, fieldObj)}
        placeholder={this.props.intl.formatMessage({ id: 'common.select' })}
      />
    )
  }

  handleFieldChange (nValue, field) {
    let { data, errors } = this.state

    let error = this.validateProperty(field, nValue)
    if (error === '') delete errors[field.path]
    else errors[field.path] = error
    data[field.path] = nValue

    this.setState({ error, data })
  }

  validateForm () {
    let isFormValid = true
    let { errors } = this.state
    Object.values(this.getFieldsObject()).forEach(field => {
      let error = this.validateProperty(field)
      if (!error) delete errors[field.path]
      else {
        errors[field.path] = error
        isFormValid = false
      }
    })
    this.setState(errors)
    return isFormValid
  }

  validateProperty (field, newValue) {
    let { data } = this.state
    const fieldData = newValue !== undefined ? newValue : data[field.path]
    if (field.required && !this.requiredValidator(fieldData)) {
      return 'common.field.required'
    } else if (field.validator) {
      return field.validator(fieldData)
    }
  }

  requiredValidator (fieldValue) {
    if (fieldValue !== undefined) {
      switch (typeof fieldValue) {
        case 'string':
          return fieldValue.trim().length > 0
        case 'object':
          return Object.keys(fieldValue).length > 0
        default:
          return true
      }
    }
    return false
  }

  handleSubmit () {
    if (!this.validateForm()) return
    const { id } = this.props.match.params
    let isInsert = id === 'new'

    this.generatePromise(isInsert)
      .then(handleExpectedErrors)
      .then(_ => {
        if (isInsert) this.finalizeAdd()
        else this.finalizeEdit()
      })
      .catch(this.handleUnexpectedErrors)
  }

  showSuccess (summary, detail) {
    this.showGrowl('success', summary, detail)
  }

  showInfo (summary, detail) {
    this.showGrowl('info', summary, detail)
  }

  showWarn (summary, detail) {
    this.showGrowl('warn', summary, detail)
  }

  showError (summary, detail) {
    this.showGrowl('error', summary, detail)
  }

  showGrowl (type, title, text) {
    const { formatMessage } = this.props.intl
    if (title) title = formatMessage({ id: title, defaultMessage: title })
    if (text) text = formatMessage({ id: text, defaultMessage: text })

    this.growl.show({ severity: type, summary: title, detail: text })
  }

  renderFormButtons () {
    return (
      <div className='row'>
        <div className='form-submit'>
          <button
            id='form_submit'
            onClick={() => this.handleSubmit()}
            className='form-button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only'
          >
            <span className='ui-button-text ui-c'>
              <FormattedMessage
                id={this.getButtonLabelId()}
                className='ui-button-text ui-c'
              />
            </span>
          </button>
          <button
            id='form_cancel'
            onClick={() => this.handleCancel()}
            className='form-button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only'
          >
            <span className='ui-button-text ui-c'>
              <FormattedMessage
                id='common.btn.cancel'
                className='ui-button-text ui-c'
              />
            </span>
          </button>
        </div>
      </div>
    )
  }

  render () {
    const { isLoading, modal } = this.state

    return (
      <React.Fragment>
        <Growl
          ref={el => {
            this.growl = el
          }}
        />
        {isLoading && <LoadingModal />}
        {modal && <DialogModal modal={modal} />}
        <PageHeader idMessage={this.getHeaderMsgId()} />
        <div
          id='form'
          style={{ height: '77vh', overflowX: 'hidden', overflowY: 'auto' }}
          className='ui-panel ui-widget ui-widget-content ui-corner-all'
        >
          {this.renderForm()}
          {this.renderFormButtons()}
        </div>
      </React.Fragment>
    )
  }
}

export default PageForm
