class CachedService {
  setData (data = []) {
    if (this.data && this.data.length === data.length) return false
    this.data = [...data]
    return true
  }

  fetchPagedList (offset = 0, max = 5, filters, sorter) {
    let data = [...this.data]
    Object.keys(filters).forEach(key => {
      data = data.filter(e => e[key].startsWith(filters[key]))
    })
    if (sorter) {
      data = data.sort(this.sortFunction(sorter.sortField, sorter.sortOrder))
    }
    return {
      data: data.slice(offset, offset + max),
      total: this.data.length
    }
  }

  sortFunction (key, order = 'ASCENDING') {
    return (a, b) => {
      const varA = a[key]
      const varB = b[key]

      let comparison = 0
      if (varA <= varB) {
        comparison = 1
      } else if (varA >= varB) {
        comparison = -1
      }
      return order === 'DESCENDING' ? comparison * -1 : comparison
    }
  }
}

export default CachedService
