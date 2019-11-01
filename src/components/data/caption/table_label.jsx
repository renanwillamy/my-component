import React, { Component } from 'react'
import LabelElement from '../caption/label_element.jsx'

class TableLabel extends Component {
  generateSingleRow (labelList) {
    return labelList.map((legend, i) => (
      <div key={i}>
        <LabelElement data={legend} />
      </div>
    ))
  }

  generateTable (labelList, nIterations) {
    let rowsLegend = []
    for (let index = 0; index < nIterations; index++) {
      const startAt = index * 4
      const finishAt = (index + 1) * 4
      rowsLegend.push(labelList.slice(startAt, finishAt))
    }

    return rowsLegend.map((legends, i) => (
      <tr key={i}>{this.generateRow(legends)}</tr>
    ))
  }

  generateRow (labelList) {
    return labelList.map((legend, i) => (
      <td key={i}>
        <LabelElement data={legend} />
      </td>
    ))
  }

  render () {
    const { labelList } = this.props
    const nIterations = Math.ceil(labelList.length / 4)

    if (nIterations === 1) {
      return (
        <div className='swh-table-left'>
          {this.generateSingleRow(labelList)}
        </div>
      )
    } else {
      return (
        <table className='swh-table-left'>
          <tbody>{this.generateTable(labelList, nIterations)}</tbody>
        </table>
      )
    }
  }
}

export default TableLabel
