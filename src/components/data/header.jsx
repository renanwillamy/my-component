import React from 'react'
import { FormattedMessage } from 'react-intl'
import SortingIcon from '../sorting_icon.jsx'
const Header = ({ id, messageId, handleClick, fieldName, sortOrder, input, sortField, clazzName,
  hidden = false, sortable = true, style }) => {
  clazzName = clazzName || 'ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only padding'

  if (hidden) {
    return null
  }
  return (
    <div style={style}>
      <span>
        { messageId && <FormattedMessage id={messageId} />}
      </span>
      {sortable ? <SortingIcon sortOrder={sortOrder} handleClick={() => handleClick(fieldName)}
        fieldName={fieldName}
        fieldToUpdate={sortField} /> : null}
      {input}
    </div>
  )
}

export default Header
