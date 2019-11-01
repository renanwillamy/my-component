import React from 'react'
import './buttons.css'


const DefaultButton = ({ title, text, handleClick, clazzName, disabled = false, hidden = false, id }) => {
  clazzName = 'text-color ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only action-btn-padding'
  const disabledStyle = disabled ? { background: '#c0c0c0', cursor: 'default', boxShadow: '1px 2px gray' } : null
  if (hidden) {
    return null
  }

  return (
    <button
      className={clazzName}
      title={title}
      onClick={handleClick}
      disabled={disabled}
      style={disabledStyle}> {text}
    </button>
  )
}

export default DefaultButton
