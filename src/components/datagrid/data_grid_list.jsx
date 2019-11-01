import React, { Component } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import Header from '../data/header.jsx'
import Row from '../data/Row.jsx'
import Column from '../data/Column.jsx'
import Customtable from '../data/custom_table.jsx'
import ListLabel from '../data/page_list/list_label.jsx'
import Action from '../buttons/action.jsx'
import { formatMsg } from '../../utils/general_utils.jsx'
import DateField from '../inputs/date_field.jsx'

// Constantes definidas para inferir comportamentos.
const config = {
  filterable: false,
  sortable: false
}

/**
 * Componente responsável para a camada que cria a listagem. Headers, rows, actions, filters, sorters.
 */
class DataGridList extends Component {
  /**
   * Geração dos cabeçalhos.
   *
   * @props {columns, sorter}
   * @returns componente {Header}
   */
  generateHeaders() {
    const { columns = {}, sorter = {} } = this.props
    const { sortField, sortOrder } = sorter
    return columns.map(column => {
      const localSortOrder = sortField === column.value ? sortOrder : ''
      const { sortable = config.sortable } = column
      return (
        <Header
          fieldName={column.value}
          sortOrder={localSortOrder}
          sortable={sortable}
          messageId={column.title}
          input={this.generateHeaderInput(column)}
          handleClick={() => this.onSort(column.value)}
          sortField={column.value}
        />
      )
    })
  }

  /**
   * Geração formas de entrada nos cabeçalhos.
   *
   * @param {Object} Cada coluna da tabela.
   * @returns um input de cada tipo definodo.
   */
  generateHeaderInput(column) {
    // Se não vier definido o filterable, então assumo como false.
    // TODO: Da suporte para outros tipos de filtros. Filterable pode ser um objeto.
    const { filterable = config.filterable } = column
    if (filterable) {
      if (column.type === 'date') {
        return this.renderDatePicker(column)
      } else {
        return this.renderTextInput(column)
      }
    }
    return null
  }

  /**
   * Cria um input do tipo texto. Se habilitado.
   *
   * @param {Object} Cada coluna da tabela.
   * @returns um input do tipo text.
   */
  renderTextInput(column) {
    return (
      <input
        id={`${column.title}_filter`}
        value={this.props.filters[column.value] || ''}
        onChange={({ currentTarget: input }) =>
          this.props.onFilter(column.value, input.value)
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

  /**
   * Converte a data para long e chama o metodo onFilter.
   * Se o campo estiver vazio/nulo remove o filtro.
   *
   * @param {columnName} coluna da tabela.
   * @param {date} valor da data.
   */
  handleChange(columnName, date) {
    if (date === '' || date === null) {
      this.props.onFilter(columnName, '')
    } else {
      const myDate = new Date(date)
      const withOffset = myDate.getTime()
      this.props.onFilter(columnName, withOffset)
    }
  }

  /**
   * Cria date picker com data inicial e final para filtragem. Se habilitado.
   *
   * @param {Object} Cada coluna da tabela.
   * @returns um intervalo de date.
   */
  renderDatePicker(column) {
    return (
      <DateField
        selectedIni={this.props.filters[column.filterStart] || ''}
        selectedEnd={this.props.filters[column.filterEnd] || ''}
        handleOnChangeStart={e => this.handleChange([column.filterStart], e)}
        handleOnChangeEnd={e => this.handleChange([column.filterEnd], e)}
        message={formatMsg(this.props.intl, 'common.date.preposition.to')}
      />
    )
  }

  /**
   * Geração das linhas da tabela.
   * tenho 3 possibilidades:
   *   1: colocar os valores conforme vieram no json. Tipo texto.
   *   2: gerar a coluna de ações. Conforme foram definidas.
   *   3: tipo especial com atributo content. A geração desta célula fica por conta da camada acima do DataGrid.
   *
   * @props {columns, data} As colunas e os dados recebidos pelo json.
   * @returns o conteúdo das linhas da tabela.
   */
  generateRows() {
    const { columns, data = [] } = this.props
    return data.map((dataRow, index) => {
      const key = dataRow.id ? dataRow.id : index
      return (
        <Row key={key}>
          {columns.map(column => (
            <Column key={`${key}_${column.value}`}>
              {column.type === 'action' &&
                this.generateActions(index, column.value, dataRow)}
              {(column.type === 'text' || column.type === 'date') &&
                column.content &&
                column.content(dataRow)}
              {column.type === 'text' &&
                !column.content &&
                dataRow[column.value]}
            </Column>
          ))}
        </Row>
      )
    })
  }

  /**
   * Gera a coluna de actions
   *
   * @param {Number, Object, list} Index da linha, as actions que serão geradas e dados da linha.
   * @returns actions desta linha.
   */
  generateActions(rowIndex, actions, dataRow) {
    return actions.map((action, index) => {
      return (
        <Action
          key={`${rowIndex}_${index}`}
          title={formatMsg(this.props.intl, action.title)}
          handleClick={() => action.action(dataRow)}
          iconClazz={action.icon}
          hidden={dataRow[action.renderAttribute] === false}
        />
      )
    })
  }

  /**
   * Altera ordem do sorter quando clicado.
   *
   * @param {Object} qual campo foi clicado.
   */
  onSort(fieldChanged) {
    let { sortField, sortOrder } = { ...this.props.sorter }

    if (sortField === fieldChanged) {
      if (sortOrder === 'ASCENDING') {
        sortOrder = 'DESCENDING'
      } else {
        sortOrder = 'ASCENDING'
      }
    } else {
      sortField = fieldChanged
      sortOrder = 'ASCENDING'
    }

    this.props.onSort({ sortField, sortOrder })
  }

  render() {
    const {
      perPage,
      pageOffSet,
      totalElements = 1,
      showPagination = true,
      isLoading
    } = this.props
    const paginator = { offset: pageOffSet, total: totalElements }
    const { labels, labelExtraContent, data = [] } = this.props

    return (
      <Customtable
        headers={this.generateHeaders()}
        rows={this.generateRows()}
        paginator={paginator}
        perPage={perPage}
        setOffset={this.props.handlePagination}
        paginationHidden={!showPagination || data.length === 0}
      >
        <div
          style={{ textAlign: 'center' }}
          hidden={isLoading || data.length > 0}
        >
          <FormattedMessage
            id='common.list.empty'
            defaultMessage='No records found.'
          />
        </div>
        {labels && (
          <ListLabel labelList={labels} optionsContent={labelExtraContent} />
        )}
      </Customtable>
    )
  }
}

export default injectIntl(DataGridList)
