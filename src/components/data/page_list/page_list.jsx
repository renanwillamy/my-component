import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import LoadingModal from '../../modals/loading_modal.jsx'
import DialogModal from '../../modals/dialog_modal.jsx'
import PageHeader from '../../data/page_header.jsx'
import ListTable from '../../data/page_list/list_table.jsx'
import DefaultButton from '../../buttons/default_button.jsx'

const config = {
  filterTimeOut: 800
}

class PageList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      modal: undefined,

      data: [],
      sorter: {},
      filters: {},
      paginator: {
        max: 10,
        offset: 0,
        total: 1
      }
    }

    this.state.tableClass =
      'list-page ui-panel ui-widget ui-widget-content ui-corner-all'

    this.onSort = this.onSort.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.onPaginate = this.onPaginate.bind(this)
    this.fetchList = this.fetchList.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.validatePagination = this.validatePagination.bind(this)
    this.renderLabelOptions = this.renderLabelOptions.bind(this)
    this.handleUnexpectedErros = this.handleUnexpectedErros.bind(this)
    this.handleFetchResult = this.handleFetchResult.bind(this)
  }

  componentDidMount () {
    this.fetchList()
  }

  onSort (sorter) {
    if (this.state.isLoading) return
    let { sorter: oldSorter } = this.state

    // Armazenando estado inicial do sorter para
    // reversão de estado em caso de falha na requisição
    let updatedState = { sorter, revertState: { sorter: oldSorter } }
    this.setState(updatedState, this.fetchList)
  }

  onFilter (field, value) {
    if (this.state.isLoading) return
    let { filters: oldFilters } = this.state

    // Removendo da lista de filtros se for ""
    const filters = { ...oldFilters }
    if (value === '') delete filters[field]
    else filters[field] = value

    // Armazenando estado inicial dos filtros para
    // reversão de estado em caso de falha na requisição
    let updatedState = { filters }
    if (!this.state.revertState) {
      updatedState = { ...updatedState, revertState: { filters: oldFilters } }
    }
    this.setState(updatedState)

    // Aplicando filtragem após timeout
    setTimeout(
      function () {
        this.fetchList()
      }.bind(this),
      config.filterTimeOut
    )
  }

  onPaginate (value) {
    let { paginator: oldPaginator } = this.state
    let paginator = { ...oldPaginator }
    paginator.offset = value

    // Armazenando estado inicial do paginator para
    // reversão de estado em caso de falha na requisição
    let updatedState = { paginator, revertState: { paginator: oldPaginator } }
    this.setState(updatedState, this.fetchList)
  }

  fetchList () {
    let { offset, max } = this.state.paginator
    this.setState({ isLoading: true }, () => {
      this.fetchListPromise()
        .then(this.handleExpectedErrors)
        .then(result => result.json())
        .then(result => {
          result = this.handleFetchResult(result)
          return this.setState({
            isLoading: false,
            revertState: undefined,
            data: this.toViewObjList(result.data),
            paginator: {
              total: result.total,
              offset: offset,
              max: max
            }
          })
        })
        .catch(this.handleUnexpectedErros)
    })
  }

  handleExpectedErrors (response) {
    if (response.ok) {
      return response
    }
    switch (response.status) {
      case 401:
        window.location = '/wms/timeout.jsf'
        break
      default:
        throw Error(response.statusText)
    }
  }

  handleUnexpectedErros () {
    let { revertState } = this.state
    let state = { isLoading: false, ...revertState, revertState: undefined }
    // Revertendo para estado anterior a falha
    this.setState(state)
  }

  handleFetchResult (result) {
    return result.parameters
  }

  toViewObjList (data) {
    return data.map(dataObj => {
      let viewObject = {}
      // Adiciona ao ViewObject atributos que vieram da
      // requisição mas que não são exibidos como uma coluna.
      this.getExtraAtributes().forEach(attr => {
        viewObject[attr] = dataObj[attr]
      })
      // Adiciona ao ViewObject o atributo necessario para
      // para exibição da coluna (definido em column.path).
      this.getColumns().forEach(column => {
        const { path } = column
        if (path) viewObject[path] = dataObj[column.path]
      })
      return viewObject
    })
  }

  validatePagination () {
    let { data, paginator } = this.state
    // Verifica se a página carregada possui apenas um elemento
    // (o que acabou de ser deletado) e está carregando uma página
    // (que não é a primeira). Se sim, ajusta o 'paginator' para
    // carregar a página anterior, caso contrário recarrega a página
    // atual.
    if (data.length === 1 && paginator.offset > 0) {
      let nPaginator = { ...paginator }
      nPaginator.offset -= paginator.max
      nPaginator.total -= 1

      this.setState({ paginator: nPaginator }, this.fetchList)
    } else {
      this.fetchList()
    }
  }

  getExtraAtributes () {
    return ['id']
  }

  showModal (title, body, positiveText, positiveAction = () => {}) {
    this.setState({
      modal: {
        data: {
          title,
          body,
          positiveText
        },
        handlers: {
          positiveAction: () => {
            this.closeModal()
            positiveAction()
          },
          negativeAction: this.closeModal
        }
      }
    })
  }

  closeModal () {
    this.setState({ modal: undefined })
  }

  renderActionBtn (title, iconClazz, onClick) {
    return (
      <DefaultButton
        title={<FormattedMessage id={title} />}
        handleClick={onClick}
        clazzName={`ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ${iconClazz}`}
      />
    )
  }

  render () {
    const { isLoading, modal } = this.state

    return (
      <React.Fragment>
        {isLoading && <LoadingModal />}
        {modal && <DialogModal modal={modal} />}
        {this.getHeaderMsgId && (
          <PageHeader idMessage={this.getHeaderMsgId()} />
        )}
        {this.renderListTable()}
      </React.Fragment>
    )
  }

  renderListTable () {
    const { sorter, filters, data, paginator, tableClass } = this.state

    return (
      <ListTable
        data={data}
        tableClass={tableClass}
        columns={this.getColumns()}
        sorter={sorter}
        filters={filters}
        onSort={this.onSort}
        onFilter={this.onFilter}
        perPage={paginator.max}
        pageOffSet={paginator.offset}
        totalElements={paginator.total}
        handlePagination={this.onPaginate}
        labels={this.getTableLabels()}
        labelExtraContent={this.renderLabelOptions}
      />
    )
  }
}

export default PageList
