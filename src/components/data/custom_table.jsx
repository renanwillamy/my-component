import React, { Component } from 'react'
import Paginator from '../paginator/paginator.jsx'
import { injectIntl } from 'react-intl'

class CustomTable extends Component {
  render () {
    const { rows, paginator, setOffset, headers, perPage, paginationHidden = false } = this.props
    return (
      <div id='core_form_react:j_idt95_content'
        className='ui-panel-content ui-widget-content'>
        <div id='list_table' className='ui-datatable ui-widget table' style={{ overflowX: 'auto' }}>
          <div className='ui-datatable-tablewrapper'>
            <table role='grid'>
              <thead id='table_head'>
                <tr role='row'>
                  {headers ? headers.map((item, index) => {
                    return (
                      <th id={index}
                        className='wms-table-header'
                        role='columnheader' key={index}>
                        {item}
                      </th>
                    )
                  }) : null}
                </tr>
              </thead>
              <tfoot />
              <tbody id='list_table_data'
                className='wms-table-row'>
                {
                  rows
                }
              </tbody>
            </table>
          </div>
        </div>
        {paginationHidden ? null
          : <Paginator currentPage={paginator.offset} perPage={perPage} total={paginator.total} handleClick={setOffset} />
        }
        {this.props.children}
      </div>
    )
  }
}

export default injectIntl(CustomTable)
