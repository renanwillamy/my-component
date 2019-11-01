import React, { Component } from 'react'
import { injectIntl } from 'react-intl'
import * as PropTypes from 'prop-types'
import Service from '../../services/crud_service.jsx'
import LoadingModal from '../modals/loading_modal.jsx'
import DataGridList from '../datagrid/data_grid_list.jsx'
import PageContent from '../page_content.jsx'
import Action from '../buttons/action.jsx'
import { handleExpectedErrors, formatMsg } from '../../utils/general_utils.jsx'
import exportFromJSON from 'export-from-json'

const config = {
  filterTimeOut: 800,
  defaultItensPerPage: 10
}

/**
 * Componente responsável para a camada por fora da tabela. PageHeader, labels, actions da página.
 */
class DataGridPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      dataExport: [],
      data: [],
      sorter: {},
      filters: props.initialFilters || {},
      paginator: {
        max: props.max || config.defaultItensPerPage,
        offset: 0,
        total: 1
      }
    }

    this.onSort = this.onSort.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.onPaginate = this.onPaginate.bind(this)
    this.fetchList = this.fetchList.bind(this)
    this.fetchListPromise = this.fetchListPromise.bind(this)
    this.renderLabelOptions = this.renderLabelOptions.bind(this)
    this.handleUnexpectedErros = this.handleUnexpectedErros.bind(this)
    this.fixOffset = this.fixOffset.bind(this)
  }

  componentDidMount () {
    this.fetchList()
  }

  componentWillReceiveProps (props) {
    const { refresh } = this.props
    if (props.refresh !== refresh) {
      this.fetchList()
    }
  }

  /**
   * Renderizar Actions na página. Alinhando à direita.
   *
   * @props { pageButtons } Lista de botões para serem renderizados.
   * @returns Actions
   */
  renderLabelOptions () {
    const { pageButtons = [] } = this.props
    return (
      <span className='swh-table-right'>
        {this.generateButtons(pageButtons)}
      </span>
    )
  }

  isDisabled = (pageButton) => {
    if (pageButton.type === 'export') {
      return !(this.state.data && this.state.data.length > 0)
    }
    return pageButton.disabled
  }

  /**
   * Geração de Actions
   * para exportar dados passar action: () => 'export'
   *
   * @param {Object} Lista de botões para serem renderizados.
   * @returns Actions
   */
  generateButtons (pageButtons) {
    return (
      pageButtons.map((pageButton, index) => {
        return <Action
          key={`${index}`}
          text={this.richButtonTitle(pageButton.title)}
          iconClazz={pageButton.icon}
          handleClick={() => pageButton.type !== 'export' ? pageButton.action() : this.fetchListExport()}
          disabled={this.isDisabled(pageButton)}
        />
      })
    )
  }

  /**
   * Gerar texto e icone. Para ter icone e texto no mesmo botão, preciso adicionar o <span> e estas classes do css.
   *
   * @param {String} String da messagem correspondente para aparecer no botão.
   * @returns texto dentro de um <span>
   */
  richButtonTitle (title) {
    return (
      <span className={'ui-button-text ui-c'}>
        {formatMsg(this.props.intl, title)}
      </span>
    )
  }

  /**
   * Ordena os dados
   *
   * @param {Object} ordem e campo para serem ordenados.
   */
  onSort (sorter) {
    if (this.state.isLoading) return
    const { sorter: oldSorter } = this.state

    // Armazenando estado inicial do sorter para
    // reversão de estado em caso de falha na requisição
    const updatedState = { sorter, revertState: { sorter: oldSorter } }
    this.setState(updatedState, this.fetchList)
    this.fixOffset()
  }

  /**
   * Filtra os dados conforme o campo e o valor inserido.
   *
   * @param {String, String} Campo para fazer o filtro e valor inserido.
   */
  onFilter (field, value) {
    if (this.state.isLoading) return
    const { filters: oldFilters } = this.state

    // Removendo da lista de filtros se for ''
    const filters = { ...oldFilters }
    if (value === '') {
      delete filters[field]
    } else {
      filters[field] = value
    }

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
    this.fixOffset()
  }

  /**
   * Altera os valores conforme altera as páginas na paginação.
   *
   * @param {Number} valor do offset para trocar de página.
   */
  onPaginate (value) {
    const { paginator: oldPaginator } = this.state
    const paginator = { ...oldPaginator }
    paginator.offset = value

    // Armazenando estado inicial do paginator para
    // reversão de estado em caso de falha na requisição
    const updatedState = { paginator, revertState: { paginator: oldPaginator } }
    this.setState(updatedState, this.fetchList)
  }

  /**
   * Buscar os dados no enpoint e atribui aos states. Recebe o uri da camada acima.
   *
   * @props {Number, number} valores para definir a páginação
   * @returns os states atualizados com os dados vindos do endpoint.
   */
  fetchList () {
    let { offset, max } = this.state.paginator
    this.setState({ isLoading: true }, () => {
      this.fetchListPromise()
        .then(handleExpectedErrors)
        .then(result => result.json())
        .then(result => {
          return this.setState({
            isLoading: false,
            revertState: null,
            data: result.content || result.parameters.data || [],
            paginator: {
              total:
                result.totalElements !== undefined
                  ? result.totalElements
                  : result.parameters.total,
              offset,
              max
            }
          })
        })
        .catch(this.handleUnexpectedErros)
    })
  }

  /**
   * Pega as configurações de filter e sorter nos states e faz o fetch.
   *
   * @returns retorno do endpoint.
   */
  fetchListPromise () {
    let { filters, sorter } = this.state
    const { uri, staticFilter = {} } = this.props
    let { offset, max = config.defaultItensPerPage } = this.state.paginator
    return Service.getList(uri, offset, max, { ...filters, ...staticFilter }, sorter)
  }

  /**
   * Busca os dados no enpoint e atribui a lista que sera exportada para arquivo.
   *
   * @returns os states atualizados com os dados vindos do endpoint.
   */
  fetchListExport () {
    this.setState({ isLoading: true }, () => {
      this.fetchListPromiseExport()
        .then(handleExpectedErrors)
        .then(result => result.json())
        .then(result => {
          return this.setState({
            isLoading: false,
            revertState: null,
            dataExport: result.parameters.data
          }, () => this.exportFile())
        }).catch(this.handleUnexpectedErros)
    })
  }

  /**
   * Pega as configurações de filter e faz o fetch para os dados a serem exportados para arquivo.
   *
   * @returns retorno do endpoint.
   */
  fetchListPromiseExport () {
    const { uri } = this.props
    let { filters, sorter, paginator } = this.state
    return Service.getList(uri, 0, paginator.total + 1, filters, sorter)
  }

  /**
   * Exporta os dados para o arquivo
   */
  exportFile () {
    const data = this.state.dataExport
    const fileName = 'download_export'
    const exportType = 'csv'
    exportFromJSON({ data, fileName, exportType })
  }

  /**
   * Tenta resolver erros estranhos. Volta os estados para não compromenter a página.
   *
   */
  handleUnexpectedErros () {
    const { revertState } = this.state
    const state = { isLoading: false, ...revertState, revertState: undefined }
    // Revertendo para estado anterior a falha
    this.setState(state)
  }

  /**
   * Depois de sorter e filter, devo corrigir a paginação, levar o user para a primeira página.
   *
   */
  fixOffset () {
    this.setState({
      paginator: {
        offset: 0
      }
    })
  }

  render () {
    const { isLoading, sorter, filters, data, paginator } = this.state
    const { columns, labels, idMessage } = this.props
    return (
      <React.Fragment>
        <LoadingModal show={isLoading} />
        <PageContent header={idMessage}>
          <DataGridList
            data={data}
            columns={columns}
            sorter={sorter}
            filters={filters}
            onSort={this.onSort}
            onFilter={this.onFilter}
            perPage={paginator.max}
            pageOffSet={paginator.offset}
            totalElements={paginator.total}
            handlePagination={this.onPaginate}
            labels={labels}
            isLoading={isLoading}
            labelExtraContent={this.renderLabelOptions}
          />
        </PageContent>
      </React.Fragment>
    )
  }
}

// TODO Para facilitar o uso do DataGrid, definir todos os tipos necessários.
DataGridPage.propTypes = {
  uri: PropTypes.string,
  max: PropTypes.number,
  idMessage: PropTypes.string
}

export default injectIntl(DataGridPage)
