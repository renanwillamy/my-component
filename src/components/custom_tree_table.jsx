import React from 'react'
import { injectIntl } from 'react-intl'
import { TreeTable } from 'primereact/treetable'
import { Column } from 'primereact/column'

const CustomTreeTable = ({ value, columns, intl }) => {
  function formatMsg (id) {
    return intl.formatMessage({
      id,
      defaultMessage: 'Message ID not found'
    })
  }

  const fomattedColumns = columns.map(column => ({
    ...column,
    header: formatMsg(column.header)
  }))

  return (
    <TreeTable value={value}>
      {fomattedColumns.map(column => (
        <Column key={column.field} {...column} />
      ))}
    </TreeTable>
  )
}

export default injectIntl(CustomTreeTable)
