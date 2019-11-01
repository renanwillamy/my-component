import React from 'react'

import CustomModal from '../modals/custom_modal.jsx'

const DefaultModal = ({
  show,
  handleClose,
  handlePositiveClick,
  title,
  body,
  btnPositiveText
}) => {
  return (
    <CustomModal
      show={show}
      onNegativeClick={handleClose}
      onPositiveClick={handlePositiveClick}
      title={title}
      positiveLabel={btnPositiveText}
    >
      {body}
    </CustomModal>
  )
}

export default DefaultModal
