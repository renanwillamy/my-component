import React, { Component } from 'react'
import Header from '../header.jsx'
import Row from '../Row.jsx'
import Column from '../Column.jsx'
import Customtable from '../custom_table.jsx'
import ListLabel from '../page_list/list_label.jsx'

class ListTable extends Component {
  generateHeaders () {
    const { columns, sorter } = this.props
    const { sortField, sortOrder } = sorter
    return columns.map(column => {
      const localSortOrder = sortField === column.path ? sortOrder : ''
      return (
        <Header
          fieldName={column.path}
          sortOrder={localSortOrder}
          sortable={column.sortable}
          messageId={column.messageId}
          input={this.generateHeaderInput(column)}
          handleClick={() => this.onSort(column.path)}
          sortField={localSortOrder === '' ? '' : column.path}
        />
      )
    })
  }

  generateHeaderInput (column) {
    if (!column.filterable) return null
    else if (column.customInput) return column.customInput
    else if (column.options) return this.renderSelectInput(column)
    else if (column.path) return this.renderTextInput(column)
  }

  renderTextInput (column) {
    return (
      <input
        id={`${column.messageId}_filter`}
        value={this.props.filters[column.path] || ''}
        onChange={({ currentTarget: input }) =>
          this.props.onFilter(column.path, input.value)
        }
        name={`${column.id}:filter`}
        className='ui-column-filter ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all'
        autoComplete={'off'}
        role='textbox'
        aria-disabled='false'
        aria-readonly='false'
        aria-multiline='false'
      />
    )
  }

  renderSelectInput (column) {
    const _id = `${column.messageId}_filter`
    return (
      <select
        id={_id}
        name={`${column.id}:filter`}
        value={this.props.filters[column.path] || ''}
        className='ui-column-filter ui-widget ui-state-default ui-corner-left'
        onChange={({ currentTarget: input }) =>
          this.props.onFilter(column.path, input.value)
        }
      >
        <option value='' />
        {column.options.map(option => this.renderSelectOptions(option))}
      </select>
    )
  }

  renderSelectOptions (option) {
    if (typeof option === 'string') {
      option = { value: option, label: option }
    }

    return (
      <option key={`_id_${option.value}`} value={option.value}>
        {option.label}
      </option>
    )
  }

  generateRows () {
    const { columns, data = [] } = this.props
    return data.map(dataRow => (
      <Row key={dataRow.id}>
        {columns.map(column => (
          <Column key={`${dataRow.id}_${column.path}`}>
            {column.content && column.content(dataRow)}
            {!column.content && dataRow[column.path]}
          </Column>
        ))}
      </Row>
    ))
  }

  onSort (field) {
    let { sortField, sortOrder } = { ...this.props.sorter }

    if (sortField === field) {
      if (sortOrder === 'ASCENDING') {
        sortOrder = 'DESCENDING'
      } else {
        sortOrder = 'ASCENDING'
      }
    } else {
      sortField = field
      sortOrder = 'ASCENDING'
    }

    this.props.onSort({ sortField, sortOrder })
  }

  render () {
    const { perPage = 10, pageOffSet, totalElements, tableClass } = this.props
    const paginator = { offset: pageOffSet, total: totalElements }
    const { labels, labelExtraContent } = this.props

    return (
      <div className={tableClass} id='core_form_react:j_idt95'>
        <Customtable
          headers={this.generateHeaders()}
          rows={this.generateRows()}
          paginator={paginator}
          perPage={perPage}
          setOffset={this.props.handlePagination}
        >
          <ListLabel labelList={labels} optionsContent={labelExtraContent} />
        </Customtable>
      </div>
    )
  }
}

export default ListTable
