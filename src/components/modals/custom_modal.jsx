import React from 'react'
import { injectIntl } from 'react-intl'

import { Modal } from 'react-bootstrap'
import DefaultButton from '../buttons/default_button.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'
import './modals.css'

const CustomModal = ({
  show,
  className,
  onNegativeClick,
  onPositiveClick,
  title,
  children,
  positiveLabel,
  intl
}) => {
  function formatText (idText) {
    return idText !== undefined && idText.includes('.') && !idText.endsWith('.')
      ? intl.formatMessage({
        id: idText,
        defaultMessage: 'Message ID not found'
      })
      : ''
  }
  return (
    <Modal show={show} onHide={onNegativeClick} dialogClassName={className} >
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
      <DefaultButton
          handleClick={onPositiveClick}
          text={positiveLabel}
        />
        <DefaultButton
          handleClick={onNegativeClick}
          text={formatText('common.btn.cancel')}
        />        
      </Modal.Footer>
    </Modal>
  )
}

export default injectIntl(CustomModal)
