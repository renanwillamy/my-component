import React, { Component } from 'react'
import TableLabel from '../caption/table_label.jsx'

class ListLabel extends Component {
  render () {
    const { labelList, optionsContent } = this.props
    return (
      <table width='100%'>
        <tbody>
          <tr>
            <td>
              <TableLabel labelList={labelList} />
            </td>
            <td>
              {optionsContent()}
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
}

export default ListLabel
