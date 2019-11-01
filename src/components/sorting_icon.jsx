import React from 'react'

const SortingIcon = ({ sortOrder, handleClick, fieldName = '', fieldToUpdate }) => {
  let clazzName = 'ui-sortable-column-icon ui-icon ui-icon-carat-2-n-s'
  if (fieldName === fieldToUpdate) {
    switch (sortOrder) {
      case 'ASCENDING':
        clazzName = 'ui-sortable-column-icon ui-icon ui-icon-carat-2-n-s ui-icon-triangle-1-s'
        break
      case 'DESCENDING':
        clazzName = 'ui-sortable-column-icon ui-icon ui-icon-carat-2-n-s ui-icon-triangle-1-n'
        break
      default:
        break
    }
  }

  return (
    <span onClick={() => handleClick(fieldName)} className={clazzName}
      style={{ display: 'inline' }}
    />
  )
}

export default SortingIcon
