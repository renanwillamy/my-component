import React from 'react'
export default (props) => {
  return (
    <tr data-ri='0' className='ui-widget-content ui-datatable-even' role='row'>
      {props.children}
    </tr>
  )
}
