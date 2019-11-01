import React from 'react'
import DefaultModal from './default_modal.jsx'

const DialogModal = ({ modal }) => {
  const { title, body, positiveText } = modal.data
  const { positiveAction, negativeAction } = modal.handlers

  return (
    <DefaultModal
      show
      title={title}
      body={body}
      btnPositiveText={positiveText}
      handlePositiveClick={positiveAction}
      handleClose={negativeAction}
    />
  )
}

export default DialogModal
