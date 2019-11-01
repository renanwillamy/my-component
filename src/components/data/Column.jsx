import React from 'react'

export default (props) => {
  return (
    <td role='gridcell' className='table-column'>
      <span >
        {props.children}
      </span>
    </td>
  )
}
