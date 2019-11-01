import PageList from '../page_list/page_list.jsx'
import CachedService from './cached_service.jsx'

const listService = new CachedService()

class LocalList extends PageList {
  constructor (props) {
    super(props)
    this.state.paginator.max = 5
    this.state.isLoading = false
    this.state.tableClass =
      'local-list-page ui-widget ui-widget-content ui-corner-all'
  }

  static getDerivedStateFromProps (nextProps) {
    // Verifica se os dados da listagem foram alterados. Caso tenha
    // sido alterado, limpa os dados para que possa ser atualizado
    // com as novas informações.
    const dataChanged = listService.setData(nextProps.data)
    if (dataChanged) return { data: undefined }

    // Não necessita atualização de estado.
    return null
  }

  componentDidUpdate () {
    if (this.state.data === undefined) {
      this.fetchList()
    }
  }

  fetchList () {
    let { paginator } = this.state
    const { offset, max } = paginator
    const { filters, sorter } = this.state
    const response = listService.fetchPagedList(offset, max, filters, sorter)

    let data = response.data
    paginator.total = response.total

    this.setState({ data, paginator })
  }

  getTableLabels () {
    return []
  }

  renderLabelOptions () {}
}

export default LocalList
